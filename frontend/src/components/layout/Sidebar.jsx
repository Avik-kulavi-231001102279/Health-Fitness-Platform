import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Dumbbell, UtensilsCrossed, Droplets, Moon,
  CheckCircle2, TrendingUp, Target, Bot, Settings,
  Sun, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import AnimatedLogo from '../common/AnimatedLogo';

const userNav = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Nutrition', path: '/nutrition', icon: UtensilsCrossed },
  { name: 'Workouts', path: '/workout', icon: Dumbbell },
  { name: 'Water Tracker', path: '/water', icon: Droplets },
  { name: 'Sleep', path: '/sleep', icon: Moon },
  { name: 'Habits', path: '/habits', icon: CheckCircle2 },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
  { name: 'Goals & Challenges', path: '/goals', icon: Target },
  { name: 'AI Coach', path: '/ai-coach', icon: Bot },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 dark:border-dark-800 flex items-center justify-between">
        {!collapsed ? (
          <AnimatedLogo size="md" to="/dashboard" />
        ) : (
          <AnimatedLogo size="sm" showText={false} to="/dashboard" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-400"
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {userNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
              ${isActive(item.path)
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            title={collapsed ? item.name : undefined}
          >
            <item.icon
              size={19}
              className={isActive(item.path) ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}
            />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-100 dark:border-dark-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800 transition"
          title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={19} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
