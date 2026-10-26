import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, User, Settings, LogOut, Bot, Sparkles, ChevronDown } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import AnimatedLogo from '../common/AnimatedLogo';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'FP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-800 px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Left side: Mobile logo or welcome message */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <AnimatedLogo size="sm" to="/dashboard" />
        </div>
        <div className="hidden sm:block">
          <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {user?.name || 'Athlete'}
          </h2>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Coach Quick Action Button */}
        <Link
          to="/ai-coach"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold shadow-md shadow-primary-500/20 hover:opacity-95 transition-all active:scale-95"
          title="Open AI Lifestyle Coach"
        >
          <Bot size={15} />
          <span className="hidden sm:inline">AI Coach</span>
        </Link>

        {/* Notification Center */}
        <NotificationCenter />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            aria-label="User Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {getInitials(user?.name)}
            </div>
            <ChevronDown size={14} className="hidden sm:block text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-900 border border-gray-100 dark:border-dark-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-800">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800"
                >
                  <User size={15} className="text-gray-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800"
                >
                  <Settings size={15} className="text-gray-400" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-gray-100 dark:border-dark-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
