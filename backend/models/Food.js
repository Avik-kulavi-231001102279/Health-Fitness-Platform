const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  calories: { type: Number, required: true }, // per servingSize
  protein: { type: Number, required: true }, // grams
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 }, // grams
  servingSize: { type: String, default: '100g' },
  servingUnit: { type: String, default: 'g' },
  category: {
    type: String,
    enum: ['Fruits', 'Vegetables', 'Grains', 'Protein', 'Dairy', 'Nuts & Seeds', 'Beverages', 'Snacks', 'Other'],
    default: 'Other'
  },
  dataSource: { type: String, default: 'Verified Nutrition Database' },
  isVerified: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

foodSchema.index({ name: 'text' });
foodSchema.index({ category: 1 });

module.exports = mongoose.model('Food', foodSchema);
