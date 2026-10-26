const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/nutritionController');

// Foods
router.get('/foods', protect, ctrl.getFoods);
router.post('/foods', protect, ctrl.addFood);

// Meals
router.post('/meals', protect, ctrl.logMeal);
router.get('/meals/today', protect, ctrl.getTodayMeals);
router.get('/meals/history', protect, ctrl.getMealHistory);
router.put('/meals/:id', protect, ctrl.updateMeal);
router.delete('/meals/:id', protect, ctrl.deleteMeal);

// Diet Plans
router.get('/diet-plans', protect, ctrl.getDietPlans);
router.post('/diet-plans', protect, ctrl.createDietPlan);

module.exports = router;
