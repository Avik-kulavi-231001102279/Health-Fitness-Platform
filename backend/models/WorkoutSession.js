const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  workoutName: { type: String, default: 'Quick Workout' },
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    exerciseName: { type: String },
    sets: [{
      reps: { type: Number },
      completed: { type: Boolean, default: false }
    }],
    completed: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false }
  }],
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalDuration: { type: Number, default: 0 }, // minutes
  caloriesBurned: { type: Number, default: 0 },
  exercisesCompleted: { type: Number, default: 0 },
  setsCompleted: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'cancelled'],
    default: 'in-progress'
  }
}, { timestamps: true });

workoutSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
