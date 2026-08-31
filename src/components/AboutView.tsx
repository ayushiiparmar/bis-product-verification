'use client';

import React from 'react';

interface AboutViewProps {
  onNavigateHome: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-slide-up">
      {/* Hero Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-white p-2.5 shadow-xl border border-outline-variant/30 mb-3 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="NexVision Official Logo"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed/60 text-primary text-xs font-bold uppercase tracking-wider mb-2.5 border border-primary-fixed-dim/40 shadow-sm">
          SMART INDIA HACKATHON • VISION SYSTEM
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-2">
          About <span className="text-gradient">NexVision</span>
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
          An AI-assisted platform combining computer vision, standards retrieval (RAG), and rule-based verification to map consumer products to Bureau of Indian Standards (BIS).
        </p>
      </div>

      {/* Section 1: Purpose & Mission */}
      <div className="w-full glass-card rounded-[28px] p-6 sm:p-8 mb-6 border border-white/80 shadow-lg">
        <div className="flex items-center gap-3 mb-3 text-primary">
          <span className="material-symbols-outlined text-[26px]">flag</span>
          <h2 className="text-lg font-bold text-on-surface">Platform Purpose</h2>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          NexVision is engineered to bridge the gap between physical consumer goods and standard compliance knowledge. By leveraging multi-modal visual recognition and semantic standards retrieval, consumers, inspectors, and businesses can instantly identify applicable Indian Standards (IS), inspect physical attributes, and review evidence-backed compliance clauses.
        </p>
      </div>

      {/* Section 2: High-Level Frozen Architecture Workflow */}
      <div className="w-full glass-card rounded-[28px] p-6 sm:p-8 mb-6 border border-white/80 shadow-lg">
        <div className="flex items-center gap-3 mb-4 text-secondary">
          <span className="material-symbols-outlined text-[26px]">account_tree</span>
          <h2 className="text-lg font-bold text-on-surface">System Architecture &amp; Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-surface/70 border border-outline-variant/20 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold">
              1
            </div>
            <h3 className="text-xs font-bold text-on-surface">Multi-Modal Ingestion</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Processes high-resolution product imagery and natural language inquiries through specialized vision feature extraction and intent routing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-surface/70 border border-outline-variant/20 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary text-xs font-bold">
              2
            </div>
            <h3 className="text-xs font-bold text-on-surface">Standards RAG &amp; Rules</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Retrieves exact Indian Standard documentation, CRS schedules, and applies deterministic dimensional &amp; safety validation rules.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-surface/70 border border-outline-variant/20 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary text-xs font-bold">
              3
            </div>
            <h3 className="text-xs font-bold text-on-surface">Explanation &amp; Citations</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Synthesizes an evidence-backed rationale, confidence score, and traceable citations referencing official standard clauses.
            </p>
          </div>
        </div>

        {/* Text Diagram Box */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-[11px] font-mono text-on-surface-variant overflow-x-auto leading-relaxed">
          <div className="font-bold text-primary mb-1">DATA FLOW:</div>
          <div>User Input (Image + Query) → Vision AI / Intent Router → Standards RAG + BIS Services → Evidence Layer → Verification Rules → [STANDARD_IDENTIFIED | INCONCLUSIVE | BIS_MISMATCH] → Explanation LLM → React Frontend</div>
        </div>
      </div>

      {/* Section 3: The Three Verification States */}
      <div className="w-full glass-card rounded-[28px] p-6 sm:p-8 mb-6 border border-white/80 shadow-lg">
        <div className="flex items-center gap-3 mb-4 text-tertiary">
          <span className="material-symbols-outlined text-[26px]">rule</span>
          <h2 className="text-lg font-bold text-on-surface">The 3 Verification States</h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* State 1 */}
          <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary-fixed-dim/40 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-xs font-bold text-primary">BIS Standard Identified</h3>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-primary-fixed-dim text-primary">
                  STANDARD_IDENTIFIED
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                The visual and technical parameters clearly map to an active Indian Standard (IS) within the BIS registry.
              </p>
            </div>
          </div>

          {/* State 2 */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-xs font-bold text-amber-800">Information Insufficient</h3>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-800">
                  INCONCLUSIVE
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Rating labels, markings, or angles are obscured, preventing unambiguous standard identification.
              </p>
            </div>
          </div>

          {/* State 3 */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">warning</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-xs font-bold text-rose-800">BIS Mismatch</h3>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-rose-300 text-rose-800">
                  BIS_MISMATCH
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Observed physical traits, dimensions, or declared specifications conflict with mandatory standard provisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Regulatory Compliance & Disclaimer */}
      <div className="w-full glass-card rounded-[28px] p-6 sm:p-7 mb-8 border border-amber-200/80 bg-amber-50/40 shadow-md">
        <div className="flex items-center gap-2.5 mb-2 text-amber-800">
          <span className="material-symbols-outlined text-[22px]">gavel</span>
          <h3 className="text-sm font-bold">Regulatory Notice &amp; Disclaimer</h3>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          NexVision provides AI-assisted image analysis and standards information for educational, investigative, and benchmarking purposes. <strong>This platform does not constitute official Bureau of Indian Standards (BIS) certification, conformity assessment, or statutory regulatory approval.</strong> Formal compliance requires certified laboratory testing in accordance with BIS procedures.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center pb-4">
        <button
          onClick={onNavigateHome}
          className="btn-gradient text-white text-sm font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-primary-container/30 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Return to Analysis Home</span>
        </button>
      </div>
    </div>
  );
};
