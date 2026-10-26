import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Award, Trophy, Lock, CheckCircle2, Flame, Star, Sparkles,
  Dumbbell, Droplets, UtensilsCrossed, Zap, Moon, Crown
} from 'lucide-react';

export default function Achievements() {
  const { user } = useAuth();

  const achievementsList = [
    { id: 1, name: 'First Workout Logged', desc: 'Completed and recorded your first fitness training session.', icon: Dumbbell, color: 'text-primary-500 bg-primary-500/10', xp: 50, unlocked: true },
    { id: 2, name: 'Hydration Hero', desc: 'Drank your entire daily water target in a single day.', icon: Droplets, color: 'text-cyan-500 bg-cyan-500/10', xp: 50, unlocked: true },
    { id: 3, name: 'Macro Master', desc: 'Tracked all meals within 100 kcal of your daily Mifflin-St Jeor target.', icon: UtensilsCrossed, color: 'text-orange-500 bg-orange-500/10', xp: 75, unlocked: true },
    { id: 4, name: '7-Day Streak Warrior', desc: 'Maintained an unbroken 7-day workout and activity streak.', icon: Flame, color: 'text-rose-500 bg-rose-500/10', xp: 150, unlocked: (user?.currentStreak || 0) >= 7 },
    { id: 5, name: 'Century Club', desc: 'Logged 100 sets across all workout routines.', icon: Award, color: 'text-emerald-500 bg-emerald-500/10', xp: 200, unlocked: false },
    { id: 6, name: 'Iron Will (14 Days)', desc: 'Crushed daily habits for two full consecutive weeks.', icon: Zap, color: 'text-amber-500 bg-amber-500/10', xp: 300, unlocked: (user?.currentStreak || 0) >= 14 },
    { id: 7, name: 'Recovery Guru', desc: 'Recorded 8+ hours of deep recovery sleep 5 days in a row.', icon: Moon, color: 'text-indigo-500 bg-indigo-500/10', xp: 150, unlocked: false },
    { id: 8, name: 'FitLife Legend', desc: 'Achieved your primary target weight and completed 50 workouts.', icon: Crown, color: 'text-yellow-500 bg-yellow-500/10', xp: 1000, unlocked: false }
  ];

  const totalXP = user?.totalXP || 250;
  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-dark-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold uppercase mb-2">
            <Trophy size={14} /> Gamified Milestones
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">Achievements & Badges</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Earn experience points (XP), collect rare badges, and celebrate your discipline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="card px-5 py-2.5 flex items-center gap-3 border-violet-500/30 bg-violet-500/10">
            <Trophy className="text-violet-500" size={24} />
            <div>
              <p className="text-[10px] font-bold uppercase text-violet-600 dark:text-violet-400">Total XP</p>
              <p className="text-xl font-black text-gray-900 dark:text-gray-100">{totalXP} XP</p>
            </div>
          </div>
          <div className="card px-4 py-2.5 flex items-center gap-2 border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
            <Award className="text-primary-500" size={20} />
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400">Unlocked</p>
              <p className="text-base font-black text-gray-900 dark:text-gray-100">{unlockedCount} / {achievementsList.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievementsList.map((ach) => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              className={`card p-6 flex flex-col justify-between transition-all border ${
                ach.unlocked
                  ? 'border-primary-500/30 bg-white dark:bg-dark-900 shadow-sm'
                  : 'opacity-50 border-gray-200 dark:border-dark-800 bg-gray-50 dark:bg-dark-900/40'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ach.color}`}>
                    <Icon size={24} />
                  </div>
                  {ach.unlocked ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 flex items-center gap-1">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-1.5">{ach.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {ach.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-dark-800 flex justify-between items-center text-xs">
                <span className="text-gray-400">Reward:</span>
                <span className="font-extrabold text-violet-600 dark:text-violet-400">+{ach.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
