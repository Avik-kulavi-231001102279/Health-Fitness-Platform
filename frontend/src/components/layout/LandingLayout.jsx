import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ArrowRight, Shield, FileText, HeartPulse, Menu, X } from 'lucide-react';
import AnimatedLogo from '../common/AnimatedLogo';

export default function LandingLayout({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Legal modals state
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | 'disclaimer' | null

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* ─── Top Sticky Navbar ─── */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-dark-900/85 backdrop-blur-md border-b border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <AnimatedLogo size="md" to="/" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <a href="#hero" className="hover:text-primary-500 transition-colors">Home</a>
            <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-500 transition-colors">How It Works</a>
            <a href="#ai-coach" className="hover:text-primary-500 transition-colors">AI Coach</a>
            <a href="#about" className="hover:text-primary-500 transition-colors">About</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <Link
                to={user?.isOnboardingDone ? "/dashboard" : "/onboarding"}
                className="hidden sm:inline-flex btn-primary items-center gap-2 py-2 px-4 text-sm"
              >
                <span>Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-2 px-4 text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900 px-4 py-4 space-y-3 animate-fade-in">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500"
            >
              How It Works
            </a>
            <a
              href="#ai-coach"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500"
            >
              AI Coach
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500"
            >
              About
            </a>

            <div className="pt-3 border-t border-gray-100 dark:border-dark-800 flex gap-2">
              {isAuthenticated ? (
                <Link
                  to={user?.isOnboardingDone ? "/dashboard" : "/onboarding"}
                  className="w-full btn-primary text-center py-2 text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-1/2 btn-secondary text-center py-2 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-1/2 btn-primary text-center py-2 text-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* ─── Section 11: Complete Footer ─── */}
      <footer className="border-t border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div>
              <div className="mb-4">
                <AnimatedLogo size="md" to="/" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                "Optimize Your Habits. Transform Your Life."
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                An intelligent AI-powered lifestyle optimization and wellness platform designed to help users track daily nutrition, calories, hydration, workouts, sleep, habits, goals, and personal progress.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-3">Platform Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard</Link></li>
                <li><Link to="/nutrition" className="hover:text-primary-500 transition-colors">Nutrition & Calorie Tracker</Link></li>
                <li><Link to="/water" className="hover:text-primary-500 transition-colors">Water Hydration Tracker</Link></li>
                <li><Link to="/workout" className="hover:text-primary-500 transition-colors">Workout Planner</Link></li>
                <li><Link to="/sleep" className="hover:text-primary-500 transition-colors">Sleep & Recovery</Link></li>
                <li><Link to="/habits" className="hover:text-primary-500 transition-colors">Habits & Streaks</Link></li>
              </ul>
            </div>

            {/* Col 3: Modules */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-3">Intelligence & Goals</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/ai-coach" className="hover:text-primary-500 transition-colors">AI Lifestyle Assistant</Link></li>
                <li><Link to="/progress" className="hover:text-primary-500 transition-colors">Progress Analytics & Export</Link></li>
                <li><Link to="/goals" className="hover:text-primary-500 transition-colors">Goals & Milestones</Link></li>
                <li><Link to="/challenges" className="hover:text-primary-500 transition-colors">Community Challenges</Link></li>
                <li><Link to="/settings" className="hover:text-primary-500 transition-colors">Account Settings</Link></li>
              </ul>
            </div>

            {/* Col 4: Legal & Health Disclaimers */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-3">Legal & Health</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <li>
                  <button
                    onClick={() => setLegalModal('disclaimer')}
                    className="hover:text-primary-500 flex items-center gap-1.5 transition-colors"
                  >
                    <HeartPulse size={14} className="text-primary-500" />
                    <span>Health & Medical Disclaimer</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModal('privacy')}
                    className="hover:text-primary-500 flex items-center gap-1.5 transition-colors"
                  >
                    <Shield size={14} className="text-primary-500" />
                    <span>Privacy & Data Isolation Policy</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModal('terms')}
                    className="hover:text-primary-500 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText size={14} className="text-primary-500" />
                    <span>Terms of Service</span>
                  </button>
                </li>
              </ul>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                FitLife Pro provides wellness tracking for educational purposes. Calculations are adult estimates and not clinical prescriptions.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-dark-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
            <p>© {new Date().getFullYear()} FitLife Pro. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-medium">MERN Stack · MongoDB Persistent Database · Tailwind CSS</p>
          </div>
        </div>
      </footer>

      {/* ─── Legal & Health Modals ─── */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-lg w-full p-6 bg-white dark:bg-dark-900 shadow-2xl border border-gray-200 dark:border-dark-700 rounded-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-dark-800 mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {legalModal === 'disclaimer' && 'Health & Medical Disclaimer'}
                {legalModal === 'privacy' && 'Privacy Policy & Data Security'}
                {legalModal === 'terms' && 'Terms of Service'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {legalModal === 'disclaimer' && (
                <>
                  <p>
                    <strong>Not Medical Advice:</strong> FitLife Pro is an educational wellness tracker. All calorie targets, macronutrient calculations, and AI lifestyle suggestions are general adult estimates derived from documented formulas like Mifflin-St Jeor.
                  </p>
                  <p>
                    <strong>Consult a Healthcare Professional:</strong> Do not begin extreme caloric deficits or intense exercise regimens without consulting a qualified medical doctor or registered dietitian, especially if you have cardiovascular conditions, metabolic disorders, or pregnancy.
                  </p>
                </>
              )}

              {legalModal === 'privacy' && (
                <>
                  <p>
                    <strong>Data Isolation:</strong> Your personal logs (nutrition, hydration, sleep, workouts, habits) are strictly tied to your authenticated user account. We enforce database-level ownership checks across every API route.
                  </p>
                  <p>
                    <strong>AI Privacy:</strong> When communicating with the AI lifestyle assistant, only sanitized non-sensitive profile parameters (goal, calorie target, water target) are transmitted. Passwords, emails, and credentials are never sent to external AI providers.
                  </p>
                  <p>
                    <strong>Data Deletion:</strong> You retain complete ownership of your data and can request complete account deletion from the Settings page at any time.
                  </p>
                </>
              )}

              {legalModal === 'terms' && (
                <>
                  <p>
                    <strong>Acceptable Use:</strong> FitLife Pro provides lifestyle tracking and fitness tools. By creating an account, you agree to use the platform in accordance with applicable laws and acknowledge that all nutritional values are approximations.
                  </p>
                  <p>
                    <strong>User Accounts:</strong> You are responsible for safeguarding your password. FitLife Pro implements industry-standard bcrypt hashing and secure JWT authentication.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setLegalModal(null)}
              className="w-full btn-primary py-2.5 text-sm"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
