/**
 * BMI Calculator Utility
 * Presents BMI as a general screening/fitness metric, NOT a medical diagnosis.
 */

const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
};

const getBMICategory = (bmi) => {
  if (!bmi) return 'N/A';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
};

const getBMIColor = (category) => {
  const colors = {
    'Underweight': '#3B82F6',
    'Normal': '#10B981',
    'Overweight': '#F59E0B',
    'Obesity': '#EF4444'
  };
  return colors[category] || '#6B7280';
};

module.exports = { calculateBMI, getBMICategory, getBMIColor };
