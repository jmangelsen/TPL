import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Activity, Zap, Droplets, HardHat, FileText, Truck, Thermometer } from 'lucide-react';

type CategoryKey = 'Power' | 'Cooling' | 'Supply Chain' | 'Permitting' | 'Labor' | 'Water';
type MarketKey = 'national' | 'northern-va' | 'phoenix' | 'texas';

interface MarketConstraintOutlookProps {
  market: MarketKey;
}

const MARKET_NAMES: Record<MarketKey, string> = {
  national: 'National Average',
  'northern-va': 'Northern Virginia',
  phoenix: 'Phoenix',
  texas: 'Texas (ERCOT)',
};

const CATEGORY_ICONS: Record<CategoryKey, React.ReactNode> = {
  Power: <Zap size={18} />,
  Cooling: <Thermometer size={18} />,
  'Supply Chain': <Truck size={18} />,
  Permitting: <FileText size={18} />,
  Labor: <HardHat size={18} />,
  Water: <Droplets size={18} />,
};

// Mock data for narratives - in a real app this might come from a central store
const MARKET_NARRATIVES: Record<MarketKey, Record<CategoryKey, { summary: string; drivers: string[] }>> = {
  national: {
    Power: { summary: "Grid interconnection and substation upgrades are the binding constraints in core AI corridors.", drivers: ["Substation backlog", "Transmission delays"] },
    Cooling: { summary: "Thermal management requirements are scaling faster than traditional HVAC supply chains can adapt.", drivers: ["Liquid cooling adoption", "Specialized components"] },
    'Supply Chain': { summary: "Long-lead items like transformers and switchgear are extending project timelines by 24+ months.", drivers: ["Transformer lead times", "Switchgear allocation"] },
    Permitting: { summary: "Local political friction and environmental review cycles are becoming significant non-technical bottlenecks.", drivers: ["Community pushback", "Environmental mandates"] },
    Labor: { summary: "Specialized electrical and mechanical labor shortages are driving up construction costs.", drivers: ["Journeymen shortage", "Wage inflation"] },
    Water: { summary: "Data center water consumption is facing increased regulatory scrutiny in drought-prone regions.", drivers: ["Municipal restrictions", "Drought legislation"] },
  },
  'northern-va': {
    Power: { summary: "Transmission bottlenecks in Ashburn are forcing developers to look toward Prince William and Loudoun outskirts.", drivers: ["Transmission capacity limits", "Substation delivery delays"] },
    Cooling: { summary: "High-density clusters in NoVa are accelerating the transition to closed-loop liquid cooling.", drivers: ["Closed-loop mandates", "High-density rack scaling"] },
    'Supply Chain': { summary: "Severe allocation of high-voltage equipment is impacting the largest NoVa campus expansions.", drivers: ["HV equipment allocation", "Local logistics bottlenecks"] },
    Permitting: { summary: "Community opposition to transmission lines and noise ordinances is creating multi-year delays.", drivers: ["Noise ordinance friction", "Transmission line pushback"] },
    Labor: { summary: "Intense competition for specialized trades is driving record wage inflation in the NoVa corridor.", drivers: ["Trade competition", "High cost of living"] },
    Water: { summary: "Increased scrutiny on Potomac water usage for data center cooling is driving new efficiency mandates.", drivers: ["Potomac usage scrutiny", "Efficiency mandates"] },
  },
  phoenix: {
    Power: { summary: "Grid stability during peak summer loads is a primary concern for new large-scale Phoenix deployments.", drivers: ["Summer peak stability", "Renewable integration"] },
    Cooling: { summary: "Extreme ambient temperatures in Phoenix are pushing the limits of traditional air-cooled systems.", drivers: ["Ambient temperature limits", "Water-free cooling push"] },
    'Supply Chain': { summary: "Logistics delays for specialized cooling equipment are impacting Phoenix project timelines.", drivers: ["Cooling logistics", "Regional allocation"] },
    Permitting: { summary: "Streamlined state-level permitting is being offset by increasingly complex local water board reviews.", drivers: ["Water board complexity", "State vs local friction"] },
    Labor: { summary: "The Phoenix labor pool is scaling but remains thin for specialized high-voltage electrical work.", drivers: ["HV electrical shortage", "Rapid pool scaling"] },
    Water: { summary: "Severe drought conditions and Colorado River allocations are the primary binding constraint in Phoenix.", drivers: ["Colorado River allocation", "Drought legislation"] },
  },
  texas: {
    Power: { summary: "ERCOT grid reliability and the speed of new interconnection approvals are the critical paths in Texas.", drivers: ["ERCOT queue reform", "Grid reliability concerns"] },
    Cooling: { summary: "High humidity in East Texas and extreme heat in West Texas require diverse cooling strategies.", drivers: ["Humidity management", "Regional heat variance"] },
    'Supply Chain': { summary: "Texas-scale projects are facing equipment allocation challenges from global suppliers.", drivers: ["Global allocation", "Project scale friction"] },
    Permitting: { summary: "Texas remains relatively pro-development, but large-scale land use is facing new local scrutiny.", drivers: ["Land use scrutiny", "Pro-development friction"] },
    Labor: { summary: "The vast Texas labor market is being strained by simultaneous large-scale industrial buildouts.", drivers: ["Industrial competition", "Labor pool strain"] },
    Water: { summary: "Groundwater depletion in certain Texas counties is leading to new data center water restrictions.", drivers: ["Groundwater depletion", "County-level restrictions"] },
  },
};

