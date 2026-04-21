import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getConstraintStatus, ConstraintStatus, CATEGORY_COLORS, STATUS_COLORS } from '../lib/constraintScoring';
import { CategoryKey } from '../lib/constraintData';
import { TplSealOverlay } from '../components/ui/TplSealOverlay';
import { CONSTRAINT_SIMULATOR_MARKETS, DEFAULT_SIMULATOR_PRIORS, DEFAULT_SIMULATOR_SIGNALS } from '../lib/simulatorData';
import { CONSTRAINT_LABELS } from '../lib/constraintTaxonomy';

const getStatusDetails = (status: ConstraintStatus): { code: ConstraintStatus, label: string, color: string } => {
  switch (status) {
    case 'OVERWEIGHT': return { code: "OVERWEIGHT", label: "Overweight / at risk", color: STATUS_COLORS.OVERWEIGHT };
    case 'OVER_ALLOCATED': return { code: "OVER_ALLOCATED", label: "Over-allocated vs constraint", color: STATUS_COLORS.OVER_ALLOCATED };
    case 'UNDER_FUNDED': return { code: "UNDER_FUNDED", label: "Under-funded vs constraint", color: STATUS_COLORS.UNDER_FUNDED };
    default: return { code: "IN_BAND", label: "Within constraint band", color: STATUS_COLORS.IN_BAND };
  }
};

const SimulatorRadarPanel = ({ pressures, boundaries, budgets, statuses }: { pressures: Record<CategoryKey, number>, boundaries: Record<CategoryKey, number>, budgets: Record<CategoryKey, number>, statuses: Record<string, { code: ConstraintStatus, label: string, color: string }> }) => {
  const data = Object.keys(pressures).map((category) => ({
    category,
    pressure: pressures[category as CategoryKey],
    boundary: boundaries[category as CategoryKey],
    budget: budgets[category as CategoryKey],
    status: statuses[category]
  }));

  return (
    <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm h-[400px] relative flex flex-col">
      <TplSealOverlay size={200} opacity={0.2} variant="dark-on-light" className="hidden md:block" />
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#dcd9d5" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={(props: any) => {
              const { payload, x, y, cx, cy, ...rest } = props;
              const status = statuses[payload.value];
              return (
                <text 
                  {...rest} 
                  x={x} 
                  y={y} 
                  fill={status.color} 
                  fontWeight="bold" 
                  fontSize={12}
                  textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
                >
                  {CONSTRAINT_LABELS[payload.value] || payload.value}
                </text>
              );
            }} 
          />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Radar name="Theoretical Boundary" dataKey="boundary" stroke="#3182ce" fill="#3182ce" fillOpacity={0.3} />
          <Radar 
            name="Simulated Capital Pressure" 
            dataKey="pressure" 
            cx={200}
            cy={200}
            stroke="#c53030" 
            fill="#e53e3e" 
            fillOpacity={0.2}
            shape={(props: any) => {
              const { points, cx, cy } = props;
              return (
                <g>
                  {points.map((point: any, index: number) => {
                    const nextPoint = points[(index + 1) % points.length];
                    const status = data[index].status;
                    return (
                      <polygon
                        key={index}
                        points={`${cx},${cy} ${point.x},${point.y} ${nextPoint.x},${nextPoint.y}`}
                        fill={status.color}
                        stroke={CATEGORY_COLORS[data[index].category as CategoryKey]}
                        fillOpacity={0.3}
                      />
                    );
                  })}
                </g>
              );
            }}
          />
          <Tooltip formatter={(value: number, name: string, props: any) => [`${name}: ${value.toFixed(1)}`, '']} />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
            {key === 'OVERWEIGHT' ? 'Overweight / at risk' : 
             key === 'OVER_ALLOCATED' ? 'Over-allocated vs constraint' :
             key === 'UNDER_FUNDED' ? 'Under-funded vs constraint' : 'Within constraint band'}
          </div>
        ))}
      </div>
    </div>
  );
};


const MAX_EFFECTIVE_BUDGET_M = 1500; // 1.5B

function simulatePressure(budgetM: number, baseline: number): number {
  const x = Math.max(0, Math.min(budgetM, MAX_EFFECTIVE_BUDGET_M));
  const norm = x / MAX_EFFECTIVE_BUDGET_M; // 0–1

  // Map normalized budget to a delta around baseline.
  // For individual projects we want a narrower effect band:
  //   -1.0 to +1.5 points, not -2 to +2.
  const delta = (norm - 0.5) * 2.5; // -1.25 at 0, 0 at mid, +1.25 near cap

  const pressure = baseline + delta;
  return Math.min(10, Math.max(0, pressure));
}

