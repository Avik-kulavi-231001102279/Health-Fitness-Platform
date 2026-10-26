import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  UtensilsCrossed, Plus, Search, Trash2, Edit2, Flame,
  Apple, PieChart, Sparkles, Check, ChevronRight, Coffee,
  Beef, Salad, Sandwich, CheckCircle2, ShieldCheck, Filter
} from 'lucide-react';
import { PageLoader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function DietNutrition() {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for adding/editing meal
  const [showModal, setShowModal] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Custom Food Form
  const [isCustomFood, setIsCustomFood] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '', calories: 200, protein: 15, carbs: 20, fat: 5, servingSize: '1 serving'
  });

  const categories = ['All', 'Grains', 'Protein', 'Dairy', 'Vegetables', 'Fruits', 'Nuts & Seeds'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mealsRes, foodsRes] = await Promise.all([
        api.get('/nutrition/meals/today'),
        api.get('/nutrition/foods')
      ]);
      setTodayMeals(mealsRes.data || []);
      setFoods(foodsRes.data || []);
    } catch (err) {
      console.error('Failed to load nutrition data:', err);
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate totals
  const totalCalories = todayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = todayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbs = todayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalFat = todayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);

  const calorieTarget = user?.dailyCalorieTarget || 2000;
  const proteinTarget = user?.macros?.protein || 130;
  const carbsTarget = user?.macros?.carbs || 240;
  const fatTarget = user?.macros?.fat || 65;

  const handleSaveMeal = async (e) => {
    e.preventDefault();
    try {
      let foodName = '';
      let foodId = undefined;
      let baseCalories = 0;
      let baseProtein = 0;
      let baseCarbs = 0;
      let baseFat = 0;

      if (isCustomFood) {
        if (!customFood.name.trim()) {
          toast.error('Please enter food name');
          return;
        }
        foodName = customFood.name.trim();
        baseCalories = customFood.calories || 0;
        baseProtein = customFood.protein || 0;
        baseCarbs = customFood.carbs || 0;
        baseFat = customFood.fat || 0;
      } else {
        if (!selectedFood) {
          toast.error('Please select a food from the database');
          return;
        }
        foodName = selectedFood.name;
        foodId = selectedFood._id;
        baseCalories = selectedFood.calories || 0;
        baseProtein = selectedFood.protein || 0;
        baseCarbs = selectedFood.carbs || 0;
        baseFat = selectedFood.fat || 0;
      }

      const q = parseFloat(quantity) || 1;
      const payload = {
        mealType: selectedMealType,
        foodId,
        foodName,
        quantity: q,
        calories: Math.round(baseCalories * q),
        protein: Math.round(baseProtein * q),
        carbs: Math.round(baseCarbs * q),
        fat: Math.round(baseFat * q)
      };

      if (editingMealId) {
        await api.put(`/nutrition/meals/${editingMealId}`, payload);
        toast.success(`Updated ${payload.foodName} in ${selectedMealType}!`);
      } else {
        await api.post('/nutrition/meals', payload);
        toast.success(`Logged ${payload.foodName} to ${selectedMealType}!`);
      }

      setShowModal(false);
      setEditingMealId(null);
      setSelectedFood(null);
      setIsCustomFood(false);
      setQuantity(1);
      fetchData();
    } catch (err) {
      toast.error('Failed to log meal entry');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await api.delete(`/nutrition/meals/${id}`);
      toast.success('Meal item deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete meal');
    }
  };

  const handleStartEdit = (meal) => {
    setEditingMealId(meal._id);
    setSelectedMealType(meal.mealType);
    setQuantity(meal.quantity || 1);
    setIsCustomFood(true);
    setCustomFood({
      name: meal.foodName,
      calories: Math.round((meal.calories || 0) / (meal.quantity || 1)),
      protein: Math.round((meal.protein || 0) / (meal.quantity || 1)),
      carbs: Math.round((meal.carbs || 0) / (meal.quantity || 1)),
      fat: Math.round((meal.fat || 0) / (meal.quantity || 1)),
      servingSize: '1 serving'
    });
    setShowModal(true);
  };

  const mealCategories = [
    { name: 'Breakfast', icon: Coffee, desc: 'Energizing morning nourishment' },
    { name: 'Lunch', icon: Salad, desc: 'Midday balanced macro sustenance' },
    { name: 'Snacks', icon: Apple, desc: 'Nutrient-dense pre/post fuel' },
    { name: 'Dinner', icon: UtensilsCrossed, desc: 'Restorative evening recovery meal' }
  ];

  const filteredFoods = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate live preview nutritional values
  const activeBase = isCustomFood ? customFood : selectedFood;
  const previewQty = parseFloat(quantity) || 1;
  const previewCal = activeBase ? Math.round((activeBase.calories || 0) * previewQty) : 0;
  const previewPro = activeBase ? Math.round((activeBase.protein || 0) * previewQty) : 0;
  const previewCarb = activeBase ? Math.round((activeBase.carbs || 0) * previewQty) : 0;
  const previewFat = activeBase ? Math.round((activeBase.fat || 0) * previewQty) : 0;

  if (loading && todayMeals.length === 0) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-dark-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase mb-2">
            <Flame size={14} /> Mifflin-St Jeor Energy Balance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
            Nutrition & Calorie Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Log whole foods, analyze macronutrient distribution, and achieve your energy targets.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMealId(null);
            setShowModal(true);
            setSelectedFood(null);
            setIsCustomFood(false);
            setQuantity(1);
          }}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm font-bold shadow-md shadow-primary-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>Log Food Item</span>
        </button>
      </div>

      {/* Overview Cards: Calories + Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="card p-6 space-y-3 lg:col-span-1 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent border border-orange-500/20 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400">Daily Calorie Target</span>
            <Flame className="text-orange-500" size={20} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-gray-100">
              {totalCalories} <span className="text-sm font-normal text-gray-400">/ {calorieTarget} kcal</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.max(0, calorieTarget - totalCalories)} kcal remaining today
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalCalories / calorieTarget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 3 Macro Breakdown Cards */}
        <div className="card p-6 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-primary-500">Protein</span>
            <span className="text-xs font-semibold text-gray-400">{totalProtein}g / {proteinTarget}g</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{totalProtein}g</div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalProtein / proteinTarget) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">Lean muscle recovery & satiety</p>
        </div>

        <div className="card p-6 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-amber-500">Carbohydrates</span>
            <span className="text-xs font-semibold text-gray-400">{totalCarbs}g / {carbsTarget}g</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{totalCarbs}g</div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalCarbs / carbsTarget) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">Primary glycogen fuel source</p>
        </div>

        <div className="card p-6 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-emerald-500">Healthy Fats</span>
            <span className="text-xs font-semibold text-gray-400">{totalFat}g / {fatTarget}g</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{totalFat}g</div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalFat / fatTarget) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">Cellular health & hormone support</p>
        </div>
      </div>

      {/* 4 Meal Category Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Today's Meal History
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealCategories.map(({ name: type, icon: Icon, desc }) => {
            const mealsOfType = todayMeals.filter(m => m.mealType === type);
            const categoryCalories = mealsOfType.reduce((sum, m) => sum + (m.calories || 0), 0);

            return (
              <div key={type} className="card p-5 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-dark-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{type}</h3>
                      <p className="text-[11px] text-gray-400">{desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-500">{categoryCalories} kcal</span>
                    <button
                      onClick={() => {
                        setSelectedMealType(type);
                        setEditingMealId(null);
                        setShowModal(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-primary-500 transition-colors"
                      title={`Add food to ${type}`}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {mealsOfType.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-3 text-center">
                    No items logged yet for {type}.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {mealsOfType.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-800/60 border border-gray-100 dark:border-dark-700 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 dark:text-gray-100">{item.foodName}</span>
                            {item.quantity && item.quantity !== 1 && (
                              <span className="text-[10px] text-primary-500 font-semibold">×{item.quantity}</span>
                            )}
                          </div>
                          <p className="text-gray-400 mt-0.5">
                            {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="text-gray-400 hover:text-primary-500 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMeal(item._id)}
                            className="text-gray-400 hover:text-rose-500 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Food Selection & Logging Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-dark-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {editingMealId ? `Edit ${selectedMealType} Item` : `Log Food (${selectedMealType})`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Switch between Database and Custom Food */}
            {!editingMealId && (
              <div className="flex gap-2 border-b border-gray-100 dark:border-dark-800 pb-3">
                <button
                  type="button"
                  onClick={() => setIsCustomFood(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    !isCustomFood
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Search Food Database
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomFood(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    isCustomFood
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Custom Food Entry
                </button>
              </div>
            )}

            {!isCustomFood ? (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    placeholder="Search roti, dal, paneer, chicken, rice, oats, eggs..."
                    className="input pl-9 text-xs"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Food List */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-gray-100 dark:border-dark-800 p-2 rounded-xl">
                  {filteredFoods.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4">No matching foods found.</p>
                  ) : (
                    filteredFoods.map((f) => (
                      <div
                        key={f._id}
                        onClick={() => setSelectedFood(f)}
                        className={`p-2.5 rounded-lg flex justify-between items-center cursor-pointer transition-all ${
                          selectedFood?._id === f._id
                            ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-500'
                            : 'hover:bg-gray-50 dark:hover:bg-dark-800 border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900 dark:text-gray-100">{f.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-dark-700 text-gray-500">
                              {f.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {f.calories} kcal ({f.servingSize}) • P: {f.protein}g • C: {f.carbs}g • F: {f.fat}g
                          </p>
                        </div>
                        {selectedFood?._id === f._id && <Check className="text-primary-500" size={16} />}
                      </div>
                    ))
                  )}
                </div>

                {/* Quantity input */}
                <div>
                  <label className="label text-xs">Number of Servings</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="20"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input text-xs py-2 px-3"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="label text-xs">Food Name</label>
                  <input
                    type="text"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                    className="input text-xs py-2 px-3"
                    placeholder="e.g. Moong Dal Khichdi"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Calories per serving (kcal)</label>
                    <input
                      type="number"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({ ...customFood, calories: Number(e.target.value) })}
                      className="input text-xs py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Protein (g)</label>
                    <input
                      type="number"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({ ...customFood, protein: Number(e.target.value) })}
                      className="input text-xs py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Carbs (g)</label>
                    <input
                      type="number"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({ ...customFood, carbs: Number(e.target.value) })}
                      className="input text-xs py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Fats (g)</label>
                    <input
                      type="number"
                      value={customFood.fat}
                      onChange={(e) => setCustomFood({ ...customFood, fat: Number(e.target.value) })}
                      className="input text-xs py-2 px-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-xs">Servings</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input text-xs py-2 px-3"
                  />
                </div>
              </div>
            )}

            {/* Live Nutritional Preview Box */}
            {activeBase && (
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                <span className="font-bold text-orange-600 dark:text-orange-400 block mb-1">
                  Preview for {previewQty} serving(s):
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Calories</span>
                    <span className="font-black text-gray-900 dark:text-gray-100">{previewCal} kcal</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Protein</span>
                    <span className="font-bold text-primary-500">{previewPro}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Carbs</span>
                    <span className="font-bold text-amber-500">{previewCarb}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Fats</span>
                    <span className="font-bold text-emerald-500">{previewFat}g</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-3 border-t border-gray-100 dark:border-dark-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMeal}
                className="btn-primary py-2 px-5 text-xs font-bold"
              >
                {editingMealId ? 'Save Changes' : `Add to ${selectedMealType}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
