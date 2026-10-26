const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['workout', 'steps', 'water', 'pushup', 'cardio', 'custom'],
    default: 'workout'
  },
  target: { type: Number, required: true },
  unit: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

challengeSchema.index({ isActive: 1, endDate: 1 });

module.exports = mongoose.model('Challenge', challengeSchema);
