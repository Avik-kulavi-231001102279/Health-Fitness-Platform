const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const protect = require('../middleware/authMiddleware');
const { chatWithCoach, getAIStatus } = require('../controllers/aiController');

// Dedicated rate limiter for AI queries
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: { success: false, message: 'AI Coach rate limit reached. Please wait a minute before sending another question.' }
});

router.use(protect);

router.post('/chat', aiLimiter, chatWithCoach);
router.get('/status', getAIStatus);

module.exports = router;
