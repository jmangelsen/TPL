import React from 'react';
import { motion } from 'motion/react';
import { FileText, Lock, Database, Map as MapIcon, HardHat, Zap } from 'lucide-react';

const BriefingCard = ({ title, date, category, icon: Icon, summary }: any) => (
  <div className="p-8 bg-white border border-tpl-ink/10 hover:border-tpl-ink/30 transition-colors flex flex-col gap-4 group cursor-pointer">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tpl-steel">{category}</span>
      <span className="text-xs font-mono text-tpl-slate">{date}</span>
    </div>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-tpl-bg border border-tpl-ink/5 flex items-center justify-center shrink-0 text-tpl-ink">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2 group-hover:text-tpl-accent transition-colors">{title}</h3>
        <p className="text-sm text-tpl-slate leading-relaxed">{summary}</p>
      </div>
    </div>
  </div>
);

export const IntelligenceArchive = () => {
  return (
    <div className="min-h-screen bg-tpl-bg py-24 px-6 relative overflow-hidden">
      {/* Background Seal */}
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 w-[600px] h-[600px] opacity-[0.02] pointer-events-none">
        <img src="/tpl-seal.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-tpl-ink text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <Lock size={14} className="text-tpl-accent" />
            Subscriber Access
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8">Intelligence Archive</h1>
          <p className="text-tpl-slate text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-serif italic">
            "Restricted access briefings, supply chain trackers, and permitting case studies for operators navigating the physical layer."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-tpl-steel mb-6 border-b border-tpl-ink/10 pb-4">Latest Briefings</h2>
            <BriefingCard 
              title="The Transformer Bottleneck: Lead Times Extend to 120 Weeks"
              date="2026.04.02"
              category="Supply Chain"
              icon={HardHat}
              summary="Analysis of the high-voltage transformer market, identifying key constraints in raw materials and specialized labor that are delaying gigawatt-scale campus deployments."
            />
            <BriefingCard 
              title="Dillon Rule States vs. Local Zoning Boards"
              date="2026.03.28"
              category="Permitting"
              icon={MapIcon}
              summary="A comparative study of data center permitting friction in Virginia versus emerging secondary markets, focusing on local pushback against water usage."
            />
            <BriefingCard 
              title="Behind-the-Meter Generation Economics"
              date="2026.03.15"
              category="Power"
              icon={Zap}
              summary="Evaluating the capital expenditure and regulatory hurdles of deploying dedicated natural gas turbines and micro-nuclear for hyperscale sites."
            />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-tpl-steel mb-6 border-b border-tpl-ink/10 pb-4">Data Trackers</h2>
              <div className="space-y-4">
                <div className="p-6 bg-tpl-ink text-white flex items-center justify-between group cursor-pointer hover:bg-tpl-slate transition-colors">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-tpl-accent" />
                    <span className="font-bold text-sm">Grid Interconnection Queue</span>
                  </div>
                  <FileText size={16} className="opacity-50 group-hover:opacity-100" />
                </div>
                <div className="p-6 bg-tpl-ink text-white flex items-center justify-between group cursor-pointer hover:bg-tpl-slate transition-colors">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-tpl-accent" />
                    <span className="font-bold text-sm">Cooling Water Consumption Index</span>
                  </div>
                  <FileText size={16} className="opacity-50 group-hover:opacity-100" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border border-tpl-ink/10">
              <h3 className="font-bold mb-4">Analyst Access</h3>
              <p className="text-sm text-tpl-slate leading-relaxed mb-6">
                Subscribers can request specific deep-dives into regional constraints or vendor supply chains.
              </p>
              <button className="w-full py-3 border border-tpl-ink text-xs font-bold uppercase tracking-widest hover:bg-tpl-ink hover:text-white transition-colors">
                Request Briefing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
