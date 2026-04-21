import React, { useState, useMemo, useEffect } from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { TplSealOverlay } from '../components/ui/TplSealOverlay';
import { TopMarketsRail } from '../components/TopMarketsRail';
import { MAP_PROJECTS, MapProjectId } from '../lib/mapProjects';
import { CategoryKey } from '../lib/constraintData';
import { CONSTRAINT_LABELS, CONSTRAINT_DESCRIPTIONS } from '../lib/constraintTaxonomy';

const getConstraintCta = () => {
  return {
    label: 'View case study',
    href: '/failures',
  };
};



const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-[#dcd9d5] p-4 shadow-xl rounded-sm max-w-[280px]">
        <p className="text-sm font-bold text-slate-900 mb-3">{label}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#3182ce]" />
            <span className="text-slate-600">Constraint Capacity:</span>
            <span className="text-slate-900 font-bold">{data.rawConstraint} ({data.constraintScore}/10)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#e53e3e]" />
            <span className="text-slate-600">Observed Capex Spend:</span>
            <span className="text-slate-900 font-bold">{data.rawSpend}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-[#dcd9d5] text-[10px] text-slate-400 italic">
          Click to view {label} Outlook →
        </div>
      </div>
    );
  }
  return null;
};

const CustomAngleTick = (props: any) => {
  const { x, y, payload, navigate, setActiveCategory, activeCategory, isLocked, isTransitioning, activeMarket, activeQuarter, isNational } = props;
  const isActive = activeCategory === payload.value;
  const isDimmed = !isTransitioning && activeCategory && !isActive;
  
  const handleLabelClick = () => {
    // For now, label click does nothing
  };

  return (
    <g 
      transform={`translate(${x},${y})`} 
      onClick={handleLabelClick}
      onMouseEnter={() => !isLocked && setActiveCategory(payload.value)}
      className="cursor-pointer group"
    >
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        fill={isActive ? "#3182ce" : "#64748b"}
        fillOpacity={isDimmed ? 0.2 : 1}
        fontSize={11}
        className={`font-sans transition-all group-hover:fill-[#3182ce] group-hover:font-bold ${isActive ? 'font-bold underline' : ''}`}
        style={{ textDecoration: isActive ? 'underline' : 'none' }}
      >
        {CONSTRAINT_LABELS[payload.value] || payload.value}
      </text>
    </g>
  );
};

const getAxisColor = (spend: number, constraint: number) => {
  const diff = spend - constraint;
  if (Math.abs(diff) <= 1) return '#2f855a'; // Aligned
  if (diff < -1) return '#c53030'; // Underfunded
  return '#d69e2e'; // Overfunded
};

const getProjectColor = (status: string) => {
  switch (status) {
    case 'SUCCESS': return '#2f855a'; // Green
    case 'WARNING':
    case 'ELEVATED':
    case 'AT-RISK': return '#d69e2e'; // Amber
    case 'FAILURE':
    default: return '#c53030'; // Red
  }
};

const CustomDot = (props: any) => {
  const { cx, cy, payload, activeCategory, color, isTransitioning, dataKey } = props;
  if (!cx || !cy) return null;
  const isDimmed = !isTransitioning && activeCategory && activeCategory !== payload.category;
  
  // Use per-axis color if it's the spendScore
  const dotColor = dataKey === 'spendScore' ? getAxisColor(payload.spendScore, payload.constraintScore) : color;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={3} 
      fill={dotColor} 
      fillOpacity={isDimmed ? 0.2 : 1} 
      stroke={dotColor}
      strokeOpacity={isDimmed ? 0.2 : 1}
      className="transition-all duration-300"
    />
  );
};

