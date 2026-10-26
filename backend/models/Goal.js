const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['weight', 'workout', 'water', 'running', 'custom'],
    default: 'custom'
  },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  unit: { type: String, default: '' }, // kg, times, L, km
  targetDate: { type: Date },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired'],
    default: 'active'
  }
}, { timestamps: true });

goalSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Goal', goalSchema);
