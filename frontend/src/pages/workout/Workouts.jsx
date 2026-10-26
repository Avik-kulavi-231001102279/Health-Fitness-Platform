import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/services';
import {
  Dumbbell, Play, CheckCircle2, Search, Filter,
  Clock, Flame, Plus, History, RotateCcw, Award, ChevronRight
} from 'lucide-react';
import { PageLoader, EmptyState } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Workouts() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'active' | 'history'
  const [exercises, setExercises] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Session state
  const [activeSession, setActiveSession] = useState(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [selectedExercisesForSession, setSelectedExercisesForSession] = useState([]);

  const categories = [
    'All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs', 'Cardio', 'HIIT'
  ];

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const [exRes, histRes] = await Promise.all([
        workoutService.getExercises(params),
        workoutService.getHistory()
      ]);
      setExercises(exRes.data || []);
      setHistory(histRes.data || []);
    } catch (err) {
      console.error('Failed to load workout data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Timer for active workout session
  useEffect(() => {
    let interval = null;
    if (activeSession) {
      interval = setInterval(() => {
        setSessionSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const startNewSession = (initialExercise = null) => {
    const list = initialExercise ? [{
      exercise: initialExercise._id,
      name: initialExercise.name,
      sets: [{ setNumber: 1, reps: initialExercise.reps || 10, weight: 0, completed: false }]
    }] : [];

    setActiveSession({
      startTime: new Date(),
      exercises: list
    });
    setSessionSeconds(0);
    setActiveTab('active');
    toast.success('Workout session started! Let’s crush it!');
  };

  const addExerciseToSession = (ex) => {
    if (!activeSession) {
      startNewSession(ex);
      return;
    }
    const updated = [...activeSession.exercises, {
      exercise: ex._id,
      name: ex.name,
      sets: [{ setNumber: 1, reps: ex.reps || 10, weight: 0, completed: false }]
    }];
    setActiveSession({ ...activeSession, exercises: updated });
    toast.success(`Added ${ex.name} to active session`);
  };

  const addSetToExercise = (exIndex) => {
    const currentSets = activeSession.exercises[exIndex].sets;
    const newSet = {
      setNumber: currentSets.length + 1,
      reps: currentSets[currentSets.length - 1]?.reps || 10,
      weight: currentSets[currentSets.length - 1]?.weight || 0,
      completed: false
    };
    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exIndex].sets.push(newSet);
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  const toggleSetComplete = (exIndex, setIndex) => {
    const updatedExercises = [...activeSession.exercises];
    const set = updatedExercises[exIndex].sets[setIndex];
    set.completed = !set.completed;
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  const updateSetValues = (exIndex, setIndex, field, value) => {
    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exIndex].sets[setIndex][field] = Number(value);
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  const completeActiveSession = async () => {
    try {
      const durationMinutes = Math.max(1, Math.round(sessionSeconds / 60));
      const caloriesBurned = durationMinutes * 8; // approx 8 kcal/min

      // First, create the session
      const startPayload = {
        workoutName: `Workout on ${new Date().toLocaleDateString()}`,
        exercises: activeSession.exercises.map(e => ({
          exerciseId: e.exercise,
          name: e.name,
          sets: e.sets.length,
          reps: e.sets[0]?.reps || 10
        }))
      };
      const startRes = await workoutService.startSession(startPayload);
      const sessionId = startRes.data._id;

      // Then, complete it with the actual data
      const completePayload = {
        caloriesBurned,
        exercises: activeSession.exercises.map(e => ({
          exercise: e.exercise,
          exerciseName: e.name,
          sets: e.sets,
          completed: e.sets.some(s => s.completed),
          skipped: !e.sets.some(s => s.completed)
        }))
      };

      await workoutService.completeSession(sessionId, completePayload);
      
      toast.success(`Workout complete! ${caloriesBurned} kcal burned!`);
      setActiveSession(null);
      setSessionSeconds(0);
      setActiveTab('history');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save workout session');
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-dark-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Workout Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse exercise library, log active training, and inspect workout history
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-dark-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'browse'
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Exercise Library
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <span>Live Session</span>
            {activeSession && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Workout History
          </button>
        </div>
      </div>

      {/* TAB 1: Exercise Library */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search & Category Pills */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises (e.g. Bench Press, Squats)..."
                className="input pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid */}
          {loading ? (
            <PageLoader />
          ) : filteredExercises.length === 0 ? (
            <EmptyState
              title="No Exercises Found"
              description="Try selecting another category or refining your search keywords."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((ex) => (
                <div key={ex._id} className="card p-5 card-hover flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="badge badge-info">{ex.category}</span>
                      <span className="text-xs font-bold text-gray-400 capitalize">{ex.difficulty}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1">{ex.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {ex.instructions}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span>{ex.sets || 3} sets × {ex.reps || 12} reps</span>
                      <span>~{ex.estimatedCalories || 50} kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addExerciseToSession(ex)}
                    className="w-full btn-secondary py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Play size={14} className="text-primary-500" />
                    <span>{activeSession ? 'Add to Session' : 'Start Workout with This'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Live Workout Session */}
      {activeTab === 'active' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!activeSession ? (
            <div className="card p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-500 flex items-center justify-center mx-auto">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-xl font-bold">No Workout Currently in Progress</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Ready to hit the gym? Start a fresh session or pick exercises from the library.
              </p>
              <button
                onClick={() => startNewSession()}
                className="btn-primary py-3 px-8 font-bold inline-flex items-center gap-2"
              >
                <Play size={18} />
                <span>Start Empty Workout Session</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Session Control Bar */}
              <div className="card p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-primary-900/20 to-accent-900/20 border-primary-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Workout Duration</p>
                    <h2 className="text-3xl font-black font-mono tracking-wider text-primary-600 dark:text-primary-400">
                      {formatTimer(sessionSeconds)}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Exercises
                  </button>
                  <button
                    onClick={completeActiveSession}
                    className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={16} /> Finish Session
                  </button>
                </div>
              </div>

              {/* Active Exercise List */}
              {activeSession.exercises.length === 0 ? (
                <div className="card p-8 text-center text-gray-400">
                  <p className="text-sm">No exercises added to this session yet.</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="mt-3 text-xs font-bold text-primary-500 hover:underline"
                  >
                    Browse exercises to add →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSession.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="card p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-xs flex items-center justify-center font-bold">
                            {exIdx + 1}
                          </span>
                          <span>{ex.name}</span>
                        </h4>
                        <button
                          onClick={() => addSetToExercise(exIdx)}
                          className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Set
                        </button>
                      </div>

                      {/* Sets Table */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-xs font-bold uppercase text-gray-400 px-2">
                          <span className="col-span-2">Set</span>
                          <span className="col-span-4">Weight (kg)</span>
                          <span className="col-span-4">Reps</span>
                          <span className="col-span-2 text-center">Done</span>
                        </div>

                        {ex.sets.map((s, sIdx) => (
                          <div
                            key={sIdx}
                            className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-all ${
                              s.completed
                                ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40'
                                : 'border-gray-100 dark:border-dark-700'
                            }`}
                          >
                            <span className="col-span-2 text-xs font-bold text-center sm:text-left">
                              {s.setNumber}
                            </span>
                            <input
                              type="number"
                              value={s.weight}
                              onChange={(e) => updateSetValues(exIdx, sIdx, 'weight', e.target.value)}
                              className="col-span-4 input py-1 text-xs"
                              placeholder="0"
                            />
                            <input
                              type="number"
                              value={s.reps}
                              onChange={(e) => updateSetValues(exIdx, sIdx, 'reps', e.target.value)}
                              className="col-span-4 input py-1 text-xs"
                              placeholder="10"
                            />
                            <div className="col-span-2 flex justify-center">
                              <button
                                type="button"
                                onClick={() => toggleSetComplete(exIdx, sIdx)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                  s.completed
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 dark:bg-dark-700 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <EmptyState
              title="No Workouts Logged Yet"
              description="Complete your first live training session above to start building your workout log!"
              action={
                <button
                  onClick={() => startNewSession()}
                  className="btn-primary py-2.5 px-6 text-sm font-bold"
                >
                  Start Workout Now
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((sess) => (
                <div key={sess._id} className="card p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">{sess.workoutName || 'Workout Session'}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(sess.createdAt || sess.date).toLocaleDateString(undefined, {
                          weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className="badge badge-success flex items-center gap-1">
                      <Award size={12} /> +{sess.xpEarned || 50} XP
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-gray-100 dark:border-dark-700">
                    <div>
                      <span className="text-gray-400">Duration:</span>{' '}
                      <strong>{sess.totalDuration || 0} mins</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Calories:</span>{' '}
                      <strong>~{sess.caloriesBurned || 0} kcal</strong>
                    </div>
                  </div>

                  {sess.exercises && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {sess.exercises.length} Exercises completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
