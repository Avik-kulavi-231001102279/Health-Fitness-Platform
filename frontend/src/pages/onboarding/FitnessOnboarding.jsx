import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AnimatedLogo from '../../components/common/AnimatedLogo';
import {
  ArrowRight, ArrowLeft, Check, Sparkles,
  Flame, Heart, Scale, User, UtensilsCrossed, Dumbbell,
  Clock, Moon, Droplets, ShieldCheck, HeartPulse
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FitnessOnboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    age: user?.age || 26,
    gender: user?.gender || 'Male',
    height: user?.height || 175,
    weight: user?.weight || 70,
    targetWeight: user?.targetWeight || 68,
    preferredUnits: user?.preferredUnits || 'metric',
    fitnessGoal: user?.fitnessGoal || 'Build strength',
    activityLevel: user?.activityLevel || 'Moderately active',
    workoutExperience: user?.workoutExperience || 'Intermediate',
    availableWorkoutTime: user?.availableWorkoutTime || 45,
    foodPreference: user?.foodPreference || 'Non-Vegetarian',
    dietaryRestrictions: user?.dietaryRestrictions || ['No Restrictions'],
    dailySleepTarget: user?.dailySleepTarget || 8
  });

  const goals = [
    { id: 'Gradual weight loss', title: 'Gradual Weight Loss', desc: 'Sustainable 0.4kg/week deficit preserving lean muscle mass' },
    { id: 'Build strength', title: 'Build Strength & Muscle', desc: 'Lean caloric surplus and progressive resistance hypertrophy' },
    { id: 'Maintain weight', title: 'Maintain Weight', desc: 'Balance daily caloric expenditure with metabolic homeostasis' },
    { id: 'Improve fitness', title: 'Improve General Fitness', desc: 'Conditioning, mobility, heart health, and daily energy' },
    { id: 'Gradual weight gain', title: 'Gradual Weight Gain', desc: 'Healthy surplus for athletic mass and body recomposition' }
  ];

  const activityLevels = [
    { id: 'Sedentary', title: 'Sedentary', desc: 'Little or no structured exercise, desk job (1.2× BMR)' },
    { id: 'Lightly active', title: 'Lightly Active', desc: 'Light exercise or brisk walks 1-3 days per week (1.375× BMR)' },
    { id: 'Moderately active', title: 'Moderately Active', desc: 'Moderate workouts or sports 3-5 days per week (1.55× BMR)' },
    { id: 'Very active', title: 'Very Active', desc: 'Hard physical training or sports 6-7 days per week (1.725× BMR)' }
  ];

  const experienceLevels = [
    { id: 'Beginner', title: 'Beginner', desc: 'New to fitness or resuming after a prolonged break' },
    { id: 'Intermediate', title: 'Intermediate', desc: 'Consistent resistance or cardiovascular training for 6+ months' },
    { id: 'Advanced', title: 'Advanced', desc: 'Structured athletic training and progressive overload for 2+ years' }
  ];

  const diets = [
    { id: 'Vegetarian', title: 'Vegetarian', desc: 'Plant-based with dairy & pulses' },
    { id: 'Non-Vegetarian', title: 'Non-Vegetarian', desc: 'Includes poultry, fish, eggs, and meat' },
    { id: 'Vegan', title: 'Vegan', desc: 'Strictly 100% plant-based whole foods' },
    { id: 'Eggetarian', title: 'Eggetarian', desc: 'Vegetarian plus eggs' }
  ];

  const restrictionsList = [
    'No Restrictions', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
    'Low-Carb', 'Keto', 'Halal', 'Kosher'
  ];

  const handleRestrictionToggle = (item) => {
    if (item === 'No Restrictions') {
      setFormData({ ...formData, dietaryRestrictions: ['No Restrictions'] });
      return;
    }
    let current = formData.dietaryRestrictions.filter(r => r !== 'No Restrictions');
    if (current.includes(item)) {
      current = current.filter(r => r !== item);
    } else {
      current.push(item);
    }
    if (current.length === 0) current = ['No Restrictions'];
    setFormData({ ...formData, dietaryRestrictions: current });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await api.post('/users/onboarding', formData);
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      toast.success('Onboarding complete! Your personalized profile is live.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-10 px-4 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <AnimatedLogo size="lg" to="/" />
          <h2 className="text-2xl font-black mt-4">Personalize Your FitLife Journey</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Step {step} of {totalSteps}: Setup your adult energy baseline & goals
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-dark-800 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-600 to-accent-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="card p-6 sm:p-8 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 shadow-xl rounded-3xl animate-fade-in">
          {/* STEP 1: Biometrics & Units */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <User size={18} className="text-primary-500" />
                <span>Basic Biometrics & Preferred Units</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Measurement Units</label>
                  <select
                    value={formData.preferredUnits}
                    onChange={(e) => setFormData({ ...formData, preferredUnits: e.target.value })}
                    className="input text-sm py-2 px-3"
                  >
                    <option value="metric">Metric (kg, cm, ml)</option>
                    <option value="imperial">Imperial (lbs, in, oz)</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Biological Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input text-sm py-2 px-3"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Age (Years)</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="input text-sm py-2 px-3"
                    required
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Adults 18+</span>
                </div>

                <div>
                  <label className="label text-xs">Height ({formData.preferredUnits === 'metric' ? 'cm' : 'in'})</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="input text-sm py-2 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="label text-xs">Current Weight ({formData.preferredUnits === 'metric' ? 'kg' : 'lbs'})</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="input text-sm py-2 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="label text-xs">Target Weight ({formData.preferredUnits === 'metric' ? 'kg' : 'lbs'})</label>
                  <input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                    className="input text-sm py-2 px-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fitness Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Flame size={18} className="text-primary-500" />
                <span>Primary Lifestyle & Fitness Goal</span>
              </h3>

              <div className="space-y-2.5">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setFormData({ ...formData, fitnessGoal: g.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      formData.fitnessGoal === g.id
                        ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/30 shadow-sm'
                        : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{g.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{g.desc}</p>
                    </div>
                    {formData.fitnessGoal === g.id && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Activity Level & Training Experience */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <Heart size={18} className="text-primary-500" />
                  <span>Daily Activity Level</span>
                </h3>

                <div className="space-y-2">
                  {activityLevels.map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setFormData({ ...formData, activityLevel: lvl.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        formData.activityLevel === lvl.id
                          ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/30'
                          : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">{lvl.title}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{lvl.desc}</p>
                      </div>
                      {formData.activityLevel === lvl.id && (
                        <Check size={16} className="text-primary-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Workout Experience</h4>
                <div className="grid grid-cols-3 gap-2">
                  {experienceLevels.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, workoutExperience: exp.id })}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        formData.workoutExperience === exp.id
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {exp.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Dietary Preferences & Restrictions */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <UtensilsCrossed size={18} className="text-primary-500" />
                  <span>Dietary Preference</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {diets.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setFormData({ ...formData, foodPreference: d.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.foodPreference === d.id
                          ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/30'
                          : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{d.title}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">
                  {restrictionsList.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleRestrictionToggle(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        formData.dietaryRestrictions.includes(item)
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Lifestyle & Daily Time Budget */}
          {step === 5 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock size={18} className="text-primary-500" />
                <span>Daily Lifestyle & Time Availability</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="label text-xs">Available Daily Workout Time</label>
                  <select
                    value={formData.availableWorkoutTime}
                    onChange={(e) => setFormData({ ...formData, availableWorkoutTime: Number(e.target.value) })}
                    className="input text-sm py-2 px-3"
                  >
                    <option value={20}>20 minutes (Express HIIT / Mobility)</option>
                    <option value={30}>30 minutes (Focused conditioning)</option>
                    <option value={45}>45 minutes (Standard resistance workout)</option>
                    <option value={60}>60 minutes (Comprehensive strength + cardio)</option>
                    <option value={90}>90 minutes (Advanced athletic protocol)</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Target Daily Sleep</label>
                  <select
                    value={formData.dailySleepTarget}
                    onChange={(e) => setFormData({ ...formData, dailySleepTarget: Number(e.target.value) })}
                    className="input text-sm py-2 px-3"
                  >
                    <option value={7}>7 hours per night</option>
                    <option value={7.5}>7.5 hours per night</option>
                    <option value={8}>8 hours per night (Recommended adult baseline)</option>
                    <option value={8.5}>8.5 hours per night (High athletic recovery)</option>
                    <option value={9}>9 hours per night</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Calculation Methodology Disclaimer */}
          {step === 6 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>Review Your Profile & Methodology</span>
              </h3>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200/50 dark:border-dark-700/50">
                  <span className="text-gray-400">Biometrics:</span>
                  <span className="font-bold">{formData.gender}, {formData.age}y · {formData.height}cm, {formData.weight}kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/50 dark:border-dark-700/50">
                  <span className="text-gray-400">Fitness Goal:</span>
                  <span className="font-bold text-primary-500">{formData.fitnessGoal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/50 dark:border-dark-700/50">
                  <span className="text-gray-400">Activity Level:</span>
                  <span className="font-bold">{formData.activityLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/50 dark:border-dark-700/50">
                  <span className="text-gray-400">Dietary Style:</span>
                  <span className="font-bold">{formData.foodPreference}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Daily Workout Time:</span>
                  <span className="font-bold">{formData.availableWorkoutTime} mins</span>
                </div>
              </div>

              {/* Scientific Guardrail Alert */}
              <div className="p-3.5 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-start gap-3 text-xs text-gray-600 dark:text-gray-300">
                <HeartPulse size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Transparent Energy Modeling:</strong> Your targets will be generated via the peer-reviewed adult Mifflin-St Jeor equation. These are scientifically grounded estimates to guide sustainable habits. They are not medical prescriptions. You can review and update these anytime in Settings.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100 dark:border-dark-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary-500/20"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="btn-primary py-2.5 px-7 text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary-500/25"
              >
                <span>{loading ? 'Finalizing Profile...' : 'Activate FitLife Pro Plan'}</span>
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
