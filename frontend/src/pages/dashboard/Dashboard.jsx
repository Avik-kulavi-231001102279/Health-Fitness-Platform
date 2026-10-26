import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dumbbell, Flame, Droplets, Moon, Target, Award,
  Plus, CheckCircle, ArrowRight, Sparkles, Scale, TrendingUp,
  Bot, RefreshCw, Calendar, Check, CheckCircle2, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid
} from 'recharts';
import api from '../../services/api';
import { PageLoader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDashboard = async (targetDate) => {
    try {
      setLoading(true);
      const url = targetDate ? `/dashboard?date=${targetDate}` : '/dashboard';
      const res = await api.get(url);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(selectedDate);
  }, [selectedDate]);

  const handleQuickWater = async (amount) => {
    try {
      await api.post('/progress/water', { amount });
      toast.success(`+${amount}ml water logged!`);
      fetchDashboard(selectedDate);
    } catch (err) {
      toast.error('Failed to log water');
    }
  };

  const handleToggleHabit = async (habitId) => {
    try {
      await api.post(`/habits/${habitId}/toggle`);
      toast.success('Habit status updated');
      fetchDashboard(selectedDate);
    } catch (err) {
      toast.error('Failed to update habit');
    }
  };

  if (loading && !data) return <PageLoader />;

  // Dynamic greeting without emoji
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const caloriesConsumed = data?.today?.calories?.consumed || 0;
  const calorieTarget = data?.today?.calories?.goal || user?.dailyCalorieTarget || 2000;
  const caloriesRemaining = data?.today?.calories?.remaining !== undefined
    ? data.today.calories.remaining
    : Math.max(0, calorieTarget - caloriesConsumed);

  const proteinConsumed = data?.today?.calories?.protein || 0;
  const proteinTarget = data?.macrosTarget?.protein || 130;

  const carbsConsumed = data?.today?.calories?.carbs || 0;
  const carbsTarget = data?.macrosTarget?.carbs || 240;

  const fatConsumed = data?.today?.calories?.fat || 0;
  const fatTarget = data?.macrosTarget?.fat || 65;

  const waterConsumed = data?.today?.water?.completed || 0;
  const waterTarget = data?.today?.water?.goal || user?.dailyWaterTarget || 2500;

  const sleepHours = data?.today?.sleep?.duration || 0;
  const sleepTarget = data?.today?.sleep?.goal || 8;

  const currentWeight = data?.stats?.currentWeight || user?.weight || 70;
  const targetWeight = user?.targetWeight || currentWeight;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* ─── Header & Greeting Banner ─── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-primary-900/30 via-primary-600/15 to-accent-600/15 p-6 rounded-3xl border border-primary-500/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-primary-500/20 text-primary-400">
              <Sparkles size={18} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
              {greeting}, {user?.name?.split(' ')[0]}!
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Target Goal: <strong className="text-primary-600 dark:text-primary-400">{user?.fitnessGoal || 'Overall Wellness'}</strong>
          </p>
          <p className="text-xs text-gray-400">
            Adult Mifflin-St Jeor TDEE: {calorieTarget} kcal/day · Fluid Target: {waterTarget} ml/day
          </p>
        </div>

        {/* Date Filter & Streak Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/70 dark:bg-dark-900/70 p-1.5 rounded-2xl border border-gray-200 dark:border-dark-700">
            <Calendar size={15} className="text-gray-400 ml-1.5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => fetchDashboard(selectedDate)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-400 hover:text-primary-500"
              title="Refresh Data"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="card px-4 py-2 flex items-center gap-2 border-orange-500/30 bg-orange-500/10">
            <Flame className="text-orange-500" size={18} />
            <div>
              <p className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">Streak</p>
              <p className="text-sm font-black text-gray-900 dark:text-gray-100">{user?.currentStreak || 1} Days</p>
            </div>
          </div>

          <div className="card px-4 py-2 flex items-center gap-2 border-primary-500/30 bg-primary-500/10">
            <Award className="text-primary-500" size={18} />
            <div>
              <p className="text-[10px] font-bold uppercase text-primary-600 dark:text-primary-400">XP</p>
              <p className="text-sm font-black text-gray-900 dark:text-gray-100">{user?.totalXP || 150}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AI Daily Insight Banner ─── */}
      {data?.aiInsight && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-blue-500/10 border border-primary-500/25 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-600 text-white shrink-0 mt-0.5 shadow-sm">
              <Bot size={18} />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-primary-600 dark:text-primary-400 block mb-0.5">
                FitLife AI Daily Insight
              </span>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                "{data.aiInsight}"
              </p>
            </div>
          </div>

          <Link
            to="/ai-coach"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline shrink-0 mt-1"
          >
            <span>Ask Coach</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* ─── 4 Core Metric Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Calories */}
        <div className="card p-5 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <Link to="/nutrition" className="text-xs font-bold text-primary-500 hover:underline">Log Food →</Link>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Calories Consumed</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{caloriesConsumed}</span>
              <span className="text-xs text-gray-400">/ {calorieTarget} kcal</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Target reached'}
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((caloriesConsumed / calorieTarget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Hydration */}
        <div className="card p-5 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Droplets size={20} />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleQuickWater(250)}
                className="text-[10px] font-bold px-2 py-1 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20"
              >
                +250ml
              </button>
              <button
                onClick={() => handleQuickWater(500)}
                className="text-[10px] font-bold px-2 py-1 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20"
              >
                +500ml
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Water Intake</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{waterConsumed}</span>
              <span className="text-xs text-gray-400">/ {waterTarget} ml</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              <Link to="/water" className="text-cyan-500 hover:underline">Open Dedicated Water Tracker →</Link>
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((waterConsumed / waterTarget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Today's Workout */}
        <div className="card p-5 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
              <Dumbbell size={20} />
            </div>
            <Link to="/workout" className="text-xs font-bold text-primary-500 hover:underline">
              {data?.today?.workout?.completed ? 'View →' : 'Start →'}
            </Link>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Today's Workout</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
                {data?.today?.workout?.completed ? `${data.today.workout.duration}m` : '0m'}
              </span>
              <span className="text-xs text-gray-400">
                {data?.today?.workout?.completed ? `(${data.today.workout.calories} kcal)` : 'Planned'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">
              {data?.today?.workout?.completed ? data.today.workout.name || 'Workout Completed' : 'Session not completed yet'}
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${data?.today?.workout?.completed ? 'bg-emerald-500 w-full' : 'bg-gray-300 dark:bg-dark-600 w-0'}`}
            />
          </div>
        </div>

        {/* Metric 4: Sleep Recovery */}
        <div className="card p-5 space-y-3 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Moon size={20} />
            </div>
            <Link to="/sleep" className="text-xs font-bold text-primary-500 hover:underline">Log Sleep →</Link>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Last Night Sleep</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{sleepHours}</span>
              <span className="text-xs text-gray-400">/ {sleepTarget} hrs</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {sleepHours >= sleepTarget ? 'Rest target met' : 'Log bedtime & wake time'}
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((parseFloat(sleepHours) / sleepTarget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── Middle Section: Macros & Weekly Activity Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Macronutrient Breakdown & Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Macronutrient Cards */}
          <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
              <span>Macronutrient Breakdown</span>
              <span className="text-xs text-gray-400 font-normal">Calculated for {user?.fitnessGoal}</span>
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Protein */}
              <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 block mb-1">Protein</span>
                <span className="text-xl font-black text-gray-900 dark:text-gray-100">{proteinConsumed}g</span>
                <span className="text-[11px] text-gray-400 block">Target: {proteinTarget}g</span>
                <div className="w-full bg-primary-500/20 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary-500 h-full rounded-full" style={{ width: `${Math.min(100, (proteinConsumed / proteinTarget) * 100)}%` }} />
                </div>
              </div>

              {/* Carbs */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">Carbohydrates</span>
                <span className="text-xl font-black text-gray-900 dark:text-gray-100">{carbsConsumed}g</span>
                <span className="text-[11px] text-gray-400 block">Target: {carbsTarget}g</span>
                <div className="w-full bg-amber-500/20 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (carbsConsumed / carbsTarget) * 100)}%` }} />
                </div>
              </div>

              {/* Fat */}
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block mb-1">Healthy Fats</span>
                <span className="text-xl font-black text-gray-900 dark:text-gray-100">{fatConsumed}g</span>
                <span className="text-[11px] text-gray-400 block">Target: {fatTarget}g</span>
                <div className="w-full bg-rose-500/20 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (fatConsumed / fatTarget) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity Trends Chart */}
          {data?.weeklyTrend && data.weeklyTrend.length > 0 && (
            <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary-500" />
                  <span>7-Day Caloric Intake Trend</span>
                </h3>
                <span className="text-xs text-gray-400">Calories vs Target ({calorieTarget} kcal)</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="calories" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Today's Atomic Habits Checklist */}
        <div className="card p-6 space-y-4 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="text-primary-500" size={17} />
              <span>Today's Habit Checklist</span>
            </h3>
            <span className="text-xs font-bold text-gray-400">
              {data?.today?.habits?.completed || 0} / {data?.today?.habits?.total || 0} Done
            </span>
          </div>

          {(!data?.today?.habits?.items || data.today.habits.items.length === 0) ? (
            <div className="p-6 text-center text-xs text-gray-400">
              <Target size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="font-semibold text-gray-600 dark:text-gray-300">No habits added yet.</p>
              <Link to="/habits" className="text-primary-500 font-bold hover:underline block mt-1">
                Choose from 8 habit templates →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.today.habits.items.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    habit.isCompleted
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-gray-700 dark:text-gray-300'
                      : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        habit.isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-gray-300 dark:border-dark-600'
                      }`}
                    >
                      {habit.isCompleted && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-xs font-semibold ${habit.isCompleted ? 'line-through opacity-60' : ''}`}>
                      {habit.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-orange-500">
                    {habit.currentStreak || 0}d streak
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 dark:border-dark-800">
            <Link
              to="/habits"
              className="w-full btn-secondary text-center block text-xs font-bold py-2"
            >
              Manage Habits & Templates →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
