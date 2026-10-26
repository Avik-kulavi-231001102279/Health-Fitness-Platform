const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const ctrl = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/statistics', ctrl.getStatistics);
router.get('/users', ctrl.getUsers);
router.delete('/users/:id', ctrl.deleteUser);

router.post('/exercises', ctrl.createExercise);
router.put('/exercises/:id', ctrl.updateExercise);
router.delete('/exercises/:id', ctrl.deleteExercise);

router.post('/foods', ctrl.createFood);
router.put('/foods/:id', ctrl.updateFood);
router.delete('/foods/:id', ctrl.deleteFood);

router.post('/challenges', ctrl.createChallenge);
router.put('/challenges/:id', ctrl.updateChallenge);
router.delete('/challenges/:id', ctrl.deleteChallenge);

module.exports = router;
