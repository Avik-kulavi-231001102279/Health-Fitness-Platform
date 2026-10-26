const User = require('../models/User');
const WaterLog = require('../models/WaterLog');
const MealLog = require('../models/MealLog');
const SleepLog = require('../models/SleepLog');
const WorkoutSession = require('../models/WorkoutSession');
const WeightLog = require('../models/WeightLog');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { calculateBMI, getBMICategory } = require('../utils/bmiCalculator');

// ─── Get Dashboard Summary ───
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpire');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Date handling (supports optional date query e.g. ?date=2026-10-25)
    let targetDate = new Date();
    if (req.query.date) {
      const parsed = new Date(req.query.date);
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }

    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
    const dateStr = startOfDay.toISOString().split('T')[0];

    // Start of week (Monday)
    const dayOfWeek = targetDate.getDay();
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // BMI
    const bmiValue = calculateBMI(user.weight, user.height);
    const bmiCategory = getBMICategory(bmiValue);

    // Today's water
    const todayWater = await WaterLog.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 });
    const totalWater = todayWater.reduce((sum, e) => sum + e.amount, 0);

    // Today's meals/calories
    const todayMeals = await MealLog.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });

    const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
    const totalCarbs = todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const totalFat = todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0);

    // Today's sleep
    const todaySleep = await SleepLog.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Today's workout
    const todayWorkout = await WorkoutSession.findOne({
      user: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'completed'
    });

    // Weekly workout count
    const weeklyWorkouts = await WorkoutSession.countDocuments({
      user: userId,
      createdAt: { $gte: startOfWeek },
      status: 'completed'
    });

    // Habits completion for today
    const userHabits = await Habit.find({ user: userId, archived: false });
    const todayHabitLogs = await HabitLog.find({
      user: userId,
      date: dateStr,
      completed: true
    });
    const completedHabitIds = new Set(todayHabitLogs.map(l => l.habit.toString()));

    const habitSummary = {
      total: userHabits.length,
      completed: userHabits.filter(h => completedHabitIds.has(h._id.toString())).length,
      items: userHabits.map(h => ({
        id: h._id,
        title: h.title,
        category: h.category,
        isCompleted: completedHabitIds.has(h._id.toString()),
        currentStreak: h.currentStreak || 0
      }))
    };

    // Active goals count
    const activeGoals = await Goal.countDocuments({ user: userId, status: 'active' });

    // Targets
    const calorieGoal = user.dailyCalorieTarget || 2000;
    const waterGoal = user.dailyWaterTarget || 2500;
    const sleepGoal = user.dailySleepTarget || 8;

    // Daily goals checklist
    const dailyGoals = {
      workout: !!todayWorkout,
      water: totalWater >= waterGoal,
      meals: todayMeals.length >= 3,
      sleep: todaySleep ? todaySleep.duration >= 7 : false,
      habits: habitSummary.total > 0 ? habitSummary.completed >= Math.ceil(habitSummary.total * 0.7) : false
    };
    const completedDailyGoals = Object.values(dailyGoals).filter(Boolean).length;

    // Generate 7-day weekly activity trend for charts
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(targetDate);
      d.setDate(d.getDate() - i);
      const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dMeals = await MealLog.find({ user: userId, date: { $gte: dStart, $lte: dEnd } });
      const dWater = await WaterLog.find({ user: userId, date: { $gte: dStart, $lte: dEnd } });
      const dWorkout = await WorkoutSession.findOne({ user: userId, createdAt: { $gte: dStart, $lte: dEnd }, status: 'completed' });
      const dSleep = await SleepLog.findOne({ user: userId, date: { $gte: dStart, $lte: dEnd } });

      weeklyTrend.push({
        day: dayName,
        date: dStart.toISOString().split('T')[0],
        calories: dMeals.reduce((s, m) => s + m.calories, 0),
        water: dWater.reduce((s, w) => s + w.amount, 0),
        workoutMinutes: dWorkout ? (dWorkout.totalDuration || 45) : 0,
        sleepHours: dSleep ? dSleep.duration : 0
      });
    }

    // Dynamic AI Daily Insight tailored to user's real progress
    let aiInsight = 'Hydration and balanced protein intake are your superpowers today. Keep your momentum going!';
    if (totalWater < waterGoal * 0.5) {
      aiInsight = `You're currently at ${totalWater}ml of your ${waterGoal}ml hydration target. Drink a 250ml glass of water now to maintain mental sharpness and metabolic efficiency.`;
    } else if (todayWorkout && totalProtein < (user.macros?.protein || 130) * 0.7) {
      aiInsight = 'Great job completing your workout session! Ensure you consume a protein-rich meal or snack within the next 2 hours to optimize muscular recovery.';
    } else if (totalCalories > calorieGoal * 0.9) {
      aiInsight = `You've utilized ${totalCalories} of your ${calorieGoal} kcal target. Plan a nutrient-dense, fiber-rich dinner to stay perfectly on track.`;
    } else if (habitSummary.completed === habitSummary.total && habitSummary.total > 0) {
      aiInsight = `Incredible discipline! You've checked off all ${habitSummary.total} of your daily habits today. Consistent micro-actions create life-changing transformations.`;
    }

    res.status(200).json({
      date: dateStr,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingDone: user.isOnboardingDone,
        fitnessGoal: user.fitnessGoal,
        preferredUnits: user.preferredUnits || 'metric'
      },
      bmi: { value: bmiValue, category: bmiCategory },
      stats: {
        currentWeight: user.weight || 0,
        bmi: bmiValue || 0,
        dailyCalorieTarget: calorieGoal,
        waterIntake: { current: totalWater, goal: waterGoal },
        streak: user.currentStreak || 0,
        weeklyWorkouts
      },
      today: {
        calories: {
          consumed: totalCalories,
          goal: calorieGoal,
          remaining: Math.max(0, calorieGoal - totalCalories),
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat
        },
        water: {
          completed: totalWater,
          goal: waterGoal,
          remaining: Math.max(0, waterGoal - totalWater),
          percentage: Math.min(100, Math.round((totalWater / waterGoal) * 100)),
          logs: todayWater
        },
        sleep: todaySleep ? {
          duration: todaySleep.duration,
          sleepTime: todaySleep.sleepTime,
          wakeUpTime: todaySleep.wakeUpTime,
          quality: todaySleep.quality || 4,
          goal: sleepGoal
        } : { duration: 0, goal: sleepGoal },
        workout: todayWorkout ? {
          completed: true,
          duration: todayWorkout.totalDuration,
          calories: todayWorkout.caloriesBurned,
          name: todayWorkout.workoutName
        } : { completed: false },
        meals: todayMeals,
        habits: habitSummary
      },
      dailyGoals: {
        items: dailyGoals,
        completed: completedDailyGoals,
        total: 5
      },
      weeklyTrend,
      aiInsight,
      activeGoals,
      macrosTarget: user.macros || { protein: 130, carbs: 240, fat: 65 }
    });
  } catch (error) {
    next(error);
  }
};