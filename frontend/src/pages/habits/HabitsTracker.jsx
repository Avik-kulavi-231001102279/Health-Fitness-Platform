import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Plus, Flame, Award, Trash2, Edit2,
  Sparkles, Calendar, TrendingUp, Check, X, ShieldAlert
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function HabitsTracker() {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // New/Edit habit form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [color, setColor] = useState('#6366f1');

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const [habitsRes, templatesRes] = await Promise.all([
        api.get('/habits'),
        api.get('/habits/templates')
      ]);

      if (habitsRes.data?.success) {
        setHabits(habitsRes.data.data || []);
      }
      if (templatesRes.data?.success) {
        setTemplates(templatesRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleToggleHabit = async (habitId) => {
    try {
      const res = await api.post(`/habits/${habitId}/toggle`);
      if (res.data?.success) {
        setHabits(prev =>
          prev.map(h => {
            if (h._id === habitId) {
              return {
                ...h,
                isCompletedToday: res.data.isCompleted,
                currentStreak: res.data.currentStreak,
                bestStreak: res.data.bestStreak
              };
            }
            return h;
          })
        );
        if (res.data.isCompleted) {
          toast.success('Habit completed! Streak updated');
        } else {
          toast('Habit marked incomplete');
        }
      }
    } catch (err) {
      toast.error('Failed to update habit');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a habit title');
      return;
    }

    try {
      if (editingHabit) {
        await api.put(`/habits/${editingHabit._id}`, {
          title,
          description,
          category,
          color
        });
        toast.success('Habit updated successfully');
      } else {
        await api.post('/habits', {
          title,
          description,
          category,
          color
        });
        toast.success('New habit created!');
      }

      setShowCreateModal(false);
      setEditingHabit(null);
      setTitle('');
      setDescription('');
      fetchHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save habit');
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit and its history?')) return;
    try {
      await api.delete(`/habits/${id}`);
      toast.success('Habit deleted');
      fetchHabits();
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  };

  const applyTemplate = (template) => {
    setTitle(template.title);
    setDescription(template.description);
    setCategory(template.category);
    setColor(template.color);
    setEditingHabit(null);
    setShowCreateModal(true);
  };

  const totalCompletionsToday = habits.filter(h => h.isCompletedToday).length;
  const overallRate = habits.length > 0
    ? Math.round((totalCompletionsToday / habits.length) * 100)
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-dark-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase mb-2">
            <CheckCircle2 size={14} /> Atomic Discipline & Systems
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
            Habits & Daily Streaks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Build unbreakable daily routines through positive reinforcement and frictionless tracking.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setTitle('');
            setDescription('');
            setCategory('Fitness');
            setColor('#6366f1');
            setShowCreateModal(true);
          }}
          className="btn-primary flex items-center gap-2 py-2.5 px-4 text-xs font-bold shrink-0 shadow-md shadow-primary-500/20"
        >
          <Plus size={16} />
          <span>Create New Habit</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Today's Progress</span>
          <div className="text-3xl font-black text-gray-900 dark:text-gray-100">
            {totalCompletionsToday} <span className="text-sm font-normal text-gray-400">/ {habits.length} Done</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${overallRate}%` }} />
          </div>
        </div>

        <div className="card p-5 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Top Active Streak</span>
          <div className="text-3xl font-black text-orange-500 flex items-center gap-1.5">
            <Flame size={24} className="fill-orange-500" />
            <span>{Math.max(0, ...habits.map(h => h.currentStreak || 0))} Days</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Consistency compounds exponentially</span>
        </div>

        <div className="card p-5 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <span className="text-xs text-gray-400 font-semibold block mb-1">All-Time Best Streak</span>
          <div className="text-3xl font-black text-primary-500 flex items-center gap-1.5">
            <Award size={24} />
            <span>{Math.max(0, ...habits.map(h => h.bestStreak || 0))} Days</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Your personal record</span>
        </div>
      </div>

      {/* Habit Checklists */}
      <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
          <span>Active Daily Habits</span>
          <span className="text-xs text-gray-400 font-semibold">
            Click checkmark to toggle today
          </span>
        </h2>

        {habits.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            <CheckCircle2 size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="font-semibold text-gray-600 dark:text-gray-300 text-sm">No habits created yet.</p>
            <p className="text-gray-400 text-xs mt-1">Pick a popular template below or create your own custom habit.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  habit.isCompletedToday
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-gray-200 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/40 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => handleToggleHabit(habit._id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      habit.isCompletedToday
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                        : 'border-2 border-gray-300 dark:border-dark-600 text-transparent hover:border-emerald-500'
                    }`}
                    title={habit.isCompletedToday ? 'Mark Incomplete' : 'Mark Done Today'}
                  >
                    <Check size={18} strokeWidth={3} className={habit.isCompletedToday ? 'text-white' : ''} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm text-gray-900 dark:text-gray-100 ${habit.isCompletedToday ? 'line-through opacity-70' : ''}`}>
                        {habit.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500">
                        {habit.category}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-dark-800">
                  {/* Streak pill */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                    <Flame size={14} className="fill-orange-500" />
                    <span>{habit.currentStreak || 0}d streak</span>
                  </div>

                  {/* 7-day completion badge */}
                  <div className="text-[11px] text-gray-400 font-semibold">
                    {habit.weeklyRate !== undefined ? `${habit.weeklyRate}% week` : ''}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingHabit(habit);
                        setTitle(habit.title);
                        setDescription(habit.description || '');
                        setCategory(habit.category || 'Fitness');
                        setColor(habit.color || '#6366f1');
                        setShowCreateModal(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
                      title="Edit Habit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
                      title="Delete Habit"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Habit Templates */}
      <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles size={18} className="text-primary-500" />
            <span>Recommended Habit Templates</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Select any research-backed habit to add it directly to your routine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-800/60 flex flex-col justify-between hover:border-primary-500/50 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 mb-1 block">
                  {tpl.category}
                </span>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
                  {tpl.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {tpl.description}
                </p>
              </div>

              <button
                onClick={() => applyTemplate(tpl)}
                className="btn-secondary w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus size={13} />
                <span>Use Template</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Habit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full p-6 bg-white dark:bg-dark-900 shadow-2xl border border-gray-200 dark:border-dark-700 rounded-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-dark-800 mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="label text-xs">Habit Title</label>
                <input
                  type="text"
                  placeholder="e.g. 20-min Morning Walk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input py-2 px-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input py-2 px-3 text-sm"
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Sleep">Sleep</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. First thing in the morning with sunlight"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input py-2 px-3 text-sm"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 btn-secondary py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 btn-primary py-2.5 text-xs font-bold"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