export const MarketConstraintOutlook: React.FC<MarketConstraintOutlookProps> = ({ market }) => {
  const marketName = MARKET_NAMES[market];
  const marketNarratives = MARKET_NARRATIVES[market];

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-300 font-sans selection:bg-[#3b82f6]/30 relative overflow-hidden">
      {/* Topography Background */}
      <div className="map-topo-bg" aria-hidden="true" />

      {/* Breadcrumbs */}
      <div className="relative border-b border-white/5 bg-white/40 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/intelligence" className="hover:text-white transition-colors">Intelligence</Link>
          <ChevronRight size={10} />
          <Link to="/constraint-atlas" className="hover:text-white transition-colors">Constraint Atlas</Link>
          <ChevronRight size={10} />
          <span className="text-white">{marketName} Overview</span>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest rounded border border-[#3b82f6]/20">
              {marketName}
            </span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Market Intelligence
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {marketName} Infrastructure Outlook — 2026 Q2
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl italic font-serif">
            "A comprehensive analysis of the physical constraints shaping AI infrastructure deployment in the {marketName} corridor."
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-16">
            {/* Market Summary Section */}
            <section className="bg-[#0f1a24] border border-white/5 p-8 rounded-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                <Activity size={14} className="text-[#3b82f6]" />
                Aggregate Market Pressure
              </h2>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-bold text-white">
                  {market === 'northern-va' ? 'CRITICAL' : 'ELEVATED'}
                </span>
                <span className="text-lg text-slate-500 font-medium">
                  {market === 'northern-va' ? '9.2' : market === 'phoenix' ? '8.4' : '7.8'}/10
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {market === 'northern-va' && "Northern Virginia is facing unprecedented power transmission bottlenecks, with Ashburn reaching a saturation point that is forcing a major geographic shift in development."}
                {market === 'phoenix' && "Phoenix remains a top-tier destination for hyperscale expansion, but the intersection of extreme heat and water scarcity is fundamentally altering cooling architecture requirements."}
                {market === 'texas' && "Texas offers the most aggressive land acquisition environment in the US, but ERCOT grid reliability and the speed of new interconnection approvals remain the primary friction points."}
              </p>
            </section>

            {/* Constraint Grid */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">Constraint Deep Dive</h2>
              <div className="space-y-6">
                {(Object.keys(marketNarratives) as CategoryKey[]).map((cat) => (
                  <div key={cat} className="p-8 bg-[#0f1a24] border border-white/5 rounded-sm hover:bg-[#0f1a24]/80 transition-colors group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                          {CATEGORY_ICONS[cat]}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{cat}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Constraint Pillar</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-[#0f1a24]/5 border border-white/10 rounded-full text-[9px] font-bold text-slate-400">
                        {Math.floor(Math.random() * 3 + 7)}/10 Impact
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 italic font-serif">
                      "{marketNarratives[cat].summary}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {marketNarratives[cat].drivers.map((driver, i) => (
                        <span key={i} className="px-2 py-1 bg-[#0f1a24]/5 text-[9px] font-medium text-slate-500 rounded border border-white/5">
                          {driver}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-12 border-t border-white/5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">Signals from the Monitor</h2>
              <div className="bg-[#0f1a24] p-8 rounded-sm border border-white/5">
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  For a broader view of how these constraints are evolving nationally, consult the National Monitor and the dedicated constraint outlooks.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/monitor"
                    className="px-6 py-3 bg-[#171614] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#3182ce] transition-all flex items-center gap-2"
                  >
                    Open Monitor <ArrowRight size={14} />
                  </Link>
                  <Link 
                    to="/constraint-atlas"
                    className="px-6 py-3 border border-white/5 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    Back to Constraint Atlas <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-[#0f1a24] border border-white/5 rounded-sm sticky top-40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Market Navigation</h3>
              <div className="space-y-4">
                <Link 
                  to="/constraint-atlas"
                  className="flex items-center justify-between p-4 bg-[#0f1a24]/5 border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#0f1a24]/10 transition-all group"
                >
                  Interactive Atlas
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    This overview provides a consolidated view of all physical constraints in {marketName}. To see how these factors interact in real-time or to model different scenarios, return to the interactive atlas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
