import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const MARKETS = [
  { slug: 'northern-virginia', name: 'Northern Virginia' },
  { slug: 'dallas-fort-worth', name: 'Dallas-Fort Worth' },
  { slug: 'silicon-valley', name: 'Silicon Valley' },
  { slug: 'chicago', name: 'Chicago' },
  { slug: 'phoenix', name: 'Phoenix' },
  { slug: 'new-york-tri-state', name: 'New York Tri-State' },
  { slug: 'atlanta', name: 'Atlanta' },
  { slug: 'hillsboro-portland', name: 'Hillsboro-Portland' },
  { slug: 'austin-san-antonio', name: 'Austin-San Antonio' },
  { slug: 'central-washington', name: 'Central Washington' },
  { slug: 'seattle', name: 'Seattle' },
  { slug: 'southern-california', name: 'Southern California' },
  { slug: 'denver', name: 'Denver' },
  { slug: 'minneapolis-saint-paul', name: 'Minneapolis-Saint Paul' },
  { slug: 'charlotte-raleigh', name: 'Charlotte-Raleigh' },
  { slug: 'columbus', name: 'Columbus' },
  { slug: 'houston', name: 'Houston' },
  { slug: 'salt-lake-city', name: 'Salt Lake City' },
  { slug: 'kansas-city', name: 'Kansas City' },
  { slug: 'reno-tahoe-reno', name: 'Reno-Tahoe-Reno' },
  { slug: 'central-oregon', name: 'Central Oregon' },
  { slug: 'central-eastern-pennsylvania', name: 'Central-Eastern Pennsylvania' },
  { slug: 'carolinas-emerging', name: 'Carolinas', emerging: true },
  { slug: 'new-jersey-emerging', name: 'New Jersey', emerging: true },
  { slug: 'massachusetts-suburban', name: 'Massachusetts Suburban' },
  { slug: 'iowa-des-moines', name: 'Iowa-Des Moines' },
  { slug: 'montana-emerging', name: 'Montana', emerging: true },
  { slug: 'mississippi-emerging', name: 'Mississippi', emerging: true }
];

