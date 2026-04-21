export type ConstraintType = 'power' | 'cooling' | 'water' | 'permitting' | 'labor' | 'mixed';
export type MonitorState = 'neutral' | 'under-pressure' | 'tightening' | 'elevated' | 'capacity-limited' | 'constrained';

export const monitorStateScore: Record<MonitorState, number> = {
  'neutral': 2,
  'under-pressure': 4,
  'tightening': 5,
  'elevated': 7,
  'capacity-limited': 8,
  'constrained': 9,
};

export interface MonitorSignal {
  signalName: string;
  state: MonitorState;
  description: string;
}

export interface ConstraintMapMarket {
  id: string;
  market: string;
  geography: string;
  country: string;
  committedCapexBn: number;
  monitorSignals: MonitorSignal[];
  projectCount: number;
  mwPipeline?: number;
  dominantConstraint: ConstraintType;
  tplPageUrl?: string;
  tplPageLabel?: string;
  tplPageExcerpt?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  updatedAt: string;
  publicationStatus: 'draft' | 'review' | 'approved';
}

// Derive constraint score from signals
export const getConstraintScore = (market: ConstraintMapMarket): number => {
  if (market.monitorSignals.length === 0) return 0;
  const total = market.monitorSignals.reduce((sum, s) => sum + monitorStateScore[s.state], 0);
  return parseFloat((total / market.monitorSignals.length).toFixed(1));
};

export const constraintMapMarkets: ConstraintMapMarket[] = [
  {
    id: 'northern-virginia',
    market: 'Northern Virginia',
    geography: 'Loudoun / Prince William Counties, VA',
    country: 'United States',
    committedCapexBn: 210,
    monitorSignals: [
      { signalName: 'Interconnection Queue', state: 'constrained', description: 'PJM queue depth exceeding 5-year median; large-load projects facing 8–12 year proposed timelines.' },
      { signalName: 'Permit Cycle', state: 'constrained', description: 'Multiple county-level moratoriums active or extended as of Q1 2026.' },
      { signalName: 'Land Entitlement Friction', state: 'elevated', description: 'Power-ready land effectively depleted in Loudoun; Prince William buildout constrained by community opposition.' },
      { signalName: 'Water Risk', state: 'under-pressure', description: 'Evaporative cooling restrictions being evaluated at county level.' }
    ],
    projectCount: 14,
    mwPipeline: 4200,
    dominantConstraint: 'permitting',
    tplPageUrl: '/monitor',
    tplPageLabel: 'Q2 2026 Constraint Monitor',
    tplPageExcerpt: 'Northern Virginia remains the most capital-intensive AI infrastructure market in the U.S., but physical constraint pressure across permitting, power, and land has moved it firmly into execution-risk territory.',
    updatedAt: '2026-04-01',
    publicationStatus: 'approved'
  },
  {
    id: 'texas-ercot',
    market: 'Texas (ERCOT)',
    geography: 'Dallas-Fort Worth / Austin / San Antonio corridors',
    country: 'United States',
    committedCapexBn: 85,
    monitorSignals: [
      { signalName: 'Grid Queue', state: 'tightening', description: 'ERCOT large-load interconnection screening reforms proposed; new requirements pending.' },
      { signalName: 'Water Risk', state: 'elevated', description: 'Significant water stress in Central Texas; cooling water sourcing materially affects site selection.' },
      { signalName: 'Labor Tightness', state: 'capacity-limited', description: 'Specialized electrical trades in short supply across DFW and Austin corridors.' }
    ],
    projectCount: 9,
    mwPipeline: 2800,
    dominantConstraint: 'water',
    updatedAt: '2026-03-28',
    publicationStatus: 'approved'
  },
  {
    id: 'phoenix-arizona',
    market: 'Phoenix Metro',
    geography: 'Maricopa County, AZ',
    country: 'United States',
    committedCapexBn: 40,
    monitorSignals: [
      { signalName: 'Water Risk', state: 'constrained', description: 'Phoenix and surrounding municipalities implementing water-use restrictions and surcharges for evaporative cooling.' },
      { signalName: 'Permit Cycle', state: 'elevated', description: 'New environmental review requirements increasing approval timelines.' },
      { signalName: 'Utility Capacity', state: 'tightening', description: 'APS large-load queue growing; new capacity filings facing longer review cycles.' }
    ],
    projectCount: 6,
    mwPipeline: 1400,
    dominantConstraint: 'water',
    updatedAt: '2026-03-25',
    publicationStatus: 'approved'
  },
  {
    id: 'chicago-midwest',
    market: 'Chicago / Midwest',
    geography: 'Cook County IL / Columbus OH',
    country: 'United States',
    committedCapexBn: 55,
    monitorSignals: [
      { signalName: 'Grid Queue', state: 'elevated', description: 'MISO interconnection queue growing but less congested than PJM corridors.' },
      { signalName: 'Labor Tightness', state: 'tightening', description: 'High-voltage electrician availability constrained as Chicago data-center builds accelerate.' },
      { signalName: 'Land Entitlement Friction', state: 'neutral', description: 'Greenfield land available in suburban corridors; entitlement timelines within historical norms.' }
    ],
    projectCount: 7,
    mwPipeline: 1800,
    dominantConstraint: 'labor',
    updatedAt: '2026-03-22',
    publicationStatus: 'approved'
  },
  {
    id: 'london-slough',
    market: 'London / Slough',
    geography: 'Southeast England',
    country: 'United Kingdom',
    committedCapexBn: 30,
    monitorSignals: [
      { signalName: 'Permit Cycle', state: 'constrained', description: 'Slough moratorium ongoing; South East England power availability materially constrained.' },
      { signalName: 'Grid Queue', state: 'constrained', description: 'National Grid ESO large-load queue among the most congested in EMEA.' },
      { signalName: 'Land Entitlement Friction', state: 'elevated', description: 'Available land with power access extremely scarce in Greater London corridor.' }
    ],
    projectCount: 5,
    mwPipeline: 900,
    dominantConstraint: 'power',
    updatedAt: '2026-03-20',
    publicationStatus: 'approved'
  },
  {
    id: 'singapore-apac',
    market: 'Singapore',
    geography: 'Singapore',
    country: 'Singapore',
    committedCapexBn: 25,
    monitorSignals: [
      { signalName: 'Permit Cycle', state: 'elevated', description: 'Moratorium lifted but new sustainability requirements adding review complexity.' },
      { signalName: 'Land Entitlement Friction', state: 'constrained', description: 'Physical land scarcity is the primary structural constraint; no greenfield expansion possible.' },
      { signalName: 'Water Risk', state: 'under-pressure', description: 'Water recycling requirements tightening for new data-center approvals.' }
    ],
    projectCount: 4,
    mwPipeline: 600,
    dominantConstraint: 'permitting',
    updatedAt: '2026-03-15',
    publicationStatus: 'approved'
  }
];
