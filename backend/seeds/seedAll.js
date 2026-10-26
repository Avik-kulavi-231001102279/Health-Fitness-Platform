const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const Exercise = require('../models/Exercise');
const Food = require('../models/Food');
const Challenge = require('../models/Challenge');

const exercises = [
  { name: 'Push-Ups', category: 'Chest', difficulty: 'Beginner', instructions: 'Keep body straight, lower chest to ground, press back up.', sets: 3, reps: 15, estimatedCalories: 50 },
  { name: 'Barbell Bench Press', category: 'Chest', difficulty: 'Intermediate', instructions: 'Lower bar to mid-chest with control, press upward explosively.', sets: 4, reps: 10, estimatedCalories: 100 },
  { name: 'Incline Dumbbell Press', category: 'Chest', difficulty: 'Intermediate', instructions: 'Set bench to 30-45 degrees, press dumbbells overhead.', sets: 3, reps: 12, estimatedCalories: 80 },
  { name: 'Pull-Ups', category: 'Back', difficulty: 'Intermediate', instructions: 'Overhand grip, pull elbows down to ribs until chin passes bar.', sets: 3, reps: 8, estimatedCalories: 70 },
  { name: 'Bent-Over Barbell Row', category: 'Back', difficulty: 'Intermediate', instructions: 'Hinge hips back at 45 deg, pull bar to upper waist.', sets: 4, reps: 10, estimatedCalories: 90 },
  { name: 'Lat Pulldown', category: 'Back', difficulty: 'Beginner', instructions: 'Pull cable bar smoothly to upper chest, squeeze scapulae.', sets: 3, reps: 12, estimatedCalories: 60 },
  { name: 'Overhead Shoulder Press', category: 'Shoulders', difficulty: 'Intermediate', instructions: 'Press barbell overhead from collarbone to full lockout.', sets: 3, reps: 10, estimatedCalories: 75 },
  { name: 'Lateral Dumbbell Raises', category: 'Shoulders', difficulty: 'Beginner', instructions: 'Raise arms out to sides until parallel to floor.', sets: 3, reps: 15, estimatedCalories: 45 },
  { name: 'Barbell Bicep Curls', category: 'Arms', difficulty: 'Beginner', instructions: 'Keep elbows tucked, curl bar up toward shoulders.', sets: 3, reps: 12, estimatedCalories: 50 },
  { name: 'Tricep Rope Pushdown', category: 'Arms', difficulty: 'Beginner', instructions: 'Push cable downward, spreading ends apart at bottom.', sets: 3, reps: 15, estimatedCalories: 45 },
  { name: 'Barbell Back Squats', category: 'Legs', difficulty: 'Intermediate', instructions: 'Hinge back, descend till hips break 90 degrees, drive up.', sets: 4, reps: 10, estimatedCalories: 130 },
  { name: 'Romanian Deadlift', category: 'Legs', difficulty: 'Intermediate', instructions: 'Hinge hips back with slight knee bend, feel hamstring stretch.', sets: 3, reps: 10, estimatedCalories: 110 },
  { name: 'Walking Lunges', category: 'Legs', difficulty: 'Beginner', instructions: 'Step forward into 90 deg bend on each leg in continuous strides.', sets: 3, reps: 20, estimatedCalories: 90 },
  { name: 'Plank Hold', category: 'Abs', difficulty: 'Beginner', instructions: 'Hold forearm plank with glutes locked and spine neutral.', sets: 3, duration: 60, estimatedCalories: 40 },
  { name: 'Hanging Leg Raises', category: 'Abs', difficulty: 'Advanced', instructions: 'Hang from pull-up bar, raise toes toward bar without swinging.', sets: 3, reps: 12, estimatedCalories: 55 },
  { name: 'HIIT Burpees', category: 'HIIT', difficulty: 'Intermediate', instructions: 'Drop into push-up, jump feet in, explode upward with jump.', sets: 4, reps: 15, estimatedCalories: 120 },
  { name: 'High-Knee Cardio Sprint', category: 'Cardio', difficulty: 'Beginner', instructions: 'Pump arms and drive knees high in rapid cadence.', sets: 3, duration: 45, estimatedCalories: 85 }
];

