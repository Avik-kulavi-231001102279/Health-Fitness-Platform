import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnimatedLogo({
  size = 'md',
  showText = true,
  to = '/',
  className = '',
  linkable = true
}) {
  // Size configurations
  const sizeMap = {
    sm: {
      box: 'w-8 h-8',
      icon: 16,
      text: 'text-lg',
      badge: 'text-[9px] px-1.5 py-0.5',
      spark: 'w-2 h-2 -top-0.5 -right-0.5'
    },
    md: {
      box: 'w-10 h-10',
      icon: 20,
      text: 'text-xl',
      badge: 'text-[10px] px-2 py-0.5',
      spark: 'w-2.5 h-2.5 -top-1 -right-1'
    },
    lg: {
      box: 'w-12 h-12',
      icon: 24,
      text: 'text-2xl',
      badge: 'text-xs px-2.5 py-0.5',
      spark: 'w-3 h-3 -top-1 -right-1'
    },
    xl: {
      box: 'w-16 h-16',
      icon: 32,
      text: 'text-3xl',
      badge: 'text-xs px-3 py-1',
      spark: 'w-3.5 h-3.5 -top-1 -right-1'
    }
  };

  const config = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Animated Icon Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Radiance Glow behind icon */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-400 blur-md pointer-events-none"
        />

        {/* Orbiting Ring Indicator */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -inset-1 rounded-2xl border border-primary-500/30 dark:border-primary-400/40 border-dashed pointer-events-none"
        />

        {/* Main Logo Container */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
          className={`relative ${config.box} rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 border border-white/20 dark:border-white/10 backdrop-blur-sm z-10 overflow-hidden`}
        >
          {/* Subtle light sweep reflection across icon */}
          <motion.div
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Dumbbell Icon with energetic micro-bobbing */}
          <motion.div
            animate={{
              rotate: [0, -8, 8, -4, 4, 0],
              y: [0, -1, 0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut'
            }}
          >
            <Dumbbell size={config.icon} strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        {/* Floating Sparkle / Energy Ping Badge */}
        <motion.span
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`absolute ${config.spark} rounded-full bg-accent-400 ring-2 ring-white dark:ring-dark-900 z-20 flex items-center justify-center shadow-sm`}
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-gray-900 dark:text-gray-100 ${config.text}`}>
            FitLife
          </span>
          <span
            className={`font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-sm shadow-primary-500/20 ${config.badge}`}
          >
            PRO
          </span>
        </div>
      )}
    </div>
  );

  if (linkable && to) {
    return (
      <Link to={to} className="inline-block transition-transform active:scale-95 focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
