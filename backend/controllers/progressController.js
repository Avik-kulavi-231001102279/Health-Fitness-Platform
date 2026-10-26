const WeightLog = require('../models/WeightLog');
const WaterLog = require('../models/WaterLog');
const SleepLog = require('../models/SleepLog');
const WorkoutSession = require('../models/WorkoutSession');
const MealLog = require('../models/MealLog');
const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// ─── Log Weight ───
exports.logWeight = async (req, res, next) => {
  try {
    const { weight, notes } = req.body;
    if (!weight) return res.status(400).json({ message: 'Weight is required.' });

    const log = await WeightLog.create({
      user: req.user.id,
      weight: parseFloat(weight),
      notes: notes || '',
      date: new Date()
    });

    // Update user's current weight
    await User.findByIdAndUpdate(req.user.id, { weight: parseFloat(weight) });

    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

// ─── Get Weight History ───
exports.getWeightHistory = async (req, res, next) => {
  try {
    const logs = await WeightLog.find({ user: req.user.id }).sort({ date: -1 }).limit(30);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// ─── Log Water ───
exports.logWater = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ message: 'A positive water amount in ml is required.' });
    }

    const log = await WaterLog.create({
      user: req.user.id,
      amount: numAmount,
      date: new Date()
    });

    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

// ─── Delete Water Entry ───
exports.deleteWaterLog = async (req, res, next) => {
  try {
    const log = await WaterLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ message: 'Water entry not found.' });
    }
    await WaterLog.deleteOne({ _id: log._id });
    res.status(200).json({ success: true, message: 'Water entry deleted.' });
  } catch (error) {
    next(error);
  }
};

// ─── Undo Last Water Entry ───
exports.undoLastWater = async (req, res, next) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    const lastLog = await WaterLog.findOne({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    if (!lastLog) {
      return res.status(404).json({ message: 'No water entries found for today to undo.' });
    }

    await WaterLog.deleteOne({ _id: lastLog._id });
    res.status(200).json({ success: true, message: `Removed last entry of ${lastLog.amount} ml.`, undoneAmount: lastLog.amount });
  } catch (error) {
    next(error);
  }
};

