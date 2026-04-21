import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MONITOR_CONFIG: Record<string, { title: string, overviewTitle: string, regionsTitle: string, embedText: string }> = {
  'power': {
    title: 'Grid Monitor',
    overviewTitle: 'Live Grid Overview',
    regionsTitle: 'Tracked Markets and Grid Regions',
    embedText: 'Embed live grid maps and dashboards here.'
  },
  'cooling': {
    title: 'System Monitor',
    overviewTitle: 'Cooling System Overview',
    regionsTitle: 'Tracked Markets and Cooling Regions',
    embedText: 'Embed live cooling maps and dashboards here.'
  },
  'water': {
    title: 'Resource Monitor',
    overviewTitle: 'Water Resource Overview',
    regionsTitle: 'Tracked Markets and Water Regions',
    embedText: 'Embed live water maps and dashboards here.'
  },
  'permitting': {
    title: 'Process Monitor',
    overviewTitle: 'Permitting Friction Overview',
    regionsTitle: 'Tracked Markets and Permitting Regions',
    embedText: 'Embed live permitting maps and dashboards here.'
  },
  'supply-chain': {
    title: 'Infrastructure Monitor',
    overviewTitle: 'Infrastructure Supply Overview',
    regionsTitle: 'Tracked Markets and Supply Regions',
    embedText: 'Embed live supply chain maps and dashboards here.'
  },
  'labor': {
    title: 'Workforce Monitor',
    overviewTitle: 'Labor Capacity Overview',
    regionsTitle: 'Tracked Markets and Labor Regions',
    embedText: 'Embed live labor maps and dashboards here.'
  }
};

export const ConstraintMonitorChild = ({ constraintId: propConstraintId }: { constraintId?: string }) => {
  const params = useParams<{ constraintId: string }>();
  const location = useLocation();
  const constraintId = propConstraintId || params.constraintId;
  const config = constraintId ? MONITOR_CONFIG[constraintId] : null;

  const backPath = `/${constraintId}`;
  const backLabel = `Back to ${constraintId?.replace('-', ' ')} Constraint`;

  if (!config) {
    return (
      <div className="min-h-screen bg-[#1a2633] text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Monitor Not Found</h1>
          <Link to="/monitor" className="text-[#3b82f6] hover:underline">Return to Monitor</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white relative pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a2633]/95 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to={backPath} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{backLabel}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
              TPL Intelligence
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-20 relative z-10">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight uppercase">
            {config.title}
          </h1>
        </div>

        <div className="space-y-12">
          {/* Live Overview */}
          <section className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">{config.overviewTitle}</h2>
            <div className="aspect-video bg-[#1a2633] border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
              </div>
              <p className="text-slate-400 text-sm relative z-10 font-mono">[{config.embedText}]</p>
            </div>
          </section>

          {/* Tracked Markets */}
          <section className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">{config.regionsTitle}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              [Placeholder content for tracked markets and regions. Data tables or regional summaries will be populated here.]
            </p>
          </section>

          {/* Key Real-Time Metrics */}
          <section className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Key Real-Time Metrics</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              [Placeholder content for key real-time metrics. Live data feeds and indicators will be populated here.]
            </p>
          </section>

          {/* Current Conditions vs Baseline */}
          <section className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Current Conditions vs. Q2 2026 Baseline</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              [Placeholder content comparing current conditions against the Q2 2026 baseline. Trend analysis will be populated here.]
            </p>
          </section>

          {/* Methodological Notes */}
          <section className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Methodological Notes & Disclaimer</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              [Placeholder content for methodological notes and disclaimers regarding the data sources and analysis.]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
