import React, { useState } from 'react';
import { Company } from '../../lib/marketTrackerData';
import { Lock } from 'lucide-react';

export const StubCard = ({ 
  company,
  index = 0,
  total = 3
}: { 
  company: Company,
  index?: number,
  total?: number
}) => {
  const [imgError, setImgError] = useState(false);

  // Calculate offset for flowing topography
  const step = 100 / (total > 1 ? total - 1 : 1);
  const basePos = index * (step * 0.5);

  return (
    <div className="bg-[#f9f8f5]/50 border border-[#dcd9d5] p-6 flex flex-col h-full relative overflow-hidden group shadow-sm">
      <div className="relative z-10 flex flex-col h-full">
        <div className="absolute top-0 right-0 bg-white text-slate-500 text-[9px] font-bold uppercase tracking-widest px-3 py-1 border border-[#dcd9d5]">
        Deep-Dive In Progress
      </div>
      
      <div className="mb-4 pr-32 flex items-start gap-3">
        {company.logoUrl && !imgError ? (
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center p-1 shrink-0 grayscale opacity-50 border border-[#dcd9d5]">
            <img 
              src={company.logoUrl} 
              alt={company.logoAlt || `${company.name} logo`} 
              className="max-w-full max-h-full object-contain mix-blend-multiply"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-white border border-[#dcd9d5] rounded-sm flex items-center justify-center shrink-0">
            <span className="text-slate-400 text-[10px] font-bold">{company.ticker.substring(0, 4)}</span>
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-tight">{company.name}</h3>
          <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest opacity-50">
            <span className="text-[#3182ce]">{company.ticker}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">{company.exchange}</span>
          </div>
        </div>
      </div>
      
      <p className="text-[11px] text-slate-500 mb-6 flex-grow leading-relaxed opacity-80">
        {company.role}
      </p>

      <div className="bg-white rounded p-3 mb-6 border border-[#dcd9d5] opacity-60">
        <p className="text-[11px] text-slate-500 italic">"{company.latestActivity}"</p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          Core physical‑layer thesis and risk notes are being drafted. Ticker remains included here for completeness of the infrastructure map.
        </p>
        <div className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-[#dcd9d5] text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] cursor-not-allowed rounded-sm">
          <Lock size={12} />
          Deep-dive in progress
        </div>
      </div>
      </div>
    </div>
  );
};
