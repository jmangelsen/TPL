import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { CONSTRAINT_SIMULATOR_MARKETS, DEFAULT_SIMULATOR_PRIORS } from '../../lib/simulatorData';

export const ConstraintScoring = () => {
  const [priors, setPriors] = useState(DEFAULT_SIMULATOR_PRIORS);
  const [loading, setLoading] = useState(false);

  const handlePriorChange = (marketId: string, category: string, value: number) => {
    setPriors(prev => ({
      ...prev,
      [marketId]: {
        ...prev[marketId],
        [category]: value
      }
    }));
  };

  return (
    <div className="p-8 bg-[#1a2633] min-h-screen text-slate-200">
      <h1 className="text-2xl font-bold mb-8 text-white">Constraint Scoring & Markets</h1>
      
      <div className="bg-[#0f1a24] p-6 rounded-sm border border-white/5">
        <h2 className="text-lg font-bold mb-4 text-white">Market Constraint Priors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-2">Market</th>
                {['power', 'cooling', 'water', 'permitting', 'supply', 'labor'].map(cat => (
                  <th key={cat} className="text-left p-2 capitalize">{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONSTRAINT_SIMULATOR_MARKETS.map(market => (
                <tr key={market.id} className="border-b border-white/5">
                  <td className="p-2 font-bold text-white">{market.label}</td>
                  {['power', 'cooling', 'water', 'permitting', 'supply', 'labor'].map(cat => (
                    <td key={cat} className="p-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        step="0.1" 
                        className="border border-white/10 bg-[#1a2633] text-white p-1 w-16 focus:outline-none focus:border-[#3b82f6]/50" 
                        value={priors[market.id]?.[cat] || 5.0} 
                        onChange={e => handlePriorChange(market.id, cat, parseFloat(e.target.value))} 
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-sm text-sm font-bold hover:bg-[#2563eb] transition-colors"><Save size={16} /> Save All Changes</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2633] border border-white/10 text-slate-300 rounded-sm text-sm font-bold hover:bg-white/5 transition-colors"><RefreshCw size={16} /> Revert Unsaved Changes</button>
        </div>
      </div>
    </div>
  );
};
