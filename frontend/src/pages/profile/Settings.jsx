import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { userService, progressService } from '../../services/services';
import {
  Settings as SettingsIcon, Sun, Moon, Lock, Bell,
  Trash2, ShieldAlert, Download, Sliders, VolumeX, CheckCircle, Save
} from 'lucide-react';
import { ConfirmDialog } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Unit & Lifestyle Preferences
  const [preferredUnits, setPreferredUnits] = useState(user?.preferredUnits || 'metric');
  const [availableWorkoutTime, setAvailableWorkoutTime] = useState(user?.availableWorkoutTime || 45);
  const [dailySleepTarget, setDailySleepTarget] = useState(user?.dailySleepTarget || 8);
  const [prefLoading, setPrefLoading] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    hydration: user?.notifications?.hydration ?? true,
    meals: user?.notifications?.meals ?? true,
    workouts: user?.notifications?.workouts ?? true,
    habits: user?.notifications?.habits ?? true,
    weeklyReport: user?.notifications?.weeklyReport ?? true
  });

  const [quietHours, setQuietHours] = useState({
    enabled: user?.quietHours?.enabled ?? false,
    start: user?.quietHours?.start || '22:00',
    end: user?.quietHours?.end || '07:00'
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Data export state
  const [exportLoading, setExportLoading] = useState(false);

  // Delete modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Save Unit & Lifestyle Preferences
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setPrefLoading(true);
    try {
      const { data } = await userService.updateProfile({
        preferredUnits,
        availableWorkoutTime: Number(availableWorkoutTime),
        dailySleepTarget: Number(dailySleepTarget),
        notifications,
        quietHours
      });
      if (data?.user) updateUser(data.user);
      toast.success('Preferences saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setPrefLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const res = await progressService.exportUserData();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data?.data || res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `fitlife_pro_data_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Your data archive has been exported!');
    } catch (err) {
      toast.error('Failed to export data archive');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      toast.success('Your account has been deleted');
      logout();
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-gray-100 dark:border-dark-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preferences, theme mode, notification rules, data management, and security credentials
        </p>
      </div>

      {/* Theme Preference */}
      <div className="card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              {theme === 'dark' ? <Moon size={18} className="text-primary-500" /> : <Sun size={18} className="text-yellow-500" />}
              <span>Interface Appearance</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Currently using <strong className="capitalize">{theme}</strong> mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2"
          >
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* Units & Lifestyle Preferences Form */}
      <form onSubmit={handleSavePreferences} className="card p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Sliders size={18} className="text-primary-500" />
            <span>Units & Lifestyle Preferences</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure system units and everyday routine targets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="label text-xs">Measurement Units</label>
            <select
              value={preferredUnits}
              onChange={(e) => setPreferredUnits(e.target.value)}
              className="input text-xs"
            >
              <option value="metric">Metric (kg, cm, ml)</option>
              <option value="imperial">Imperial (lbs, in, fl oz)</option>
            </select>
          </div>

          <div>
            <label className="label text-xs">Available Workout Time</label>
            <select
              value={availableWorkoutTime}
              onChange={(e) => setAvailableWorkoutTime(e.target.value)}
              className="input text-xs"
            >
              <option value={15}>15 Minutes (Express)</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Standard)</option>
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes (Advanced)</option>
            </select>
          </div>

          <div>
            <label className="label text-xs">Daily Sleep Target (hours)</label>
            <input
              type="number"
              min={5}
              max={12}
              step={0.5}
              value={dailySleepTarget}
              onChange={(e) => setDailySleepTarget(e.target.value)}
              className="input text-xs"
            />
          </div>
        </div>

        {/* Notification Reminders */}
        <div className="border-t border-gray-100 dark:border-dark-800 pt-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-primary-500" />
            <h4 className="text-sm font-bold">Automated In-App Reminders</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-dark-800 hover:bg-gray-50/50 dark:hover:bg-dark-850 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.hydration}
                onChange={(e) => setNotifications(prev => ({ ...prev, hydration: e.target.checked }))}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium">Hydration Reminders</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-dark-800 hover:bg-gray-50/50 dark:hover:bg-dark-850 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.meals}
                onChange={(e) => setNotifications(prev => ({ ...prev, meals: e.target.checked }))}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium">Meal Logging Alerts</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-dark-800 hover:bg-gray-50/50 dark:hover:bg-dark-850 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.workouts}
                onChange={(e) => setNotifications(prev => ({ ...prev, workouts: e.target.checked }))}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium">Daily Workout Prompts</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-dark-800 hover:bg-gray-50/50 dark:hover:bg-dark-850 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.habits}
                onChange={(e) => setNotifications(prev => ({ ...prev, habits: e.target.checked }))}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium">Habit Streak Reminders</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-dark-800 hover:bg-gray-50/50 dark:hover:bg-dark-850 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReport: e.target.checked }))}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium">Weekly Progress Digest</span>
            </label>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="border-t border-gray-100 dark:border-dark-800 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VolumeX size={16} className="text-indigo-500" />
              <div>
                <h4 className="text-sm font-bold">Quiet Hours (Do Not Disturb)</h4>
                <p className="text-[11px] text-gray-500">Mute non-critical notifications while you rest</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quietHours.enabled}
                onChange={(e) => setQuietHours(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 max-w-xs text-xs pt-2">
              <div>
                <label className="label text-[11px]">Start Time</label>
                <input
                  type="time"
                  value={quietHours.start}
                  onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                  className="input text-xs"
                />
              </div>
              <div>
                <label className="label text-[11px]">End Time</label>
                <input
                  type="time"
                  value={quietHours.end}
                  onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                  className="input text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={prefLoading}
          className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2"
        >
          <Save size={14} />
          <span>{prefLoading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </form>

      {/* Password Security */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Lock size={18} className="text-primary-500" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="label text-xs">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input text-xs"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="label text-xs">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input text-xs"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="label text-xs">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="input text-xs"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="btn-primary py-2.5 px-6 text-xs font-bold"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Data Export & Portability */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Download size={18} className="text-primary-500" />
              <span>Data Portability & Export</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-lg leading-relaxed">
              Download a complete JSON archive of all your authorized personal data, including workout history, daily nutrition records, sleep logs, hydration history, and habit streaks.
            </p>
          </div>

          <button
            onClick={handleExportData}
            disabled={exportLoading}
            className="btn-secondary py-2.5 px-5 text-xs font-bold flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Download size={14} />
            <span>{exportLoading ? 'Exporting...' : 'Export JSON Archive'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 dark:border-red-900/50 space-y-4 bg-red-50/20 dark:bg-red-950/10">
        <div className="flex items-start gap-3">
          <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={22} />
          <div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Permanently delete your account and all associated fitness logs, workouts, meals, and streak records. This operation cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-4 btn-danger py-2 px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Delete My FitLife Account</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Permanently Delete Account?"
        message="Are you sure you want to delete your FitLife Pro account? All workout logs, diet history, and metrics will be wiped permanently."
        danger={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
