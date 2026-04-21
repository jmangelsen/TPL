import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Activity, 
  ChevronRight,
  ArrowUpRight,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { buildoutKPIs, BuildoutCategory, BuildoutEvent } from '../../lib/buildoutTrackerData';
import { SECTOR_EVIDENCE_SEED, SectorId } from '../../data/sectorEvidenceSeed';
import { SECTOR_ROUTES } from '../../lib/evidenceDrawerData';
import { CONSTRAINT_CATEGORY_COLORS, impactLabelColor, categoryTagColor } from '../../lib/brandColors';
import { TplSealOverlay } from '../../components/ui/TplSealOverlay';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useBuildoutEvents } from '../../hooks/useBuildoutEvents';

const SECTOR_COLORS: Record<string, string> = {
  'Hyperscaler Capex': CONSTRAINT_CATEGORY_COLORS.Power,
  'Power Generation': CONSTRAINT_CATEGORY_COLORS.Permitting,
  'REITs & Operators': CONSTRAINT_CATEGORY_COLORS['Supply Chain'],
  'Power & Cooling OEMs': CONSTRAINT_CATEGORY_COLORS.Cooling,
  'Chips & Networking': CONSTRAINT_CATEGORY_COLORS.Labor,
  'Sovereign / Gov\'t': CONSTRAINT_CATEGORY_COLORS.Water,
};

const SECTOR_LABELS: Record<string, string> = {
  'Hyperscaler Capex': 'Hyperscaler Capex',
  'Power Generation': 'Power Generation',
  'REITs & Operators': 'REITs & Operators',
  'Power & Cooling OEMs': 'Power & Cooling OEMs',
  'Chips & Networking': 'Chips & Networking',
  'Sovereign / Gov\'t': 'Sovereign / Gov\'t',
};