const foods = [
  // Indian Staples
  { name: 'Whole Wheat Roti / Chapati', calories: 104, protein: 3.5, carbs: 20, fat: 0.5, fiber: 3, servingSize: '1 medium (35g)', servingUnit: 'piece', category: 'Grains', dataSource: 'Verified Indian Food Composition', isVerified: true },
  { name: 'Moong Dal (Cooked Tadka)', calories: 150, protein: 9, carbs: 20, fat: 3.5, fiber: 5, servingSize: '1 katori (150g)', servingUnit: 'bowl', category: 'Protein', dataSource: 'Verified Indian Food Composition', isVerified: true },
  { name: 'Paneer (Raw / Cottage Cheese)', calories: 265, protein: 18, carbs: 3, fat: 20, fiber: 0, servingSize: '100g', servingUnit: 'g', category: 'Dairy', dataSource: 'Verified Indian Food Composition', isVerified: true },
  { name: 'Basmati White Rice (Cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, servingSize: '100g', servingUnit: 'g', category: 'Grains', dataSource: 'Verified Nutrition Database', isVerified: true },
  { name: 'Brown Rice (Cooked)', calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.8, servingSize: '100g', servingUnit: 'g', category: 'Grains', dataSource: 'Verified Nutrition Database', isVerified: true },
  { name: 'Masoor Dal (Red Lentils, Cooked)', calories: 168, protein: 12, carbs: 28, fat: 0.8, fiber: 6, servingSize: '1 katori (150g)', servingUnit: 'bowl', category: 'Protein', dataSource: 'Verified Indian Food Composition', isVerified: true },
  { name: 'Chana Masala (Chickpeas Curry)', calories: 180, protein: 8, carbs: 25, fat: 5, fiber: 6, servingSize: '1 katori (150g)', servingUnit: 'bowl', category: 'Vegetables', dataSource: 'Verified Indian Food Composition', isVerified: true },
  { name: 'Cow Milk (Toned, 3% fat)', calories: 60, protein: 3.2, carbs: 4.8, fat: 3.1, fiber: 0, servingSize: '100ml', servingUnit: 'ml', category: 'Dairy', dataSource: 'Verified Nutrition Database', isVerified: true },
  { name: 'Curd / Dahi (Plain Whole Milk)', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, servingSize: '100g', servingUnit: 'g', category: 'Dairy', dataSource: 'Verified Indian Food Composition', isVerified: true },
  { name: 'Mixed Vegetable Sabzi (Dry)', calories: 95, protein: 2.5, carbs: 12, fat: 4, fiber: 3.5, servingSize: '1 katori (120g)', servingUnit: 'bowl', category: 'Vegetables', dataSource: 'Verified Indian Food Composition', isVerified: true },
  
  // Proteins & Meats
  { name: 'Chicken Breast (Cooked, Grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g', servingUnit: 'g', category: 'Protein', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Fish Fillet (Rohu / Indian Carp, Steamed)', calories: 112, protein: 20, carbs: 0, fat: 3.2, fiber: 0, servingSize: '100g', servingUnit: 'g', category: 'Protein', dataSource: 'Verified Nutrition Database', isVerified: true },
  { name: 'Salmon Fillet (Baked)', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, servingSize: '100g', servingUnit: 'g', category: 'Protein', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Eggs (Whole, Boiled)', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, servingSize: '2 large (100g)', servingUnit: 'piece', category: 'Protein', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Egg White (Boiled)', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, servingSize: '3 large whites (100g)', servingUnit: 'piece', category: 'Protein', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Tofu (Firm)', calories: 144, protein: 17, carbs: 3, fat: 9, fiber: 2.3, servingSize: '100g', servingUnit: 'g', category: 'Protein', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Greek Yogurt (Plain, Non-fat)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, servingSize: '100g', servingUnit: 'g', category: 'Dairy', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Whey Protein Powder', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 1, servingSize: '1 scoop (30g)', servingUnit: 'scoop', category: 'Protein', dataSource: 'Verified Nutrition Database', isVerified: true },

  // Grains & Oats
  { name: 'Rolled Oats (Dry)', calories: 379, protein: 13.5, carbs: 68, fat: 6.5, fiber: 10, servingSize: '100g', servingUnit: 'g', category: 'Grains', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Sweet Potato (Baked)', calories: 90, protein: 2, carbs: 21, fat: 0.2, fiber: 3.3, servingSize: '100g', servingUnit: 'g', category: 'Vegetables', dataSource: 'USDA FoodData Central', isVerified: true },

  // Fruits & Vegetables
  { name: 'Broccoli (Steamed)', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 2.6, servingSize: '100g', servingUnit: 'g', category: 'Vegetables', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Spinach / Palak (Cooked)', calories: 23, protein: 3, carbs: 3.8, fat: 0.3, fiber: 2.4, servingSize: '100g', servingUnit: 'g', category: 'Vegetables', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, servingSize: '1 medium (100g)', servingUnit: 'piece', category: 'Fruits', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, servingSize: '1 medium (100g)', servingUnit: 'piece', category: 'Fruits', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Papaya (Ripe, Cubes)', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, servingSize: '1 cup (145g)', servingUnit: 'cup', category: 'Fruits', dataSource: 'Verified Nutrition Database', isVerified: true },

  // Nuts & Seeds
  { name: 'Almonds (Raw)', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, servingSize: '100g', servingUnit: 'g', category: 'Nuts & Seeds', dataSource: 'USDA FoodData Central', isVerified: true },
  { name: 'Walnuts (Raw halves)', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, servingSize: '100g', servingUnit: 'g', category: 'Nuts & Seeds', dataSource: 'USDA FoodData Central', isVerified: true }
];

const challenges = [
  {
    name: '30-Day Hydration Hero',
    description: 'Drink at least 3,000ml of water daily for 30 consecutive days.',
    type: 'water',
    target: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    name: '100 Push-Ups Mastery',
    description: 'Complete 100 push-ups logged across workouts this week.',
    type: 'pushup',
    target: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Weekly Workout Streak (5 Days)',
    description: 'Crush at least 5 workout sessions in a single week.',
    type: 'workout',
    target: 5,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('No MONGO_URI specified in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await Exercise.deleteMany({ createdBy: { $exists: false } });
    await Exercise.insertMany(exercises);
    console.log(`✅ Seeded ${exercises.length} Exercises`);

    await Food.deleteMany({ createdBy: { $exists: false } });
    await Food.insertMany(foods);
    console.log(`✅ Seeded ${foods.length} Foods`);

    await Challenge.deleteMany({});
    await Challenge.insertMany(challenges);
    console.log(`✅ Seeded ${challenges.length} Challenges`);

    console.log('🌟 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
