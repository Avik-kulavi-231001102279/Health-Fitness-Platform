const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true }, // kg
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, { timestamps: true });

weightLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WeightLog', weightLogSchema);
