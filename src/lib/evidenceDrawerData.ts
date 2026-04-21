export type SectorId =
  | 'Hyperscaler Capex'
  | 'Power Generation'
  | 'REITs & Operators'
  | 'Power & Cooling OEMs'
  | 'Chips & Networking'
  | 'Sovereign / Gov\'t';

export type EvidenceSectorConfig = {
  id: SectorId;
  slug: string;
  headline: string;
  trackedCapexLabel: string;
  pieSlices: {
    label: string;
    spend: number;
  }[];
  narrativeIntro: string;
  narrativeBody: string;
  records: {
    entity: string;
    title: string;
    date: string;
    spend: number | null;
    sourceUrl?: string;
  }[];
};

export const SECTOR_ROUTES: Record<SectorId, string> = {
  'Hyperscaler Capex': '/evidence/hyperscaler-capex',
  'Power Generation': '/evidence/power-generation',
  'REITs & Operators': '/evidence/reits-operators',
  'Power & Cooling OEMs': '/evidence/power-cooling-oems',
  'Chips & Networking': '/evidence/chips-networking',
  'Sovereign / Gov\'t': '/evidence/sovereign-govt',
};

// Placeholder data for now
export const EVIDENCE_DRAWER_DATA: Record<SectorId, EvidenceSectorConfig> = {
  'Hyperscaler Capex': {
    id: 'Hyperscaler Capex',
    slug: 'hyperscaler-capex',
    headline: 'Hyperscaler Capex',
    trackedCapexLabel: '$105.0B Aggregate',
    pieSlices: [
      { label: 'Amazon Web Services', spend: 100_000_000_000 },
      { label: 'Microsoft', spend: 3_000_000_000 },
      { label: 'Meta', spend: 2_000_000_000 },
    ],
    narrativeIntro: 'Tracked hyperscaler capex is concentrated in a handful of U.S. and global platforms.',
    narrativeBody: 'This capital is flowing primarily into new AI campus developments, grid interconnections, and critical thermal management infrastructure.',
    records: [
      { entity: 'Amazon Web Services', title: 'AWS $100B+ US Data Center Investment', date: '2026-01-15', spend: 100000000000 },
    ],
  },
  'Power Generation': {
    id: 'Power Generation',
    slug: 'power-generation',
    headline: 'Power Generation',
    trackedCapexLabel: '$15.0B Aggregate',
    pieSlices: [
      { label: 'NextEra Energy', spend: 15_000_000_000 },
    ],
    narrativeIntro: 'Power‑sector spend here reflects large renewables and firm power programs tied to AI load growth.',
    narrativeBody: 'This capital is flowing primarily into new AI campus developments, grid interconnections, and critical thermal management infrastructure.',
    records: [
      { entity: 'NextEra Energy', title: 'NextEra Energy $15B Renewables Expansion', date: '2026-03-12', spend: 15000000000 },
    ],
  },
  'REITs & Operators': {
    id: 'REITs & Operators',
    slug: 'reits-operators',
    headline: 'REITs & Operators',
    trackedCapexLabel: '$20.0B Aggregate',
    pieSlices: [
      { label: 'Digital Realty', spend: 12_000_000_000 },
      { label: 'Equinix', spend: 8_000_000_000 },
    ],
    narrativeIntro: 'Operator capex is split between wholesale hyperscale campuses and interconnection‑dense retail sites.',
    narrativeBody: 'This capital is flowing primarily into new AI campus developments, grid interconnections, and critical thermal management infrastructure.',
    records: [
      { entity: 'Digital Realty', title: 'Digital Realty $12B Development Pipeline', date: '2026-04-05', spend: 12000000000 },
      { entity: 'Equinix', title: 'Equinix $8B xScale Data Center JV', date: '2026-02-20', spend: 8000000000 },
    ],
  },
  'Power & Cooling OEMs': {
    id: 'Power & Cooling OEMs',
    slug: 'power-cooling-oems',
    headline: 'Power & Cooling OEMs',
    trackedCapexLabel: '$2.5B Aggregate',
    pieSlices: [
      { label: 'Vertiv', spend: 2_500_000_000 },
    ],
    narrativeIntro: 'OEM spend is dominated by a small set of global power and thermal manufacturers.',
    narrativeBody: 'This capital is flowing primarily into new AI campus developments, grid interconnections, and critical thermal management infrastructure.',
    records: [
      { entity: 'Vertiv', title: 'Vertiv $2.5B Manufacturing Capacity Expansion', date: '2026-01-25', spend: 2500000000 },
    ],
  },
  'Chips & Networking': {
    id: 'Chips & Networking',
    slug: 'chips-networking',
    headline: 'Chips & Networking',
    trackedCapexLabel: '$4.0B Aggregate',
    pieSlices: [
      { label: 'Broadcom', spend: 4_000_000_000 },
    ],
    narrativeIntro: 'Silicon and networking capex reflects custom ASIC and interconnect investments.',
    narrativeBody: 'This capital is flowing primarily into new AI campus developments, grid interconnections, and critical thermal management infrastructure.',
    records: [
      { entity: 'Broadcom', title: 'Broadcom $4B Custom Silicon R&D Facility', date: '2026-03-01', spend: 4000000000 },
    ],
  },
  'Sovereign / Gov\'t': {
    id: 'Sovereign / Gov\'t',
    slug: 'sovereign-govt',
    headline: 'Sovereign / Gov\'t',
    trackedCapexLabel: '$30.0B Aggregate',
    pieSlices: [
      { label: 'MGX (UAE Fund)', spend: 30_000_000_000 },
    ],
    narrativeIntro: 'Sovereign AI infrastructure commitments are concentrated in a single flagship vehicle.',
    narrativeBody: 'This capital is flowing primarily into new AI campus developments, grid interconnections, and critical thermal management infrastructure.',
    records: [
      { entity: 'MGX', title: 'UAE $30B Sovereign AI Infrastructure Fund', date: '2026-03-15', spend: 30000000000 },
    ],
  },
};