const CONSTRAINT_DATA: Record<string, any> = {
  'power': {
    title: 'Power',
    intent: 'Captures the availability and timeline of bulk power delivery to flagship data center markets.',
    signals: ['Interconnection Queue', 'Utility Capacity', 'Substation Capacity', 'Power Availability Window'],
    sources: ['Regional grid operator materials (PJM, ERCOT, etc.)', 'DOE / EIA outlooks', 'Power market reporting', 'Operator disclosures'],
    scope: 'Major US grid interconnects and primary AI build corridors.',
    normalization: 'Raw MW availability and queue timelines are weighted against historical delivery rates and regional transmission constraints to determine the true delay risk.',
    labels: 'Constrained (severe delays), Elevated (growing queue depth), Tightening (early warning of capacity limits), Limited (localized issues).',
    confidence: 'High (Grid operator data and OEM disclosures)',
    indicator: 'Power availability is lagging; interconnection queue growth is leading',
    limitations: 'Grid operator data can lag real-time market conditions by 3-6 months. High volume of speculative "ghost" projects in queues can artificially inflate raw wait times.'
  },
  'supply-chain': {
    title: 'Supply Chain',
    intent: 'Tracks the availability and lead times of critical physical infrastructure components.',
    signals: ['Transformer Lead Time', 'Switchgear Backlog'],
    sources: ['OEM and supplier lead-time disclosures', 'Industry surveys', 'Procurement intelligence'],
    scope: 'Global heavy electrical equipment supply chain for transformers, switchgear, and related high-voltage components.',
    normalization: 'Raw lead times are adjusted based on supplier reliability and raw material constraints (e.g., electrical steel).',
    labels: 'Constrained (100+ week lead times), Tightening (lead times increasing), Elevated (historically high but stable).',
    confidence: 'High (OEM lead-time disclosures)',
    indicator: 'Switchgear backlog is lagging; transformer lead time is leading',
    limitations: 'Hyperscalers often secure priority allocations, meaning public lead times may overstate delays for top-tier buyers. Lead-time thresholds focus on large power transformers and other critical high-voltage equipment where 100+ week delays materially affect data center build schedules.'
  },
  'water': {
    title: 'Water',
    intent: 'Measures the ecological and municipal pressure on water resources required for data center cooling.',
    signals: ['Water Risk'],
    sources: ['Municipal water utility reports', 'Regional drought monitors', 'S&P Global water stress indices', 'Public filings'],
    scope: 'Water-stressed regions and major municipal hubs (e.g., Northern Virginia, Phoenix).',
    normalization: 'Combines physical water scarcity metrics with municipal policy shifts (e.g., new surcharges or usage caps) to assess total operational risk, recognizing that cooling architecture (evaporative vs. closed-loop) modulates how heavily facilities draw on stressed systems.',
    labels: 'Elevated (high baseline stress), Under Pressure (emerging municipal friction), Constrained (hard limits on new usage).',
    confidence: 'Medium (Municipal reports and indices are reliable but highly localized)',
    indicator: 'Water risk is lagging; municipal policy shifts are leading',
    limitations: 'Highly localized; a region may be stable while a specific municipality is constrained.'
  },
  'cooling': {
    title: 'Cooling',
    intent: 'Monitors the supply chain and operational shifts related to advanced cooling systems.',
    signals: ['Cooling Pressure'],
    sources: ['OEM lead-time disclosures', 'Infrastructure research', 'Supplier commentary'],
    scope: 'Global supply chain for enterprise and hyperscale cooling infrastructure.',
    normalization: 'Lead times are cross-referenced with component availability (e.g., CDUs, specialized piping) to identify true bottlenecks.',
    labels: 'Tightening (lead times extending), Under Pressure (component shortages), Constrained (critical path delays). The cooling indicator is surfaced when market conditions move beyond normal; neutral conditions are treated as baseline and may not be displayed.',
    confidence: 'Medium (OEM disclosures are reliable but technology landscape is rapidly evolving)',
    indicator: 'Component shortages are lagging; OEM lead times are leading',
    limitations: 'Rapidly evolving technology landscape makes historical comparisons difficult.'
  },
  'land': {
    title: 'Land',
    intent: 'Tracks the difficulty of acquiring suitable land with access to power, fiber, and water.',
    signals: ['Site Control Friction', 'Land Entitlement Friction'],
    sources: ['Site development records', 'Commercial real estate reports', 'Operator commentary'],
    scope: 'Tier 1 and emerging Tier 2 data center markets.',
    normalization: 'Combines land pricing trends with the availability of "powered shell" or power-ready sites, primarily based on marketed asking prices and broker commentary.',
    labels: 'Constrained (no available power-ready sites), Elevated (high pricing and intense competition).',
    confidence: 'Lower (Private land transactions lack transparent pricing and terms)',
    indicator: 'Site control friction is lagging; land entitlement friction is leading',
    limitations: 'Private land transactions often lack transparent pricing and terms, and many deals are negotiated off-market, which can obscure true clearing prices.'
  },
  'permitting': {
    title: 'Permitting',
    intent: 'Measures the political and bureaucratic friction involved in securing approvals for new data center builds.',
    signals: ['Permit Cycle'],
    sources: ['Permitting timelines', 'Public filings', 'Regional development records', 'Local news and opposition tracking'],
    scope: 'Primary and secondary US data center markets.',
    normalization: 'Tracks the delta between historical approval timelines and current cycles, factoring in local moratoriums or new regulatory hurdles.',
    labels: 'Constrained (active moratoriums or extreme delays), Elevated (increasing friction), Tightening (new regulations pending).',
    confidence: 'Medium (Public filings are reliable but highly variable by municipality)',
    indicator: 'Permit cycle delays are lagging; new regulatory hurdles are leading',
    limitations: 'Highly variable by county and municipality; federal processes (e.g., FAST-41) can create parallel timelines that do not always align with local patterns.'
  },
  'labor': {
    title: 'Labor',
    intent: 'Assesses the availability of specialized construction and electrical labor required for facility buildouts.',
    signals: ['Labor Tightness'],
    sources: ['BLS labor indicators', 'Union reports', 'Construction industry surveys'],
    scope: 'Major US construction markets.',
    normalization: 'General construction labor data is filtered to isolate specialized trades (e.g., high-voltage electricians) critical to data centers.',
    labels: 'Limited (shortages impacting timelines), Tightening (wage inflation and reduced availability).',
    confidence: 'Medium (Survey-based data and BLS indicators)',
    indicator: 'Labor tightness is lagging; wage inflation is leading',
    limitations: 'Labor mobility can temporarily alleviate local shortages, making it harder to distinguish short-term relief from structural tightness.'
  }
};

