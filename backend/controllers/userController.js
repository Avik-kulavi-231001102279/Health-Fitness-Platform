const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const bcrypt = require('bcryptjs');
const { calculateAllTargets } = require('../utils/calorieCalculator');

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

// ─── Get Profile ───
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// ─── Complete Onboarding ───
exports.completeOnboarding = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      fitnessGoal,
      activityLevel,
      workoutExperience,
      foodPreference,
      dietaryRestrictions,
      targetWeight,
      preferredUnits,
      availableWorkoutTime,
      dailySleepTarget
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.age = Number(age) || user.age;
    user.gender = gender || user.gender;
    user.height = Number(height) || user.height;
    user.weight = Number(weight) || user.weight;
    user.fitnessGoal = fitnessGoal || user.fitnessGoal;
    user.activityLevel = activityLevel || user.activityLevel;
    user.workoutExperience = workoutExperience || user.workoutExperience;
    user.foodPreference = foodPreference || user.foodPreference;
    if (preferredUnits) user.preferredUnits = preferredUnits;
    if (availableWorkoutTime) user.availableWorkoutTime = Number(availableWorkoutTime);
    if (dailySleepTarget) user.dailySleepTarget = Number(dailySleepTarget);
    if (dietaryRestrictions) user.dietaryRestrictions = dietaryRestrictions;
    if (targetWeight) user.targetWeight = Number(targetWeight);

    // Calculate smart targets
    const targets = calculateAllTargets(user);
    user.dailyCalorieTarget = targets.dailyCalorieTarget;
    user.macros = targets.macros;
    user.dailyWaterTarget = targets.dailyWaterTarget;
    user.isOnboardingDone = true;

    await user.save();

    // Log initial weight
    if (user.weight) {
      await WeightLog.create({
        user: user._id,
        weight: user.weight,
        date: new Date(),
        notes: 'Initial weight recorded during onboarding'
      });
    }

    res.json({
      message: 'Onboarding completed successfully',
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ message: err.message || 'Server error completing onboarding' });
  }
};

// ─── Update Profile ───
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      age,
      gender,
      height,
      weight,
      targetWeight,
      fitnessGoal,
      activityLevel,
      workoutExperience,
      foodPreference,
      dietaryRestrictions,
      profileImage,
      theme,
      notifications,
      preferredUnits,
      availableWorkoutTime,
      dailySleepTarget,
      quietHours
    } = req.body;

    let needsRecalculation = false;

    if (name) user.name = name;
    if (age !== undefined) { user.age = Number(age); needsRecalculation = true; }
    if (gender) { user.gender = gender; needsRecalculation = true; }
    if (height !== undefined) { user.height = Number(height); needsRecalculation = true; }
    if (weight !== undefined) {
      user.weight = Number(weight);
      needsRecalculation = true;
      // Also log new weight
      await WeightLog.create({
        user: user._id,
        weight: Number(weight),
        date: new Date(),
        notes: 'Weight updated from profile'
      });
    }
    if (targetWeight !== undefined) user.targetWeight = Number(targetWeight);
    if (fitnessGoal) { user.fitnessGoal = fitnessGoal; needsRecalculation = true; }
    if (activityLevel) { user.activityLevel = activityLevel; needsRecalculation = true; }
    if (workoutExperience) user.workoutExperience = workoutExperience;
    if (foodPreference) user.foodPreference = foodPreference;
    if (dietaryRestrictions) user.dietaryRestrictions = dietaryRestrictions;
    if (preferredUnits) user.preferredUnits = preferredUnits;
    if (availableWorkoutTime !== undefined) user.availableWorkoutTime = Number(availableWorkoutTime);
    if (dailySleepTarget !== undefined) user.dailySleepTarget = Number(dailySleepTarget);
    if (quietHours) user.quietHours = { ...user.quietHours, ...quietHours };
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (theme) user.theme = theme;
    if (notifications) user.notifications = { ...user.notifications, ...notifications };

    if (needsRecalculation && user.weight && user.height && user.age) {
      const targets = calculateAllTargets(user);
      user.dailyCalorieTarget = targets.dailyCalorieTarget;
      user.macros = targets.macros;
      user.dailyWaterTarget = targets.dailyWaterTarget;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message || 'Server error updating profile' });
  }
};

// ─── Change Password ───
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

// ─── Delete Account ───
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Server error deleting account' });
  }
};
