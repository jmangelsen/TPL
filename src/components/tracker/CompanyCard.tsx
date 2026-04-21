import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../lib/marketTrackerData';
import { ArrowRight, Activity, Info, ExternalLink } from 'lucide-react';
import { categoryTagColor } from '../../lib/statusColors';

const getTagTooltip = (tag: string) => {
  const lowerTag = tag.toLowerCase();
  if (lowerTag.includes('power')) return "Signals related to grid interconnection, megawatt delivery, and power‑purchase structure.";
  if (lowerTag.includes('cooling')) return "Signals related to liquid cooling, thermal design limits, and water/air tradeoffs.";
  if (lowerTag.includes('land') || lowerTag.includes('permitting')) return "Signals related to land acquisition, zoning, water rights, and construction permitting timelines.";
  return undefined;
};

export const CompanyCard = ({ 
  company, 
  latestNews,
  index = 0,
  total = 3
}: { 
  company: Company, 
  latestNews?: any,
  index?: number,
  total?: number
}) => {
  const [imgError, setImgError] = useState(false);

  // Calculate offset for flowing topography
  const step = 100 / (total > 1 ? total - 1 : 1);
  const basePos = index * (step * 0.5);

  return (
    <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-6 flex flex-col h-full hover:border-[#3182ce]/50 transition-all group interactive-card relative overflow-hidden shadow-sm">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          {company.logoUrl && !imgError ? (
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center p-1 shrink-0 border border-[#dcd9d5]">
              <img 
                src={company.logoUrl} 
                alt={company.logoAlt || `${company.name} logo`} 
                className="max-w-full max-h-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-[#3182ce]/10 border border-[#3182ce]/20 rounded-sm flex items-center justify-center shrink-0">
              <span className="text-[#3182ce] text-[10px] font-bold">{company.ticker.substring(0, 4)}</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-tight group-hover:text-[#3182ce] transition-colors">{company.name}</h3>
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest">
              <span className="text-[#3182ce] font-bold">{company.ticker}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{company.exchange}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 ml-2">
          <div className="text-sm font-bold text-slate-900">{company.stockPrice.split(' ')[0]}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">Cap: {company.marketCap.split(' ')[0]}</div>
        </div>
      </div>
      
      <p className="text-[11px] text-slate-600 mb-6 flex-grow leading-relaxed">
        {company.role}
      </p>

      <div className="bg-white rounded p-3 mb-6 border border-[#dcd9d5]">
        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 group/tooltip relative">
          <Activity size={10} />
          Physical-Layer Signal
          <Info size={10} className="text-slate-400 cursor-help" />
          <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-white border border-[#dcd9d5] text-slate-700 text-[10px] normal-case tracking-normal rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
            Curated, forward‑looking updates that specifically impact power, cooling, land, networking, or capacity constraints for AI data centers.
          </div>
        </div>
        {latestNews ? (
          <a href={latestNews.url} target="_blank" rel="noopener noreferrer" className="block group/news">
            <p className="text-[11px] text-slate-700 group-hover/news:text-[#3182ce] transition-colors line-clamp-2 mb-1">
              {latestNews.headline}
            </p>
            <div className="flex items-center gap-2 text-[8px] text-slate-500 uppercase tracking-widest">
              <span>{latestNews.source}</span>
              <span>•</span>
              <span>{Math.floor((Date.now() - new Date(latestNews.publishedAt).getTime()) / (1000 * 60 * 60))}h ago</span>
            </div>
          </a>
        ) : (
          <p className="text-[11px] text-slate-600 italic">"{company.latestActivity}"</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {company.constraintExposure.map(tag => {
          const tooltip = getTagTooltip(tag);
          const lowerTag = tag.toLowerCase() as keyof typeof categoryTagColor;
          const colorConfig = categoryTagColor[lowerTag];
          return (
            <div key={tag} className="relative group/tag">
              <span 
                className="status-label"
                style={{
                  '--status-color': colorConfig?.color ?? undefined,
                  '--status-color-bg': colorConfig?.bg ?? undefined,
                  '--status-color-border': colorConfig?.border ?? undefined,
                } as React.CSSProperties}
              >
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
        className="mt-auto flex flex-col items-center justify-center gap-1 w-full py-3 bg-[#171614] hover:bg-[#0f3638] text-[#f9f8f4] transition-all group/btn rounded-sm"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]">
          Open Infrastructure Deep‑Dive <ArrowRight size={12} />
        </div>
        <div className="text-[8px] text-slate-400 group-hover/btn:text-white/80 uppercase tracking-widest">
          View ticker, capacity signals, and risk notes
        </div>
      </Link>
      </div>
    </div>
  );
};
