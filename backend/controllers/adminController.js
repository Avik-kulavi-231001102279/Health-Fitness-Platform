const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Food = require('../models/Food');
const Challenge = require('../models/Challenge');
const WorkoutSession = require('../models/WorkoutSession');
const MealLog = require('../models/MealLog');

// ─── Get System Statistics ───
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExercises = await Exercise.countDocuments();
    const totalFoods = await Food.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const totalWorkoutsLogged = await WorkoutSession.countDocuments();
    const totalMealsLogged = await MealLog.countDocuments();

    // Today's active users (rough count based on updatedAt)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await User.countDocuments({ updatedAt: { $gte: today } });

    res.json({
      totalUsers,
      totalExercises,
      totalFoods,
      totalChallenges,
      totalWorkoutsLogged,
      totalMealsLogged,
      activeToday
    });
  } catch (err) {
    console.error('Admin statistics error:', err);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
};

// ─── Users Management ───
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// ─── Exercise Management ───
exports.createExercise = async (req, res) => {
  try {
    const exercise = new Exercise({
      ...req.body,
      createdBy: req.user.id
    });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error('Admin create exercise error:', err);
    res.status(500).json({ message: err.message || 'Server error creating exercise' });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (err) {
    console.error('Admin update exercise error:', err);
    res.status(500).json({ message: err.message || 'Server error updating exercise' });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.error('Admin delete exercise error:', err);
    res.status(500).json({ message: 'Server error deleting exercise' });
  }
};

// ─── Food Management ───
exports.createFood = async (req, res) => {
  try {
    const food = new Food({
      ...req.body,
      createdBy: req.user.id
    });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    console.error('Admin create food error:', err);
    res.status(500).json({ message: err.message || 'Server error creating food' });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    console.error('Admin update food error:', err);
    res.status(500).json({ message: err.message || 'Server error updating food' });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    console.error('Admin delete food error:', err);
    res.status(500).json({ message: 'Server error deleting food' });
  }
};

// ─── Challenge Management ───
exports.createChallenge = async (req, res) => {
  try {
    const challenge = new Challenge({
      ...req.body,
      createdBy: req.user.id
    });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    console.error('Admin create challenge error:', err);
    res.status(500).json({ message: err.message || 'Server error creating challenge' });
  }
};

exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (err) {
    console.error('Admin update challenge error:', err);
    res.status(500).json({ message: err.message || 'Server error updating challenge' });
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json({ message: 'Challenge deleted successfully' });
  } catch (err) {
    console.error('Admin delete challenge error:', err);
    res.status(500).json({ message: 'Server error deleting challenge' });
  }
};
