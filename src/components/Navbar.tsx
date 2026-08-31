'use client';

import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  historyCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  historyCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm sticky top-0 z-50 transition-all duration-300 w-full">
      <div className="flex justify-between items-center w-full px-3 sm:px-6 md:px-10 py-2.5 sm:py-3 max-w-[1200px] mx-auto">
        {/* Brand Logo with Official Eagle Logo */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
          aria-label="NexVision Home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center p-0.5 sm:p-1 shadow-sm border border-outline-variant/30 group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/logo.png"
              alt="NexVision Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-[19px] font-extrabold tracking-tight text-on-surface leading-tight">
              NEX<span className="text-secondary-container text-gradient">VISION</span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-semibold text-outline tracking-wider uppercase hidden xs:inline-block">
              AI Standards Platform
            </span>
          </div>
        </button>

        {/* Center Nav Links (Desktop / Tablet) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => handleTabClick('home')}
            className={`font-semibold text-sm px-2 py-1 transition-all duration-200 ${
              activeTab === 'home'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleTabClick('history')}
            className={`font-semibold text-sm px-2 py-1 transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabClick('about')}
            className={`font-semibold text-sm px-2 py-1 transition-all duration-200 ${
              activeTab === 'about'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Pill (Desktop / Tablet) */}
          <button
            onClick={() => handleTabClick('history')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-primary-fixed text-primary border-primary'
                : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px]">
                {historyCount}
              </span>
            )}
          </button>

          {/* About Icon Button */}
          <button
            onClick={() => handleTabClick('about')}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors shadow-inner ${
              activeTab === 'about'
                ? 'bg-primary text-white'
                : 'bg-primary-fixed text-primary-fixed-variant hover:bg-primary-fixed-dim'
            }`}
            title="About Platform"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">info</span>
          </button>

          {/* Mobile Hamburger Toggle Button (< md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface border border-outline-variant/30"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white/95 backdrop-blur-2xl border-b border-outline-variant/30 px-4 py-3 shadow-lg flex flex-col gap-2 animate-slide-up">
          <button
            onClick={() => handleTabClick('home')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
              activeTab === 'home'
                ? 'bg-primary-fixed text-primary'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">home</span>
              Home (Upload &amp; Analyze)
            </span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>

          <button
            onClick={() => handleTabClick('history')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
              activeTab === 'history'
                ? 'bg-primary-fixed text-primary'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Analysis History
            </span>
            {historyCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px]">
                {historyCount}
              </span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('about')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
              activeTab === 'about'
                ? 'bg-primary-fixed text-primary'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              About Platform &amp; Standards
            </span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      )}
    </header>
  );
};
