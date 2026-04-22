import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Lock,
  Download,
  Bell,
  Search,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { signInWithGoogle } from '../firebase';
import { CONSTRAINT_STATUS_COLORS, CONSTRAINT_CATEGORY_COLORS, getStatusColor } from '../lib/brandColors';

interface Constraint {
  category: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'constrained' | 'elevated' | 'under-pressure' | 'tightening' | 'capacity-limited' | 'neutral';
  system: string;
  updatedQuarter: string;
}

const constraints: Constraint[] = [
  { category: 'Permitting', label: 'Permit Cycle', value: '14.2 Months', trend: 'up', status: 'constrained', system: 'Governance', updatedQuarter: 'Q2 2026' },
  { category: 'Power', label: 'Interconnection Queue', value: '5.8 Years', trend: 'up', status: 'elevated', system: 'Utility', updatedQuarter: 'Q2 2026' },
  { category: 'Supply Chain', label: 'Transformer Lead Time', value: '118 Weeks', trend: 'stable', status: 'constrained', system: 'Hardware', updatedQuarter: 'Q2 2026' },
  { category: 'Supply Chain', label: 'Switchgear Backlog', value: '72 Weeks', trend: 'up', status: 'tightening', system: 'Hardware', updatedQuarter: 'Q2 2026' },
  { category: 'Water', label: 'Water Risk', value: '7.4 Index', trend: 'up', status: 'under-pressure', system: 'Ecological', updatedQuarter: 'Q2 2026' },
  { category: 'Power', label: 'Utility Capacity', value: 'Constrained', trend: 'up', status: 'constrained', system: 'Utility', updatedQuarter: 'Q2 2026' },
  { category: 'Cooling', label: 'Cooling Pressure', value: 'Rising', trend: 'up', status: 'under-pressure', system: 'Thermal', updatedQuarter: 'Q2 2026' },
  { category: 'Labor', label: 'Labor Tightness', value: '-12%', trend: 'down', status: 'capacity-limited', system: 'Human Capital', updatedQuarter: 'Q2 2026' },
  { category: 'Land', label: 'Site Control Friction', value: 'High', trend: 'up', status: 'constrained', system: 'Real Estate', updatedQuarter: 'Q2 2026' },
  { category: 'Power', label: 'Substation Capacity', value: 'Limited', trend: 'stable', status: 'capacity-limited', system: 'Utility', updatedQuarter: 'Q2 2026' },
  { category: 'Land', label: 'Land Entitlement Friction', value: 'High', trend: 'up', status: 'constrained', system: 'Real Estate', updatedQuarter: 'Q2 2026' },
  { category: 'Power', label: 'Power Availability Window', value: 'Tightening', trend: 'up', status: 'tightening', system: 'Utility', updatedQuarter: 'Q2 2026' },
];

const StatusBadge = ({ status }: { status: Constraint['status'] }) => {
  if (status === 'neutral') return null;

  const color = getStatusColor(status);

  let label = status.replace('-', ' ');
  if (status === 'capacity-limited') label = 'Capacity Limited';
  if (status === 'under-pressure') label = 'Under Pressure';
  if (status === 'tightening') label = 'Tightening';
  if (status === 'constrained') label = 'Constrained';
  if (status === 'elevated') label = 'Elevated';

  return (
    <span 
      className="status-label"
      style={{
        '--status-color': color,
        '--status-color-bg': `${color}1f`, // 12% opacity
        '--status-color-border': `${color}4d`, // 30% opacity
      } as React.CSSProperties}
    >
      {label}
    </span>
  );
};

const TrendIcon = ({ trend }: { trend: Constraint['trend'] }) => {
  if (trend === 'up') return <span title="Tightening"><ArrowUpRight size={12} className="text-rose-500/60" /></span>;
  if (trend === 'down') return <span title="Easing"><ArrowDownRight size={12} className="text-emerald-500/60" /></span>;
  return <span title="Stable"><Minus size={12} className="text-slate-600" /></span>;
};

