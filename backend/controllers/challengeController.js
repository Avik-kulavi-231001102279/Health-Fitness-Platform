const Challenge = require('../models/Challenge');

// ─── Get Active Challenges ───
exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Add user's progress if participating
    const result = challenges.map(c => {
      const participant = c.participants.find(p => p.user.toString() === req.user.id);
      return {
        ...c.toObject(),
        joined: !!participant,
        myProgress: participant ? participant.progress : 0,
        myCompleted: participant ? participant.completed : false,
        participantCount: c.participants.length
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Join Challenge ───
exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found.' });

    const alreadyJoined = challenge.participants.find(p => p.user.toString() === req.user.id);
    if (alreadyJoined) return res.status(400).json({ message: 'Already joined.' });

    challenge.participants.push({ user: req.user.id, progress: 0 });
    await challenge.save();

    res.status(200).json({ message: 'Joined challenge!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Update Challenge Progress ───
exports.updateProgress = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found.' });

    const participant = challenge.participants.find(p => p.user.toString() === req.user.id);
    if (!participant) return res.status(400).json({ message: 'You haven\'t joined this challenge.' });

    const { progress } = req.body;
    participant.progress = progress;
    if (progress >= challenge.target) participant.completed = true;

    await challenge.save();
    res.status(200).json({ message: 'Progress updated.', progress: participant.progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
