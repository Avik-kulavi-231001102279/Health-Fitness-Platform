import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import {
  Shield, Users, Dumbbell, Apple, Trophy, Flame,
  Trash2, Plus, Search, CheckCircle2, UserCheck
} from 'lucide-react';
import { PageLoader, ConfirmDialog } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'exercises' | 'foods' | 'challenges'
  const [loading, setLoading] = useState(true);

  // Exercise creation modal
  const [showExModal, setShowExModal] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '', category: 'Chest', difficulty: 'Beginner', instructions: '', sets: 3, reps: 10, estimatedCalories: 60
  });

  // Food creation modal
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '', calories: 150, protein: 20, carbs: 10, fat: 5, servingSize: '100g', category: 'Protein'
  });

  // Delete user confirmation
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUsers()
      ]);
      setStats(sRes.data || null);
      setUsers(uRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Failed to load admin portal');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await adminService.deleteUser(deleteUserId);
      toast.success('User deleted successfully');
      setDeleteUserId(null);
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      await adminService.createExercise(newExercise);
      toast.success('New exercise created!');
      setShowExModal(false);
      setNewExercise({ name: '', category: 'Chest', difficulty: 'Beginner', instructions: '', sets: 3, reps: 10, estimatedCalories: 60 });
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to create exercise');
    }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      await adminService.createFood(newFood);
      toast.success('New food item added to database!');
      setShowFoodModal(false);
      setNewFood({ name: '', calories: 150, protein: 20, carbs: 10, fat: 5, servingSize: '100g', category: 'Protein' });
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to create food item');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-dark-800 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-red-500" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black">Admin Command Center</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            System overview, user governance, and central database management
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400">Total Users</p>
          <p className="text-2xl font-black mt-0.5 text-primary-500">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400">Workouts</p>
          <p className="text-2xl font-black mt-0.5">{stats?.totalWorkoutsLogged || 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400">Meals</p>
          <p className="text-2xl font-black mt-0.5">{stats?.totalMealsLogged || 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400">Exercises</p>
          <p className="text-2xl font-black mt-0.5">{stats?.totalExercises || 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400">Foods DB</p>
          <p className="text-2xl font-black mt-0.5">{stats?.totalFoods || 0}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400">Active Challenges</p>
          <p className="text-2xl font-black mt-0.5">{stats?.totalChallenges || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-dark-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Users Management
        </button>
        <button
          onClick={() => setShowExModal(true)}
          className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Exercise
        </button>
        <button
          onClick={() => setShowFoodModal(true)}
          className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Food
        </button>
      </div>

      {/* TAB: Users List */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-800 font-bold text-sm">
            Registered Platform Users ({users.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-dark-900/50 text-gray-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Goal</th>
                  <th className="p-4">Streak</th>
                  <th className="p-4">XP</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{u.name}</div>
                      <div className="text-gray-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{u.fitnessGoal || 'Not set'}</td>
                    <td className="p-4 font-bold">
                      <span className="flex items-center gap-1 text-orange-500">
                        <Flame size={14} /> {u.currentStreak || 0}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-violet-500">{u.totalXP || 0} XP</td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setDeleteUserId(u._id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Exercise */}
      {showExModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Add New Exercise</h3>
              <button onClick={() => setShowExModal(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleCreateExercise} className="space-y-3 text-xs">
              <div>
                <label className="label text-xs">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  placeholder="e.g. Dumbbell Shoulder Press"
                  className="input text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label text-xs">Category</label>
                  <select
                    value={newExercise.category}
                    onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                    className="input text-xs"
                  >
                    {['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs', 'Cardio', 'HIIT'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Difficulty</label>
                  <select
                    value={newExercise.difficulty}
                    onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
                    className="input text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label text-xs">Instructions</label>
                <textarea
                  value={newExercise.instructions}
                  onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
                  className="input text-xs h-20"
                  placeholder="Proper form and breathing guidance..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-dark-700">
                <button type="button" onClick={() => setShowExModal(false)} className="btn-ghost text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold">Add Exercise</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Food */}
      {showFoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Add Food to Master Database</h3>
              <button onClick={() => setShowFoodModal(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleCreateFood} className="space-y-3 text-xs">
              <div>
                <label className="label text-xs">Food Name</label>
                <input
                  type="text"
                  required
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="e.g. Grass-fed Ribeye Steak"
                  className="input text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label text-xs">Calories (kcal)</label>
                  <input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Serving Size</label>
                  <input
                    type="text"
                    value={newFood.servingSize}
                    onChange={(e) => setNewFood({ ...newFood, servingSize: e.target.value })}
                    className="input text-xs"
                    placeholder="e.g. 100g"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label text-xs">Protein (g)</label>
                  <input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Carbs (g)</label>
                  <input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Fat (g)</label>
                  <input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-dark-700">
                <button type="button" onClick={() => setShowFoodModal(false)} className="btn-ghost text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold">Save Food</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Dialog */}
      <ConfirmDialog
        isOpen={!!deleteUserId}
        title="Delete User Account?"
        message="Are you sure you want to remove this user from the system? Their data and logs will be permanently deleted."
        danger={true}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUserId(null)}
      />
    </div>
  );
}
