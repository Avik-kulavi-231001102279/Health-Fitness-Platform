import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Droplets, CheckCircle2, Bot } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Nutrition', path: '/nutrition', icon: UtensilsCrossed },
  { name: 'Workouts', path: '/workout', icon: Dumbbell },
  { name: 'Water', path: '/water', icon: Droplets },
  { name: 'Habits', path: '/habits', icon: CheckCircle2 },
  { name: 'AI Coach', path: '/ai-coach', icon: Bot },
];

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-t border-gray-100 dark:border-dark-800 px-1 py-1 pb-safe shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[50px]
              ${isActive(item.path)
                ? 'text-primary-600 dark:text-primary-400 font-bold scale-105'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
          >
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 1.8} />
            <span className="text-[10px] tracking-tight">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
