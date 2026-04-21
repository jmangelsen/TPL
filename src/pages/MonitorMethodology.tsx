import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const methodologyModules = [
  {
    title: 'Power',
    intent: 'Captures the availability and timeline of bulk power delivery to flagship data center markets.',
    signals: ['Interconnection Queue', 'Utility Capacity', 'Substation Capacity', 'Power Availability Window'],
    sources: ['Regional grid operator materials (PJM, ERCOT, etc.)', 'DOE / EIA outlooks', 'Power market reporting', 'Operator disclosures'],
    scope: 'Major US grid interconnects and primary AI build corridors.',
    normalization: 'Raw MW availability and queue timelines are weighted against historical delivery rates and regional transmission constraints to determine the true delay risk.',
    labels: 'Constrained (severe delays), Elevated (growing queue depth), Tightening (early warning of capacity limits), Limited (localized issues).',
    confidence: 'High (Grid operator data and OEM disclosures)',
    indicator: 'Power availability is lagging; interconnection queue growth is leading',
    updated: 'Quarterly',
    limitations: 'Grid operator data can lag real-time market conditions by 3-6 months. High volume of speculative "ghost" projects in queues can artificially inflate raw wait times.'
  },
  {
    title: 'Supply Chain',
    intent: 'Tracks the availability and lead times of critical physical infrastructure components.',
    signals: ['Transformer Lead Time', 'Switchgear Backlog'],
    sources: ['OEM and supplier lead-time disclosures', 'Industry surveys', 'Procurement intelligence'],
    scope: 'Global heavy electrical equipment supply chain for transformers, switchgear, and related high-voltage components.',
    normalization: 'Raw lead times are adjusted based on supplier reliability and raw material constraints (e.g., electrical steel).',
    labels: 'Constrained (100+ week lead times), Tightening (lead times increasing), Elevated (historically high but stable).',
    confidence: 'High (OEM lead-time disclosures)',
    indicator: 'Switchgear backlog is lagging; transformer lead time is leading',
    updated: 'Quarterly',
    limitations: 'Hyperscalers often secure priority allocations, meaning public lead times may overstate delays for top-tier buyers. Lead-time thresholds focus on large power transformers and other critical high-voltage equipment where 100+ week delays materially affect data center build schedules.'
  },
  {
    title: 'Water',
    intent: 'Measures the ecological and municipal pressure on water resources required for data center cooling.',
    signals: ['Water Risk'],
    sources: ['Municipal water utility reports', 'Regional drought monitors', 'S&P Global water stress indices', 'Public filings'],
    scope: 'Water-stressed regions and major municipal hubs (e.g., Northern Virginia, Phoenix).',
    normalization: 'Combines physical water scarcity metrics with municipal policy shifts (e.g., new surcharges or usage caps) to assess total operational risk, recognizing that cooling architecture (evaporative vs. closed-loop) modulates how heavily facilities draw on stressed systems.',
    labels: 'Elevated (high baseline stress), Under Pressure (emerging municipal friction), Constrained (hard limits on new usage).',
    confidence: 'Medium (Municipal reports and indices are reliable but highly localized)',
    indicator: 'Water risk is lagging; municipal policy shifts are leading',
    updated: 'Quarterly',
    limitations: 'Highly localized; a region may be stable while a specific municipality is constrained.'
  },
  {
    title: 'Cooling',
    intent: 'Monitors the supply chain and operational shifts related to advanced cooling systems.',
    signals: ['Cooling Pressure'],
    sources: ['OEM lead-time disclosures', 'Infrastructure research', 'Supplier commentary'],
    scope: 'Global supply chain for enterprise and hyperscale cooling infrastructure.',
    normalization: 'Lead times are cross-referenced with component availability (e.g., CDUs, specialized piping) to identify true bottlenecks.',
    labels: 'Tightening (lead times extending), Under Pressure (component shortages), Constrained (critical path delays). The cooling indicator is surfaced when market conditions move beyond normal; neutral conditions are treated as baseline and may not be displayed.',
    confidence: 'Medium (OEM disclosures are reliable but technology landscape is rapidly evolving)',
    indicator: 'Component shortages are lagging; OEM lead times are leading',
    updated: 'Quarterly',
    limitations: 'Rapidly evolving technology landscape makes historical comparisons difficult.'
  },
  {
    title: 'Land',
    intent: 'Tracks the difficulty of acquiring suitable land with access to power, fiber, and water.',
    signals: ['Site Control Friction', 'Land Entitlement Friction'],
    sources: ['Site development records', 'Commercial real estate reports', 'Operator commentary'],
    scope: 'Tier 1 and emerging Tier 2 data center markets.',
    normalization: 'Combines land pricing trends with the availability of "powered shell" or power-ready sites, primarily based on marketed asking prices and broker commentary.',
    labels: 'Constrained (no available power-ready sites), Elevated (high pricing and intense competition).',
    confidence: 'Lower (Private land transactions lack transparent pricing and terms)',
    indicator: 'Site control friction is lagging; land entitlement friction is leading',
    updated: 'Quarterly',
    limitations: 'Private land transactions often lack transparent pricing and terms, and many deals are negotiated off-market, which can obscure true clearing prices.'
  },
  {
    title: 'Permitting',
    intent: 'Measures the political and bureaucratic friction involved in securing approvals for new data center builds.',
    signals: ['Permit Cycle'],
    sources: ['Permitting timelines', 'Public filings', 'Regional development records', 'Local news and opposition tracking'],
    scope: 'Primary and secondary US data center markets.',
    normalization: 'Tracks the delta between historical approval timelines and current cycles, factoring in local moratoriums or new regulatory hurdles.',
    labels: 'Constrained (active moratoriums or extreme delays), Elevated (increasing friction), Tightening (new regulations pending).',
    confidence: 'Medium (Public filings are reliable but highly variable by municipality)',
    indicator: 'Permit cycle delays are lagging; new regulatory hurdles are leading',
    updated: 'Quarterly',
    limitations: 'Highly variable by county and municipality; federal processes (e.g., FAST-41) can create parallel timelines that do not always align with local patterns.'
  },
  {
    title: 'Labor',
    intent: 'Assesses the availability of specialized construction and electrical labor required for facility buildouts.',
    signals: ['Labor Tightness'],
    sources: ['BLS labor indicators', 'Union reports', 'Construction industry surveys'],
    scope: 'Major US construction markets.',
    normalization: 'General construction labor data is filtered to isolate specialized trades (e.g., high-voltage electricians) critical to data centers.',
    labels: 'Limited (shortages impacting timelines), Tightening (wage inflation and reduced availability).',
    confidence: 'Medium (Survey-based data and BLS indicators)',
    indicator: 'Labor tightness is lagging; wage inflation is leading',
    updated: 'Quarterly',
    limitations: 'Labor mobility can temporarily alleviate local shortages, making it harder to distinguish short-term relief from structural tightness.'
  }
];

