'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { ImageFileInfo } from '../types';

interface ImageUploaderProps {
  onImageSelected: (info: ImageFileInfo, query?: string) => void;
  onQueryOnlySubmit: (query: string) => void;
  onError: (msg: string) => void;
  initialQuery?: string;
}

const suggestedQueries = [
  'What BIS standard applies to wireless audio & headphones?',
  'Check plug insulation requirements under IS 1293',
  'Textile shirting fabric specifications under IS 3937',
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onQueryOnlySubmit,
  onError,
  initialQuery = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [textQuery, setTextQuery] = useState(initialQuery);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Please upload a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError('Image file size exceeds the 15MB limit. Please choose a smaller image.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const extension = file.name.split('.').pop()?.toUpperCase() || 'IMAGE';

    const img = new Image();
    img.onload = () => {
      onImageSelected(
        {
          file,
          previewUrl,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          dimensions: {
            width: img.naturalWidth,
            height: img.naturalHeight,
          },
          extension,
        },
        textQuery
      );
    };
    img.onerror = () => {
      onImageSelected(
        {
          file,
          previewUrl,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          extension,
        },
        textQuery
      );
    };
    img.src = previewUrl;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textQuery.trim()) {
      onError('Please enter a query or select an image to analyze.');
      return;
    }
    onQueryOnlySubmit(textQuery.trim());
  };

  return (
    <div className="w-full flex flex-col items-center animate-slide-up">
      {/* Official NexVision Center Logo - Responsive Sizing */}
      <div className="flex flex-col items-center mb-4 sm:mb-6 relative z-20">
        <div className="relative group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-container via-secondary-container to-tertiary-container blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 scale-110" />
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 shadow-2xl border border-white flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <img
              src="/logo.png"
              alt="NexVision Official Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="text-center mb-5 sm:mb-6 max-w-xl mx-auto flex flex-col items-center px-1">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-primary-fixed/60 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3.5 border border-primary-fixed-dim/40 shadow-sm">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-ping" />
          SCAN • ANALYZE • DISCOVER
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-on-surface mb-2 tracking-tight">
          Upload or <span className="text-gradient">Ask Anything</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Upload a product image, ask about BIS Indian Standards, or provide both for precision analysis.
        </p>
      </div>

      {/* Upload Drop Zone Card - Responsive Container */}
      <div className="w-full max-w-[640px] mx-auto upload-area p-3.5 sm:p-6 md:p-7 rounded-[24px] sm:rounded-[32px] shadow-[0_12px_48px_rgba(167,139,250,0.15)] border border-white/80 hover:border-primary-fixed-dim/80 hover:shadow-[0_16px_56px_rgba(167,139,250,0.22)] transition-all duration-500 mb-6 relative overflow-hidden group">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative upload-dashed p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[210px] sm:min-h-[250px] cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragging
              ? 'bg-primary-fixed/30 scale-[1.02] border-primary'
              : 'bg-white/40 hover:bg-white/70 group-hover:scale-[1.01]'
          }`}
        >
          {/* Laser Scan Line Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px] sm:rounded-[24px]">
            <div className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80 shadow-[0_0_15px_rgba(167,139,250,0.9)] animate-scan" />
          </div>

          {/* Center Icon with Sparkles */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-primary-fixed to-secondary-fixed flex items-center justify-center mb-3 sm:mb-4 shadow-inner relative group-hover:scale-110 transition-transform duration-500 z-10">
            <svg
              className="absolute -top-1 right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-container animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z" />
            </svg>
            <svg
              className="absolute top-2.5 -left-1 w-2.5 sm:w-3 h-2.5 sm:h-3 text-tertiary-container animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ animationDelay: '0.6s' }}
            >
              <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z" />
            </svg>
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-30" />

            <span className="material-symbols-outlined text-[30px] sm:text-[38px] text-primary">
              image
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-on-surface mb-0.5 sm:mb-1 z-10">
            Upload product image here
          </h3>
          <p className="text-xs sm:text-sm font-medium text-on-surface-variant z-10 mb-1.5 sm:mb-2">
            Drag &amp; drop or click to browse
          </p>
          <span className="inline-block text-[9px] sm:text-[10px] font-semibold text-outline px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/30 z-10">
            JPG, PNG, WebP up to 15MB
          </span>
        </div>

        {/* Text Query Input Form - Responsive flex wrap */}
        <form onSubmit={handleQuerySubmit} className="mt-4 sm:mt-5 relative flex flex-col gap-2">
          <label className="block text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
            Text Query / Ask About Standards
          </label>
          <div className="relative flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="e.g. What BIS standard applies to headphones or plugs?"
              className="w-full pl-3.5 pr-3 xs:pr-24 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-on-surface placeholder:text-outline/70 transition-all outline-none shadow-sm"
            />
            <button
              type="submit"
              disabled={!textQuery.trim()}
              className="xs:absolute xs:right-1.5 px-4 py-2.5 xs:py-2 rounded-xl btn-gradient text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-1 hover:opacity-95 shrink-0"
            >
              <span>Ask</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-[10px] font-semibold text-outline">Suggestions:</span>
            {suggestedQueries.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTextQuery(sug)}
                className="text-[9px] sm:text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/80 hover:bg-primary-fixed/40 text-on-surface-variant hover:text-primary border border-outline-variant/20 transition-all truncate max-w-full text-left"
              >
                {sug}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
