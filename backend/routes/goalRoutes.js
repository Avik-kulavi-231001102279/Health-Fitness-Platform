const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/goalController');

router.get('/', protect, ctrl.getGoals);
router.post('/', protect, ctrl.createGoal);
router.put('/:id', protect, ctrl.updateGoal);
router.delete('/:id', protect, ctrl.deleteGoal);

module.exports = router;
