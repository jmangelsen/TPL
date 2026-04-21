export type CategoryKey = 'Power' | 'Cooling' | 'Supply Chain' | 'Permitting' | 'Labor' | 'Water';
export type QuarterKey = '2025-Q4' | '2026-Q1' | '2026-Q2';
export type MarketKey = 'national' | 'northern-va' | 'phoenix' | 'texas';
export type ScenarioKey = 'base' | 'aggressive' | 'policyShock';

export const MARKET_LABELS: Record<MarketKey, string> = {
  national: 'National Average',
  'northern-va': 'Northern Virginia',
  phoenix: 'Phoenix',
  texas: 'Texas (ERCOT)',
};

export interface RadarPoint {
  category: CategoryKey;
  constraintScore: number;   // 0–10 normalized
  spendScore: number;        // 0–10 normalized
  rawSpend: string;
  rawConstraint: string;
  path: string;
  summary: string;
  spendDelta: string;        // Added for UI requirement
}

export type RadarDataset = Record<QuarterKey, Record<ScenarioKey, RadarPoint[]>>

export const PROJECT_RADAR_DATA: Record<string, RadarPoint[]> = {
  'midwest-campus-failure': [
    { category: 'Power', constraintScore: 9.5, spendScore: 4.0, rawSpend: '$200M', rawConstraint: 'CRITICAL', path: '/outlook/power', summary: 'Power interconnection denied due to grid capacity limits.', spendDelta: 'N/A' },
    { category: 'Cooling', constraintScore: 6.0, spendScore: 5.0, rawSpend: '$150M', rawConstraint: 'MODERATE', path: '/outlook/cooling', summary: 'Standard cooling deployed.', spendDelta: 'N/A' },
    { category: 'Supply Chain', constraintScore: 7.0, spendScore: 8.0, rawSpend: '$400M', rawConstraint: 'ELEVATED', path: '/outlook/supply-chain', summary: 'Over-allocated on shell and equipment.', spendDelta: 'N/A' },
    { category: 'Permitting', constraintScore: 9.0, spendScore: 2.0, rawSpend: '$50M', rawConstraint: 'CRITICAL', path: '/outlook/permitting', summary: 'Blocked by local resistance.', spendDelta: 'N/A' },
    { category: 'Labor', constraintScore: 5.0, spendScore: 5.0, rawSpend: '$100M', rawConstraint: 'NOMINAL', path: '/outlook/labor', summary: 'Labor available but project stalled.', spendDelta: 'N/A' },
    { category: 'Water', constraintScore: 7.0, spendScore: 4.0, rawSpend: '$50M', rawConstraint: 'MODERATE', path: '/outlook/water', summary: 'Water usage concerns raised.', spendDelta: 'N/A' },
  ],
  'midwest-campus-success': [
    { category: 'Power', constraintScore: 6.0, spendScore: 6.0, rawSpend: '$300M', rawConstraint: 'MODERATE', path: '/outlook/power', summary: 'Grid-aligned build.', spendDelta: 'N/A' },
    { category: 'Cooling', constraintScore: 5.0, spendScore: 5.0, rawSpend: '$200M', rawConstraint: 'NOMINAL', path: '/outlook/cooling', summary: 'Efficient cooling.', spendDelta: 'N/A' },
    { category: 'Supply Chain', constraintScore: 5.0, spendScore: 5.0, rawSpend: '$300M', rawConstraint: 'NOMINAL', path: '/outlook/supply-chain', summary: 'Balanced supply.', spendDelta: 'N/A' },
    { category: 'Permitting', constraintScore: 5.0, spendScore: 5.0, rawSpend: '$100M', rawConstraint: 'NOMINAL', path: '/outlook/permitting', summary: 'Smooth permitting.', spendDelta: 'N/A' },
    { category: 'Labor', constraintScore: 5.0, spendScore: 5.0, rawSpend: '$150M', rawConstraint: 'NOMINAL', path: '/outlook/labor', summary: 'Sufficient labor.', spendDelta: 'N/A' },
    { category: 'Water', constraintScore: 5.0, spendScore: 5.0, rawSpend: '$50M', rawConstraint: 'NOMINAL', path: '/outlook/water', summary: 'Water rights secured.', spendDelta: 'N/A' },
  ],
};