export const MonitorMethodology = () => {
  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white relative">
      {/* Background Seal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-[800px] h-[800px] z-0">
        <img 
          src="/tpl-seal.png" 
          alt="" 
          className="w-full h-full object-contain invert"
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a2633]/95 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/monitor" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Monitor</span>
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
        <div className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight uppercase">
            Monitor Methodology
          </h1>
          <p className="text-xl text-slate-400 font-serif italic leading-relaxed max-w-3xl mb-4">
            The Constraint Monitor is TPL's synthesized intelligence layer, designed to track the physical bottlenecks shaping AI infrastructure. It is not a raw data feed, but a normalized index of constraint pressure.
          </p>
          <p className="text-xl text-slate-400 font-serif italic leading-relaxed max-w-3xl">
            These indicator frameworks govern both the metric thresholds and the state labels (Constrained, Elevated, Under Pressure, Tightening, Limited) shown on the Constraint Monitor.
          </p>
        </div>

        {/* Overview Section */}
        <div className="bg-[#0f1a24]/50 border border-white/5 p-10 md:p-12 mb-16">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#3b82f6] mb-8 border-b border-white/5 pb-4">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">What the monitor is</h3>
              <p className="text-sm text-slate-300 leading-relaxed">A quarterly updated index reflecting TPL's synthesized view of constraint pressure across key physical systems relevant to AI infrastructure.</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Update Cadence</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Quarterly. The monitor does not imply false real-time precision; infrastructure moves in quarters and years, not minutes.</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Scope</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Major AI infrastructure markets and flagship data center build corridors, primarily focused on North America with global supply chain inputs.</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Source Universe</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Public grid data, interconnection statistics, equipment lead-time reporting, labor indicators, permitting signals, operator disclosures, and proprietary infrastructure research.</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Scoring & Normalization</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Raw inputs are normalized into a proprietary framework to account for speculative noise (e.g., ghost projects in grid queues) and localized variances.</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Limitations</h3>
              <p className="text-sm text-slate-300 leading-relaxed">The monitor is a macro-level intelligence tool. Highly localized conditions may differ from the aggregate regional or national status.</p>
            </div>
          </div>
        </div>

        {/* How to Read This Framework */}
        <div className="bg-[#0f1a24]/50 border border-white/5 p-10 md:p-12 mb-16">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#3b82f6] mb-8 border-b border-white/5 pb-4">
            How to Read This Framework
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Constraint Monitor is a quarterly updated index synthesizing physical bottleneck pressure across AI infrastructure. It normalizes raw signals into comparable constraint scores using transparent frameworks. Each section below defines what is measured, how scores are derived, and the real-world implications of each status label.
          </p>
        </div>

        {/* Methodology Modules */}
        <div className="space-y-12">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase mb-8">
            Indicator Frameworks
          </h2>
          
          {methodologyModules.map((mod, index) => (
            <div key={index} className="bg-[#0f1a24]/30 border border-white/5 p-8 md:p-10 hover:bg-[#0f1a24]/50 transition-colors">
              <h3 className="text-xl font-bold text-white tracking-tight uppercase mb-6 flex items-center gap-4">
                <span className="text-[#3b82f6] text-sm">0{index + 1}</span>
                {mod.title}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Intent</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{mod.intent}</p>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Signals Tracked</h4>
                  <ul className="space-y-1">
                    {mod.signals.map((signal, i) => (
                      <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-2">
                        <span className="text-[#3b82f6] mt-1.5">•</span>
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Observable Sources</h4>
                    <ul className="space-y-1">
                      {mod.sources.map((source, i) => (
                        <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                          <span className="text-[#3b82f6] mt-1.5">•</span>
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Market Scope</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{mod.scope}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Normalization Logic</h4>
                  <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-[#3b82f6]/30 pl-4 italic">{mod.normalization}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Status Labels</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{mod.labels}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Confidence Interval</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{mod.confidence}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Indicator Type</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{mod.indicator}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Limitations</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{mod.limitations}</p>
                </div>

                <div className="pt-6">
                  <Link 
                    to={`/${mod.title.toLowerCase().replace(' ', '-')}`}
                    state={{ from: '/monitor/methodology', label: 'Back to Methodology' }}
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3b82f6] hover:text-white transition-colors group"
                  >
                    View Full {mod.title} Constraint Details
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Outlooks */}
      <section className="max-w-[1600px] mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-12">Category Outlooks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {['Power', 'Cooling', 'Water', 'Land', 'Permitting', 'Supply Chain', 'Labor'].map(cat => (
            <Link 
              key={cat} 
              to={`/${cat.toLowerCase().replace(' ', '-')}`}
              state={{ from: '/monitor/methodology', label: 'Back to Methodology' }}
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

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-12">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
          <div className="flex items-center gap-12">
            <span>© 2026 The Physical Layer</span>
            <span className="text-[#3b82f6]/30">Infrastructure Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
