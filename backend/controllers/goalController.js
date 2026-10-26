const Goal = require('../models/Goal');

// ─── Get User Goals ───
exports.getGoals = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Create Goal ───
exports.createGoal = async (req, res) => {
  try {
    const { title, type, target, unit, targetDate } = req.body;
    if (!title || !target) return res.status(400).json({ message: 'Title and target are required.' });

    const goal = await Goal.create({
      user: req.user.id, title, type: type || 'custom',
      target, unit: unit || '', targetDate: targetDate || null
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Update Goal Progress ───
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });

    const { current, status } = req.body;
    if (current !== undefined) goal.current = current;
    if (status) goal.status = status;

    // Auto-complete if target reached
    if (goal.current >= goal.target) goal.status = 'completed';

    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Delete Goal ───
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    res.status(200).json({ message: 'Goal deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
