const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs', 'Full Body', 'Cardio', 'HIIT', 'Stretching', 'Yoga']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  instructions: { type: String, default: '' },
  defaultSets: { type: Number, default: 3 },
  defaultReps: { type: Number, default: 12 },
  duration: { type: Number, default: 0 }, // minutes (for cardio/yoga)
  estimatedCalories: { type: Number, default: 0 }, // per session
  image: { type: String, default: '' },
  isCustom: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ name: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);
