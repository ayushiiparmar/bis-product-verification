'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AnalysisData, ImageFileInfo, VerificationState } from '../types';
import { FeatureList } from './FeatureList';

interface ResultCardProps {
  data: AnalysisData;
  imageInfo?: ImageFileInfo | null;
  query?: string;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  data,
  imageInfo,
  query,
  onReset,
}) => {
  useEffect(() => {
    if (data.verification_state === 'STANDARD_IDENTIFIED') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a78bfa', '#64a8fe', '#f170b4', '#10b981'],
        });
      } catch {
        // ignore
      }
    }
  }, [data.verification_state]);

  const handleDownloadReport = () => {
    const reportData = {
      query: query || null,
      image_name: imageInfo?.name || null,
      analysis_date: new Date().toISOString(),
      verification_state: data.verification_state,
      standard_identified: data.standard_identified || 'N/A',
      confidence_score: data.confidence_score,
      explanation: data.explanation,
      evidence: data.evidence,
      citations: data.citations,
      detected_details: {
        product_name: data.product_name,
        category: data.category,
        material: data.material,
        color: data.color,
        brand: data.brand,
        condition: data.condition,
        visible_features: data.visible_features,
      },
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = imageInfo ? imageInfo.name.replace(/\.[^/.]+$/, '') : 'standards-query';
    a.download = `nexvision-report-${baseName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const title = `NexVision Analysis: ${data.product_name || 'Standards Query'}`;
    const text = `Verification Result: ${getVerificationTitle(data.verification_state)}. Standard: ${
      data.standard_identified || 'N/A'
    }`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(`${title}\n${text}`);
      alert('Analysis summary copied to clipboard!');
    }
  };

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

  const getVerificationBadgeConfig = (state: VerificationState) => {
    switch (state) {
      case 'STANDARD_IDENTIFIED':
        return {
          badgeClass: 'bg-primary-fixed/60 text-primary border-primary-fixed-dim',
          icon: 'verified',
          cardBorder: 'border-t-primary',
          themeBg: 'bg-primary-fixed/30',
          textColor: 'text-primary',
        };
      case 'INCONCLUSIVE':
        return {
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: 'help_outline',
          cardBorder: 'border-t-amber-400',
          themeBg: 'bg-amber-50',
          textColor: 'text-amber-700',
        };
      case 'BIS_MISMATCH':
        return {
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: 'warning',
          cardBorder: 'border-t-rose-500',
          themeBg: 'bg-rose-50',
          textColor: 'text-rose-700',
        };
      default:
        return {
          badgeClass: 'bg-surface-container text-on-surface border-outline-variant',
          icon: 'info',
          cardBorder: 'border-t-outline',
          themeBg: 'bg-surface',
          textColor: 'text-on-surface',
        };
    }
  };

  const badgeConfig = getVerificationBadgeConfig(data.verification_state);

  return (
    <div className="w-full max-w-[1120px] mx-auto flex flex-col items-center">
      {/* Header Banner - Responsive Sizing */}
      <div className="text-center mb-6 sm:mb-8 flex flex-col items-center gap-2.5 sm:gap-3 animate-slide-up px-2">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${badgeConfig.themeBg} flex items-center justify-center ${badgeConfig.textColor} shadow-inner transition-transform duration-300 hover:scale-105`}>
          <span className="material-symbols-outlined text-[28px] sm:text-[32px]">{badgeConfig.icon}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text-primary">
          {imageInfo ? 'Analysis Complete' : 'Query Results & Standards Answer'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-on-surface-variant max-w-md">
          Results synthesized from visual extraction, intent understanding, standards RAG, and rules
        </p>

        {/* Query Prompt Badge */}
        {query && query.trim() && (
          <div className="mt-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 border border-outline-variant/30 text-xs sm:text-sm text-primary font-semibold shadow-sm flex items-center gap-2 max-w-full truncate animate-fade-in">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">psychology</span>
            <span className="truncate">&quot;{query}&quot;</span>
          </div>
        )}
      </div>

      {/* Main Results Container */}
      <div className="w-full glass-card rounded-[24px] sm:rounded-[28px] p-4 sm:p-7 md:p-8 flex flex-col gap-6 bg-surface-container-lowest border border-white/80 shadow-xl animate-slide-up-delay-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full">
          {/* Left Column: Image / Query Visual Container (12 cols on mobile, 5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
            {imageInfo ? (
              <>
                <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden bg-surface-container-low aspect-video sm:aspect-square w-full relative shadow-inner group">
                  <img
                    alt={data.product_name || imageInfo.name}
                    src={imageInfo.previewUrl}
                    className="w-full h-full object-contain sm:object-cover object-center absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold">
                    Analyzed Asset
                  </div>
                </div>

                {/* File Info */}
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-outline-variant/20 bg-surface/60">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-xl sm:text-2xl">description</span>
                  </div>
                  <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                    <div className="text-xs font-semibold text-primary flex items-center gap-1.5 truncate">
                      <span className="text-outline uppercase text-[10px]">File:</span>
                      <span className="text-on-surface font-bold truncate">{imageInfo.name}</span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-on-surface-variant flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                      {imageInfo.dimensions && (
                        <>
                          <span>{imageInfo.dimensions.width} × {imageInfo.dimensions.height} px</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{imageInfo.sizeFormatted}</span>
                      <span>•</span>
                      <span className="font-bold text-[10px] sm:text-[11px]">{imageInfo.extension}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-primary-fixed/30 via-white to-secondary-fixed/30 p-5 sm:p-6 border border-outline-variant/30 flex flex-col items-center justify-center text-center h-full min-h-[220px] sm:min-h-[260px] shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white p-2.5 sm:p-3 shadow-lg border border-outline-variant/20 mb-3 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="NexVision Standards Logo"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface mb-1">
                  BIS Standards Knowledge Hub
                </h3>
                <p className="text-[11px] sm:text-xs text-on-surface-variant max-w-xs leading-relaxed">
                  Query resolved using Standards RAG, Certification Info, and BIS Services retrieval layers.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Detected Details & Verification State (12 cols on mobile, 7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div>
              {/* Status Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-[20px] sm:text-[22px]">analytics</span>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                      {imageInfo ? 'Extracted Information' : 'Standards Analysis'}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-outline">Pipeline synthesized attributes</p>
                  </div>
                </div>

                <div className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border text-[11px] sm:text-xs font-bold flex items-center gap-1.5 ${badgeConfig.badgeClass} self-start sm:self-auto`}>
                  <span className="material-symbols-outlined text-[14px] sm:text-[16px]">{badgeConfig.icon}</span>
                  <span>{getVerificationTitle(data.verification_state)}</span>
                </div>
              </div>

              {/* Product Title Card */}
              {data.product_name && (
                <div className="mb-3.5 sm:mb-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-fixed/40 to-secondary-fixed/40 border border-primary-fixed-dim/30">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary">
                    {imageInfo ? 'Product Title' : 'Queried Focus'}
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-on-surface capitalize mt-0.5 truncate">
                    {data.product_name}
                  </h3>
                </div>
              )}

              {/* Attribute Rows */}
              <div className="flex flex-col gap-0 divide-y divide-outline-variant/15 text-xs sm:text-sm">
                {data.category && (
                  <div className="flex items-center justify-between py-2.5 sm:py-3 dashed-line">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">sell</span>
                      </div>
                      <span className="font-medium text-on-surface-variant">Category:</span>
                    </div>
                    <span className="font-bold text-primary capitalize truncate max-w-[180px]">
                      {data.category}
                    </span>
                  </div>
                )}

                {data.material && (
                  <div className="flex items-center justify-between py-2.5 sm:py-3 dashed-line">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-sm">
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">layers</span>
                      </div>
                      <span className="font-medium text-on-surface-variant">Material:</span>
                    </div>
                    <span className="font-bold text-secondary capitalize text-right truncate max-w-[200px]">
                      {data.material}
                    </span>
                  </div>
                )}

                {data.color && (
                  <div className="flex items-center justify-between py-2.5 sm:py-3 dashed-line">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm">
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">palette</span>
                      </div>
                      <span className="font-medium text-on-surface-variant">Color:</span>
                    </div>
                    <span className="font-bold text-tertiary capitalize text-right truncate max-w-[180px]">
                      {data.color}
                    </span>
                  </div>
                )}

                {data.brand && (
                  <div className="flex items-center justify-between py-2.5 sm:py-3 dashed-line">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-fixed/50 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">shield</span>
                      </div>
                      <span className="font-medium text-on-surface-variant">Brand:</span>
                    </div>
                    <span className="font-bold text-on-surface capitalize truncate max-w-[180px]">
                      {data.brand}
                    </span>
                  </div>
                )}

                {data.condition && (
                  <div className="flex items-center justify-between py-2.5 sm:py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shadow-sm">
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">verified</span>
                      </div>
                      <span className="font-medium text-on-surface-variant">Condition:</span>
                    </div>
                    <span className="font-bold text-on-surface capitalize">
                      {data.condition}
                    </span>
                  </div>
                )}
              </div>

              {/* Features List */}
              {data.visible_features && data.visible_features.length > 0 && (
                <FeatureList features={data.visible_features} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification State & Identified Standard Card */}
      <div className={`w-full glass-card rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 mt-6 flex flex-col md:flex-row gap-5 sm:gap-6 items-stretch md:items-center justify-between bg-surface-container-lowest border-t-[4px] ${badgeConfig.cardBorder} shadow-lg animate-slide-up-delay-2`}>
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full md:w-1/2">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${badgeConfig.themeBg} flex items-center justify-center ${badgeConfig.textColor} shrink-0 border border-outline-variant/30 shadow-inner`}>
            <span className="material-symbols-outlined text-[26px] sm:text-[30px]">{badgeConfig.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-on-surface mb-0.5">
              {getVerificationTitle(data.verification_state)}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {data.verification_state === 'STANDARD_IDENTIFIED' &&
                'Applicable BIS Indian Standard identified from visual and technical parameters.'}
              {data.verification_state === 'INCONCLUSIVE' &&
                'Insufficient information or obscured markings prevent unambiguous standard mapping.'}
              {data.verification_state === 'BIS_MISMATCH' &&
                'Observed visual attributes conflict with prescribed standard constraints.'}
            </p>
          </div>
        </div>

        <div className={`w-full md:w-1/2 ${badgeConfig.themeBg} rounded-2xl p-4 sm:p-5 border border-outline-variant/30 flex flex-col gap-2.5 sm:gap-3 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1.5 font-bold text-xs sm:text-sm ${badgeConfig.textColor}`}>
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{badgeConfig.icon}</span>
              <span>{getVerificationTitle(data.verification_state)}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-outline-variant/30 text-on-surface">
              Pipeline Output
            </span>
          </div>

          {typeof data.confidence_score === 'number' && (
            <div className="flex items-center justify-between dashed-line pb-2 text-xs sm:text-sm">
              <span className="text-on-surface-variant">Confidence Score</span>
              <span className={`font-extrabold ${badgeConfig.textColor}`}>
                {data.confidence_score}%
              </span>
            </div>
          )}

          <div className="flex flex-col xs:flex-row xs:items-center justify-between pt-0.5 text-xs sm:text-sm gap-1">
            <span className="text-on-surface-variant shrink-0">Standard Matched:</span>
            <span className="font-bold text-on-surface xs:text-right truncate">
              {data.standard_identified || 'No explicit standard identified'}
            </span>
          </div>
        </div>
      </div>

      {/* Explanation LLM Synthesis Section */}
      {data.explanation && (
        <div className="w-full glass-card rounded-[24px] p-5 sm:p-7 mt-5 sm:mt-6 bg-surface-container-lowest border border-white/80 shadow-md animate-slide-up-delay-3">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3 text-primary">
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">psychology</span>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">
              Explanation &amp; Standards Reasoning
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-surface/60 p-3.5 sm:p-4 rounded-xl border border-outline-variant/20">
            {data.explanation}
          </p>
        </div>
      )}

      {/* Evidence Layer Section */}
      {data.evidence && data.evidence.length > 0 && (
        <div className="w-full glass-card rounded-[24px] p-5 sm:p-7 mt-5 sm:mt-6 bg-surface-container-lowest border border-white/80 shadow-md animate-slide-up-delay-4">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">find_in_page</span>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">
              Evidence Points (Retrieval &amp; Rules)
            </h3>
          </div>
          <ul className="flex flex-col gap-2 pl-1 sm:pl-2">
            {data.evidence.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                <span className="w-5 h-5 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 text-[10px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations / Sources Section */}
      {data.citations && data.citations.length > 0 && (
        <div className="w-full glass-card rounded-[24px] p-5 sm:p-7 mt-5 sm:mt-6 bg-surface-container-lowest border border-white/80 shadow-md animate-slide-up-delay-4">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3 text-tertiary">
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">menu_book</span>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">Citations &amp; Standard Sources</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {data.citations.map((cite, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl bg-surface/70 border border-outline-variant/20 flex flex-col justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-0.5">{cite.title}</h4>
                  {cite.source && (
                    <p className="text-[10px] sm:text-[11px] text-outline mb-0.5">{cite.source}</p>
                  )}
                  {cite.section && (
                    <p className="text-[10px] sm:text-[11px] font-semibold text-primary">{cite.section}</p>
                  )}
                </div>
                {cite.url && (
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-secondary hover:underline mt-1"
                  >
                    <span>View Reference</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Buttons - Mobile full-width stacking */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 animate-slide-up-delay-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto btn-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-primary-container/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-98 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">restart_alt</span>
          <span>{imageInfo ? 'Analyze Another Image / Ask' : 'Ask Another Question'}</span>
        </button>

        <div className="flex flex-col xs:flex-row w-full sm:w-auto gap-2.5 sm:gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-tertiary-container/60 text-tertiary hover:bg-tertiary-fixed/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all bg-white shadow-sm hover:-translate-y-0.5 active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">download</span>
            <span>Download Report</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-secondary-container/60 text-secondary hover:bg-secondary-fixed/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all bg-white shadow-sm hover:-translate-y-0.5 active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">share</span>
            <span>Share Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};
