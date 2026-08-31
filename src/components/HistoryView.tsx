'use client';

import React from 'react';
import { HistoryItem, VerificationState } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onNavigateHome: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onNavigateHome,
}) => {
  const getVerificationTitle = (state: VerificationState): string => {
    switch (state) {
      case 'STANDARD_IDENTIFIED':
        return 'BIS Standard Identified';
      case 'INCONCLUSIVE':
        return 'Information Insufficient';
      case 'BIS_MISMATCH':
        return 'BIS Mismatch';
      default:
        return 'Analysis Result';
    }
  };

  const getBadgeStyle = (state: VerificationState) => {
    switch (state) {
      case 'STANDARD_IDENTIFIED':
        return 'bg-primary-fixed/60 text-primary border-primary-fixed-dim';
      case 'INCONCLUSIVE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'BIS_MISMATCH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-surface-container text-on-surface border-outline-variant';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[28px]">history</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-2">
          Activity &amp; Analysis{' '}
          <span className="text-gradient">History</span>
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md">
          Review your completed product analyses and standards inquiries from this session.
        </p>
      </div>

      {/* History Items or Empty State */}
      {history.length === 0 ? (
        <div className="glass-card rounded-[28px] p-8 sm:p-12 text-center flex flex-col items-center w-full max-w-lg border border-white/80 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-[32px]">manage_search</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-1">
            No Previous Analyses Yet
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mb-6 max-w-xs leading-relaxed">
            Upload an image or ask a question about BIS standards to see your results recorded here.
          </p>
          <button
            onClick={onNavigateHome}
            className="btn-gradient text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>Start New Analysis</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center px-2 mb-1">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {history.length} {history.length === 1 ? 'Record' : 'Records'} Found
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Clear History</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {history.map((item, idx) => (
              <div
                key={item.id || idx}
                className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/80 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-low overflow-hidden shrink-0 border border-outline-variant/30 flex items-center justify-center relative shadow-inner">
                    {item.imageInfo?.previewUrl ? (
                      <img
                        src={item.imageInfo.previewUrl}
                        alt={item.data.product_name || 'Item'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full p-2.5 flex items-center justify-center bg-gradient-to-tr from-primary-fixed/40 to-secondary-fixed/40">
                        <img
                          src="/logo.png"
                          alt="NexVision"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-on-surface truncate">
                        {item.data.product_name || item.query || 'Product Analysis'}
                      </span>
                    </div>

                    {item.query && item.imageInfo && (
                      <p className="text-xs text-primary font-medium truncate mb-1">
                        &quot;{item.query}&quot;
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-outline">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {item.timestamp}
                      </span>
                      {item.data.standard_identified && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] font-semibold text-on-surface-variant">
                            {item.data.standard_identified}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Badge & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/10">
                  <span
                    className={`px-3 py-1 rounded-full border text-[11px] font-bold ${getBadgeStyle(
                      item.data.verification_state
                    )}`}
                  >
                    {getVerificationTitle(item.data.verification_state)}
                  </span>

                  <button
                    onClick={() => onSelectHistoryItem(item)}
                    className="px-3.5 py-1.5 rounded-xl btn-gradient text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>View</span>
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