export const ConstraintMonitor = ({ user, isSubscribed }: { user: any, isSubscribed: boolean }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  
  const categories = ['All', 'Power', 'Water', 'Land', 'Permitting', 'Supply Chain', 'Labor'];
  const statuses = ['All', 'Constrained', 'Elevated', 'Under-Pressure', 'Tightening', 'Limited'];

  const filteredConstraints = constraints.filter(c => {
    const categoryMatch = activeCategory === 'All' || c.category === activeCategory;
    const statusMatch = activeStatus === 'All' || c.status === activeStatus.toLowerCase();
    return categoryMatch && statusMatch;
  });

  const visibleCount = filteredConstraints.length;

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Hero Atmosphere - Matching Reports */}
      <div className="relative h-[40vh] flex items-center overflow-hidden border-b border-white/5 bg-[#0f1a24]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-xl opacity-10 pointer-events-none">
          <img 
            src="/tpl-seal.png" 
            alt="TPL Seal" 
            className="w-full h-auto object-contain invert drop-shadow-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2633] via-[#1a2633]/60 to-transparent" />
        
        <div className="max-w-[1600px] mx-auto px-6 relative z-10 w-full">
          <span className="inline-block px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-[#3b82f6]/20">
            Quarterly Intelligence
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-[0.9] tracking-tighter uppercase max-w-4xl">
            Constraint Monitor
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-serif italic mb-4">
            Quarterly index of water, power, interconnection, cooling, land, and labor constraints across major AI data center markets.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Coverage: 12 constraint systems across major AI data center markets. Updated Q2 2026.
          </p>
        </div>
      </div>

      {/* System Header - Compact & Functional - Re-themed */}
      <div className="sticky top-20 z-40 bg-[#1a2633]/95 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Monitor:</span>
                <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Coverage:</span>
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">12 Constraint Systems Tracked</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/monitor/report"
              className="flex items-center gap-2 px-3 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 hover:bg-[#3b82f6]/20 transition-all group cursor-pointer"
            >
              <FileText size={12} className="text-[#3b82f6]" />
              <span className="text-[9px] font-bold text-[#3b82f6] uppercase tracking-widest transition-colors">
                Read Q2 2026 Report
              </span>
              <ArrowUpRight size={10} className="text-[#3b82f6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 border border-white/5 hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                title="Export Data"
              >
                <Download size={14} />
              </button>
              <button 
                className="p-2 border border-white/5 hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                title="System Alerts"
              >
                <Bell size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Intelligence Grid - High Density */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          <div className="space-y-12">
            {/* System Overview / KPI Bar - Integrated, not standalone cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#dcd9d5] border border-[#dcd9d5]">
              {[
                { label: 'Permit Cycle', value: '14.2m', trend: 'up', status: 'constrained', isIndex: false },
                { label: 'Grid Queue', value: '5.8y', trend: 'up', status: 'elevated', isIndex: false },
                { label: 'Supply Backlog', value: '118w', trend: 'stable', status: 'constrained', isIndex: false },
                { label: 'Water Risk', value: '7.4', trend: 'up', status: 'under-pressure', isIndex: true },
              ].map((kpi, i) => (
                <div key={i} className="bg-[#f9f8f5] p-8 flex flex-col justify-between min-h-[140px] hover:bg-white transition-all group relative overflow-hidden">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3182ce]">{kpi.label}</span>
                      <TrendIcon trend={kpi.trend as any} />
                    </div>
                    <div className="flex flex-col mt-6 gap-3">
                      <div className="flex flex-col">
                        <span className="text-4xl font-bold text-slate-900 tracking-tight leading-none">{kpi.value}</span>
                        {kpi.isIndex && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-2">Index</span>
                        )}
                      </div>
                      <div className="w-fit mt-1">
                        <StatusBadge status={kpi.status as any} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter & Search Bar - Functional */}
            <div className="flex flex-col gap-6 border-b border-white/5 pb-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest shrink-0 mt-2 sm:mt-0">System:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all border ${
                          activeCategory === cat 
                            ? 'bg-[#3b82f6] border-[#3b82f6] text-white' 
                            : 'bg-transparent border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative shrink-0">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search constraints..." 
                    className="bg-white/5 border border-white/5 pl-12 pr-6 py-2.5 text-[10px] font-bold uppercase tracking-widest w-full sm:w-64 focus:outline-none focus:border-[#3b82f6]/50 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex items-start sm:items-center gap-4">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest shrink-0 mt-2 sm:mt-0">Status:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => setActiveStatus(status)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all border ${
                        activeStatus === status 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-transparent border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Constraint Table - The Core Information Surface */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#dcd9d5] text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                      <th className="px-8 py-5">Constraint Signal</th>
                      <th className="px-8 py-5">Metric & TPL Status</th>
                      <th className="px-8 py-5">Trend</th>
                      <th className="px-8 py-5">System</th>
                      <th className="px-8 py-5 text-right">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConstraints.map((c, i) => (
                      <tr key={i} className="border-b border-[#dcd9d5] hover:bg-white transition-colors group interactive-row">
                        <td className="px-8 py-8">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-[#3182ce] transition-colors uppercase tracking-tight">{c.label}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: CONSTRAINT_CATEGORY_COLORS[c.category as keyof typeof CONSTRAINT_CATEGORY_COLORS] || '#64748b' }} 
                              />
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{c.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-bold text-slate-900">{c.value}</span>
                            <div className="w-fit">
                              <StatusBadge status={c.status} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <TrendIcon trend={c.trend} />
                        </td>
                        <td className="px-8 py-8">
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{c.system}</span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.updatedQuarter}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Intelligence Panel */}
          <aside className="space-y-12">
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-10 space-y-10 relative overflow-hidden shadow-sm">
              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between border-b border-[#dcd9d5] pb-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Field Intelligence</h3>
                  <span className="text-[9px] font-bold text-[#3182ce] uppercase tracking-widest">Notes</span>
                </div>

                <div className="space-y-10">
                  {[
                    { 
                      type: 'System Alert', 
                      system: 'Power', 
                      time: 'Q2 2026', 
                      content: 'U.S. interconnection queues exceed 2,600 GW with typical waits around five years. Expect "utility capacity" signals to remain in the CONSTRAINED zone through Q4.',
                      severity: 'high'
                    },
                    { 
                      type: 'Field Note', 
                      system: 'Water', 
                      time: 'Q2 2026', 
                      content: 'New municipal water surcharges in Northern Virginia hubs are pricing in infrastructure upgrades. Direct risk signal for pending site approvals.',
                      severity: 'medium'
                    },
                    { 
                      type: 'Supply Chain', 
                      system: 'Hardware', 
                      time: 'Q2 2026', 
                      content: 'Transformer lead times have stabilized at ~118 weeks while switchgear remains in a tightening regime due to raw material bottlenecks.',
                      severity: 'medium'
                    }
                  ].map((note, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#3182ce]">{note.type} // {note.system}</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{note.time}</span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-slate-600 font-medium border-l border-[#3182ce]/30 pl-4 italic">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-10 space-y-8 relative overflow-hidden shadow-sm">
              <div className="relative z-10 space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">External Signals</h3>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'WRI // Grid Demand', 
                      url: 'https://www.wri.org/insights/us-data-centers-electricity-demand',
                      date: 'Sep 2025',
                      tooltip: 'WRI projects 300-400 TWh/year data center electricity demand by 2030, representing 44% of US load growth'
                    },
                    { 
                      label: 'S&P Global // Water Stress', 
                      url: 'https://www.spglobal.com/sustainable1/en/insights/special-editorial/beneath-the-surface-water-stress-in-data-centers',
                      date: 'Sep 2025',
                      tooltip: 'S&P Global finds 43% of global data centers already in high water stress areas'
                    },
                    { 
                      label: 'Hanwha // Power Availability', 
                      url: 'https://www.hanwhadatacenters.com/blog/power-availability-the-new-1-in-data-center-site-selection/',
                      date: 'Feb 2026',
                      tooltip: 'Hanwha reports 84% of decision-makers now rank power availability as top-3 site selection factor'
                    },
                    { 
                      label: 'Egret // Equipment Backlogs', 
                      url: 'https://egretconsulting.com/powering-the-ai-era-how-switchgear-and-transformer-manufacturers-can-lead-the-data-center-boom/',
                      date: 'Recent',
                      tooltip: 'Egret notes transformer lead times stabilized at ~118 weeks while switchgear remains in a tightening regime'
                    },
                  ].map((link, i) => (
                    <a 
                      key={i}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={link.tooltip}
                      className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-[#3182ce] transition-colors py-3 border-b border-[#dcd9d5] last:border-0"
                    >
                      <span>
                        {link.label} <span className="text-[8px] text-slate-400 ml-2">{link.date}</span>
                      </span>
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </aside>
        </div>

        {/* Methodology Trust Module */}
        <div className="mt-24 bg-[#f9f8f5] border border-[#dcd9d5] p-12 lg:p-16 max-w-4xl mx-auto text-center relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#3182ce] mb-6">
              Methodology
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight uppercase">
              How the monitor is built
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-serif italic max-w-2xl mx-auto mb-10">
              The Constraint Monitor is a quarterly updated TPL intelligence layer built from observable infrastructure signals across major AI data center markets. Each metric combines reported market datapoints with TPL's normalized interpretation of current constraint pressure.
            </p>
            <Link 
              to="/monitor/methodology"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-white/10 hover:border-white/20 transition-all"
            >
              View Monitor Methodology
            </Link>
          </div>
        </div>
      </div>

      {/* Forecasts Section */}
      <section className="max-w-[1600px] mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-12">Category Outlooks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {['Power', 'Cooling', 'Water', 'Land', 'Permitting', 'Supply Chain', 'Labor'].map(cat => (
            <Link 
              key={cat} 
              to={`/${cat.toLowerCase().replace(' ', '-')}`}
              state={{ from: '/monitor', label: 'Back to Monitor' }}
              className="p-8 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden"
            >
              {/* Topography Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
              </div>
              <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* System Footer - Compact */}
      <footer className="border-t border-white/5 py-12 px-6 mt-24">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-12">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-[#3b82f6]/40 rounded-full" /> TPL-SYS-001</span>
            <span>Status: Nominal</span>
            <span>Ref: 2026.04.06.1638</span>
          </div>
          <div className="flex items-center gap-12">
            <span>© 2026 The Physical Layer</span>
            <span className="text-[#3b82f6]/30">Infrastructure Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

