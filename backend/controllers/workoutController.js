const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const WorkoutSession = require('../models/WorkoutSession');
const User = require('../models/User');

// ─── Get All Exercises ───
exports.getExercises = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Get Exercises Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get Single Exercise ───
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found.' });
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get User's Workout Plans ───
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).populate('exercises.exercise').sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Create Workout Plan ───
exports.createWorkout = async (req, res) => {
  try {
    const { name, category, difficulty, exercises, estimatedDuration, estimatedCalories } = req.body;
    const workout = await Workout.create({
      user: req.user.id, name, category, difficulty, exercises,
      estimatedDuration, estimatedCalories
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Delete Workout Plan ───
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    res.status(200).json({ message: 'Workout deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Start Workout Session ───
exports.startSession = async (req, res) => {
  try {
    const { workoutId, workoutName, exercises } = req.body;
    const session = await WorkoutSession.create({
      user: req.user.id,
      workout: workoutId || undefined,
      workoutName: workoutName || 'Quick Workout',
      exercises: exercises.map(ex => ({
        exercise: ex.exerciseId,
        exerciseName: ex.name,
        sets: Array(ex.sets || 3).fill({ reps: ex.reps || 12, completed: false }),
        completed: false,
        skipped: false
      })),
      startTime: new Date(),
      status: 'in-progress'
    });
    res.status(201).json(session);
  } catch (error) {
    console.error('Start Session Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Complete Workout Session ───
exports.completeSession = async (req, res) => {
  try {
    const session = await WorkoutSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const { exercises, caloriesBurned } = req.body;
    const endTime = new Date();
    const totalDuration = Math.round((endTime - session.startTime) / 60000); // minutes

    let exercisesCompleted = 0;
    let setsCompleted = 0;
    if (exercises) {
      session.exercises = exercises;
      exercises.forEach(ex => {
        if (ex.completed) exercisesCompleted++;
        if (ex.sets) ex.sets.forEach(s => { if (s.completed) setsCompleted++; });
      });
    }

    const xpEarned = exercisesCompleted * 20 + setsCompleted * 5;

    session.endTime = endTime;
    session.totalDuration = totalDuration;
    session.caloriesBurned = caloriesBurned || exercisesCompleted * 50;
    session.exercisesCompleted = exercisesCompleted;
    session.setsCompleted = setsCompleted;
    session.xpEarned = xpEarned;
    session.status = 'completed';
    await session.save();

    // Update user streak and XP
    const user = await User.findById(req.user.id);
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive === yesterday.toDateString()) {
        user.currentStreak = (user.currentStreak || 0) + 1;
      } else if (lastActive !== today) {
        user.currentStreak = 1;
      }
      user.lastActiveDate = new Date();
      if (user.currentStreak > (user.longestStreak || 0)) {
        user.longestStreak = user.currentStreak;
      }
    }
    user.totalXP = (user.totalXP || 0) + xpEarned;
    await user.save();

    res.status(200).json({
      message: 'Workout Complete! 🎉',
      session,
      summary: {
        totalDuration,
        caloriesBurned: session.caloriesBurned,
        exercisesCompleted,
        setsCompleted,
        xpEarned
      }
    });
  } catch (error) {
    console.error('Complete Session Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get Workout History ───
exports.getHistory = async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'all'
    const filter = { user: req.user.id, status: 'completed' };

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filter.createdAt = { $gte: weekAgo };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filter.createdAt = { $gte: monthAgo };
    }

    const sessions = await WorkoutSession.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get Single Session ───
exports.getSession = async (req, res) => {
  try {
    const session = await WorkoutSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
