'use client';

import React, { useState, useEffect } from 'react';
import { ImageFileInfo } from '../types';

interface LoadingStateProps {
  imageInfo?: ImageFileInfo | null;
  query?: string;
}

const visualStages = [
  { label: 'Input received (Image / Query)', icon: 'check' },
  { label: 'Analyzing visual & intent features', icon: 'analytics' },
  { label: 'Retrieving standards evidence (RAG)', icon: 'search_insights' },
  { label: 'Verifying standard criteria & BIS rules', icon: 'rule' },
  { label: 'Synthesizing answer & explanation', icon: 'edit_note' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ imageInfo, query }) => {
  const [activeStage, setActiveStage] = useState(1);

  // Progressive visual indicator sequence while awaiting the API promise
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev < visualStages.length - 1 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-2">
          {imageInfo ? 'Analyzing Product...' : 'Processing Query...'}
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant">
          Running visual extraction, intent routing, and standards RAG
        </p>
      </div>

      {/* Main Container */}
      <div className="glass-card rounded-[32px] overflow-hidden w-full p-6 sm:p-8 flex flex-col items-center text-center shadow-xl border border-white/80 relative">
        {/* Animated Visual Target (Image or Holographic Logo) */}
        {imageInfo ? (
          <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-surface-container-low mb-6 shadow-inner flex items-center justify-center">
            <img
              alt="Analyzing target"
              src={imageInfo.previewUrl}
              className="w-full h-full object-cover filter brightness-90"
            />
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #674bb5 1px, transparent 1px), linear-gradient(to bottom, #674bb5 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#38bdf8] scanner-laser" />
            </div>
            <div className="absolute w-28 h-28 border-2 border-dashed border-primary-container/80 rounded-xl animate-pulse pointer-events-none flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-white bg-primary/80 px-2 py-0.5 rounded uppercase">
                VISION RAG
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-28 h-28 rounded-3xl bg-white/90 p-3 mb-6 shadow-xl border border-white flex items-center justify-center animate-pulse">
            <img
              src="/logo.png"
              alt="NexVision Processing"
              className="w-full h-full object-contain drop-shadow"
            />
            <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 animate-ping opacity-25" />
          </div>
        )}

        {/* Query badge if provided */}
        {query && query.trim() && (
          <div className="mb-5 px-4 py-2 rounded-full bg-surface-container text-xs font-semibold text-primary border border-outline-variant/30 flex items-center gap-2 max-w-md truncate shadow-sm">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span className="truncate">&quot;{query}&quot;</span>
          </div>
        )}

        {/* Visual Pipeline Stages */}
        <div className="w-full max-w-md bg-surface/70 rounded-2xl p-4 border border-outline-variant/20 mb-4 text-left">
          <div className="flex flex-col gap-2.5">
            {visualStages.map((stage, idx) => {
              const isCompleted = idx < activeStage;
              const isCurrent = idx === activeStage;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'text-primary font-semibold'
                      : isCurrent
                      ? 'text-on-surface font-bold'
                      : 'text-outline/70 font-medium'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : isCurrent
                        ? 'bg-primary-container text-white animate-pulse'
                        : 'border border-outline-variant text-outline'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[12px]">check</span>
                    ) : isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="flex-1 truncate">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <span className="text-[11px] text-outline font-medium">
          Awaiting backend pipeline synthesis...
        </span>
      </div>
    </div>
  );
};
