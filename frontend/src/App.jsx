import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import LandingLayout from './components/layout/LandingLayout';

// Route Guards
import {
  ProtectedRoute,
  PublicRoute,
  OnboardedRoute,
  AdminRoute
} from './components/common/RouteGuards';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import FitnessOnboarding from './pages/onboarding/FitnessOnboarding';
import Dashboard from './pages/dashboard/Dashboard';
import Workouts from './pages/workout/Workouts';
import DietNutrition from './pages/nutrition/DietNutrition';
import HealthMetrics from './pages/health/HealthMetrics';
import WaterTracker from './pages/health/WaterTracker';
import SleepTracker from './pages/health/SleepTracker';
import HabitsTracker from './pages/habits/HabitsTracker';
import AICoach from './pages/ai/AICoach';
import Analytics from './pages/progress/Analytics';
import Goals from './pages/goals/Goals';
import Challenges from './pages/goals/Challenges';
import Achievements from './pages/goals/Achievements';
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
          <Routes>
            {/* Public Landing Route */}
            <Route
              path="/"
              element={
                <LandingLayout>
                  <Landing />
                </LandingLayout>
              }
            />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Onboarding Route (Requires Auth, but redirects once done) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <FitnessOnboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected Fitness Dashboard Routes (Requires Onboarding Completed) */}
            <Route
              path="/dashboard"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/workout"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Workouts />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Workouts />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <DietNutrition />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/water"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <WaterTracker />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/sleep"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <SleepTracker />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/habits"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <HabitsTracker />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/ai-coach"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <AICoach />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <HealthMetrics />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Analytics />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Goals />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Challenges />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Achievements />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <OnboardedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </OnboardedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </AdminRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;