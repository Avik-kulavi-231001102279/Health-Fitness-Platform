const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const { getProfile, completeOnboarding, updateProfile, changePassword, deleteAccount } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.post('/onboarding', protect, completeOnboarding);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
