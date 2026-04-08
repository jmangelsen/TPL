import React, { useState } from 'react';
import { Company } from '../../lib/marketTrackerData';
import { Lock } from 'lucide-react';

export const StubCard = ({ company }: { company: Company }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#0f1a24]/30 border border-white/5 p-6 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-white/5 text-slate-500 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
        Deep-Dive In Progress
      </div>
      
      <div className="mb-4 pr-32 flex items-start gap-3">
        {company.logoUrl && !imgError ? (
          <div className="w-8 h-8 bg-white/50 rounded-sm flex items-center justify-center p-1 shrink-0 grayscale opacity-50">
            <img 
              src={company.logoUrl} 
              alt={company.logoAlt || `${company.name} logo`} 
              className="max-w-full max-h-full object-contain mix-blend-multiply"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center shrink-0">
            <span className="text-slate-500 text-[10px] font-bold">{company.ticker.substring(0, 3)}</span>
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-tight">{company.name}</h3>
          <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest opacity-50">
            <span className="text-[#3b82f6]">{company.ticker}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">{company.exchange}</span>
          </div>
        </div>
      </div>
      
      <p className="text-[11px] text-slate-500 mb-6 flex-grow leading-relaxed opacity-80">
        {company.role}
      </p>

      <div className="bg-white/5 rounded p-3 mb-6 border border-white/5 opacity-60">
        <p className="text-[11px] text-slate-500 italic">"{company.latestActivity}"</p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          Core physical‑layer thesis and risk notes are being drafted. Ticker remains included here for completeness of the infrastructure map.
        </p>
        <div className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 text-slate-600 text-[10px] font-bold uppercase tracking-[0.25em] cursor-not-allowed">
          <Lock size={12} />
          Deep-dive in progress
        </div>
      </div>
    </div>
  );
};
