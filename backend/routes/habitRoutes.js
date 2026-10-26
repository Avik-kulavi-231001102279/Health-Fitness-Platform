const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getHabits,
  getTemplates,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion
} = require('../controllers/habitController');

router.use(protect);

router.get('/', getHabits);
router.get('/templates', getTemplates);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/toggle', toggleHabitCompletion);

module.exports = router;