export const InteractiveConstraintMap = () => {
  const [projectName, setProjectName] = useState('New Data Center Project');
  const [horizon, setHorizon] = useState('0–3 years');
  const [marketId, setMarketId] = useState('nva');
  const [budgets, setBudgets] = useState<Record<string, number>>({
    'power': 400, 'cooling': 250, 'water': 100, 'permitting': 50, 'supply': 300, 'labor': 200
  });

  const { pressures, boundaries, deltas, strain, statuses } = useMemo(() => {
    const priors = DEFAULT_SIMULATOR_PRIORS[marketId] || { power: 5, cooling: 5, water: 5, permitting: 5, supply: 5, labor: 5 };
    const newPressures: Record<string, number> = {};
    const newBoundaries: Record<string, number> = {};
    const newDeltas: Record<string, number> = {};
    const newStatuses: Record<string, { code: ConstraintStatus, label: string, color: string }> = {};
    
    Object.entries(budgets).forEach(([cat, budget]) => {
      const p0 = priors[cat] || 5;
      const simulated = simulatePressure(budget, p0);
      newBoundaries[cat] = p0;
      newPressures[cat] = simulated;
      newDeltas[cat] = simulated - p0;
      newStatuses[cat] = getStatusDetails(getConstraintStatus(p0, simulated));
    });

    const positiveDeltas = Object.values(newDeltas).filter(d => d > 0);
    const strain = Math.min(10, Math.max(0, positiveDeltas.reduce((sum, d) => sum + d, 0)));

    return { pressures: newPressures, boundaries: newBoundaries, deltas: newDeltas, strain, statuses: newStatuses };
  }, [budgets, marketId]);

  const totalBudget = useMemo(() => Object.values(budgets).reduce((a, b) => a + b, 0), [budgets]);
  const displayCapex = totalBudget >= 1000 ? `$${(totalBudget / 1000).toFixed(1)}B` : `$${totalBudget}M`;
  
  const { withinCount, overCount, underUtilCount, underFundedCount } = useMemo(() => {
    const values = Object.values(statuses);
    return {
      withinCount: values.filter(s => s.code === "IN_BAND").length,
      overCount: values.filter(s => s.code === "OVERWEIGHT" || s.code === "OVER_ALLOCATED").length,
      underUtilCount: 0, // Not used in new logic
      underFundedCount: values.filter(s => s.code === "UNDER_FUNDED").length,
    };
  }, [statuses]);

  const narrative = useMemo(() => {
    const marketLabel = CONSTRAINT_SIMULATOR_MARKETS.find(m => m.id === marketId)?.label || marketId;
    
    const overweight = Object.entries(statuses).filter(([_, s]) => s.code === "OVERWEIGHT").map(([c]) => c);
    const overAllocated = Object.entries(statuses).filter(([_, s]) => s.code === "OVER_ALLOCATED").map(([c]) => c);
    const underFunded = Object.entries(statuses).filter(([_, s]) => s.code === "UNDER_FUNDED").map(([c]) => c);
    const within = Object.entries(statuses).filter(([_, s]) => s.code === "IN_BAND").map(([c]) => c);
    
    let headline = "";
    let body = "";

    if (overweight.length > 0 || overAllocated.length > 0) {
      headline = `Your allocation is over-extended in ${[...overweight, ...overAllocated].join(', ')}.`;
      body = `These categories are driving high systemic strain (${strain.toFixed(1)}/10) in ${marketLabel}.`;
      
      if (underFunded.length > 0) {
        body += ` You are also under-funding tight constraints in ${underFunded.join(', ')}.`;
      }
    } else if (underFunded.length > 0) {
      headline = `You are under-funding key constraints in ${underFunded.join(', ')}.`;
      body = `These categories are structurally tight in ${marketLabel}, but your project spend falls below the baseline pressure. Expect persistent bottlenecks unless budgets are increased.`;
    } else {
      headline = `Your allocation is balanced against the market's structural constraints in ${marketLabel}.`;
      body = `Constraint pressure is aligned with baseline conditions. Execution risk is manageable.`;
    }
    
    return { headline, body };
  }, [statuses, marketId, strain]);

  const signals = DEFAULT_SIMULATOR_SIGNALS[marketId] || {};

  return (
    <div className="min-h-screen bg-[#171614] text-slate-300 p-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <Link to="/constraint-atlas" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={12} />
          Back to Constraint Atlas
        </Link>
        
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Interactive Constraint Simulator</h1>
            <p className="text-slate-400">Allocate your project budget across infrastructure categories to see where a single data center build runs into systemic constraints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-sm border border-[#dcd9d5] text-slate-900 space-y-4">
              <h3 className="font-bold">Project Context</h3>
              <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full p-2 border border-[#dcd9d5] rounded-sm" placeholder="Project Name" />
              <div className="flex gap-2">
                {['0–3 years', '3–5 years', '5–10 years'].map(h => (
                  <button key={h} onClick={() => setHorizon(h)} className={`px-3 py-1 text-xs font-bold rounded-sm ${horizon === h ? 'bg-[#3182ce] text-white' : 'bg-slate-100'}`}>{h}</button>
                ))}
              </div>
              <div className="font-bold">Total Project Capex: {displayCapex}</div>
            </div>
            <div className="bg-white p-6 rounded-sm border border-[#dcd9d5] text-slate-900 space-y-4">
              <h3 className="font-bold">Market Context</h3>
              <select value={marketId} onChange={e => setMarketId(e.target.value)} className="w-full p-2 border border-[#dcd9d5] rounded-sm">
                {CONSTRAINT_SIMULATOR_MARKETS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
              <p className="text-xs text-slate-500">
                Market constraint levels are based on The Physical Layer’s research and reflect conditions for this market as a whole. This simulator shows how a single project’s budget interacts with those constraints.
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm border border-[#dcd9d5] text-slate-900 space-y-4">
              <h3 className="font-bold">System Strain</h3>
              <div className="text-3xl font-bold">
                {strain.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ 10</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${strain < 3 ? 'bg-green-500' : strain < 7 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${strain * 10}%` }}></div>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold">Categories within constraint: {withinCount} / 6</div>
                <div className="flex gap-2 text-slate-500">
                  <span><span className="text-red-500 font-bold">•</span> Overweight: {overCount}</span>
                  <span><span className="text-amber-500 font-bold">•</span> Under-funded: {underFundedCount}</span>
                  <span><span className="text-green-500 font-bold">•</span> In Band: {withinCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-sm border border-[#dcd9d5] text-slate-900 space-y-4">
              <h3 className="font-bold mb-4">Capital Allocation</h3>
              {Object.entries(budgets).map(([category, budget]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold capitalize">
                    <span>{CONSTRAINT_LABELS[category] || category}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Baseline: {boundaries[category]?.toFixed(1) || '0.0'}/10 &nbsp;&nbsp; Simulated: {pressures[category]?.toFixed(1) || '0.0'}/10 &nbsp;&nbsp; Δ {deltas[category] >= 0 ? "+" : ""}{deltas[category]?.toFixed(1) || '0.0'}
                  </div>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border`} style={{ backgroundColor: `${statuses[category].color}1A`, color: statuses[category].color, borderColor: statuses[category].color }}>
                    {statuses[category].label}
                  </div>
                  <div className="flex gap-4 items-center">
                    <label className="text-xs font-bold">Budget ($M):</label>
                    <input type="number" value={budget} onChange={e => setBudgets(prev => ({...prev, [category]: Number(e.target.value)}))} className="w-20 p-1 border border-[#dcd9d5] rounded-sm text-sm" />
                    <input type="range" min="0" max="1500" step="10" value={budget} onChange={e => setBudgets(prev => ({...prev, [category]: Number(e.target.value)}))} className="flex-grow" />
                  </div>
                </div>
              ))}
            </div>
            <SimulatorRadarPanel pressures={pressures} boundaries={boundaries} budgets={budgets} statuses={statuses} />
          </div>

          <div className="bg-slate-100 p-6 rounded-sm border border-slate-200 text-slate-900">
            <h4 className="font-bold mb-2">{narrative.headline}</h4>
            <p className="text-sm mb-4">{narrative.body}</p>
            <h5 className="font-bold mb-2 text-xs uppercase tracking-widest text-slate-500">Market Signals</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(signals).map(([key, value]) => (
                <div key={key}>
                  <span className="font-bold">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-[#2b2926] bg-[#171614]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c1baac]">
              Failure case studies
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] text-[#bab9b4]">
              Explore real projects where billions in planned data center capital ran into
              local resistance, power constraints, or mis‑forecast demand and never delivered
              the capacity investors expected. These cases ground the scenarios you are simulating.
            </p>
          </div>

          <div className="mt-3 md:mt-0">
            <a
              href="/failures"
              className="inline-flex items-center justify-center rounded-full bg-[#f9f5ec] px-4 py-2 text-[13px] font-semibold text-[#171614] hover:bg-[#f3ebde] transition-colors"
            >
              View failure case studies
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
