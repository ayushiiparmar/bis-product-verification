'use client';

import React from 'react';

interface StepperProps {
  currentStep: 1 | 2 | 3;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto flex items-center justify-between mb-5 sm:mb-8 px-2 sm:px-4 relative">
      {/* Step 1: Upload */}
      <div className="flex flex-col items-center gap-1 sm:gap-1.5 z-10 relative">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 ${
            currentStep >= 1
              ? 'bg-primary-container text-white shadow-md shadow-primary-container/30'
              : 'bg-white border-2 border-outline-variant/40 text-outline'
          }`}
        >
          {currentStep > 1 ? (
            <span className="material-symbols-outlined text-[16px] sm:text-[20px]">check</span>
          ) : (
            <span>1</span>
          )}
        </div>
        <span
          className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
            currentStep >= 1 ? 'text-primary' : 'text-outline'
          }`}
        >
          Upload
        </span>
      </div>

      {/* Progress Bar 1 */}
      <div className="flex-1 h-[2px] mx-1.5 sm:mx-2 relative bg-outline-variant/30 overflow-hidden rounded">
        <div
          className={`h-full bg-primary-container transition-all duration-500 ${
            currentStep >= 2 ? 'w-full' : 'w-0'
          }`}
        />
      </div>

      {/* Step 2: Analyze */}
      <div className="flex flex-col items-center gap-1 sm:gap-1.5 z-10 relative">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 ${
            currentStep > 2
              ? 'bg-primary-container text-white shadow-md shadow-primary-container/30'
              : currentStep === 2
              ? 'bg-white border-2 border-primary text-primary shadow-md shadow-primary/20 scale-105 ring-2 sm:ring-4 ring-primary/10'
              : 'bg-white border-2 border-outline-variant/40 text-outline'
          }`}
        >
          {currentStep > 2 ? (
            <span className="material-symbols-outlined text-[16px] sm:text-[20px]">check</span>
          ) : (
            <span>2</span>
          )}
        </div>
        <span
          className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
            currentStep >= 2 ? 'text-primary' : 'text-outline'
          }`}
        >
          Analyze
        </span>
      </div>

      {/* Progress Bar 2 */}
      <div className="flex-1 h-[2px] mx-1.5 sm:mx-2 relative bg-outline-variant/30 overflow-hidden rounded">
        <div
          className={`h-full bg-primary-container transition-all duration-500 ${
            currentStep >= 3 ? 'w-full' : 'w-0'
          }`}
        />
      </div>

      {/* Step 3: Results */}
      <div className="flex flex-col items-center gap-1 sm:gap-1.5 z-10 relative">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 ${
            currentStep === 3
              ? 'bg-primary-container text-white shadow-lg shadow-primary-container/40 ring-2 sm:ring-4 ring-primary/20 scale-105'
              : 'bg-white border-2 border-outline-variant/40 text-outline'
          }`}
        >
          <span>3</span>
        </div>
        <span
          className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
            currentStep === 3 ? 'text-primary font-bold' : 'text-outline'
          }`}
        >
          Results
        </span>
      </div>
    </div>
  );
};
