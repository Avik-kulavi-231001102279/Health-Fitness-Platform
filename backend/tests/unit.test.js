const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateWaterTarget
} = require('../utils/calorieCalculator');

describe('FitLife Pro Unit Tests — Nutrition & Energy Equations', () => {

  test('Mifflin-St Jeor BMR calculation for Adult Male', () => {
    // Weight: 80kg, Height: 180cm, Age: 30, Gender: Male
    // Formula: (10 * 80) + (6.25 * 180) - (5 * 30) + 5 = 800 + 1125 - 150 + 5 = 1780
    const bmr = calculateBMR(80, 180, 30, 'Male');
    assert.strictEqual(bmr, 1780);
  });

  test('Mifflin-St Jeor BMR calculation for Adult Female', () => {
    // Weight: 60kg, Height: 165cm, Age: 28, Gender: Female
    // Formula: (10 * 60) + (6.25 * 165) - (5 * 28) - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 -> 1330
    const bmr = calculateBMR(60, 165, 28, 'Female');
    assert.strictEqual(bmr, 1330);
  });

  test('TDEE calculation with Moderately active multiplier', () => {
    // BMR: 1780, Moderately active multiplier: 1.55 => 1780 * 1.55 = 2759
    const tdee = calculateTDEE(1780, 'Moderately active');
    assert.strictEqual(tdee, 2759);
  });

  test('Calorie Target with Gradual Weight Loss deficit and safety floor', () => {
    // TDEE: 2500, Deficit: 450 => 2050
    const target = calculateCalorieTarget(2500, 'Gradual weight loss', 'Male');
    assert.strictEqual(target, 2050);

    // Safety floor for females: should not drop below 1200 kcal
    const lowTarget = calculateCalorieTarget(1400, 'Gradual weight loss', 'Female');
    assert.strictEqual(lowTarget, 1200);
  });

  test('Macro breakdown adheres to target percentages', () => {
    const macros = calculateMacros(2000, 'Build strength');
    // Protein: 35% of 2000 = 700 kcal / 4 = 175g
    // Carbs: 40% of 2000 = 800 kcal / 4 = 200g
    // Fat: 25% of 2000 = 500 kcal / 9 = 56g
    assert.strictEqual(macros.protein, 175);
    assert.strictEqual(macros.carbs, 200);
    assert.strictEqual(macros.fat, 56);
  });

  test('Water target scales with body weight and activity level', () => {
    // 70kg base * 35 = 2450. Moderately active adds 600 => 3050 ml
    const water = calculateWaterTarget(70, 'Moderately active');
    assert.strictEqual(water, 3050);
  });

  test('Serving size nutrition scaling function', () => {
    const baseServing = 100; // grams
    const selectedGrams = 250; // user entered 250g
    const baseCalories = 165;
    const baseProtein = 31;

    const ratio = selectedGrams / baseServing;
    const calculatedCalories = Math.round(baseCalories * ratio);
    const calculatedProtein = parseFloat((baseProtein * ratio).toFixed(1));

    assert.strictEqual(calculatedCalories, 413);
    assert.strictEqual(calculatedProtein, 77.5);
  });

  test('Sleep duration calculation correctly crosses midnight', () => {
    function calculateSleepHours(sleepTime, wakeUpTime) {
      const [sHours, sMinutes] = sleepTime.split(':').map(Number);
      const [wHours, wMinutes] = wakeUpTime.split(':').map(Number);
      let sTotal = sHours * 60 + sMinutes;
      let wTotal = wHours * 60 + wMinutes;
      if (wTotal <= sTotal) {
        wTotal += 24 * 60;
      }
      return parseFloat(((wTotal - sTotal) / 60).toFixed(1));
    }

    // 22:30 (10:30 PM) to 06:45 (6:45 AM) = 8 hours 15 minutes = 8.3 hours (rounded)
    const duration = calculateSleepHours('22:30', '06:45');
    assert.strictEqual(duration, 8.3);

    // 23:00 to 07:00 = 8.0 hours
    const duration2 = calculateSleepHours('23:00', '07:00');
    assert.strictEqual(duration2, 8.0);
  });

  test('Habit streak calculation counts unbroken consecutive days', () => {
    function calculateStreak(completedDatesSet, referenceDate = new Date('2026-10-25T12:00:00Z')) {
      const getFormatted = (d) => d.toISOString().split('T')[0];
      let streak = 0;
      let checkDate = new Date(referenceDate);

      // Check today
      if (completedDatesSet.has(getFormatted(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (completedDatesSet.has(getFormatted(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      return streak;
    }

    const testDates = new Set(['2026-10-25', '2026-10-24', '2026-10-23', '2026-10-22']);
    const ref = new Date('2026-10-25T12:00:00Z');
    assert.strictEqual(calculateStreak(testDates, ref), 4);

    // Broken streak
    const brokenDates = new Set(['2026-10-25', '2026-10-23']);
    assert.strictEqual(calculateStreak(brokenDates, ref), 1);
  });
});
