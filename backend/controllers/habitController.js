const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

const HABIT_TEMPLATES = [
  {
    title: 'Morning Walk',
    description: 'Get 20 minutes of morning daylight and gentle cardio.',
    category: 'Fitness',
    frequency: 'daily',
    color: '#3b82f6',
    icon: 'Footprints'
  },
  {
    title: 'Drink Water',
    description: 'Drink at least 500ml upon waking and stay hydrated.',
    category: 'Hydration',
    frequency: 'daily',
    color: '#06b6d4',
    icon: 'Droplets'
  },
  {
    title: 'Daily Workout',
    description: 'Complete a planned resistance or cardio session.',
    category: 'Fitness',
    frequency: 'daily',
    color: '#8b5cf6',
    icon: 'Dumbbell'
  },
  {
    title: 'Mindful Reading',
    description: 'Read 15 pages of an educational or inspiring book.',
    category: 'Mindfulness',
    frequency: 'daily',
    color: '#ec4899',
    icon: 'BookOpen'
  },
  {
    title: 'Post-Workout Stretching',
    description: '10 minutes of full-body mobility and flexibility.',
    category: 'Fitness',
    frequency: 'daily',
    color: '#10b981',
    icon: 'Activity'
  },
  {
    title: 'Meditation & Breathwork',
    description: '5-10 minutes of box breathing or calm mindfulness.',
    category: 'Mindfulness',
    frequency: 'daily',
    color: '#a855f7',
    icon: 'Sparkles'
  },
  {
    title: 'Consistent Bedtime',
    description: 'Turn off screens and wind down at your target hour.',
    category: 'Sleep',
    frequency: 'daily',
    color: '#6366f1',
    icon: 'Moon'
  },
  {
    title: 'Healthy Whole-Food Eating',
    description: 'Prioritize protein, veggies, and avoid ultra-processed foods.',
    category: 'Nutrition',
    frequency: 'daily',
    color: '#f97316',
    icon: 'Apple'
  }
];

// Helper to get today's date formatted as YYYY-MM-DD
const getFormattedDate = (d = new Date()) => {
  return d.toISOString().split('T')[0];
};

// @desc    Get all habits for current user with today's status & streaks
// @route   GET /api/habits
// @access  Private
exports.getHabits = async (req, res, next) => {
  try {
    const today = req.query.date || getFormattedDate();

    const habits = await Habit.find({
      user: req.user._id,
      archived: false
    }).sort({ createdAt: -1 });

    // Fetch today's logs for all user's habits
    const todayLogs = await HabitLog.find({
      user: req.user._id,
      date: today
    });

    const completedHabitIds = new Set(
      todayLogs.filter(log => log.completed).map(log => log.habit.toString())
    );

    // Calculate weekly completion (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startDateStr = getFormattedDate(sevenDaysAgo);

    const pastWeekLogs = await HabitLog.find({
      user: req.user._id,
      date: { $gte: startDateStr, $lte: today },
      completed: true
    });

    const habitsWithStatus = habits.map(habit => {
      const habitId = habit._id.toString();
      const isCompletedToday = completedHabitIds.has(habitId);
      const weeklyCompletions = pastWeekLogs.filter(
        log => log.habit.toString() === habitId
      ).length;
      const weeklyRate = Math.round((weeklyCompletions / 7) * 100);

      return {
        ...habit.toObject(),
        isCompletedToday,
        weeklyCompletions,
        weeklyRate
      };
    });

    res.json({
      success: true,
      data: habitsWithStatus,
      date: today
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit templates
// @route   GET /api/habits/templates
// @access  Private
exports.getTemplates = async (req, res) => {
  res.json({
    success: true,
    data: HABIT_TEMPLATES
  });
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
exports.createHabit = async (req, res, next) => {
  try {
    const { title, description, category, frequency, targetDaysPerWeek, color, icon } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Habit title is required' });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title,
      description: description || '',
      category: category || 'General',
      frequency: frequency || 'daily',
      targetDaysPerWeek: targetDaysPerWeek || 7,
      color: color || '#6366f1',
      icon: icon || 'CheckCircle'
    });

    res.status(201).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
exports.updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const { title, description, category, frequency, targetDaysPerWeek, color, icon, archived } = req.body;

    if (title !== undefined) habit.title = title;
    if (description !== undefined) habit.description = description;
    if (category !== undefined) habit.category = category;
    if (frequency !== undefined) habit.frequency = frequency;
    if (targetDaysPerWeek !== undefined) habit.targetDaysPerWeek = targetDaysPerWeek;
    if (color !== undefined) habit.color = color;
    if (icon !== undefined) habit.icon = icon;
    if (archived !== undefined) habit.archived = archived;

    await habit.save();

    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    await Habit.deleteOne({ _id: habit._id });
    await HabitLog.deleteMany({ habit: habit._id });

    res.json({
      success: true,
      message: 'Habit and related history removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle habit completion for a specific date
// @route   POST /api/habits/:id/toggle
// @access  Private
exports.toggleHabitCompletion = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const date = req.body.date || getFormattedDate();

    const existingLog = await HabitLog.findOne({
      user: req.user._id,
      habit: habit._id,
      date
    });

    let isCompleted = false;

    if (existingLog) {
      if (existingLog.completed) {
        existingLog.completed = false;
        await existingLog.save();
        isCompleted = false;
      } else {
        existingLog.completed = true;
        await existingLog.save();
        isCompleted = true;
      }
    } else {
      await HabitLog.create({
        user: req.user._id,
        habit: habit._id,
        date,
        completed: true
      });
      isCompleted = true;
    }

    // Recalculate streak for this habit
    const recentLogs = await HabitLog.find({
      user: req.user._id,
      habit: habit._id,
      completed: true
    }).sort({ date: -1 }).limit(60);

    const logDates = new Set(recentLogs.map(l => l.date));

    // Check consecutive days starting from today or yesterday
    let currentStreak = 0;
    let checkDate = new Date();
    let checkStr = getFormattedDate(checkDate);

    // If today is completed, count starting today
    if (logDates.has(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If not completed today, check if yesterday was completed
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (logDates.has(getFormattedDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    habit.currentStreak = currentStreak;
    if (currentStreak > habit.bestStreak) {
      habit.bestStreak = currentStreak;
    }
    await habit.save();

    res.json({
      success: true,
      isCompleted,
      currentStreak: habit.currentStreak,
      bestStreak: habit.bestStreak,
      date
    });
  } catch (error) {
    next(error);
  }
};
