import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  completeOnboarding: (data) => api.post('/users/onboarding', data),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: () => api.delete('/users/account'),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard'),
};

export const workoutService = {
  getExercises: (params) => api.get('/workouts/exercises', { params }),
  getExercise: (id) => api.get(`/workouts/exercises/${id}`),
  getWorkouts: () => api.get('/workouts'),
  createWorkout: (data) => api.post('/workouts', data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  startSession: (data) => api.post('/workouts/sessions', data),
  completeSession: (id, data) => api.put(`/workouts/sessions/${id}/complete`, data),
  getHistory: (params) => api.get('/workouts/sessions', { params }),
  getSession: (id) => api.get(`/workouts/sessions/${id}`),
};

export const nutritionService = {
  getFoods: (params) => api.get('/nutrition/foods', { params }),
  addFood: (data) => api.post('/nutrition/foods', data),
  logMeal: (data) => api.post('/nutrition/meals', data),
  getTodayMeals: () => api.get('/nutrition/meals/today'),
  getMealHistory: (params) => api.get('/nutrition/meals/history', { params }),
  deleteMeal: (id) => api.delete(`/nutrition/meals/${id}`),
  getDietPlans: () => api.get('/nutrition/diet-plans'),
  createDietPlan: (data) => api.post('/nutrition/diet-plans', data),
};

export const progressService = {
  logWeight: (data) => api.post('/progress/weight', data),
  getWeightHistory: () => api.get('/progress/weight'),
  logWater: (amount) => api.post('/progress/water', { amount }),
  getTodayWater: () => api.get('/progress/water/today'),
  getWaterHistory: (days) => api.get('/progress/water/history', { params: { days } }),
  logSleep: (data) => api.post('/progress/sleep', data),
  getSleepHistory: (days) => api.get('/progress/sleep', { params: { days } }),
  getAnalytics: (days) => api.get('/progress/analytics', { params: { days } }),
  exportUserData: () => api.get('/progress/export'),
};

export const goalService = {
  getGoals: (params) => api.get('/goals', { params }),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

export const challengeService = {
  getChallenges: () => api.get('/challenges'),
  joinChallenge: (id) => api.post(`/challenges/${id}/join`),
  updateProgress: (id, progress) => api.put(`/challenges/${id}/progress`, { progress }),
};

export const adminService = {
  getStatistics: () => api.get('/admin/statistics'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createExercise: (data) => api.post('/admin/exercises', data),
  updateExercise: (id, data) => api.put(`/admin/exercises/${id}`, data),
  deleteExercise: (id) => api.delete(`/admin/exercises/${id}`),
  createFood: (data) => api.post('/admin/foods', data),
  updateFood: (id, data) => api.put(`/admin/foods/${id}`, data),
  deleteFood: (id) => api.delete(`/admin/foods/${id}`),
  createChallenge: (data) => api.post('/admin/challenges', data),
  deleteChallenge: (id) => api.delete(`/admin/challenges/${id}`),
};
