const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Habit title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['Fitness', 'Nutrition', 'Hydration', 'Mindfulness', 'Sleep', 'General'],
    default: 'General'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  targetDaysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    default: 7
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#6366f1' // purple/indigo accent
  },
  icon: {
    type: String,
    default: 'CheckCircle'
  },
  archived: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

habitSchema.index({ user: 1, archived: 1 });

module.exports = mongoose.model('Habit', habitSchema);
