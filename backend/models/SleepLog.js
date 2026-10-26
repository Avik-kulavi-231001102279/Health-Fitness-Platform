const mongoose = require('mongoose');

const sleepLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sleepTime: { type: String, required: true }, // e.g., "22:30"
  wakeUpTime: { type: String, required: true }, // e.g., "06:30"
  duration: { type: Number, required: true }, // hours as decimal, e.g. 8.0
  quality: { type: Number, min: 1, max: 5, default: 4 }, // 1 to 5 scale
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

sleepLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('SleepLog', sleepLogSchema);