// ─── Update Water Goal ───
exports.updateWaterGoal = async (req, res, next) => {
  try {
    const { goal } = req.body;
    const numGoal = parseInt(goal, 10);
    if (!numGoal || numGoal < 500 || numGoal > 8000) {
      return res.status(400).json({ message: 'Daily water goal must be between 500ml and 8,000ml.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { dailyWaterTarget: numGoal },
      { new: true }
    );

    res.status(200).json({ success: true, dailyWaterTarget: user.dailyWaterTarget });
  } catch (error) {
    next(error);
  }
};

// ─── Get Today's Water ───
exports.getTodayWater = async (req, res, next) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    const logs = await WaterLog.find({ user: req.user.id, date: { $gte: start, $lte: end } }).sort({ date: -1 });
    const total = logs.reduce((sum, l) => sum + l.amount, 0);

    const user = await User.findById(req.user.id);
    const goal = user.dailyWaterTarget || 2500;
    const percentage = Math.min(100, Math.round((total / goal) * 100));

    res.status(200).json({
      total,
      goal,
      remaining: Math.max(0, goal - total),
      percentage,
      logs
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Water History (last N days) ───
exports.getWaterHistory = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const results = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const logs = await WaterLog.find({ user: req.user.id, date: { $gte: start, $lte: end } });
      results.push({
        date: start.toISOString().split('T')[0],
        total: logs.reduce((s, l) => s + l.amount, 0)
      });
    }
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

// Helper: Calculate sleep duration handling midnight crossover
function calculateSleepHours(sleepTime, wakeUpTime) {
  const [sHours, sMinutes] = sleepTime.split(':').map(Number);
  const [wHours, wMinutes] = wakeUpTime.split(':').map(Number);

  let sTotal = sHours * 60 + sMinutes;
  let wTotal = wHours * 60 + wMinutes;

  if (wTotal <= sTotal) {
    // Crosses midnight
    wTotal += 24 * 60;
  }

  const diffMinutes = wTotal - sTotal;
  return parseFloat((diffMinutes / 60).toFixed(1));
}

// ─── Log Sleep ───
exports.logSleep = async (req, res, next) => {
  try {
    const { sleepTime, wakeUpTime, quality, notes } = req.body;
    let { duration } = req.body;

    if (!sleepTime || !wakeUpTime) {
      return res.status(400).json({ message: 'Sleep time (bedtime) and wake up time are required.' });
    }

    if (!duration) {
      duration = calculateSleepHours(sleepTime, wakeUpTime);
    } else {
      duration = parseFloat(duration);
    }

    // Check if already logged today
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const existing = await SleepLog.findOne({ user: req.user.id, date: { $gte: start, $lte: end } });

    if (existing) {
      existing.sleepTime = sleepTime;
      existing.wakeUpTime = wakeUpTime;
      existing.duration = duration;
      if (quality) existing.quality = quality;
      if (notes !== undefined) existing.notes = notes;
      await existing.save();
      return res.status(200).json(existing);
    }

    const log = await SleepLog.create({
      user: req.user.id,
      sleepTime,
      wakeUpTime,
      duration,
      quality: quality || 4,
      notes: notes || '',
      date: new Date()
    });

    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

// ─── Delete Sleep Log ───
exports.deleteSleepLog = async (req, res, next) => {
  try {
    const log = await SleepLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ message: 'Sleep log not found.' });
    }
    await SleepLog.deleteOne({ _id: log._id });
    res.status(200).json({ success: true, message: 'Sleep log deleted.' });
  } catch (error) {
    next(error);
  }
};

// ─── Get Sleep History & Insights ───
exports.getSleepHistory = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const logs = await SleepLog.find({ user: req.user.id, date: { $gte: since } }).sort({ date: -1 });

    const user = await User.findById(req.user.id);
    const goal = user.dailySleepTarget || 8;

    // Calculate consistency insights
    const avgDuration = logs.length > 0
      ? parseFloat((logs.reduce((sum, l) => sum + l.duration, 0) / logs.length).toFixed(1))
      : 0;

    const avgQuality = logs.length > 0
      ? parseFloat((logs.reduce((sum, l) => sum + (l.quality || 4), 0) / logs.length).toFixed(1))
      : 0;

    res.status(200).json({
      logs,
      goal,
      avgDuration,
      avgQuality,
      daysLogged: logs.length
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Progress Analytics ───
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Weight progress
    const weightData = await WeightLog.find({ user: userId, date: { $gte: since } }).sort({ date: 1 });

    // Workout frequency
    const workoutData = await WorkoutSession.find({ 
      user: userId, status: 'completed', createdAt: { $gte: since } 
    }).sort({ createdAt: 1 });

    // Calorie data
    const calorieData = [];
    for (let i = Math.min(days, 14) - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const meals = await MealLog.find({ user: userId, date: { $gte: start, $lte: end } });
      calorieData.push({
        date: start.toISOString().split('T')[0],
        calories: meals.reduce((s, m) => s + m.calories, 0),
        protein: meals.reduce((s, m) => s + (m.protein || 0), 0),
        carbs: meals.reduce((s, m) => s + (m.carbs || 0), 0),
        fat: meals.reduce((s, m) => s + (m.fat || 0), 0)
      });
    }

    // Water data (last 7 or 14 days)
    const waterDays = Math.min(days, 14);
    const waterData = [];
    for (let i = waterDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const logs = await WaterLog.find({ user: userId, date: { $gte: start, $lte: end } });
      waterData.push({
        date: start.toISOString().split('T')[0],
        total: logs.reduce((s, l) => s + l.amount, 0)
      });
    }

    // Sleep data
    const sleepData = await SleepLog.find({ user: userId, date: { $gte: since } }).sort({ date: 1 });

    // Habits completion count
    const habitData = await HabitLog.find({
      user: userId,
      completed: true,
      createdAt: { $gte: since }
    });

    res.status(200).json({
      weight: weightData,
      workouts: workoutData.map(w => ({
        date: w.createdAt,
        duration: w.totalDuration,
        calories: w.caloriesBurned,
        name: w.workoutName
      })),
      calories: calorieData,
      water: waterData,
      sleep: sleepData.map(s => ({
        date: s.date,
        duration: s.duration,
        quality: s.quality || 4
      })),
      totalHabitsCompleted: habitData.length
    });
  } catch (error) {
    next(error);
  }
};

// ─── Export Authorized User Data (JSON / CSV Format) ───
exports.exportUserData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const meals = await MealLog.find({ user: userId }).sort({ date: -1 });
    const water = await WaterLog.find({ user: userId }).sort({ date: -1 });
    const workouts = await WorkoutSession.find({ user: userId }).sort({ date: -1 });
    const sleep = await SleepLog.find({ user: userId }).sort({ date: -1 });
    const habits = await Habit.find({ user: userId });
    const habitLogs = await HabitLog.find({ user: userId });

    const exportPayload = {
      exportDate: new Date().toISOString(),
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        fitnessGoal: user.fitnessGoal,
        activityLevel: user.activityLevel,
        dailyCalorieTarget: user.dailyCalorieTarget,
        dailyWaterTarget: user.dailyWaterTarget
      },
      summary: {
        totalMealsLogged: meals.length,
        totalWaterLogs: water.length,
        totalWorkouts: workouts.length,
        totalSleepLogs: sleep.length,
        totalHabits: habits.length
      },
      meals,
      water,
      workouts,
      sleep,
      habits,
      habitLogs
    };

    res.status(200).json({
      success: true,
      data: exportPayload
    });
  } catch (error) {
    next(error);
  }
};
