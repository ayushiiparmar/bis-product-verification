'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onReset,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center animate-slide-up">
      <div className="glass-card rounded-[28px] p-6 sm:p-8 flex flex-col items-center text-center shadow-xl border border-red-100 w-full bg-white/90">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mb-4 shadow-inner animate-pulse">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
          Analysis Encountered an Issue
        </h2>

        <p className="text-sm text-on-surface-variant max-w-sm mb-6 leading-relaxed">
          {message || 'Unable to complete analysis at this time. Please check your inquiry and try again.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-md shadow-primary-container/20 hover:-translate-y-0.5 active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Retry Analysis</span>
          </button>

          <button
            onClick={onReset}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl border-2 border-outline-variant/50 bg-white hover:bg-surface-container-low text-on-surface-variant font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Start Over</span>
          </button>
        </div>
      </div>
    </div>
  );
};
