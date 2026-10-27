import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/services';
import {
  User, Mail, Scale, Flame, Heart, Dumbbell,
  Utensils, Edit3, Shield, Award, Sparkles, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    age: user?.age || 25,
    gender: user?.gender || 'Male',
    height: user?.height || 175,
    weight: user?.weight || 70,
    targetWeight: user?.targetWeight || 68,
    fitnessGoal: user?.fitnessGoal || 'Improve fitness',
    activityLevel: user?.activityLevel || 'Moderately active',
    workoutExperience: user?.workoutExperience || 'Intermediate',
    foodPreference: user?.foodPreference || 'Non-Vegetarian'
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userService.updateProfile(editForm);
      updateUser(data.user);
      toast.success('Profile and fitness targets updated!');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const heightM = (user?.height || 175) / 100;
  const currentWeight = user?.weight || 70;
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-primary-900/20 via-primary-500/10 to-accent-500/10 border border-primary-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{user?.name}</h1>
              {user?.role === 'admin' && (
                <span className="badge badge-danger flex items-center gap-1">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="font-bold text-violet-500 flex items-center gap-1">
                <Award size={14} className="text-violet-500" /> {user?.totalXP || 150} XP
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm font-bold shadow-md shadow-primary-500/20"
        >
          <Edit3 size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Grid: Body Metrics & Fitness Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Physical Metrics */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-700">
            <Scale className="text-primary-500" size={20} />
            <span>Biometric Baseline</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <p className="text-gray-400">Current Weight</p>
              <p className="text-lg font-black mt-0.5">{user?.weight || 70} kg</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <p className="text-gray-400">Target Weight</p>
              <p className="text-lg font-black mt-0.5">{user?.targetWeight || user?.weight || 70} kg</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <p className="text-gray-400">Height</p>
              <p className="text-lg font-black mt-0.5">{user?.height || 175} cm</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <p className="text-gray-400">BMI Score</p>
              <p className="text-lg font-black text-primary-500 mt-0.5">{bmi}</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <p className="text-gray-400">Age & Gender</p>
              <p className="text-sm font-bold mt-0.5">{user?.age || 25} yrs • {user?.gender || 'Male'}</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <p className="text-gray-400">Water Target</p>
              <p className="text-sm font-bold mt-0.5">{user?.dailyWaterTarget || 3000} ml/day</p>
            </div>
          </div>
        </div>

        {/* Card 2: Fitness Regimen & Nutrition Setup */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-700">
            <Flame className="text-orange-500" size={20} />
            <span>Target Engine Parameters</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <span className="text-gray-400">Primary Goal:</span>
              <strong className="text-primary-600 dark:text-primary-400 text-sm">{user?.fitnessGoal || 'Improve fitness'}</strong>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <span className="text-gray-400">Activity Level:</span>
              <strong>{user?.activityLevel || 'Moderately active'}</strong>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <span className="text-gray-400">Workout Experience:</span>
              <strong>{user?.workoutExperience || 'Intermediate'}</strong>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50">
              <span className="text-gray-400">Dietary Style:</span>
              <strong>{user?.foodPreference || 'Non-Vegetarian'}</strong>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 flex justify-between items-center">
              <span className="text-orange-600 dark:text-orange-400 font-bold">Daily Calorie Target:</span>
              <strong className="text-base text-orange-600 dark:text-orange-400">{user?.dailyCalorieTarget || 2200} kcal</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Update Profile & Biometrics</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="label text-xs">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Age</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="input text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label text-xs">Height (cm)</label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Weight (kg)</label>
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Target (kg)</label>
                  <input
                    type="number"
                    value={editForm.targetWeight}
                    onChange={(e) => setEditForm({ ...editForm, targetWeight: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs">Fitness Goal</label>
                <select
                  value={editForm.fitnessGoal}
                  onChange={(e) => setEditForm({ ...editForm, fitnessGoal: e.target.value })}
                  className="input text-xs"
                >
                  <option value="Gradual weight loss">Gradual Weight Loss</option>
                  <option value="Build strength">Build Strength</option>
                  <option value="Maintain weight">Maintain Weight</option>
                  <option value="Improve fitness">Improve Fitness</option>
                  <option value="Gradual weight gain">Gradual Weight Gain</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Activity Level</label>
                <select
                  value={editForm.activityLevel}
                  onChange={(e) => setEditForm({ ...editForm, activityLevel: e.target.value })}
                  className="input text-xs"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly active">Lightly Active</option>
                  <option value="Moderately active">Moderately Active</option>
                  <option value="Very active">Very Active</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-dark-700">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary py-2 px-5 text-xs font-bold">
                  {loading ? 'Saving...' : 'Recalculate & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
