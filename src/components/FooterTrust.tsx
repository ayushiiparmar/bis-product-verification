'use client';

import React from 'react';

export const FooterTrust: React.FC = () => {
  return (
    <footer className="w-full mt-auto pt-8 sm:pt-10 pb-6 flex flex-col items-center gap-3.5 sm:gap-4 z-10 px-2">
      {/* Privacy Capsule - Fluid wrapping */}
      <div className="glass-panel px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl sm:rounded-full flex flex-col xs:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs font-medium text-on-surface-variant border border-white/60 shadow-sm max-w-md w-full text-center xs:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[16px]">lock</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-on-surface text-[11px] sm:text-[12px] leading-tight">
              Your data is secure and private.
            </span>
            <span className="text-[10px] sm:text-[11px] text-outline leading-tight">
              We do not store your uploaded images.
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 hidden xs:inline-block">
          verified
        </span>
      </div>

      {/* Trust Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-8 text-on-surface-variant text-[11px] sm:text-xs font-semibold">
        <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[16px] text-primary">
            verified_user
          </span>
          <span>Secure</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-outline-variant hidden xs:block" />
        <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[16px] text-primary">
            lock
          </span>
          <span>Private</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-outline-variant hidden xs:block" />
        <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[16px] text-primary">
            memory
          </span>
          <span>AI Powered</span>
        </div>
      </div>

      <div className="text-[10px] sm:text-[11px] text-outline font-medium text-center">
        NexVision AI Analysis Platform • SIH Smart Vision System
      </div>
    </footer>
  );
};
