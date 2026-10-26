const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs', 'Full Body', 'Cardio', 'HIIT', 'Stretching', 'Yoga']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: { type: Number, default: 3 },
    reps: { type: Number, default: 12 },
    duration: { type: Number, default: 0 }
  }],
  estimatedDuration: { type: Number, default: 0 }, // minutes
  estimatedCalories: { type: Number, default: 0 }
}, { timestamps: true });

workoutSchema.index({ user: 1 });

module.exports = mongoose.model('Workout', workoutSchema);
