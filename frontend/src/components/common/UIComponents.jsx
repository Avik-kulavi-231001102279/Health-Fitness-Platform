import React from 'react';
import { Inbox, AlertTriangle } from 'lucide-react';

export const LoadingSkeleton = ({ className = '', count = 1 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`skeleton h-4 rounded ${className}`} />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="skeleton h-4 w-1/3 rounded" />
    <div className="skeleton h-8 w-1/2 rounded" />
    <div className="skeleton h-3 w-full rounded" />
  </div>
);

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 text-gray-400">
      {icon || <Inbox size={56} className="text-gray-400 dark:text-gray-600" />}
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{description}</p>
    {action}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 text-amber-500">
      <AlertTriangle size={56} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Oops!</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary">Try Again</button>
    )}
  </div>
);

export const ProgressRing = ({ value, max, size = 80, strokeWidth = 6, color = '#22c55e', children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
          className="progress-ring-bg" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
          stroke={color} fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || <span className="text-sm font-bold">{Math.round(percentage)}%</span>}
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, danger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card p-6 max-w-md w-full space-y-4 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
