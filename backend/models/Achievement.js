const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  category: {
    type: String,
    enum: ['workout', 'streak', 'water', 'nutrition', 'goal', 'challenge'],
    default: 'workout'
  },
  condition: {
    type: { type: String }, // 'workout_count', 'streak_days', 'water_total', etc.
    value: { type: Number }
  },
  xpReward: { type: Number, default: 50 },
  unlockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
