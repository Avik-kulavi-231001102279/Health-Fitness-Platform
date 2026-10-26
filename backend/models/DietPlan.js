const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  basedOnGoal: { type: String },
  totalCalories: { type: Number, default: 0 },
  meals: {
    breakfast: [{
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      foodName: { type: String },
      quantity: { type: Number },
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number }
    }],
    lunch: [{
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      foodName: { type: String },
      quantity: { type: Number },
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number }
    }],
    snack: [{
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      foodName: { type: String },
      quantity: { type: Number },
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number }
    }],
    dinner: [{
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      foodName: { type: String },
      quantity: { type: Number },
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number }
    }]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

dietPlanSchema.index({ user: 1 });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