export const ConstraintDetail = ({ constraintId: propConstraintId }: { constraintId?: string }) => {
  const params = useParams<{ constraintId: string, marketSlug: string }>();
  const location = useLocation();
  const constraintId = propConstraintId || params.constraintId;
  const data = constraintId ? CONSTRAINT_DATA[constraintId] : null;

  let backPath = location.state?.from || '/monitor/methodology';
  let backLabel = location.state?.label || 'Back to Methodology';

  if (params.marketSlug) {
    backPath = `/${constraintId}`;
    backLabel = `Back to ${data.title} Constraint`;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#1a2633] text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Constraint Not Found</h1>
          <Link to={backPath} className="text-[#3b82f6] hover:underline">Return</Link>
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
            {data.title} Constraint
            {params.marketSlug && (
              <span className="block text-2xl text-slate-400 mt-2">
                {MARKETS.find(m => m.slug === params.marketSlug)?.name || params.marketSlug}
              </span>
            )}
          </h1>
          
          <div className="flex flex-wrap gap-4">
            {constraintId === 'power' && (
              <Link 
                to="/power/grid-monitor"
                className="px-8 py-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
                </div>
                <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  GRID MONITOR
                </span>
              </Link>
            )}
            {constraintId === 'cooling' && (
              <Link 
                to="/cooling/system-monitor"
                className="px-8 py-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
                </div>
                <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  SYSTEM MONITOR
                </span>
              </Link>
            )}
            {constraintId === 'water' && (
              <Link 
                to="/water/resource-monitor"
                className="px-8 py-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
                </div>
                <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  RESOURCE MONITOR
                </span>
              </Link>
            )}
            {constraintId === 'permitting' && (
              <Link 
                to="/permitting/process-monitor"
                className="px-8 py-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
                </div>
                <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  PROCESS MONITOR
                </span>
              </Link>
            )}
            {constraintId === 'supply-chain' && (
              <Link 
                to="/supply-chain/infrastructure-monitor"
                className="px-8 py-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
                </div>
                <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  INFRASTRUCTURE MONITOR
                </span>
              </Link>
            )}
            {constraintId === 'labor' && (
              <Link 
                to="/labor/workforce-monitor"
                className="px-8 py-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group text-center relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
                </div>
                <span className="relative z-10 text-[11px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  WORKFORCE MONITOR
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10 mb-12">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Intent</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{data.intent}</p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Signals Tracked</h4>
              <ul className="space-y-1">
                {data.signals.map((signal: string, i: number) => (
                  <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1.5">•</span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Observable Sources</h4>
                <ul className="space-y-1">
                  {data.sources.map((source: string, i: number) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-1.5">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Market Scope</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{data.scope}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Normalization Logic</h4>
              <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-[#3b82f6]/30 pl-4 italic">{data.normalization}</p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Status Labels</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{data.labels}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Confidence Interval</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{data.confidence}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Indicator Type</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{data.indicator}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Limitations</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{data.limitations}</p>
            </div>
          </div>
        </div>

        {/* Market Outlooks */}
        <div className="bg-[#0f1a24]/50 border border-white/5 p-8 md:p-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#3b82f6] mb-8 border-b border-white/5 pb-4">
            Market Outlooks
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKETS.map((market) => (
              <li key={market.slug}>
                <Link 
                  to={`/${constraintId}/${market.slug}`}
                  className="group flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowUpRight size={14} className="text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>
                    {market.name}
                    {market.emerging && <span className="ml-2 text-[10px] text-slate-500 uppercase tracking-widest">(Emerging)</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
