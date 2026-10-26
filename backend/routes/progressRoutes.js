const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/progressController');

// Weight
router.post('/weight', protect, ctrl.logWeight);
router.get('/weight', protect, ctrl.getWeightHistory);

// Water
router.post('/water', protect, ctrl.logWater);
router.get('/water/today', protect, ctrl.getTodayWater);
router.get('/water/history', protect, ctrl.getWaterHistory);
router.delete('/water/:id', protect, ctrl.deleteWaterLog);
router.post('/water/undo', protect, ctrl.undoLastWater);
router.put('/water/goal', protect, ctrl.updateWaterGoal);

// Sleep
router.post('/sleep', protect, ctrl.logSleep);
router.get('/sleep', protect, ctrl.getSleepHistory);
router.delete('/sleep/:id', protect, ctrl.deleteSleepLog);

// Analytics & Data Export
router.get('/analytics', protect, ctrl.getAnalytics);
router.get('/export', protect, ctrl.exportUserData);

module.exports = router;
