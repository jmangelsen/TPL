import React from 'react';
import { IndicatorForecast, ScenarioId } from '../../lib/monitorForecasts';

type CategoryForecastChartProps = {
  indicator: IndicatorForecast;
  scenarioId: ScenarioId;
};

export function CategoryForecastChart({ indicator, scenarioId }: CategoryForecastChartProps) {
  const scenario = indicator.scenarios.find(s => s.id === scenarioId);
  if (!scenario) return null;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold">{indicator.displayName}</h3>
          <p className="text-xs text-slate-400">
            Horizon: next {indicator.horizonQuarters} quarters ({indicator.unit}).
          </p>
        </div>
      </div>

      {/* Placeholder for chart */}
      <div className="h-40 bg-slate-950 rounded flex items-center justify-center text-xs text-slate-500">
        [Forecast chart for {indicator.displayName} – {scenario.label}]
      </div>

      <p className="mt-2 text-[11px] text-slate-400">{scenario.description}</p>
      <p className="mt-1 text-[11px] text-slate-500">{indicator.notes}</p>
    </div>
  );
}
