const { askAILifestyleAssistant } = require('../services/aiService');
const User = require('../models/User');

// Suggested prompts for the frontend UI
const DEFAULT_SUGGESTIONS = [
  'Suggest a balanced high-protein breakfast under 450 calories',
  'Design a 30-minute home workout for building core and upper body strength',
  'How do I stay hydrated throughout a busy workday?',
  'What are effective sleep hygiene habits to wake up energized?',
  'How can I stick to my workout routine when motivation drops?'
];

// @desc    Send message to AI Coach
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithCoach = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long. Please keep queries under 500 characters for optimal advice.'
      });
    }

    // Retrieve sanitized user profile
    const user = await User.findById(req.user.id).select(
      'fitnessGoal dailyCalorieTarget dailyWaterTarget activityLevel foodPreference dailySleepTarget workoutExperience'
    );

    const result = await askAILifestyleAssistant(message.trim(), user);

    res.json({
      success: true,
      data: {
        reply: result.reply,
        isAIGenerated: result.isAIGenerated,
        mode: result.mode,
        statusMessage: result.statusMessage,
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI suggestions and current configuration status
// @route   GET /api/ai/status
// @access  Private
exports.getAIStatus = async (req, res) => {
  const isKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'
  );

  res.json({
    success: true,
    data: {
      provider: 'Google Gemini',
      model: isKeyConfigured ? 'gemini-2.5-flash' : 'FitLife Deterministic Fallback Engine',
      isConfigured: isKeyConfigured,
      statusMessage: isKeyConfigured
        ? 'Gemini API is connected.'
        : 'Gemini API key is not configured in backend .env. Deterministic lifestyle optimization engine is active and fully functional.',
      suggestions: DEFAULT_SUGGESTIONS
    }
  });
};
