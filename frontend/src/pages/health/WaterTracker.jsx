import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, Plus, Undo2, Trash2, Settings, AlertCircle,
  Clock, CheckCircle2, Bell, ShieldCheck, HeartPulse
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function WaterTracker() {
  const [loading, setLoading] = useState(true);
  const [waterData, setWaterData] = useState({
    total: 0,
    goal: 2500,
    remaining: 2500,
    percentage: 0,
    logs: []
  });
  const [history, setHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('2500');
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const fetchWaterData = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        api.get('/progress/water/today'),
        api.get('/progress/water/history?days=7')
      ]);

      if (todayRes.data) {
        setWaterData(todayRes.data);
        setNewGoal(String(todayRes.data.goal || 2500));
      }
      if (historyRes.data) {
        setHistory(historyRes.data);
      }
    } catch (err) {
      toast.error('Failed to load hydration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, []);

  const handleAddWater = async (amount) => {
    const num = parseInt(amount, 10);
    if (!num || num <= 0) {
      toast.error('Please enter a valid water amount');
      return;
    }
    if (num > 2000) {
      toast.error('Single entry cannot exceed 2,000ml for hydration safety');
      return;
    }

    try {
      await api.post('/progress/water', { amount: num });
      toast.success(`Logged +${num} ml of water!`);
      setCustomAmount('');
      fetchWaterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error logging water');
    }
  };

  const handleUndoLast = async () => {
    try {
      const res = await api.post('/progress/water/undo');
      toast.success(res.data.message || 'Removed last entry');
      fetchWaterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No entries to undo');
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await api.delete(`/progress/water/${id}`);
      toast.success('Water log entry deleted');
      fetchWaterData();
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    const g = parseInt(newGoal, 10);
    if (!g || g < 500 || g > 6000) {
      toast.error('Daily hydration target must be between 500ml and 6,000ml');
      return;
    }

    try {
      await api.put('/progress/water/goal', { goal: g });
      toast.success(`Daily goal updated to ${g} ml`);
      setIsEditingGoal(false);
      fetchWaterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update goal');
    }
  };

  const requestNotificationAccess = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser notifications are not supported on this device');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      toast.success('Hydration reminders enabled! We will remind you during waking hours.');
    } else {
      toast('Notification permission was not granted.', { icon: 'ℹ️' });
    }
  };

  const percentage = Math.min(100, Math.round((waterData.total / (waterData.goal || 2500)) * 100));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-dark-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold uppercase mb-2">
            <Droplets size={14} /> Fluid Balance & Vitality
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
            Water Hydration Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Maintain optimal cellular hydration, cognitive focus, and workout recovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="btn-secondary flex items-center gap-2 text-xs py-2 px-3.5"
          >
            <Settings size={15} />
            <span>Configure Goal</span>
          </button>

          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationAccess}
              className="btn-secondary flex items-center gap-2 text-xs py-2 px-3.5"
              title="Enable hydration notifications"
            >
              <Bell size={15} />
              <span>Enable Reminders</span>
            </button>
          )}
        </div>
      </div>

      {/* Goal Edit Modal / Collapse */}
      <AnimatePresence>
        {isEditingGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-5 border border-cyan-500/30 bg-cyan-500/5 rounded-2xl"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Settings size={16} className="text-cyan-500" />
              <span>Personal Daily Hydration Target</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Adult baseline is generally 35ml per kg of body weight, adjusted for athletic training and climate.
            </p>
            <form onSubmit={handleUpdateGoal} className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="input py-2 px-3 pr-12 text-sm w-44"
                  min="500"
                  max="6000"
                  step="50"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">ml</span>
              </div>
              <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold">
                Save Target
              </button>
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="btn-secondary py-2 px-3 text-xs"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hydration Visualizer & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Water Level Card */}
        <div className="card p-6 flex flex-col items-center justify-center relative overflow-hidden border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="relative w-44 h-64 border-4 border-cyan-500/40 rounded-b-3xl rounded-t-lg bg-gray-50 dark:bg-dark-800/50 overflow-hidden flex flex-col justify-end shadow-inner mb-4">
            {/* Water Wave Fill */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="w-full bg-gradient-to-t from-cyan-600 via-cyan-500 to-sky-400 relative"
            >
              {/* Wave surface shimmer */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/40 blur-xs" />
            </motion.div>

            {/* Percentage Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-4xl font-black text-gray-900 dark:text-gray-100 drop-shadow-sm">
                {percentage}%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Of Goal
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              {waterData.total.toLocaleString()} <span className="text-xs font-semibold text-gray-400">/ {waterData.goal.toLocaleString()} ml</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {waterData.remaining > 0
                ? `${waterData.remaining.toLocaleString()} ml remaining today`
                : 'Target achieved! Superb hydration today.'}
            </p>
          </div>
        </div>

        {/* Quick Add & Controls Card */}
        <div className="lg:col-span-2 card p-6 flex flex-col justify-between border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Plus size={18} className="text-cyan-500" />
                <span>Quick Log Hydration</span>
              </h2>

              {waterData.logs.length > 0 && (
                <button
                  onClick={handleUndoLast}
                  className="text-xs font-semibold text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <Undo2 size={14} />
                  <span>Undo Last Log</span>
                </button>
              )}
            </div>

            {/* Quick Add Preset Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => handleAddWater(150)}
                className="p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 hover:border-cyan-500 dark:hover:border-cyan-500 text-center transition-all active:scale-95 group"
              >
                <Droplets size={20} className="mx-auto mb-1 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-base font-black text-gray-900 dark:text-gray-100 block">+150 ml</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Small Glass</span>
              </button>

              <button
                onClick={() => handleAddWater(250)}
                className="p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 hover:border-cyan-500 dark:hover:border-cyan-500 text-center transition-all active:scale-95 group"
              >
                <Droplets size={20} className="mx-auto mb-1 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-base font-black text-gray-900 dark:text-gray-100 block">+250 ml</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Standard Cup</span>
              </button>

              <button
                onClick={() => handleAddWater(500)}
                className="p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 hover:border-cyan-500 dark:hover:border-cyan-500 text-center transition-all active:scale-95 group"
              >
                <Droplets size={20} className="mx-auto mb-1 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-base font-black text-gray-900 dark:text-gray-100 block">+500 ml</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Water Bottle</span>
              </button>
            </div>

            {/* Custom Amount Input Form */}
            <div className="mb-6">
              <label className="label text-xs">Custom Hydration Amount</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 350)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="input py-2.5 px-3 pr-12 text-sm"
                    min="10"
                    max="2000"
                  />
                  <span className="absolute right-3 top-3 text-xs text-gray-400 font-bold">ml</span>
                </div>
                <button
                  onClick={() => handleAddWater(customAmount)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shrink-0"
                >
                  Log Custom
                </button>
              </div>
            </div>
          </div>

          {/* Safety & Health Fluid Guardrail Disclaimer */}
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
            <HeartPulse size={18} className="text-cyan-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>Health & Hydration Guidance:</strong> Sip water steadily across your active hours. Never force excessive consumption. If you have cardiovascular, kidney, or medically prescribed fluid restrictions, always prioritize your doctor's instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Log Entries Table */}
      <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock size={18} className="text-cyan-500" />
            <span>Today's Hydration Entries</span>
          </span>
          <span className="text-xs font-semibold text-gray-400">
            {waterData.logs.length} logged
          </span>
        </h2>

        {waterData.logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            <Droplets size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">No water logged yet today.</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Click any quick-add button above to start your daily streak.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-800">
            {waterData.logs.map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                    <Droplets size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 block">
                      +{log.amount} ml
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Logged at {new Date(log.date || log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteEntry(log._id)}
                  className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7-Day Hydration History */}
      {history.length > 0 && (
        <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            7-Day Hydration History
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {history.map((day) => {
              const dayMet = day.total >= waterData.goal;
              return (
                <div
                  key={day.date}
                  className={`p-3 rounded-xl border text-center ${
                    dayMet
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-gray-100 dark:border-dark-800 bg-gray-50/50 dark:bg-dark-800/30'
                  }`}
                >
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">
                    {new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </span>
                  <span className={`text-base font-black ${dayMet ? 'text-emerald-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    {day.total} ml
                  </span>
                  {dayMet && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center justify-center gap-0.5 mt-1">
                      <CheckCircle2 size={10} /> Met
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
