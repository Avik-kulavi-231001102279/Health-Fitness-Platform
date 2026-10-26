const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/challengeController');

router.get('/', protect, ctrl.getChallenges);
router.post('/:id/join', protect, ctrl.joinChallenge);
router.put('/:id/progress', protect, ctrl.updateProgress);

module.exports = router;
