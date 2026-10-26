/**
 * FitLife Pro - Calorie & Macro Calculator Utility
 * Implements Mifflin-St Jeor adult BMR & TDEE equation with transparent, configurable rules.
 * Includes clinical safety guardrails (min safe caloric floor, no aggressive sudden deficits).
 */

const activityMultipliers = {
  'Sedentary': 1.2,
  'Lightly active': 1.375,
  'Moderately active': 1.55,
  'Very active': 1.725
};

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor
 * Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
 * Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
 */
const calculateBMR = (weight, height, age, gender) => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseInt(age, 10);
  if (!w || !h || !a) return 1600;

  if (gender === 'Male') {
    return Math.round((10 * w) + (6.25 * h) - (5 * a) + 5);
  }
  return Math.round((10 * w) + (6.25 * h) - (5 * a) - 161);
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
};

/**
 * Calculate daily calorie target based on fitness goal with transparent adjustments
 */
const calculateCalorieTarget = (tdee, fitnessGoal, gender = 'Male') => {
  let target = tdee;

  switch (fitnessGoal) {
    case 'Gradual weight loss':
      target = Math.round(tdee - 450); // Sustainable 0.4kg/week deficit
      break;
    case 'Gradual weight gain':
    case 'Build strength':
      target = Math.round(tdee + 350); // Controlled surplus for lean hypertrophy
      break;
    case 'Maintain weight':
    case 'Improve fitness':
    default:
      target = Math.round(tdee);
      break;
  }

  // Safety floor guardrail: Prevent dangerously low targets
  const minFloor = gender === 'Female' ? 1200 : 1500;
  return Math.max(target, minFloor);
};

/**
 * Calculate macro breakdown (protein, carbs, fat in grams)
 */
const calculateMacros = (dailyCalories, fitnessGoal) => {
  let proteinPct = 0.30;
  let fatPct = 0.25;
  let carbsPct = 0.45;

  if (fitnessGoal === 'Build strength' || fitnessGoal === 'Gradual weight gain') {
    proteinPct = 0.35;
    fatPct = 0.25;
    carbsPct = 0.40;
  } else if (fitnessGoal === 'Gradual weight loss') {
    proteinPct = 0.35;
    fatPct = 0.25;
    carbsPct = 0.40;
  }

  return {
    protein: Math.round((dailyCalories * proteinPct) / 4),
    carbs: Math.round((dailyCalories * carbsPct) / 4),
    fat: Math.round((dailyCalories * fatPct) / 9)
  };
};

/**
 * Calculate daily water target in ml based on weight and activity
 */
const calculateWaterTarget = (weight, activityLevel) => {
  const w = parseFloat(weight) || 70;
  let target = w * 35; // 35ml per kg base

  if (activityLevel === 'Lightly active') target += 300;
  else if (activityLevel === 'Moderately active') target += 600;
  else if (activityLevel === 'Very active') target += 900;

  // Safe clamping between 1500ml and 4500ml
  return Math.min(4500, Math.max(1800, Math.round(target)));
};

/**
 * Calculate all targets at once
 */
const calculateAllTargets = (user) => {
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const dailyCalorieTarget = calculateCalorieTarget(tdee, user.fitnessGoal, user.gender);
  const macros = calculateMacros(dailyCalorieTarget, user.fitnessGoal);
  const dailyWaterTarget = calculateWaterTarget(user.weight, user.activityLevel);

  return { bmr, tdee, dailyCalorieTarget, macros, dailyWaterTarget };
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateWaterTarget,
  calculateAllTargets
};