export const ConstraintMap = ({ isAdmin }: { isAdmin: boolean }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('Power');
  const [activeProjectId, setActiveProjectId] = useState<MapProjectId>('midwest-ai-campuses-blocked');
  const [isLocked, setIsLocked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOutlookClick = () => {
    if (activeProjectId === 'midwest-ai-campuses-blocked') {
      navigate('/failures/midwest-ai-campus#midwest-ai-campuses-blocked');
    } else {
      navigate(`/failures#${activeProjectId}`);
    }
  };

  const activeProject = useMemo(() => 
    MAP_PROJECTS.find(p => p.id === activeProjectId) || MAP_PROJECTS[0]
  , [activeProjectId]);

  const radarData = useMemo(() => {
    const scores = activeProject.constraintScores;
    const capital = activeProject.capitalScores;
    return [
      { category: 'power', constraintScore: scores.power, spendScore: capital.power },
      { category: 'cooling', constraintScore: scores.cooling, spendScore: capital.cooling },
      { category: 'water', constraintScore: scores.water, spendScore: capital.water },
      { category: 'labor', constraintScore: scores.labor, spendScore: capital.labor },
      { category: 'supply', constraintScore: scores.supply, spendScore: capital.supply },
      { category: 'permitting', constraintScore: scores.permitting, spendScore: capital.permitting },
    ];
  }, [activeProject]);

  const activeData = useMemo(() => 
    radarData.find(d => d.category === activeCategory) || radarData[0]
  , [activeCategory, radarData]);

  const deltas = useMemo(() => {
    return {
      constraint: null,
      spend: null
    };
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [activeProjectId]);

  return (
    <div className="relative bg-[#171614] min-h-screen text-slate-300 font-sans selection:bg-[#3b82f6]/30">
      <div className="map-topo-bg" aria-hidden="true" />
      
      {/* Header / Hero */}
      <header className="relative pb-12 px-6 z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 block">
                Strategic Research — Internal Draft
              </span>
              <span className="px-2 py-0.5 bg-[#3182ce]/10 border border-[#3182ce]/20 text-[#3182ce] text-[8px] font-bold uppercase tracking-widest rounded-sm">
                Beta
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              The Constraint Atlas
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
              Mapping the gap between physical constraint and capital deployment.
            </p>
          </div>
        </div>
      </header>

      <main className="relative max-w-[1200px] mx-auto px-6 pb-24 z-10">
        
        {/* Usage Hint */}
        <div className="text-center mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Interactive hub: click any axis, data point, or panel CTA to navigate to the specific category outlook.
            <span className="mx-2 text-slate-700">|</span>
            <Link to="/monitor" className="hover:text-white underline">For full constraint timelines, see Monitor</Link>
          </p>
        </div>

        {/* Academic Figure Container */}
        <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-sm p-8 md:p-12 shadow-2xl relative">
          
          {/* Active Project Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-white border border-[#dcd9d5] rounded-full shadow-sm z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3182ce] animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              View: {activeProject.name}
            </span>
          </div>
          
          {/* Figure Title */}
          <div className="text-center mb-12">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Theoretical constraint capacity and observed capex by infrastructure category
            </h2>
            
            {/* Secondary State Strip */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#797876]">
              <span className="opacity-60">Active Project:</span>
              <span className="px-3 py-1 rounded-full bg-[#1c1b19] text-[#f9f8f4] border border-[#262523]">
                {activeProject.name}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1c1b19] text-[#f9f8f4] border border-[#262523]">
                {activeProject.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Radar Chart (65%) */}
            <div className="w-full lg:w-[65%] h-[400px] md:h-[500px] relative">
              <TplSealOverlay size={280} opacity={0.2} variant="dark-on-light" className="hidden md:block" />
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius={window.innerWidth < 768 ? "60%" : "80%"} data={radarData}>
                  <PolarGrid stroke="#dcd9d5" strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={(props) => (
                      <CustomAngleTick 
                        {...props} 
                        navigate={navigate} 
                        setActiveCategory={setActiveCategory}
                        activeCategory={activeCategory}
                        isLocked={isLocked}
                        isTransitioning={isTransitioning}
                      />
                    )}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 10]} 
                    tick={false} 
                    axisLine={false}
                  />
                  
                  {/* Theoretical Constraint Boundary */}
                  <Radar
                    name="Theoretical Constraint Boundary"
                    dataKey="constraintScore"
                    stroke="#2b6cb0"
                    strokeWidth={1.5}
                    fill="#3182ce"
                    fillOpacity={0.3}
                    isAnimationActive={true}
                    animationDuration={500}
                    onMouseEnter={(data: any) => !isLocked && data?.payload?.category && setActiveCategory(data.payload.category)}
                    dot={(props) => <CustomDot {...props} activeCategory={activeCategory} color="#2b6cb0" isTransitioning={isTransitioning} />}
                    activeDot={{ r: 5, fill: "#2b6cb0", stroke: "#fff", strokeWidth: 2 }}
                  />
                  
                  {/* Observed Capital Deployment */}
                  <Radar
                    name="Observed Capital Deployment"
                    dataKey="spendScore"
                    stroke={getProjectColor(activeProject.status)}
                    strokeWidth={1.5}
                    fill={getProjectColor(activeProject.status)}
                    fillOpacity={0.6}
                    isAnimationActive={true}
                    animationDuration={500}
                    onMouseEnter={(data: any) => !isLocked && data?.payload?.category && setActiveCategory(data.payload.category)}
                    dot={(props) => <CustomDot {...props} activeCategory={activeCategory} color={getProjectColor(activeProject.status)} isTransitioning={isTransitioning} />}
                    activeDot={{ r: 5, fill: getProjectColor(activeProject.status), stroke: "#fff", strokeWidth: 2 }}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>

              {/* Boxed Legend */}
              <div className="absolute bottom-0 left-0 bg-white border border-[#dcd9d5] p-3 text-[10px] space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[#2b6cb0] relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2b6cb0]" />
                  </div>
                  <span className="text-slate-600 font-medium uppercase tracking-wider">Theoretical Constraint Boundary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 relative" style={{ backgroundColor: getProjectColor(activeProject.status) }}>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5" style={{ backgroundColor: getProjectColor(activeProject.status) }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-600 font-medium uppercase tracking-wider">Observed Capital Deployment</span>
                    <span className="text-[8px] text-slate-400">Color reflects deployment status: green = aligned, red = underfunded, amber = misallocated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Constraint Details Panel (35%) */}
            <div 
              className="lg:w-[35%] flex flex-col"
              onMouseEnter={() => setIsLocked(true)}
              onMouseLeave={() => setIsLocked(false)}
            >
              <div className="bg-white border border-[#dcd9d5] p-8 h-full flex flex-col shadow-sm">
                <div className="mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3182ce] mb-2 block">
                    Atlas Analysis
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {activeProject.name}
                  </h3>
                </div>

                <div className="mb-6 px-3 py-1.5 border border-opacity-20 rounded-sm" style={{ backgroundColor: `${getProjectColor(activeProject.status)}15`, borderColor: `${getProjectColor(activeProject.status)}30` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: getProjectColor(activeProject.status) }}>
                    Market: {activeProject.marketLabel} · Status: {activeProject.status}
                  </p>
                </div>

                <div className="space-y-8 flex-grow">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Analysis</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {activeProject.summary}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#dcd9d5]">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Constraint Score</p>
                      <p className="text-lg font-bold text-slate-900">
                        {activeData.constraintScore}/10
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Capex Score</p>
                      <p className="text-lg font-bold text-slate-900">
                        {activeData.spendScore}/10
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      {activeProject.status === 'FAILURE' 
                        ? "This scenario represents a set of AI data center campuses in the Midwest that failed to reach operation due to power and permitting constraints."
                        : "This case study demonstrates successful alignment of capital with market constraints."}
                    </p>
                  </div>
                </div>

                <div className="mt-12">
                  <button 
                    type="button"
                    onClick={handleOutlookClick}
                    className="w-full py-4 bg-[#171614] text-[#f9f8f4] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#0f3638] transition-all flex items-center justify-center gap-3 group rounded-sm"
                  >
                    {activeProject.status === 'FAILURE' ? 'View failure case study' : 'View project details'}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analytical Controls - Relocated to Card Bottom */}
          <div className="mt-16 pt-8 border-t border-[#dcd9d5] flex flex-row gap-x-6 items-center justify-center overflow-x-auto pb-4">
            {/* Project Filter */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Project</span>
              <select 
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value as MapProjectId)}
                className="bg-white border border-[#dcd9d5] text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 px-3 py-1 rounded-sm focus:outline-none cursor-pointer"
              >
                {MAP_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Band */}
        <section className="border-t border-[#e1ddd5] bg-[#f9f8f5] py-10 mt-12">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8a8375] mb-3">
              Markets we are tracking closely
            </h2>
            {isAdmin ? (
              <>
                <p className="text-[13px] text-[#4b4740] mb-6">
                  These dossiers document concrete projects and evidence that underpin our constraint scores. Other markets on the map reflect independent research but do not yet have full write‑ups.
                </p>
                <TopMarketsRail />
              </>
            ) : (
              <p className="text-[13px] text-[#8a8375] italic">
                Market dossiers are coming soon.
              </p>
            )}
          </div>
        </section>

        {/* Methodology Explainer */}
        <section className="border-t border-[#e1ddd5] bg-[#f9f8f5] py-12 mt-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8a8375] mb-4">
              How to read this map
            </h2>
            <p className="text-[13px] leading-relaxed text-[#4b4740] font-serif">
              Structural physical constraints (blue) represent the theoretical maximum capacity of grid, supply chain, and regulatory environments. Observed capital deployment (red) reflects actual hyperscaler and operator spend commitments, indicating where timelines are likely to extend beyond typical 18–24 month cycles.
            </p>
            <div className="mt-6 space-y-2">
              {['Power', 'Cooling', 'Water', 'Labor', 'Permitting', 'Supply Chain'].map((key) => (
                <p key={key} className="text-[12px] text-[#4b4740]">
                  <strong>{CONSTRAINT_LABELS[key]}</strong> – {CONSTRAINT_DESCRIPTIONS[key]}
                </p>
              ))}
            </div>
            <div className="mt-8">
              {isAdmin ? (
                <Link 
                  to="/constraint-atlas/interactive"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182ce] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2c5282] transition-all rounded-sm shadow-md"
                >
                  Open Interactive Constraint Atlas <ArrowRight size={14} />
                </Link>
              ) : (
                <button 
                  disabled
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md cursor-not-allowed"
                >
                  Interactive Constraint Atlas (Coming Soon) <Lock size={14} />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
