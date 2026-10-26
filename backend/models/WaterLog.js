const mongoose = require('mongoose');

const waterLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // ml
  date: { type: Date, default: Date.now }
}, { timestamps: true });

waterLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WaterLog', waterLogSchema);
