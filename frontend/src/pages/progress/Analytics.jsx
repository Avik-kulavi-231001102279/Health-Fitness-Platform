import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  TrendingUp, Calendar, Dumbbell, Flame, Droplets,
  Moon, Sparkles, Award, Scale, Download, CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { PageLoader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [days, setDays] = useState(14);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/progress/analytics?days=${days}`);
      setAnalytics(res.data || null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const res = await api.get('/progress/export');
      if (res.data?.success && res.data.data) {
        const payload = res.data.data;
        const csvRows = [];

        // Header section
        csvRows.push(['FitLife Pro - Personal Health Data Export']);
        csvRows.push([`Export Date: ${new Date().toISOString()}`]);
        csvRows.push([`User: ${payload.user.name} (${payload.user.email})`]);
        csvRows.push([`Calorie Target: ${payload.user.dailyCalorieTarget} kcal`, `Water Target: ${payload.user.dailyWaterTarget} ml`]);
        csvRows.push([]);

        // Meals Table
        csvRows.push(['--- MEAL LOGS ---']);
        csvRows.push(['Date', 'Meal Type', 'Food Name', 'Quantity', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)']);
        (payload.meals || []).forEach(m => {
          csvRows.push([
            m.date ? new Date(m.date).toLocaleDateString() : '',
            m.mealType || '',
            `"${m.foodName || ''}"`,
            m.quantity || 1,
            m.calories || 0,
            m.protein || 0,
            m.carbs || 0,
            m.fat || 0
          ]);
        });
        csvRows.push([]);

        // Water Table
        csvRows.push(['--- HYDRATION LOGS ---']);
        csvRows.push(['Date', 'Amount (ml)']);
        (payload.water || []).forEach(w => {
          csvRows.push([
            w.date ? new Date(w.date).toLocaleDateString() : '',
            w.amount || 0
          ]);
        });
        csvRows.push([]);

        // Sleep Table
        csvRows.push(['--- SLEEP LOGS ---']);
        csvRows.push(['Date', 'Bedtime', 'Wake Time', 'Duration (hrs)', 'Quality (1-5)', 'Notes']);
        (payload.sleep || []).forEach(s => {
          csvRows.push([
            s.date ? new Date(s.date).toLocaleDateString() : '',
            s.sleepTime || '',
            s.wakeUpTime || '',
            s.duration || 0,
            s.quality || 4,
            `"${s.notes || ''}"`
          ]);
        });
        csvRows.push([]);

        // Workouts Table
        csvRows.push(['--- WORKOUT SESSIONS ---']);
        csvRows.push(['Date', 'Workout Name', 'Duration (mins)', 'Calories Burned']);
        (payload.workouts || []).forEach(w => {
          csvRows.push([
            w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '',
            `"${w.workoutName || ''}"`,
            w.totalDuration || 0,
            w.caloriesBurned || 0
          ]);
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `fitlife_pro_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Authorized personal data exported as CSV!');
      }
    } catch (err) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const weightData = analytics?.weight?.map(w => ({
    date: new Date(w.date || w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: w.weight
  })) || [];

  const calorieData = analytics?.calories?.map(c => ({
    date: new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    calories: c.calories || 0,
    protein: c.protein || 0,
    carbs: c.carbs || 0,
    fat: c.fat || 0
  })) || [];

  const waterData = analytics?.water?.map(w => ({
    date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    amount: w.total || 0
  })) || [];

  const sleepData = analytics?.sleep?.map(s => ({
    date: new Date(s.date || s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    hours: parseFloat((s.duration || 8).toFixed(1))
  })) || [];

  const totalWorkouts = analytics?.workouts?.length || 0;
  const avgCalories = calorieData.length ? Math.round(calorieData.reduce((a, b) => a + b.calories, 0) / calorieData.length) : 0;
  const avgWater = waterData.length ? Math.round(waterData.reduce((a, b) => a + b.amount, 0) / waterData.length) : 0;
  const avgSleep = sleepData.length ? (sleepData.reduce((a, b) => a + b.hours, 0) / sleepData.length).toFixed(1) : 0;
  const totalHabitsCompleted = analytics?.totalHabitsCompleted || 0;

  if (loading && !analytics) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-dark-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold uppercase mb-2">
            <TrendingUp size={14} /> Empirical Health Metrics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
            Progress & Performance Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Long-term trends, biometric charting, and authorized data export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 bg-gray-100 dark:bg-dark-800 p-1 rounded-2xl">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  days === d
                    ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn-secondary flex items-center gap-2 py-2 px-4 text-xs font-bold shrink-0"
            title="Download authorized CSV report"
          >
            <Download size={15} />
            <span>{exporting ? 'Generating CSV...' : 'Export Data (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 space-y-1 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex items-center gap-2 text-primary-500 mb-1">
            <Dumbbell size={18} />
            <span className="text-xs font-bold uppercase text-gray-400">Workouts</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{totalWorkouts}</div>
          <p className="text-[11px] text-gray-400">Completed in last {days} days</p>
        </div>

        <div className="card p-5 space-y-1 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Flame size={18} />
            <span className="text-xs font-bold uppercase text-gray-400">Avg Calories</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{avgCalories} <span className="text-xs font-normal text-gray-400">kcal</span></div>
          <p className="text-[11px] text-gray-400">Daily average intake</p>
        </div>

        <div className="card p-5 space-y-1 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex items-center gap-2 text-cyan-500 mb-1">
            <Droplets size={18} />
            <span className="text-xs font-bold uppercase text-gray-400">Avg Water</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{avgWater} <span className="text-xs font-normal text-gray-400">ml</span></div>
          <p className="text-[11px] text-gray-400">Daily average hydration</p>
        </div>

        <div className="card p-5 space-y-1 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Moon size={18} />
            <span className="text-xs font-bold uppercase text-gray-400">Avg Sleep</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{avgSleep} <span className="text-xs font-normal text-gray-400">hrs</span></div>
          <p className="text-[11px] text-gray-400">Rest & recovery baseline</p>
        </div>
      </div>

      {/* Grid of Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Body Weight */}
        <div className="card p-6 space-y-4 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Scale size={18} className="text-emerald-500" />
            <span>Body Weight History (kg)</span>
          </h3>
          <div className="h-64 w-full">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Log your body weight in Profile to view progress over time.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Caloric Intake */}
        <div className="card p-6 space-y-4 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <span>Daily Caloric Intake (kcal)</span>
          </h3>
          <div className="h-64 w-full">
            {calorieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Log meals to see your daily caloric totals.
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Water Hydration */}
        <div className="card p-6 space-y-4 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Droplets size={18} className="text-cyan-500" />
            <span>Hydration Trends (ml)</span>
          </h3>
          <div className="h-64 w-full">
            {waterData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Log water intake in Water Tracker to track hydration consistency.
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Sleep Recovery */}
        <div className="card p-6 space-y-4 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Moon size={18} className="text-indigo-500" />
            <span>Sleep Duration (Hours)</span>
          </h3>
          <div className="h-64 w-full">
            {sleepData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[4, 12]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Log sleep sessions in Sleep Tracker to monitor your recovery cycle.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
