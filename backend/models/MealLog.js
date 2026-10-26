const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
    required: true
  },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true }, // grams
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

mealLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('MealLog', mealLogSchema);