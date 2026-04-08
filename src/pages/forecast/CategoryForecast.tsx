import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FORECAST_CATEGORIES } from '../../lib/forecastCategories';
import { MONITOR_FORECASTS, ScenarioId } from '../../lib/monitorForecasts';
import { ForecastDisclaimer } from '../../components/monitor/ForecastDisclaimer';
import { CategoryForecastChart } from '../../components/monitor/CategoryForecastChart';
import { useEffectiveTier } from '../../hooks/useEffectiveTier';
import { ArrowLeft, Lock } from 'lucide-react';

export const CategoryForecast = ({ user, isSubscribed }: { user: any, isSubscribed: boolean }) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = FORECAST_CATEGORIES.find(c => c.slug === categorySlug);
  
  const [scenarioId, setScenarioId] = useState<ScenarioId>('baseline');

  if (!category) return <div>Category not found</div>;

  const indicators = MONITOR_FORECASTS.filter(f =>
    category.relatedIndicators.includes(f.indicatorId),
  );

  const effectiveTier = useEffectiveTier(isSubscribed ? 'pro' : 'free', user?.email || undefined);
  const canViewForecast = effectiveTier === 'pro' || effectiveTier === 'admin';

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white relative">
      {/* Topography Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
      </div>

      {/* Header Section */}
      <div className="relative border-b border-white/5 bg-[#0f1a24] py-12 z-10">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none overflow-hidden">
          <img 
            src="/tpl-seal.png" 
            alt="TPL Seal" 
            className="w-full h-full object-contain invert"
          />
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/monitor" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8">
            <ArrowLeft size={12} />
            Back to Monitor
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[9px] font-bold uppercase tracking-[0.2em] border border-[#3b82f6]/20">
                  {category.heroKicker}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase mb-4">
                {category.name}
              </h1>
              <p className="text-sm text-slate-300 font-serif italic leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Scenario Selector - Only show if they have access */}
            {canViewForecast && (
              <div className="bg-[#0f1a24]/50 border border-white/5 p-6 min-w-[200px]">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-4">Scenario</div>
                <select
                  value={scenarioId}
                  onChange={e => setScenarioId(e.target.value as ScenarioId)}
                  className="w-full bg-[#1a2633] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white p-3 focus:outline-none focus:border-[#3b82f6]/50"
                >
                  <option value="baseline">Baseline</option>
                  <option value="accelerated_build">Accelerated Build</option>
                  <option value="policy_delay">Policy Delay</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 z-10 relative">
        {!canViewForecast && (
          <div className="bg-[#0f1a24]/50 border border-white/5 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a2633]/90 z-10" />
            
            {/* Blurred background content to show what they are missing */}
            <div className="relative z-0 opacity-20 blur-[3px] select-none pointer-events-none">
              <div className="grid gap-6 mb-12">
                <div className="h-64 bg-white/5 border border-white/10"></div>
                <div className="h-64 bg-white/5 border border-white/10"></div>
              </div>
            </div>

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Lock size={20} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Pro Subscription Required</h3>
              <p className="text-xs text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Category‑level forecasts, detailed constraint outlooks, and scenario modeling are available exclusively to Pro subscribers.
              </p>
              <Link to="/get-access" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors">
                Upgrade Access
              </Link>
            </div>
          </div>
        )}

        {canViewForecast && (
          <div className="space-y-12">
            <section className="grid gap-6">
              {indicators.map(ind => (
                <div key={ind.indicatorId} className="bg-[#0f1a24]/50 border border-white/5 p-8">
                  <CategoryForecastChart
                    indicator={ind}
                    scenarioId={scenarioId}
                  />
                </div>
              ))}
            </section>

            <section className="border-t border-white/5 pt-12">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-6">Outlook</h2>
              <p className="text-sm text-slate-300 leading-relaxed font-serif italic">
                {/* Insert category-specific commentary text for this quarter here. */}
              </p>
              <div className="mt-8">
                <ForecastDisclaimer />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