export const BuildoutTrackerHub = React.memo(() => {
  console.log("BuildoutTrackerHub rendering");
  const [activeTab, setActiveTab] = useState<'all' | 'capital' | 'cooling' | 'policy'>('all');
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [activeQuarter, setActiveQuarter] = useState<string>('2026-Q2');
  const [isExplainerPinned, setIsExplainerPinned] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { events: buildoutEvents, loading } = useBuildoutEvents();

  const setSegment = (key: string | null) => {
    console.log("setSegment called with:", key);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isExplainerPinned) return;
    setActiveSegment(key);
  };

  const clearSegment = () => {
    if (isExplainerPinned) return;
    timeoutRef.current = setTimeout(() => {
      setActiveSegment(null);
    }, 150);
  };

  const spendChartData = useMemo(() => {
    const approved = buildoutEvents.filter(
      r => r.publicationStatus === 'approved' && r.category === 'capital'
    );

    // Filter by quarter if needed (simulated for now as data is static)
    // In a real app, we'd filter by eventDate relative to activeQuarter
    
    const totals: Record<string, number> = {};
    const nonNumeric: Record<string, number> = {};

    approved.forEach(r => {
      let key = r.entityType;
      // Map old keys to new keys
      if (key === 'Hyperscaler') key = 'Hyperscaler Capex';
      else if (key === 'REIT / Operator') key = 'REITs & Operators';
      else if (key === 'Power & Cooling') key = 'Power & Cooling OEMs';
      
      if (!key) return;
      const raw = r.announcedSpend ?? '';
      let num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 0) {
        const lower = raw.toLowerCase();
        if (lower.includes('b')) num *= 1000000000;
        else if (lower.includes('m')) num *= 1000000;
        else if (lower.includes('k')) num *= 1000;
        totals[key] = (totals[key] ?? 0) + num;
      } else {
        nonNumeric[key] = (nonNumeric[key] ?? 0) + 1;
      }
    });

    return Object.entries(totals)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        key,
        label: SECTOR_LABELS[key] ?? key,
        value: value / 1000000000, // Convert to Billions for chart display
        color: SECTOR_COLORS[key] ?? '#5a5a5a',
        nonNumericCount: nonNumeric[key] ?? 0,
      }));
  }, [buildoutEvents]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative bg-[#1a2633] min-h-screen text-slate-300 pb-24 font-sans selection:bg-[#3b82f6]/30">
      
      {/* Hero Atmosphere - Compacted */}
      <div className="relative h-[30vh] flex items-center overflow-hidden border-b border-white/5 bg-[#0f1a24]">
        {/* Breadcrumbs */}
        <div className="absolute top-0 left-0 w-full z-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="max-w-[1600px] mx-auto px-6 h-10 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={8} />
            <Link to="/intelligence" className="hover:text-white transition-colors">Intelligence</Link>
            <ChevronRight size={8} />
            <span className="text-white">AI Data Center Buildout Tracker</span>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-xl opacity-5 pointer-events-none">
          <img 
            src="/tpl-seal.png" 
            alt="TPL Seal" 
            className="w-full h-auto object-contain invert drop-shadow-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2633] via-[#1a2633]/60 to-transparent" />
        
        <div className="max-w-[1600px] mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] mb-4 border border-[#3b82f6]/20">
                Capital Intelligence
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-[0.9] tracking-tighter uppercase max-w-4xl">
                Buildout Tracker
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-2xl font-serif italic">
                Real-time monitoring of global AI infrastructure capital deployment, cooling disclosures, and policy developments.
              </p>
            </div>
            
            <div className="shrink-0">
              <Link 
                to="/market-tracker"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3b82f6]/10 border border-[#3b82f6]/20 hover:bg-[#3b82f6]/20 text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest transition-all group"
              >
                Open Market Tracker
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Global AI Infrastructure Spend Distribution */}
      <section className="relative py-12 px-6 z-10 mt-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Canonical Card Shell - Matching Constraint Atlas */}
          <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-sm p-8 md:p-12 shadow-2xl relative">
            
            {/* Figure Title & State Strip - Matching Map */}
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 block mb-4">
                Capital Intelligence — System Distribution
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Global AI Infrastructure Spend Distribution by Sector
              </h2>
              
              {/* Secondary State Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#797876]">
                <span className="opacity-60">Active View:</span>
                <span className="px-3 py-1 rounded-full bg-[#1c1b19] text-[#f9f8f4] border border-[#262523]">
                  Global Aggregate
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1c1b19] text-[#f9f8f4] border border-[#262523]">
                  {activeQuarter.replace('-', ' ')} Update
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1c1b19] text-[#f9f8f4] border border-[#262523]">
                  Approved Capex
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center overflow-hidden rounded-sm">
              {/* Left Column: Chart Container (65%) */}
              <div className="w-full lg:w-[65%] h-[400px] md:h-[600px] relative flex items-center justify-center">
                <TplSealOverlay size={400} opacity={0.1} variant="dark-on-light" className="p-8 flex items-center justify-center hidden md:flex" />
                
                  <div className="relative w-full h-full">
                    {loading ? (
                      <div className="flex items-center justify-center h-full text-xs font-bold uppercase tracking-widest text-slate-500">Loading Tracker Data...</div>
                    ) : spendChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-xs font-bold uppercase tracking-widest text-slate-500">No Data Available</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={spendChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="80%"
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            onMouseEnter={(data) => setSegment(String(data.key))}
                            onMouseLeave={() => clearSegment()}
                            onClick={(data) => {
                              const key = String(data.key);
                              setActiveSegment(key);
                              setIsExplainerPinned(true);
                            }}
                            className="cursor-pointer focus:outline-none"
                          >
                            {spendChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                opacity={activeSegment === null || activeSegment === entry.key ? 1 : 0.3}
                                className="transition-opacity duration-300 hover:opacity-100 focus:opacity-100 focus:outline-none"
                                tabIndex={0}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white border border-[#dcd9d5] p-4 shadow-xl rounded-sm max-w-[280px]">
                                    <p className="text-sm font-bold text-slate-900 mb-3">{data.label}</p>
                                    <div className="space-y-2 mb-4">
                                      <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                                        <span className="text-slate-600">Tracked Capex:</span>
                                        <span className="text-slate-900 font-bold">${data.value.toFixed(1)}B</span>
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-[#dcd9d5] text-[10px] text-slate-400 italic">
                                      Click to view {data.label} Evidence →
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
              </div>

              {/* Right Column: Evidence Drawer / Analysis Panel (35%) - Matching Map */}
              <div 
                onMouseEnter={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                }}
                onMouseLeave={() => clearSegment()}
                className={`
                  absolute inset-x-0 bottom-0 z-50 bg-white border-t border-[#dcd9d5] p-6 shadow-2xl transition-all duration-300 ease-in-out transform
                  lg:relative lg:inset-auto lg:border-t-0 lg:border-l lg:border-[#dcd9d5] lg:p-8 lg:transform-none lg:h-[600px] lg:flex lg:flex-col lg:shadow-none lg:w-[35%]
                  ${activeSegment ? 'translate-y-0 opacity-100' : 'translate-y-full lg:opacity-100 lg:pointer-events-auto'}
                  pointer-events-auto
                `}
              >
                <div className="bg-white h-full flex flex-col">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3182ce] block">
                        Evidence Drawer
                      </span>
                      <button 
                        onClick={() => {
                          setIsExplainerPinned(false);
                          setActiveSegment(null);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors lg:hidden"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {activeSegment ? `${SECTOR_LABELS[activeSegment] ?? activeSegment} Spend` : 'Sector Analysis'}
                    </h3>
                  </div>

                  {activeSegment ? (() => {
                    const sectorLabel = SECTOR_LABELS[activeSegment] as SectorId;
                    const segmentData = spendChartData.find(d => d.key === activeSegment);
                    const records = buildoutEvents.filter(r => r.publicationStatus === 'approved' && r.category === 'capital' && r.entityType === activeSegment);
                    
                    const hasLiveData = records.length > 0 && (segmentData?.value ?? 0) > 0;
                    const seed = SECTOR_EVIDENCE_SEED[sectorLabel];
                    
                    const totalSpend = hasLiveData ? (segmentData?.value ?? 0) * 1000000000 : (seed?.totalSpend ?? 0);
                    
                    const formatSpend = (raw: string | number) => {
                      const num = typeof raw === 'string' ? parseFloat(raw.replace(/[^0-9.]/g, '')) : raw;
                      if (isNaN(num)) return String(raw);
                      if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
                      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
                      return `$${num.toLocaleString()}`;
                    };
                    
                    const confidenceCounts = {
                      Confirmed: records.filter(r => r.confidence === 'Confirmed' || !r.confidence).length,
                      Guided: records.filter(r => r.confidence === 'Guided').length,
                      Derived: records.filter(r => r.confidence === 'Derived').length,
                      Estimated: records.filter(r => r.confidence === 'Estimated').length,
                    };
                    const totalConfidence = records.length;
                    
                    let interpretiveCopy = seed?.narrative ?? "This category's spend total is primarily sourced from direct company disclosures and capex guidance.";
                    if (hasLiveData && totalConfidence > 0) {
                      if (confidenceCounts.Confirmed / totalConfidence > 0.8) {
                        interpretiveCopy = "This category's spend total is primarily sourced from direct company disclosures.";
                      } else if (confidenceCounts.Guided / totalConfidence > 0.5) {
                        interpretiveCopy = "This category is primarily based on forward guidance and subject to revision.";
                      } else if ((confidenceCounts.Derived + confidenceCounts.Estimated) / totalConfidence > 0.5) {
                        interpretiveCopy = "This category relies heavily on inferred or third-party figures. Treat totals as directional.";
                      }
                    }

                    return (
                      <div className="flex flex-col h-full">
                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tracked Capex</p>
                            <div className="flex items-baseline gap-3">
                              <span className="text-3xl font-bold text-slate-900 tracking-tight">{formatSpend(totalSpend)}</span>
                              <span className="text-xs text-slate-500 font-medium tracking-normal">Aggregate</span>
                            </div>
                          </div>

                          {hasLiveData && (
                            <div className="space-y-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confidence Distribution</p>
                              <div className="h-[4px] w-full bg-slate-100 overflow-hidden flex rounded-full">
                                {totalConfidence > 0 && (
                                  <>
                                    <div className="h-full bg-[#4f98a3]" style={{ width: `${(confidenceCounts.Confirmed / totalConfidence) * 100}%` }} title="Confirmed" />
                                    <div className="h-full bg-[#5a7fb8]" style={{ width: `${(confidenceCounts.Guided / totalConfidence) * 100}%` }} title="Guided" />
                                    <div className="h-full bg-[#e0b15a]" style={{ width: `${(confidenceCounts.Derived / totalConfidence) * 100}%` }} title="Derived" />
                                    <div className="h-full bg-slate-300" style={{ width: `${(confidenceCounts.Estimated / totalConfidence) * 100}%` }} title="Estimated" />
                                  </>
                                )}
                              </div>
                              <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 flex flex-wrap gap-x-2 gap-y-1">
                                {confidenceCounts.Confirmed > 0 && <span>{confidenceCounts.Confirmed} Confirmed</span>}
                                {confidenceCounts.Confirmed > 0 && (confidenceCounts.Guided > 0 || confidenceCounts.Derived > 0 || confidenceCounts.Estimated > 0) && <span>·</span>}
                                {confidenceCounts.Guided > 0 && <span>{confidenceCounts.Guided} Guided</span>}
                                {confidenceCounts.Guided > 0 && (confidenceCounts.Derived > 0 || confidenceCounts.Estimated > 0) && <span>·</span>}
                                {confidenceCounts.Derived > 0 && <span>{confidenceCounts.Derived} Derived</span>}
                                {confidenceCounts.Derived > 0 && confidenceCounts.Estimated > 0 && <span>·</span>}
                                {confidenceCounts.Estimated > 0 && <span>{confidenceCounts.Estimated} Estimated</span>}
                              </div>
                            </div>
                          )}

                          <div className="pt-6 border-t border-[#dcd9d5]">
                            <p className="text-sm text-slate-600 leading-relaxed font-serif italic mb-6">
                              "{interpretiveCopy}"
                            </p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent Records</p>
                            {hasLiveData ? records.map(record => (
                              <div key={record.id} className="border-l border-slate-200 pl-4 py-1 hover:border-slate-400 transition-colors">
                                <div className="text-xs font-bold text-slate-900 mb-0.5">{record.entityName}</div>
                                <div className="text-[10px] text-slate-500">{record.announcedSpend ? formatSpend(record.announcedSpend) : 'Undisclosed amount'}</div>
                              </div>
                            )) : seed?.companies.map((c, i) => (
                              <div key={i} className="border-l border-slate-200 pl-4 py-1 hover:border-slate-400 transition-colors">
                                <div className="text-xs font-bold text-slate-900 mb-0.5">{c.entity}</div>
                                <div className="text-[10px] text-slate-500">{formatSpend(c.spend)}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                      <div className="flex-shrink-0 pt-4 border-t border-[#dcd9d5]">
                          <Link 
                            to={SECTOR_ROUTES[sectorLabel as any] || '/buildout-tracker'}
                            className="w-full py-4 bg-[#171614] text-[#f9f8f4] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#0f3638] transition-all flex items-center justify-center gap-3 group rounded-sm"
                          >
                            Open sector evidence drawer
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="flex flex-col h-full items-center justify-center text-center p-8">
                      <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">Select a sector on the chart to view underlying capital records and confidence distribution.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytical Controls - Relocated to Card Bottom - Matching Map */}
            <div className="mt-16 pt-8 border-t border-[#dcd9d5] flex flex-wrap gap-x-12 gap-y-6 items-center justify-center">
              {/* Quarter */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Quarter</span>
                <SegmentedControl
                  options={['2025-Q4', '2026-Q1', '2026-Q2']}
                  labels={{
                    '2025-Q4': '2025 Q4',
                    '2026-Q1': '2026 Q1',
                    '2026-Q2': '2026 Q2'
                  }}
                  value={activeQuarter}
                  onChange={(v) => setActiveQuarter(v)}
                  size="sm"
                  variant="light"
                />
              </div>

              {/* Market - Placeholder to match Map layout */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Market</span>
                <SegmentedControl
                  options={['global']}
                  labels={{ 'global': 'Global Aggregate' }}
                  value="global"
                  onChange={() => {}}
                  size="sm"
                  variant="light"
                />
              </div>

              {/* View Type - Signal filtering */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Signal Type</span>
                <SegmentedControl
                  options={['all', 'capital', 'cooling', 'policy']}
                  labels={{
                    'all': 'All Signals',
                    'capital': 'Capital',
                    'cooling': 'Cooling',
                    'policy': 'Policy'
                  }}
                  value={activeTab}
                  onChange={(v) => setActiveTab(v as any)}
                  size="sm"
                  scrollableOnMobile
                  variant="light"
                />
              </div>
            </div>

            {/* Horizontal Legend - Relocated to the very bottom, outside filtering */}
            <div className="mt-8 pt-8 border-t border-[#dcd9d5]/50 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {spendChartData.map((entry) => {
                const isActive = activeSegment === entry.key;
                return (
                  <button
                    key={`legend-bottom-${entry.key}`}
                    onMouseEnter={() => setSegment(entry.key)}
                    onMouseLeave={() => clearSegment()}
                    onClick={() => {
                      setActiveSegment(entry.key);
                      setIsExplainerPinned(true);
                    }}
                    className={`flex items-center gap-3 transition-all ${
                      activeSegment === null || isActive ? 'opacity-100' : 'opacity-40 text-slate-400'
                    } hover:opacity-100`}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full transition-all ${isActive ? 'ring-2 ring-slate-900/20 ring-offset-2 scale-110' : ''}`} 
                      style={{ backgroundColor: entry.color }} 
                    />
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      {entry.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Framing Section */}
      <section className="py-12 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0f1a24]/50 border border-white/5 p-6 md:p-8 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[#3b82f6]" />
              How to Use This Intelligence Layer
            </h2>
            <div className="text-sm text-slate-400 leading-relaxed max-w-3xl">
              <p className="mb-4">This page provides a system-level view of AI infrastructure buildout, tracking macro forces like capital flows, cooling technology, and policy friction.</p>
              <p>For company-specific exposure across hyperscalers and suppliers, move into the <Link to="/market-tracker" className="text-[#3b82f6] hover:underline">Market Tracker</Link> for detailed analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Child-page callout block */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-gradient-to-br from-[#0f1a24] to-[#0a0f14] border border-white/10 p-8 md:p-12 rounded-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#3b82f6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Public Market Exposure</h2>
              <p className="text-slate-400 leading-relaxed">
                For company-specific exposure across hyperscalers, cooling and power suppliers, networking vendors, and data-center REITs, move from this system-level buildout view into the Market Tracker.
              </p>
            </div>
            <Link 
              to="/market-tracker"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-slate-200 transition-colors"
            >
              Open Market Tracker
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
});