export const radarDataset: RadarDataset = {
  '2025-Q4': {
    base: [
      { category: 'Power', constraintScore: 7.2, spendScore: 8.1, rawSpend: '$190B', rawConstraint: 'MODERATE', path: '/outlook/power', summary: 'Early-stage grid planning and initial substation orders dominate the landscape.', spendDelta: 'N/A' },
      { category: 'Cooling', constraintScore: 5.8, spendScore: 3.2, rawSpend: '$32B', rawConstraint: 'NOMINAL', path: '/outlook/cooling', summary: 'Standard air cooling systems meeting current demand with manageable lead times.', spendDelta: 'N/A' },
      { category: 'Supply Chain', constraintScore: 7.1, spendScore: 5.8, rawSpend: '$95B', rawConstraint: 'MODERATE', path: '/outlook/supply-chain', summary: 'Initial signs of transformer backlog appearing in primary markets.', spendDelta: 'N/A' },
      { category: 'Permitting', constraintScore: 7.5, spendScore: 1.8, rawSpend: '$10B', rawConstraint: 'MODERATE', path: '/outlook/permitting', summary: 'Standard review cycles for greenfield sites in established zones.', spendDelta: 'N/A' },
      { category: 'Labor', constraintScore: 6.2, spendScore: 2.8, rawSpend: '$22B', rawConstraint: 'NOMINAL', path: '/outlook/labor', summary: 'Regional labor pools sufficient for current construction velocity.', spendDelta: 'N/A' },
      { category: 'Water', constraintScore: 6.5, spendScore: 1.1, rawSpend: '$6B', rawConstraint: 'NOMINAL', path: '/outlook/water', summary: 'Water rights secured for initial phases of major clusters.', spendDelta: 'N/A' },
    ],
    aggressive: [],
    policyShock: [],
  },
  '2026-Q1': {
    base: [
      { category: 'Power', constraintScore: 7.9, spendScore: 8.8, rawSpend: '$220B', rawConstraint: 'ELEVATED', path: '/outlook/power', summary: 'Interconnection queues begin to swell as hyperscaler clusters scale.', spendDelta: '+$30B' },
      { category: 'Cooling', constraintScore: 6.4, spendScore: 3.8, rawSpend: '$38B', rawConstraint: 'MODERATE', path: '/outlook/cooling', summary: 'Shift toward liquid cooling begins to strain specialized component supply.', spendDelta: '+$6B' },
      { category: 'Supply Chain', constraintScore: 7.8, spendScore: 6.5, rawSpend: '$110B', rawConstraint: 'ELEVATED', path: '/outlook/supply-chain', summary: 'Lead times for high-voltage equipment extend beyond 18 months.', spendDelta: '+$15B' },
      { category: 'Permitting', constraintScore: 8.2, spendScore: 2.2, rawSpend: '$12B', rawConstraint: 'ELEVATED', path: '/outlook/permitting', summary: 'Increased community pushback in Northern Virginia and Phoenix.', spendDelta: '+$2B' },
      { category: 'Labor', constraintScore: 6.8, spendScore: 3.4, rawSpend: '$26B', rawConstraint: 'MODERATE', path: '/outlook/labor', summary: 'Shortage of specialized electrical journeymen starts impacting timelines.', spendDelta: '+$4B' },
      { category: 'Water', constraintScore: 7.0, spendScore: 1.3, rawSpend: '$7B', rawConstraint: 'MODERATE', path: '/outlook/water', summary: 'New municipal restrictions proposed in arid data center hubs.', spendDelta: '+$1B' },
    ],
    aggressive: [],
    policyShock: [],
  },
  '2026-Q2': {
    base: [
      { category: 'Power', constraintScore: 8.6, spendScore: 9.5, rawSpend: '$250B+', rawConstraint: 'ELEVATED', path: '/outlook/power', summary: 'Grid interconnection and substation upgrades are the binding constraints in core AI corridors.', spendDelta: '+$30B' },
      { category: 'Cooling', constraintScore: 6.9, spendScore: 4.2, rawSpend: '$45B+', rawConstraint: 'UNDER PRESSURE', path: '/outlook/cooling', summary: 'Thermal management requirements are scaling faster than traditional HVAC supply chains can adapt.', spendDelta: '+$7B' },
      { category: 'Supply Chain', constraintScore: 8.4, spendScore: 7.1, rawSpend: '$120B+', rawConstraint: 'CONSTRAINED', path: '/outlook/supply-chain', summary: 'Long-lead items like transformers and switchgear are extending project timelines by 24+ months.', spendDelta: '+$10B' },
      { category: 'Permitting', constraintScore: 8.8, spendScore: 2.5, rawSpend: '$15B+', rawConstraint: 'CONSTRAINED', path: '/outlook/permitting', summary: 'Local political friction and environmental review cycles are becoming significant non-technical bottlenecks.', spendDelta: '+$3B' },
      { category: 'Labor', constraintScore: 7.2, spendScore: 3.8, rawSpend: '$30B+', rawConstraint: 'CAPACITY LIMITED', path: '/outlook/labor', summary: 'Specialized electrical and mechanical labor shortages are driving up construction costs.', spendDelta: '+$4B' },
      { category: 'Water', constraintScore: 7.4, spendScore: 1.5, rawSpend: '$8B+', rawConstraint: 'UNDER PRESSURE', path: '/outlook/water', summary: 'Data center water consumption is facing increased regulatory scrutiny in drought-prone regions.', spendDelta: '+$1B' },
    ],
    aggressive: [
      { category: 'Power', constraintScore: 8.8, spendScore: 9.8, rawSpend: '$270B+', rawConstraint: 'ELEVATED', path: '/outlook/power', summary: 'Accelerated AI buildout pushes spend ahead of grid reform.', spendDelta: '+$50B' },
      { category: 'Cooling', constraintScore: 7.2, spendScore: 5.2, rawSpend: '$55B+', rawConstraint: 'CONSTRAINED', path: '/outlook/cooling', summary: 'Rapid deployment of high-density racks forces immediate liquid cooling adoption.', spendDelta: '+$17B' },
      { category: 'Supply Chain', constraintScore: 8.9, spendScore: 8.5, rawSpend: '$140B+', rawConstraint: 'CRITICAL', path: '/outlook/supply-chain', summary: 'Global competition for power electronics creates severe allocation bottlenecks.', spendDelta: '+$30B' },
      { category: 'Permitting', constraintScore: 8.8, spendScore: 2.5, rawSpend: '$15B+', rawConstraint: 'CONSTRAINED', path: '/outlook/permitting', summary: 'Local political friction and environmental review cycles are becoming significant non-technical bottlenecks.', spendDelta: '+$3B' },
      { category: 'Labor', constraintScore: 7.2, spendScore: 3.8, rawSpend: '$30B+', rawConstraint: 'CAPACITY LIMITED', path: '/outlook/labor', summary: 'Specialized electrical and mechanical labor shortages are driving up construction costs.', spendDelta: '+$4B' },
      { category: 'Water', constraintScore: 7.4, spendScore: 1.5, rawSpend: '$8B+', rawConstraint: 'UNDER PRESSURE', path: '/outlook/water', summary: 'Data center water consumption is facing increased regulatory scrutiny in drought-prone regions.', spendDelta: '+$1B' },
    ],
    policyShock: [
      { category: 'Power', constraintScore: 9.2, spendScore: 9.5, rawSpend: '$250B+', rawConstraint: 'CONSTRAINED', path: '/outlook/power', summary: 'Policy-driven queue reform slows new approvals despite existing capex.', spendDelta: '+$30B' },
      { category: 'Cooling', constraintScore: 6.9, spendScore: 4.2, rawSpend: '$45B+', rawConstraint: 'UNDER PRESSURE', path: '/outlook/cooling', summary: 'Thermal management requirements are scaling faster than traditional HVAC supply chains can adapt.', spendDelta: '+$7B' },
      { category: 'Supply Chain', constraintScore: 8.4, spendScore: 7.1, rawSpend: '$120B+', rawConstraint: 'CONSTRAINED', path: '/outlook/supply-chain', summary: 'Long-lead items like transformers and switchgear are extending project timelines by 24+ months.', spendDelta: '+$10B' },
      { category: 'Permitting', constraintScore: 9.8, spendScore: 2.5, rawSpend: '$15B+', rawConstraint: 'CRITICAL', path: '/outlook/permitting', summary: 'Federal environmental mandate adds 12 months to all active review cycles.', spendDelta: '+$3B' },
      { category: 'Labor', constraintScore: 7.2, spendScore: 3.8, rawSpend: '$30B+', rawConstraint: 'CAPACITY LIMITED', path: '/outlook/labor', summary: 'Specialized electrical and mechanical labor shortages are driving up construction costs.', spendDelta: '+$4B' },
      { category: 'Water', constraintScore: 8.5, spendScore: 1.5, rawSpend: '$8B+', rawConstraint: 'CRITICAL', path: '/outlook/water', summary: 'Emergency drought legislation halts new water allocations in 4 key states.', spendDelta: '+$1B' },
    ],
  },
};

// Helper to populate aggressive/policyShock for older quarters if not defined
['2025-Q4', '2026-Q1'].forEach(q => {
  const quarter = q as QuarterKey;
  const base = radarDataset[quarter].base;
  
  radarDataset[quarter].aggressive = base.map(p => {
    if (['Power', 'Cooling', 'Supply Chain'].includes(p.category)) {
      return { ...p, spendScore: Math.min(10, p.spendScore + 1.2), rawSpend: `$${parseInt(p.rawSpend.replace(/\D/g, '')) + 15}B` };
    }
    return { ...p };
  });

  radarDataset[quarter].policyShock = base.map(p => {
    if (['Permitting', 'Water'].includes(p.category)) {
      return { ...p, constraintScore: Math.min(10, p.constraintScore + 1.0), rawConstraint: 'CONSTRAINED' };
    }
    return { ...p };
  });
});
