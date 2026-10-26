import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplets, Dumbbell, Moon, CheckCircle2,
  Sparkles, ArrowRight, ShieldCheck, Activity,
  ChevronDown, HeartPulse, RefreshCw, Bot,
  Apple, Award, Compass, BarChart3, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  // Interactive dashboard preview active tab
  const [activePreviewTab, setActivePreviewTab] = useState('overview');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Health Disclaimer Modal State
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Quick BMI calculator state
  const [calcHeight, setCalcHeight] = useState('175');
  const [calcWeight, setCalcWeight] = useState('70');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateQuickBmi = (e) => {
    e.preventDefault();
    const h = parseFloat(calcHeight) / 100;
    const w = parseFloat(calcWeight);
    if (h > 0 && w > 0) {
      const bmi = parseFloat((w / (h * h)).toFixed(1));
      let category = 'Normal weight';
      let color = 'text-emerald-500';
      let bg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-blue-500';
        bg = 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';
      } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
        color = 'text-amber-500';
        bg = 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400';
      } else if (bmi >= 30) {
        category = 'Obese';
        color = 'text-rose-500';
        bg = 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400';
      }
      setBmiResult({ bmi, category, color, bg });
    }
  };

  const faqs = [
    {
      q: 'How does FitLife Pro calculate my daily calorie and macronutrient targets?',
      a: 'We use the peer-reviewed Mifflin-St Jeor formula for adults to estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Based on your fitness goal (weight loss, muscle gain, or maintenance), we apply a sustainable surplus or deficit with strict clinical safety floors. All calculations are transparent estimates, not rigid prescriptions.'
    },
    {
      q: 'How does the AI Lifestyle Assistant work?',
      a: 'Our AI Coach analyzes only your authorized profile data (goal, dietary preferences, daily hydration, calorie targets) to answer lifestyle planning questions, generate balanced meal suggestions, and optimize recovery routines. If the external AI service is unreachable, a robust deterministic engine provides science-backed answers.'
    },
    {
      q: 'Is my personal health and nutrition data kept private?',
      a: 'Absolutely. We enforce backend-level data isolation for every user. Your nutrition logs, water entries, body metrics, and sleep data are accessible solely by your authenticated session. We never sell user data or expose credentials.'
    },
    {
      q: 'Can I track Indian and regional foods?',
      a: 'Yes! FitLife Pro includes a verified food database containing Indian staples (roti, moong dal, paneer, brown rice, chana masala, curd, etc.) with accurate calorie, protein, carbohydrate, and fat values per serving.'
    },
    {
      q: 'Does FitLife Pro provide medical diagnoses or prescriptions?',
      a: 'No. FitLife Pro is an educational lifestyle optimization and wellness tracker. It does not diagnose medical conditions, prescribe medication, or replace personalized medical counsel. Users with underlying conditions should always consult a licensed healthcare professional.'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[650px] h-[450px] bg-gradient-to-tr from-primary-600/25 via-accent-500/20 to-blue-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/30 text-primary-600 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-primary-500" />
            <span>AI-Powered Lifestyle Optimization & Wellness</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] mb-6">
            Transform Your Lifestyle with{' '}
            <span className="text-gradient">AI-Powered Wellness.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Track your nutrition, build healthier habits, plan your workouts, improve your sleep, and discover a smarter way to live.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to={user?.isOnboardingDone ? '/dashboard' : '/onboarding'}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 shadow-xl shadow-primary-500/25"
              >
                <span>Go to Your Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                to="/register"
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 shadow-xl shadow-primary-500/25"
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
            )}

            <a
              href="#features"
              className="w-full sm:w-auto btn-secondary text-base px-8 py-4 flex items-center justify-center gap-2"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Adult Mifflin-St Jeor TDEE</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Zero Fabricated Statistics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Private User Data Isolation</span>
            </div>
          </div>
        </div>

        {/* ─── Hero Dashboard Preview Card ─── */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="card p-3 sm:p-5 shadow-2xl border border-gray-200/80 dark:border-dark-700/80 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-dark-800 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-gray-400">fitlife-pro.app/dashboard</span>
              </div>
              <div className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Architecture Preview
              </div>
            </div>

            {/* Simulated Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Calories Remaining</span>
                  <Flame size={16} className="text-orange-500" />
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-gray-100">680 <span className="text-xs font-normal text-gray-500">/ 2,150</span></div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Daily Hydration</span>
                  <Droplets size={16} className="text-cyan-500" />
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-gray-100">2,250 <span className="text-xs font-normal text-gray-500">/ 3,000 ml</span></div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Sleep Recovery</span>
                  <Moon size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-gray-100">7.5 <span className="text-xs font-normal text-gray-500">/ 8.0 hrs</span></div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Active Streak</span>
                  <Award size={16} className="text-primary-500" />
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-gray-100">14 <span className="text-xs font-normal text-gray-500">Days</span></div>
                <div className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Consistency Multiplier Active</span>
                </div>
              </div>
            </div>

            {/* AI Insight Box in preview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-blue-500/10 border border-primary-500/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-500 text-white shrink-0 mt-0.5">
                <Bot size={18} />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-primary-600 dark:text-primary-300 block mb-0.5">FitLife AI Assistant Daily Insight</span>
                <p className="text-gray-600 dark:text-gray-300">
                  "You've maintained consistent hydration across 5 consecutive days. For your strength session today, prioritize 25g protein within 2 hours post-workout."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Feature Overview ─── */}
      <section id="features" className="py-20 bg-gray-50/80 dark:bg-dark-900/60 border-y border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              A Complete System for Sustainable Health
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Engineered with modern full-stack reliability, verified nutrition, and personalized coaching to optimize every dimension of daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                <Flame size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Nutrition & Macro Tracking</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Log meals across Breakfast, Lunch, Snacks, and Dinner. Search verified Indian & wholesome foods with real-time calorie, protein, carb, and fat calculations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <Droplets size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Dedicated Water Tracker</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Adaptive daily hydration targets adjusted for body weight and workout intensity. Quick-add 150ml, 250ml, 500ml, entry history, undo, and reminders.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4">
                <Dumbbell size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Workout Planner & Sessions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Extensive exercise library spanning beginner, home, gym, strength, and cardio. Active workout controls with timer, sets, reps, and calorie burn summaries.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Moon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Sleep & Recovery Logs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Record bedtimes and wake times with automatic duration calculation crossing midnight. Quality ratings, notes, and weekly sleep consistency insights.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Atomic Habits & Streaks</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Create custom habits or use 8 pre-built templates (morning walk, reading, hydration, meditation). Calculate streaks with timezone consistency and zero guilt.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Analytics & Export</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Interactive charts powered by Recharts. Analyze 7-day and 30-day nutrition, hydration, sleep, and workout trends, with authorized CSV and JSON data export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: How It Works ─── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold uppercase mb-4">
            <Compass size={14} /> Guided Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            How FitLife Pro Transforms Your Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Four simple steps designed to build effortless consistency and long-term health optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="card p-6 text-center relative z-10">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
              1
            </div>
            <h3 className="text-lg font-bold mb-2">Complete Onboarding</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Input age, height, weight, activity profile, and dietary preferences for instant adult Mifflin-St Jeor calculations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card p-6 text-center relative z-10">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
              2
            </div>
            <h3 className="text-lg font-bold mb-2">Log Daily Actions</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Track meals, quick-add water in 150ml/250ml increments, record workout sessions, and log sleep hours.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card p-6 text-center relative z-10">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
              3
            </div>
            <h3 className="text-lg font-bold mb-2">Receive AI Coaching</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Ask your AI lifestyle assistant for high-protein recipe ideas, workout adjustments, or sleep optimization tips.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card p-6 text-center relative z-10">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
              4
            </div>
            <h3 className="text-lg font-bold mb-2">Build Streaks & Progress</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Watch your consistency climb, complete community challenges, earn XP milestones, and export your personal progress.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 6: AI Lifestyle Assistant Showcase ─── */}
      <section id="ai-coach" className="py-20 bg-gray-50/80 dark:bg-dark-900/60 border-y border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold uppercase mb-4">
                <Bot size={14} /> Intelligent Assistance
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Your Context-Aware Lifestyle Coach
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Unlike generic chatbots, FitLife Pro's coach utilizes your sanitized profile metrics to provide actionable lifestyle guidance.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-gray-100">Nutrition Optimization:</strong> Meal suggestions tailored to your daily calorie target and dietary restrictions (Vegetarian, Vegan, Non-Veg).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-gray-100">Safe Workout Progression:</strong> Beginner-friendly routines structured for progressive overload without extreme risk.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-gray-100">Strict Non-Medical Guardrails:</strong> Clear disclaimers and deterministic fallback mode if no external AI API is configured.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/register" className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-sm">
                  <span>Try AI Coach with Free Account</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Interactive Chat Mockup */}
            <div className="card p-6 shadow-2xl border border-gray-200/80 dark:border-dark-700 bg-white dark:bg-dark-900 rounded-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-dark-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">FitLife Coach</div>
                    <div className="text-[10px] text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Lifestyle Assistant
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 font-semibold">
                  Sanitized Context
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-800 dark:text-gray-200 ml-8">
                  "Suggest a quick 400 kcal vegetarian breakfast with at least 25g protein."
                </div>

                <div className="p-3.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-500/20 text-gray-800 dark:text-gray-200 mr-4">
                  <p className="font-semibold text-primary-600 dark:text-primary-400 mb-1">
                    FitLife Coach Recommendation:
                  </p>
                  <p className="leading-relaxed">
                    <strong>Tofu & Sprout Scramble with Whole Wheat Toast:</strong><br />
                    • 150g firm crumbled tofu sautéed with turmeric, spinach, and diced tomatoes.<br />
                    • 1 slice toasted 100% whole wheat bread.<br />
                    • 1 glass unsweetened soy milk.<br />
                    <em>Total: ~390 kcal | 27g Protein | 8g Fiber.</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 7 & Interactive BMI: Scientific Health Screening ─── */}
      <section id="bmi" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-300 text-xs font-bold uppercase mb-4">
              <HeartPulse size={14} /> Scientifically Documented Adult Baseline
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Explore Your Body Mass Index & Metabolic Needs
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Body Mass Index (BMI) is a standardized screening metric. FitLife Pro pairs your height and weight with the Mifflin-St Jeor equation to estimate your basal energy expenditure, giving you realistic targets rather than restrictive fad diets.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-gray-100">&lt; 18.5 (Underweight):</strong> Focus on nutrient-rich caloric surplus and progressive strength.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-gray-100">18.5 – 24.9 (Normal Weight):</strong> Ideal baseline for cardiovascular health and lean recomposition.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-gray-100">25.0 – 29.9 (Overweight):</strong> Moderate, sustainable 400-500 kcal deficit and active daily movement.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-gray-100">30.0+ (Obese):</strong> Structured habit building with guidance from medical practitioners.</p>
              </div>
            </div>
          </div>

          <div className="card p-8 shadow-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-primary-500" />
              <span>Interactive BMI Screening Tool</span>
            </h3>

            <form onSubmit={calculateQuickBmi} className="space-y-4">
              <div>
                <label className="label">Height (in cm)</label>
                <input
                  type="number"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(e.target.value)}
                  className="input"
                  placeholder="e.g. 175"
                  required
                />
              </div>

              <div>
                <label className="label">Weight (in kg)</label>
                <input
                  type="number"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(e.target.value)}
                  className="input"
                  placeholder="e.g. 70"
                  required
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3 font-bold">
                Calculate Screening Score
              </button>
            </form>

            {bmiResult && (
              <div className={`mt-6 p-4 rounded-xl text-center border ${bmiResult.bg} transition-all`}>
                <p className="text-xs uppercase font-bold tracking-wider opacity-80">Calculated Body Mass Index</p>
                <div className={`text-4xl font-black my-1 ${bmiResult.color}`}>{bmiResult.bmi}</div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/80 dark:bg-dark-800/80 shadow-sm">
                  {bmiResult.category}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-dark-700/50">
                  <Link to="/register" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                    Get custom Mifflin-St Jeor calorie & workout targets →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Section 8: Benefits ─── */}
      <section id="about" className="py-20 bg-gray-50/80 dark:bg-dark-900/60 border-y border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Why Choose FitLife Pro?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Precision health principles designed to replace guesswork with sustainable wellness habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Evidence-Based Formulas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                No pseudo-science or aggressive crash diet recommendations. We adhere to clinical Mifflin-St Jeor energy baselines and safe caloric boundaries.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">All-In-One Unified Architecture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Eliminate 5 disconnected apps. Nutrition, hydration, workouts, habits, sleep, and AI coaching all live under a single synchronized login.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center mb-4">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Full Data Ownership</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Export your authorized logs at any time as clean CSV or JSON. Maintain total sovereignty over your health history without vendor lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 9: Frequently Asked Questions ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Transparent details about our methodology, security, and algorithms.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card border border-gray-200 dark:border-dark-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left font-bold flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
              >
                <span className="text-base text-gray-900 dark:text-gray-100">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-dark-800"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 10: Final Call-To-Action ─── */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            Optimize Your Habits. Transform Your Life.
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join FitLife Pro today and take control of your nutrition, workouts, hydration, and sleep with personalized AI guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-extrabold px-8 py-4 rounded-xl shadow-2xl hover:bg-gray-100 transition-transform active:scale-95 text-base"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-800/60 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-800 transition-colors text-base"
            >
              <span>Sign In to Existing Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Health Disclaimer Modal / Drawer ─── */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-lg w-full p-6 bg-white dark:bg-dark-900 shadow-2xl border border-gray-200 dark:border-dark-700 rounded-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-dark-800 mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ShieldCheck className="text-primary-500" />
                <span>Health & Wellness Disclaimer</span>
              </h3>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              FitLife Pro is an educational wellness and lifestyle tracking tool. All caloric estimates, macronutrient targets, and AI assistant suggestions are generated using general adult formulas (e.g. Mifflin-St Jeor) and are provided for informational and motivational purposes only.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              FitLife Pro does not provide medical diagnoses, treatment plans, or pharmaceutical advice. Always consult a qualified physician or registered dietitian before embarking on aggressive fitness or dietary changes.
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full btn-primary py-2.5 text-sm"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
