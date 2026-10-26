import React, { useState, useEffect } from 'react';
import { goalService } from '../../services/services';
import { Target, Plus, CheckCircle2, Trash2, Calendar, Award } from 'lucide-react';
import { PageLoader, EmptyState } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'weight',
    target: 65,
    current: 70,
    unit: 'kg',
    targetDate: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals();
      setGoals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await goalService.createGoal(newGoal);
      toast.success('Fitness goal created!');
      setShowModal(false);
      setNewGoal({ title: '', type: 'weight', target: 65, current: 70, unit: 'kg', targetDate: '' });
      fetchGoals();
    } catch (err) {
      toast.error('Failed to create goal');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalService.deleteGoal(id);
      toast.success('Goal removed');
      fetchGoals();
    } catch (err) {
      toast.error('Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (id, newCurrent) => {
    try {
      await goalService.updateGoal(id, { current: Number(newCurrent) });
      toast.success('Progress updated!');
      fetchGoals();
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-dark-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Personal Goals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set ambitious targets, track milestones, and celebrate achievements
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm font-bold shadow-md shadow-primary-500/20"
        >
          <Plus size={18} />
          <span>New Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          title="No Active Goals Set"
          description="Setting measurable targets is the highest leverage action for physical transformation. Create your first goal today!"
          action={
            <button onClick={() => setShowModal(true)} className="btn-primary py-2.5 px-6 font-bold text-sm">
              Create My First Goal
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const isDone = g.status === 'completed' || pct >= 100;

            return (
              <div key={g._id} className="card p-6 space-y-4 relative card-hover">
                <div className="flex justify-between items-start">
                  <span className="badge badge-info uppercase">{g.type}</span>
                  <button
                    onClick={() => handleDeleteGoal(g._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{g.title}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black">{g.current}</span>
                    <span className="text-xs text-gray-400">/ {g.target} {g.unit || ''}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Progress</span>
                    <span className={isDone ? 'text-green-500' : 'text-primary-500'}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-dark-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : 'bg-primary-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Progress Quick Update */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={g.current}
                    onBlur={(e) => {
                      if (Number(e.target.value) !== g.current) {
                        handleUpdateProgress(g._id, e.target.value);
                      }
                    }}
                    className="input py-1 px-2 text-xs w-24"
                  />
                  <span className="text-xs text-gray-400">Update current</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Goal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Create New Goal</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="label text-xs">Goal Title</label>
                <input
                  type="text"
                  required
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g. Reach 65kg with 12% body fat"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Category</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  className="input text-xs"
                >
                  <option value="weight">Body Weight</option>
                  <option value="workout">Workout Consistency</option>
                  <option value="water">Hydration</option>
                  <option value="custom">Custom Milestone</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Current Value</label>
                  <input
                    type="number"
                    required
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({ ...newGoal, current: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Target Value</label>
                  <input
                    type="number"
                    required
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="kg, sessions, ml"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-xs">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-dark-700">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
