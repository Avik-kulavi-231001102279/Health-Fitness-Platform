const Food = require('../models/Food');
const MealLog = require('../models/MealLog');
const DietPlan = require('../models/DietPlan');

// ─── Get Foods (with search) ───
exports.getFoods = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const foods = await Food.find(filter).sort({ name: 1 }).limit(50);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Add Food ───
exports.addFood = async (req, res) => {
  try {
    const food = await Food.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Log Meal ───
exports.logMeal = async (req, res) => {
  try {
    const { mealType, foodId, foodName, quantity, calories, protein, carbs, fat } = req.body;

    const meal = await MealLog.create({
      user: req.user.id,
      mealType,
      food: foodId || undefined,
      foodName,
      quantity,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      date: new Date()
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error('Log Meal Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get Today's Meals ───
exports.getTodayMeals = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    const meals = await MealLog.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ createdAt: 1 });

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Update Meal Log ───
exports.updateMeal = async (req, res) => {
  try {
    const { quantity, calories, protein, carbs, fat, mealType, foodName } = req.body;
    const meal = await MealLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!meal) return res.status(404).json({ message: 'Meal entry not found.' });

    if (quantity !== undefined) meal.quantity = quantity;
    if (calories !== undefined) meal.calories = calories;
    if (protein !== undefined) meal.protein = protein;
    if (carbs !== undefined) meal.carbs = carbs;
    if (fat !== undefined) meal.fat = fat;
    if (mealType !== undefined) meal.mealType = mealType;
    if (foodName !== undefined) meal.foodName = foodName;

    await meal.save();
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Delete Meal Log ───
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await MealLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!meal) return res.status(404).json({ message: 'Meal not found.' });
    res.status(200).json({ message: 'Meal deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get Meal History ───
exports.getMealHistory = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const meals = await MealLog.find({
      user: req.user.id,
      date: { $gte: since }
    }).sort({ date: -1 });

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Get Diet Plans ───
exports.getDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Create Diet Plan ───
exports.createDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.create({ ...req.body, user: req.user.id });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
