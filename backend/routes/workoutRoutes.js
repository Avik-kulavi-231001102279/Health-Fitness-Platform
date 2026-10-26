const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/workoutController');

// Exercises (public read, protected create)
router.get('/exercises', protect, ctrl.getExercises);
router.get('/exercises/:id', protect, ctrl.getExercise);

// Workout Plans
router.get('/', protect, ctrl.getWorkouts);
router.post('/', protect, ctrl.createWorkout);
router.delete('/:id', protect, ctrl.deleteWorkout);

// Workout Sessions
router.post('/sessions', protect, ctrl.startSession);
router.put('/sessions/:id/complete', protect, ctrl.completeSession);
router.get('/sessions', protect, ctrl.getHistory);
router.get('/sessions/:id', protect, ctrl.getSession);

module.exports = router;
