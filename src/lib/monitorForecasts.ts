export type ScenarioId = 'baseline' | 'accelerated_build' | 'policy_delay';

export type ForecastPoint = {
  quarter: string;
  value: number;
};

export type Scenario = {
  id: ScenarioId;
  label: string;
  description: string;
  points: ForecastPoint[];
};

export type IndicatorForecast = {
  indicatorId: string;
  displayName: string;
  unit: string;
  horizonQuarters: number;
  notes: string;
  scenarios: Scenario[];
};

export const MONITOR_FORECASTS: IndicatorForecast[] = [
  {
    indicatorId: 'grid_queue',
    displayName: 'Grid Interconnection Queue',
    unit: 'Years',
    horizonQuarters: 4,
    notes: 'Based on PJM and CAISO interconnection data.',
    scenarios: [
      {
        id: 'baseline',
        label: 'Baseline',
        description: 'Current queue processing speeds continue.',
        points: [{ quarter: 'Q2 2026', value: 5.8 }, { quarter: 'Q3 2026', value: 5.9 }, { quarter: 'Q4 2026', value: 6.0 }, { quarter: 'Q1 2027', value: 6.1 }]
      },
      {
        id: 'accelerated_build',
        label: 'Accelerated Build',
        description: 'Increased demand forces faster queue processing.',
        points: [{ quarter: 'Q2 2026', value: 5.8 }, { quarter: 'Q3 2026', value: 6.2 }, { quarter: 'Q4 2026', value: 6.5 }, { quarter: 'Q1 2027', value: 6.8 }]
      },
      {
        id: 'policy_delay',
        label: 'Policy Delay',
        description: 'Regulatory bottlenecks slow down project approvals.',
        points: [{ quarter: 'Q2 2026', value: 5.8 }, { quarter: 'Q3 2026', value: 5.7 }, { quarter: 'Q4 2026', value: 5.6 }, { quarter: 'Q1 2027', value: 5.5 }]
      }
    ]
  }
  // Add other indicators as needed...
];
