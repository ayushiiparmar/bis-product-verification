'use client';

import React, { useState } from 'react';
import { ImageFileInfo } from '../types';

interface ImagePreviewProps {
  imageInfo: ImageFileInfo;
  initialQuery?: string;
  onChangeImage: () => void;
  onAnalyze: (query?: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageInfo,
  initialQuery = '',
  onChangeImage,
  onAnalyze,
}) => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-slide-up">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-2">
          Image{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary-container via-primary-container to-secondary-container">
            Preview
          </span>
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant">
          Review your image and query before starting the standards pipeline
        </p>
      </div>

      {/* Preview Card */}
      <div className="glass-card rounded-[28px] overflow-hidden w-full mb-6 p-3 sm:p-5 flex flex-col shadow-lg border border-white/60">
        {/* Image Area */}
        <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-[20px] overflow-hidden bg-surface-container-low flex items-center justify-center group shadow-inner">
          <img
            alt={imageInfo.name}
            src={imageInfo.previewUrl}
            className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* File Info Card */}
        <div className="flex items-center gap-4 p-4 mt-3 bg-surface/60 rounded-2xl border border-outline-variant/20">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-outline uppercase">File:</span>
              <span className="text-sm font-bold text-on-surface truncate">
                {imageInfo.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-outline mt-1">
              <span>Size: {imageInfo.sizeFormatted}</span>
              {imageInfo.dimensions && (
                <>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span>{imageInfo.dimensions.width} × {imageInfo.dimensions.height}</span>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">
                {imageInfo.extension}
              </span>
            </div>
          </div>
        </div>

        {/* Query field preview/edit */}
        <div className="mt-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <label className="block text-xs font-semibold text-on-surface mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-primary">search</span>
            Search Query Context
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Add context or standard focus question..."
            className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant/30 text-xs sm:text-sm text-on-surface outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
        <button
          onClick={onChangeImage}
          className="w-full py-3.5 px-6 rounded-2xl border-2 border-primary/40 bg-white hover:bg-primary-fixed/20 text-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
          <span>Change Image</span>
        </button>

        <button
          onClick={() => onAnalyze(query)}
          className="w-full py-3.5 px-6 rounded-2xl btn-gradient text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 shadow-lg shadow-primary-container/30 hover:shadow-xl hover:shadow-primary-container/40"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>Analyze Image</span>
        </button>
      </div>
    </div>
  );
};
