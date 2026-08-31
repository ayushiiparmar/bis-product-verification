'use client';

import React from 'react';

interface FeatureListProps {
  features: string[];
}

export const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container rounded-2xl p-5 sm:p-6 mt-5 border border-outline-variant/20 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">
          fact_check
        </span>
        Visible Features:
      </h3>
      <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant list-disc pl-5 marker:text-primary-container">
        {features.map((feature, idx) => (
          <li key={idx} className="leading-snug capitalize">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
