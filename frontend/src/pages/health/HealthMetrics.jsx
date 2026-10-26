import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { progressService, userService } from '../../services/services';
import {
  Heart, Scale, Droplets, Moon, Plus,
  TrendingUp, CheckCircle, ArrowRight, Sparkles, AlertCircle, Star
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PageLoader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function HealthMetrics() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // Health data states
  const [weightHistory, setWeightHistory] = useState([]);
  const [waterHistory, setWaterHistory] = useState([]);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [todayWater, setTodayWater] = useState(0);

  // Interactive inputs
  const [logWeightVal, setLogWeightVal] = useState(user?.weight || 70);
  const [weightNotes, setWeightNotes] = useState('');

  // Sleep logging form
  const [sleepTime, setSleepTime] = useState('23:00');
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(4);

  // BMI state
  const heightM = (user?.height || 175) / 100;
  const currentWeight = user?.weight || 70;
  const bmi = parseFloat((currentWeight / (heightM * heightM)).toFixed(1));

  const minHealthyWeight = Math.round(18.5 * heightM * heightM);
  const maxHealthyWeight = Math.round(24.9 * heightM * heightM);

  let bmiCategory = 'Normal weight';
  let bmiColor = 'text-green-500';
  let bmiBg = 'bg-green-100 dark:bg-green-900/30';
  let bmiAdvice = 'Maintain your balanced diet, continue strength progression, and preserve lean muscle mass.';

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-blue-500';
    bmiBg = 'bg-blue-100 dark:bg-blue-900/30';
    bmiAdvice = 'Prioritize a caloric surplus with nutrient-dense proteins and complex carbs, accompanied by progressive overload resistance training.';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-yellow-500';
    bmiBg = 'bg-yellow-100 dark:bg-yellow-900/30';
    bmiAdvice = 'Aim for a steady caloric deficit of ~300-500 kcal, prioritize high protein intake, and incorporate at least 150 minutes of weekly cardio.';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-red-500';
    bmiBg = 'bg-red-100 dark:bg-red-900/30';
    bmiAdvice = 'Focus on low-impact cardiovascular routines (walking, swimming, cycling), sustainable dietary shifts, and consulting a health specialist.';
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [wRes, waterTodayRes, waterHistRes, sRes] = await Promise.all([
        progressService.getWeightHistory(),
        progressService.getTodayWater(),
        progressService.getWaterHistory(7),
        progressService.getSleepHistory(7)
      ]);
      setWeightHistory(wRes.data || []);
      setTodayWater(waterTodayRes.data?.total || 0);
      setWaterHistory(waterHistRes.data || []);
      setSleepHistory(sRes.data || []);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    try {
      await progressService.logWeight({ weight: Number(logWeightVal), notes: weightNotes });
      toast.success('Weight recorded successfully!');
      if (user) {
        updateUser({ ...user, weight: Number(logWeightVal) });
      }
      setWeightNotes('');
      fetchMetrics();
    } catch (err) {
      toast.error('Failed to log weight');
    }
  };

  const handleLogWater = async (amount) => {
    try {
      await progressService.logWater(amount);
      toast.success(`+${amount}ml water logged!`);
      fetchMetrics();
    } catch (err) {
      toast.error('Failed to log water');
    }
  };

  const handleLogSleep = async (e) => {
    e.preventDefault();
    try {
      // Calculate duration between sleepTime and wakeUpTime (HH:MM format)
      const [sh, sm] = sleepTime.split(':').map(Number);
      const [wh, wm] = wakeUpTime.split(':').map(Number);
      let diffMins = (wh * 60 + wm) - (sh * 60 + sm);
      if (diffMins < 0) diffMins += 24 * 60; // crossed midnight

      await progressService.logSleep({
        sleepTime,
        wakeUpTime,
        duration: diffMins,
        quality: Number(sleepQuality)
      });
      toast.success(`Sleep logged: ${(diffMins / 60).toFixed(1)} hours!`);
      fetchMetrics();
    } catch (err) {
      toast.error('Failed to log sleep');
    }
  };

  const chartWeightData = weightHistory.slice().reverse().map(w => ({
    date: new Date(w.date || w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: w.weight
  }));

  const waterTarget = user?.dailyWaterTarget || 3000;

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-dark-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black">Health Metrics & Bio-Stats</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          BMI screening, weight management, daily hydration, and sleep recovery
        </p>
      </div>

      {/* SECTION 1: BMI Screening & Ideal Range */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Body Mass Index (BMI)</span>
            <h2 className="text-2xl font-bold">Personal BMI Screening</h2>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${bmiBg} ${bmiColor}`}>
            {bmiCategory}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Big BMI Number */}
          <div className="text-center md:text-left p-4 rounded-2xl bg-gray-50 dark:bg-dark-900/50">
            <p className="text-xs text-gray-400 font-semibold uppercase">Current Score</p>
            <div className={`text-5xl font-black my-1 ${bmiColor}`}>{bmi}</div>
            <p className="text-xs text-gray-500">Based on {currentWeight}kg / {user?.height || 175}cm</p>
          </div>

          {/* Ideal Weight Range */}
          <div className="text-center md:text-left p-4 rounded-2xl bg-gray-50 dark:bg-dark-900/50">
            <p className="text-xs text-gray-400 font-semibold uppercase">Healthy Weight Range</p>
            <div className="text-3xl font-black my-1 text-gray-900 dark:text-gray-100">
              {minHealthyWeight} – {maxHealthyWeight} <span className="text-sm font-normal text-gray-400">kg</span>
            </div>
            <p className="text-xs text-gray-500">Standard WHO 18.5 – 24.9 BMI bracket</p>
          </div>

          {/* Action Recommendation */}
          <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 mb-1">
              <Sparkles size={14} /> Fitness Insight
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {bmiAdvice}
            </p>
          </div>
        </div>

        {/* Visual BMI scale bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
            <span>&lt; 18.5 Underweight</span>
            <span>18.5 - 24.9 Normal</span>
            <span>25.0 - 29.9 Overweight</span>
            <span>30.0+ Obese</span>
          </div>
          <div className="h-3 rounded-full flex overflow-hidden">
            <div className="bg-blue-400 w-1/4" title="Underweight" />
            <div className="bg-green-500 w-1/4" title="Normal" />
            <div className="bg-yellow-400 w-1/4" title="Overweight" />
            <div className="bg-red-500 w-1/4" title="Obese" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Weight Tracker & Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Scale className="text-primary-500" size={20} />
            <span>Log Body Weight</span>
          </h3>

          <form onSubmit={handleLogWeight} className="space-y-4">
            <div>
              <label className="label text-xs">Weight (in kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={logWeightVal}
                onChange={(e) => setLogWeightVal(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label text-xs">Optional Notes</label>
              <input
                type="text"
                value={weightNotes}
                onChange={(e) => setWeightNotes(e.target.value)}
                placeholder="e.g. Weighed fasting after morning workout"
                className="input text-xs"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold">
              Save Weight Entry
            </button>
          </form>

          <div className="pt-2 text-xs text-gray-400">
            Target Weight: <strong>{user?.targetWeight || currentWeight} kg</strong>
          </div>
        </div>

        {/* Weight Trend Chart */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-primary-500" size={20} />
              <span>Weight Progress Trend</span>
            </h3>
            <span className="text-xs text-gray-400">Past logs</span>
          </div>

          <div className="h-60 w-full">
            {chartWeightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartWeightData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Log your weight entries to display the trendline!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Hydration & Sleep Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Tracker */}
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Droplets className="text-cyan-500" size={20} />
              <span>Daily Hydration</span>
            </h3>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {todayWater} / {waterTarget} ml
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-dark-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayWater / waterTarget) * 100, 100)}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">One-tap hydration logging buttons:</p>
          <div className="grid grid-cols-4 gap-2">
            {[250, 500, 750, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleLogWater(amt)}
                className="py-2.5 rounded-xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-100 transition-all active:scale-95"
              >
                +{amt}ml
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Tracker */}
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Moon className="text-indigo-500" size={20} />
              <span>Sleep & Recovery</span>
            </h3>
            <span className="text-xs text-gray-400">Target: 8.0 hrs</span>
          </div>

          <form onSubmit={handleLogSleep} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Bedtime</label>
                <input
                  type="time"
                  required
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="input text-xs"
                />
              </div>
              <div>
                <label className="label text-xs">Wake Up Time</label>
                <input
                  type="time"
                  required
                  value={wakeUpTime}
                  onChange={(e) => setWakeUpTime(e.target.value)}
                  className="input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs">Sleep Quality (1 - 5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setSleepQuality(star)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      sleepQuality === star
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-200 dark:border-dark-700'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Star size={12} className={sleepQuality === star ? 'fill-indigo-500 text-indigo-500' : 'text-gray-400'} />
                      {star}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold">
              Log Sleep Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
