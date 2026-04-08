import React from 'react';

const ALL_CONSTRAINTS = [
  'Power & Grid',
  'Cooling & Thermal',
  'Supply Chain & Lead Times',
  'Labor & Construction',
  'Land & Permitting',
  'Networking & Interconnect'
];

// Helper to map the raw string tags from data to the official categories and assign a level
const getConstraintLevel = (category: string, exposures: string[]): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const lowerExposures = exposures.map(e => e.toLowerCase());
  
  if (category === 'Power & Grid') {
    if (lowerExposures.some(e => e.includes('power') || e.includes('grid'))) return 'HIGH';
    return 'MEDIUM';
  }
  if (category === 'Cooling & Thermal') {
    if (lowerExposures.some(e => e.includes('cooling') || e.includes('thermal') || e.includes('water'))) return 'HIGH';
    return 'LOW';
  }
  if (category === 'Supply Chain & Lead Times') {
    if (lowerExposures.some(e => e.includes('supply chain') || e.includes('lead time') || e.includes('silicon'))) return 'HIGH';
    return 'MEDIUM';
  }
  if (category === 'Labor & Construction') {
    if (lowerExposures.some(e => e.includes('labor') || e.includes('construction'))) return 'HIGH';
    return 'LOW';
  }
  if (category === 'Land & Permitting') {
    if (lowerExposures.some(e => e.includes('land') || e.includes('permit'))) return 'HIGH';
    return 'LOW';
  }
  if (category === 'Networking & Interconnect') {
    if (lowerExposures.some(e => e.includes('network') || e.includes('fiber') || e.includes('optical') || e.includes('interconnect'))) return 'HIGH';
    return 'LOW';
  }
  
  return 'LOW';
};

const getBadgeColor = (level: 'HIGH' | 'MEDIUM' | 'LOW') => {
  switch (level) {
    case 'HIGH': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'LOW': return 'bg-white/5 text-slate-500 border-white/5';
  }
};

export const ConstraintExposureBox = ({ exposures }: { exposures: string[] }) => {
  return (
    <div className="bg-[#0f1a24]/50 border border-white/5 p-8">
      <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-6">Constraint Exposure Profile</h3>
      <p className="text-[11px] text-slate-400 mb-8 leading-relaxed">
        How this company intersects with the primary physical bottlenecks of AI infrastructure buildout.
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {ALL_CONSTRAINTS.map(constraint => {
          const level = getConstraintLevel(constraint, exposures);
          return (
            <div key={constraint} className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{constraint}</span>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${getBadgeColor(level)}`}>
                {level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
