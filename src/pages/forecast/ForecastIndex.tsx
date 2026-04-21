import React from 'react';
import { Link } from 'react-router-dom';
import { FORECAST_CATEGORIES } from '../../lib/forecastCategories';

export const ForecastIndex = () => {
  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white relative">
      {/* Topography Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
      </div>

      {/* Hero Atmosphere */}
      <div className="relative h-[40vh] flex items-center overflow-hidden border-b border-white/5 bg-[#0f1a24] z-10">
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
            Research & Analysis
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-[0.9] tracking-tighter uppercase max-w-4xl">
            Constraint Outlooks
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-serif italic mb-4">
            Forward-looking projections on the physical constraints shaping AI infrastructure buildout.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-20 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FORECAST_CATEGORIES.map(category => (
            <Link 
              key={category.id} 
              to={`/outlook/${category.slug}`}
              className="group p-8 bg-[#0f1a24] border border-white/5 hover:border-[#3b82f6]/30 transition-all"
            >
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest group-hover:text-[#3b82f6] transition-colors">{category.name}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
