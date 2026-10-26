const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Authentication
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Password Reset
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  // Onboarding Status
  isOnboardingDone: { type: Boolean, default: false },

  // Step 1 — Basic Information
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  // Step 2 — Body Information
  height: { type: Number }, // cm
  weight: { type: Number }, // kg

  // Step 3 — Fitness Goal
  fitnessGoal: {
    type: String,
    enum: ['Gradual weight loss', 'Build strength', 'Maintain weight', 'Improve fitness', 'Gradual weight gain']
  },

  // Step 4 — Activity Level
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active']
  },

  // Step 5 — Workout Experience
  workoutExperience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },

  // Step 6 — Food Preference
  foodPreference: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian']
  },

  // Step 7 — Dietary Restrictions
  dietaryRestrictions: {
    type: [String],
    default: ['No Restrictions']
  },

  // Calculated Targets (set by system during onboarding/profile update)
  dailyCalorieTarget: { type: Number },
  dailyWaterTarget: { type: Number }, // in ml
  macros: {
    protein: { type: Number }, // grams
    carbs: { type: Number },
    fat: { type: Number }
  },

  // Profile
  profileImage: { type: String, default: '' },
  targetWeight: { type: Number },

  // Streaks & XP
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  totalXP: { type: Number, default: 0 },

  // Extended Preferences & Guardrails
  preferredUnits: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
  availableWorkoutTime: { type: Number, default: 45 }, // minutes per day
  dailySleepTarget: { type: Number, default: 8 }, // hours per night
  quietHours: {
    start: { type: String, default: '22:00' },
    end: { type: String, default: '07:00' },
    enabled: { type: Boolean, default: false }
  },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  notifications: {
    workout: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    meal: { type: Boolean, default: true },
    goal: { type: Boolean, default: true },
    habits: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);