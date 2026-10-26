/**
 * Smart Fitness Recommendation Engine
 * Rule-based system — presented as general wellness guidance, NOT medical advice.
 * Architecture ready for future AI integration.
 */

const generateRecommendations = (user) => {
  const recommendations = {
    workout: [],
    nutrition: [],
    lifestyle: [],
    insights: []
  };

  if (!user) return recommendations;

  const { fitnessGoal, activityLevel, workoutExperience, age, gender, foodPreference } = user;
  const { calculateBMI } = require('./bmiCalculator');
  const bmi = calculateBMI(user.weight, user.height);

  // ─── Workout Recommendations ───
  if (fitnessGoal === 'Gradual weight loss') {
    recommendations.workout.push('Include 3-4 cardio sessions per week (30-45 min each)');
    recommendations.workout.push('Add strength training 2-3 times per week to preserve muscle');
    recommendations.workout.push('Try HIIT workouts for efficient calorie burn');
    if (activityLevel === 'Sedentary') {
      recommendations.workout.push('Start with daily walking (30 min) and gradually increase intensity');
    }
  } else if (fitnessGoal === 'Build strength' || fitnessGoal === 'Gradual weight gain') {
    recommendations.workout.push('Focus on progressive overload with compound movements');
    recommendations.workout.push('Train each muscle group 2x per week');
    recommendations.workout.push('Include rest days for recovery — muscles grow during rest');
    recommendations.workout.push('Prioritize compound exercises: squats, deadlifts, bench press, rows');
  } else if (fitnessGoal === 'Improve fitness') {
    recommendations.workout.push('Mix cardio and strength training for overall fitness');
    recommendations.workout.push('Try Full Body workouts 3-4 times per week');
    recommendations.workout.push('Include flexibility work like yoga or stretching');
  } else {
    recommendations.workout.push('Aim for at least 150 minutes of moderate activity per week');
    recommendations.workout.push('Include both cardio and strength exercises');
    recommendations.workout.push('Add stretching or yoga for flexibility and stress relief');
  }

  // Adjust for experience level
  if (workoutExperience === 'Beginner') {
    recommendations.workout.push('Start with bodyweight exercises before adding weights');
    recommendations.workout.push('Focus on learning proper form to prevent injury');
  }

  // ─── Nutrition Recommendations ───
  if (fitnessGoal === 'Gradual weight loss') {
    recommendations.nutrition.push('Maintain a moderate calorie deficit (300-500 kcal below TDEE)');
    recommendations.nutrition.push('Prioritize protein-rich foods to preserve muscle mass');
    recommendations.nutrition.push('Increase vegetable and fiber intake for satiety');
  } else if (fitnessGoal === 'Build strength' || fitnessGoal === 'Gradual weight gain') {
    recommendations.nutrition.push('Eat in a slight calorie surplus (200-300 kcal above TDEE)');
    recommendations.nutrition.push('Consume 1.6-2.2g protein per kg of body weight');
    recommendations.nutrition.push('Time protein intake around workouts for better recovery');
  } else {
    recommendations.nutrition.push('Eat a balanced diet with adequate protein, carbs, and healthy fats');
    recommendations.nutrition.push('Include a variety of fruits and vegetables daily');
  }

  // Food preference adjustments
  if (foodPreference === 'Vegetarian' || foodPreference === 'Vegan') {
    recommendations.nutrition.push('Include diverse plant protein sources: lentils, chickpeas, tofu, quinoa');
    if (foodPreference === 'Vegan') {
      recommendations.nutrition.push('Consider B12 supplementation and ensure adequate iron intake');
    }
  }

  // ─── Lifestyle Recommendations ───
  recommendations.lifestyle.push('Aim for 7-9 hours of quality sleep each night');
  recommendations.lifestyle.push('Stay hydrated throughout the day — don\'t wait until you\'re thirsty');

  if (bmi && bmi > 25) {
    recommendations.lifestyle.push('Small, consistent changes in diet and activity lead to sustainable results');
  }

  if (age && age > 40) {
    recommendations.lifestyle.push('Include joint-friendly exercises and prioritize warm-ups');
  }

  // ─── Insights ───
  if (bmi) {
    if (bmi < 18.5) {
      recommendations.insights.push('Your BMI indicates you may be underweight — focus on nutrient-dense foods');
    } else if (bmi >= 18.5 && bmi < 25) {
      recommendations.insights.push('Your BMI is in the normal range — great foundation for your fitness goals');
    } else if (bmi >= 25 && bmi < 30) {
      recommendations.insights.push('Your BMI suggests being overweight — a combination of diet and exercise can help');
    } else {
      recommendations.insights.push('Consider consulting a healthcare professional for personalized guidance');
    }
  }

  return recommendations;
};

/**
 * Generate weekly health insights based on user data
 */
const generateWeeklyInsights = (userData) => {
  const insights = [];

  if (userData.workoutCountThisWeek > userData.workoutCountLastWeek) {
    insights.push('Your workout frequency increased compared to last week. Keep it up!');
  } else if (userData.workoutCountThisWeek < userData.workoutCountLastWeek) {
    insights.push('Your workout frequency decreased this week. Try to stay consistent.');
  }

  if (userData.avgWaterThisWeek < userData.waterTarget * 0.7) {
    insights.push('Your water intake was below your daily target on several days this week.');
  }

  if (userData.avgSleepThisWeek < 7) {
    insights.push('Your average sleep this week was below 7 hours. Prioritize rest for recovery.');
  } else if (userData.avgSleepThisWeek >= 7.5) {
    insights.push('Great sleep consistency this week! Quality rest supports your fitness goals.');
  }

  if (userData.streakDays >= 7) {
    insights.push(`Impressive ${userData.streakDays}-day streak! Consistency is the key to results.`);
  }

  if (insights.length === 0) {
    insights.push('Start tracking your workouts, meals, and water to get personalized weekly insights.');
  }

  return insights;
};

module.exports = { generateRecommendations, generateWeeklyInsights };
