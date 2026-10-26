import React, { useState, useEffect } from 'react';
import {
  Moon, Clock, Plus, Trash2, Calendar, Star,
  TrendingUp, Sparkles, CheckCircle2, ShieldCheck, HeartPulse
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SleepTracker() {
  const [loading, setLoading] = useState(true);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [goal, setGoal] = useState(8);
  const [avgDuration, setAvgDuration] = useState(0);
  const [avgQuality, setAvgQuality] = useState(0);

  // Form State
  const [sleepTime, setSleepTime] = useState('22:30');
  const [wakeUpTime, setWakeUpTime] = useState('06:30');
  const [quality, setQuality] = useState(4);
  const [notes, setNotes] = useState('');

  // Calculate live preview duration crossing midnight
  const calculatePreviewDuration = () => {
    if (!sleepTime || !wakeUpTime) return 8.0;
    const [sH, sM] = sleepTime.split(':').map(Number);
    const [wH, wM] = wakeUpTime.split(':').map(Number);
    let sTotal = sH * 60 + sM;
    let wTotal = wH * 60 + wM;
    if (wTotal <= sTotal) {
      wTotal += 24 * 60;
    }
    return parseFloat(((wTotal - sTotal) / 60).toFixed(1));
  };

  const previewDuration = calculatePreviewDuration();

  const fetchSleepData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/progress/sleep?days=14');
      if (res.data) {
        setSleepLogs(res.data.logs || []);
        setGoal(res.data.goal || 8);
        setAvgDuration(res.data.avgDuration || 0);
        setAvgQuality(res.data.avgQuality || 0);
      }
    } catch (err) {
      toast.error('Failed to load sleep history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSleepData();
  }, []);

  const handleLogSleep = async (e) => {
    e.preventDefault();
    try {
      await api.post('/progress/sleep', {
        sleepTime,
        wakeUpTime,
        duration: previewDuration,
        quality: Number(quality),
        notes
      });
      toast.success(`Sleep logged: ${previewDuration} hours!`);
      setNotes('');
      fetchSleepData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log sleep');
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.delete(`/progress/sleep/${id}`);
      toast.success('Sleep record deleted');
      fetchSleepData();
    } catch (err) {
      toast.error('Failed to delete sleep record');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-gray-100 dark:border-dark-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase mb-2">
          <Moon size={14} /> Circadian Rhythm & Recovery
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
          Sleep & Recovery Tracker
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor your sleep consistency, recovery metrics, and nocturnal regeneration.
        </p>
      </div>

      {/* Sleep Insights Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Target Sleep Duration</span>
          <div className="text-3xl font-black text-indigo-500">{goal} <span className="text-sm font-normal text-gray-400">hours/night</span></div>
          <span className="text-xs text-gray-500 mt-1 block">Ideal restorative window</span>
        </div>

        <div className="card p-5 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <span className="text-xs text-gray-400 font-semibold block mb-1">14-Day Average Duration</span>
          <div className="text-3xl font-black text-gray-900 dark:text-gray-100">
            {avgDuration > 0 ? `${avgDuration}h` : '--'}
          </div>
          <span className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>{avgDuration >= goal ? 'Goal Met' : 'Approaching Target'}</span>
          </span>
        </div>

        <div className="card p-5 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Average Sleep Quality</span>
          <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
            <span>{avgQuality > 0 ? avgQuality : '--'}</span>
            <span className="text-sm font-normal text-gray-400">/ 5.0</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Subjective morning freshness</span>
        </div>
      </div>

      {/* Log Sleep Form & Consistency Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Card */}
        <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-indigo-500" />
            <span>Record Last Night's Sleep</span>
          </h2>

          <form onSubmit={handleLogSleep} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label text-xs font-semibold">Bedtime (Sleep Time)</label>
                <div className="relative">
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="input py-2 px-3 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs font-semibold">Wake-Up Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="input py-2 px-3 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Calculated Duration Preview */}
            <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-between">
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1.5">
                <Clock size={15} />
                <span>Calculated Sleep Duration:</span>
              </span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {previewDuration} hrs
              </span>
            </div>

            {/* Sleep Quality Rating */}
            <div>
              <label className="label text-xs font-semibold">Sleep Quality (1 to 5)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setQuality(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                      quality === val
                        ? 'border-indigo-500 bg-indigo-500 text-white shadow-md'
                        : 'border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    <Star size={12} className={quality >= val ? 'fill-current' : ''} />
                    <span>{val}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="label text-xs font-semibold">Optional Notes</label>
              <input
                type="text"
                placeholder="e.g. Dimmed lights, read for 15 mins, no caffeine after 2pm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input py-2 px-3 text-sm"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-3 text-sm font-bold shadow-md shadow-indigo-500/20">
              Save Sleep Record
            </button>
          </form>
        </div>

        {/* Circadian Hygiene Guide Card */}
        <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <span>Sleep Hygiene Principles</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700">
              <strong className="text-gray-900 dark:text-gray-100 block mb-0.5">Circadian Regularity:</strong>
              Consistent wake-up times program your body's master circadian clock, improving restorative slow-wave sleep.
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700">
              <strong className="text-gray-900 dark:text-gray-100 block mb-0.5">Light & Melatonin:</strong>
              Dim evening screens 60 minutes prior to sleep to signal natural melatonin synthesis in the pineal gland.
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700">
              <strong className="text-gray-900 dark:text-gray-100 block mb-0.5">Thermal Regulation:</strong>
              A cooler room environment (18-20°C) facilitates natural nocturnal core temperature reduction.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
            <HeartPulse size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> FitLife Pro does not diagnose sleep apnea, insomnia, or clinical sleep disorders. For persistent sleep disturbances, please consult a medical sleep specialist.
            </p>
          </div>
        </div>
      </div>

      {/* Sleep Log History Table */}
      <div className="card p-6 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" />
            <span>Recent Sleep History</span>
          </span>
          <span className="text-xs text-gray-400 font-semibold">
            {sleepLogs.length} entries
          </span>
        </h2>

        {sleepLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            <Moon size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">No sleep records logged yet.</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Log last night's bedtime and wake time above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-800">
            {sleepLogs.map((log) => (
              <div key={log._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Moon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {log.duration} Hours Slept
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center gap-0.5">
                        <Star size={10} className="fill-current" />
                        {log.quality || 4}/5
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{log.sleepTime} → {log.wakeUpTime}</span>
                      <span>•</span>
                      <span>{new Date(log.date || log.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      {log.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-gray-500">"{log.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteLog(log._id)}
                  className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                  title="Delete record"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
