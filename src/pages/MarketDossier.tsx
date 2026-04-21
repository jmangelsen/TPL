import React from 'react';
import { useParams } from 'react-router-dom';
import { MarketDossierLayout } from '../components/MarketDossierLayout';

const MARKET_DATA: Record<string, { name: string, descriptor: string, summary: string }> = {
  'northern-virginia': {
    name: 'Northern Virginia',
    descriptor: 'Data Center Alley / Hyperscale Backbone',
    summary: 'The world\'s largest data center market, facing critical power and permitting constraints as it expands beyond Ashburn.'
  },
  'dallas-fort-worth': {
    name: 'Dallas–Fort Worth',
    descriptor: 'Sunbelt interconnect hub',
    summary: 'A 1 GW+ market serving as a major growth hub for hyperscale and enterprise deployments with rapid expansion.'
  },
  'phoenix': {
    name: 'Phoenix',
    descriptor: 'High‑growth desert market',
    summary: 'A rapidly growing market with significant power and cooling constraints, driving innovation in water-efficient infrastructure.'
  },
  'atlanta': {
    name: 'Atlanta',
    descriptor: 'Southeast expansion node',
    summary: 'A 1.4 GW+ market experiencing fast expansion and emerging power and network density constraints.'
  },
  'chicago': {
    name: 'Chicago',
    descriptor: 'Midwestern backbone',
    summary: 'A mature 900+ MW market with tight power and network density, serving as a critical Midwestern hub.'
  }
};

export function MarketDossier() {
  const { slug } = useParams<{ slug: string }>();
  const market = slug ? MARKET_DATA[slug] : null;

  if (!market) {
    return <div>Market not found</div>;
  }

  return (
    <MarketDossierLayout {...market}>
      <section>
        <h2 className="text-xl font-bold mb-4">Build‑out snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0f1a24] p-4 border border-white/5 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Installed MW</p>
            <p className="text-xl font-bold">TBD</p>
          </div>
          <div className="bg-[#0f1a24] p-4 border border-white/5 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Vacancy</p>
            <p className="text-xl font-bold">TBD</p>
          </div>
          <div className="bg-[#0f1a24] p-4 border border-white/5 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Recent Absorption</p>
            <p className="text-xl font-bold">TBD</p>
          </div>
          <div className="bg-[#0f1a24] p-4 border border-white/5 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Headline Capex</p>
            <p className="text-xl font-bold">TBD</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Constraint profile</h2>
        <div className="bg-[#0f1a24] p-8 border border-white/5 rounded-sm h-[300px] flex items-center justify-center text-slate-400">
          [Radar Chart Placeholder for {market.name}]
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Tracked projects</h2>
        <div className="bg-[#0f1a24] p-6 border border-white/5 rounded-sm">
          <ul className="list-disc list-inside text-[14px] text-slate-300 space-y-2">
            <li>Project A - Brief note on status</li>
            <li>Project B - Brief note on status</li>
          </ul>
        </div>
      </section>
    </MarketDossierLayout>
  );
}
