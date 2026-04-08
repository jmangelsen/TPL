import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../lib/marketTrackerData';
import { ArrowRight, Activity, Info } from 'lucide-react';

const getTagTooltip = (tag: string) => {
  const lowerTag = tag.toLowerCase();
  if (lowerTag.includes('power')) return "Signals related to grid interconnection, megawatt delivery, and power‑purchase structure.";
  if (lowerTag.includes('cooling')) return "Signals related to liquid cooling, thermal design limits, and water/air tradeoffs.";
  if (lowerTag.includes('land') || lowerTag.includes('permitting')) return "Signals related to land acquisition, zoning, water rights, and construction permitting timelines.";
  return undefined;
};

export const CompanyCard = ({ company }: { company: Company }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#0f1a24]/50 border border-white/5 p-6 flex flex-col h-full hover:border-[#3b82f6]/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          {company.logoUrl && !imgError ? (
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center p-1 shrink-0">
              <img 
                src={company.logoUrl} 
                alt={company.logoAlt || `${company.name} logo`} 
                className="max-w-full max-h-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-sm flex items-center justify-center shrink-0">
              <span className="text-[#3b82f6] text-[10px] font-bold">{company.ticker.substring(0, 3)}</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-tight group-hover:text-[#3b82f6] transition-colors">{company.name}</h3>
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest">
              <span className="text-[#3b82f6] font-bold">{company.ticker}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500">{company.exchange}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 ml-2">
          <div className="text-sm font-bold text-white">{company.stockPrice.split(' ')[0]}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">Cap: {company.marketCap.split(' ')[0]}</div>
        </div>
      </div>
      
      <p className="text-[11px] text-slate-400 mb-6 flex-grow leading-relaxed">
        {company.role}
      </p>

      <div className="bg-white/5 rounded p-3 mb-6 border border-white/5">
        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 group/tooltip relative">
          <Activity size={10} />
          Physical-Layer Signal
          <Info size={10} className="text-slate-600 cursor-help" />
          <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-[#1a2633] border border-white/10 text-slate-300 text-[10px] normal-case tracking-normal rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
            Curated, forward‑looking updates that specifically impact power, cooling, land, networking, or capacity constraints for AI data centers.
          </div>
        </div>
        <p className="text-[11px] text-slate-300 italic">"{company.latestActivity}"</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {company.constraintExposure.map(tag => {
          const tooltip = getTagTooltip(tag);
          return (
            <div key={tag} className="relative group/tag">
              <span className="px-2 py-1 bg-white/5 text-slate-400 text-[9px] uppercase tracking-widest rounded border border-white/5 cursor-default block">
                {tag}
              </span>
              {tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-[#1a2633] border border-white/10 text-slate-300 text-[10px] normal-case tracking-normal rounded opacity-0 group-hover/tag:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl text-center">
                  {tooltip}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link 
        to={`/market-tracker/${company.slug}`}
        className="mt-auto flex flex-col items-center justify-center gap-1 w-full py-3 bg-white/5 hover:bg-[#3b82f6] text-white transition-all group/btn"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]">
          Open Infrastructure Deep‑Dive <ArrowRight size={12} />
        </div>
        <div className="text-[8px] text-slate-400 group-hover/btn:text-white/80 uppercase tracking-widest">
          View ticker, capacity signals, and risk notes
        </div>
      </Link>
    </div>
  );
};
