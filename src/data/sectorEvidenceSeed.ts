export type SectorId =
  | 'Hyperscaler Capex'
  | 'Power Generation'
  | 'REITs & Operators'
  | 'Power & Cooling OEMs'
  | 'Chips & Networking'
  | 'Sovereign / Gov\'t';

export type SectorCompanySlice = {
  entity: string;
  spend: number; // raw dollars
};

export type SectorEvidenceSeed = {
  totalSpend: number;
  companies: SectorCompanySlice[];
  narrative: string;
};

export const SECTOR_EVIDENCE_SEED: Record<SectorId, SectorEvidenceSeed> = {
  'Hyperscaler Capex': {
    totalSpend: 105_000_000_000,
    companies: [
      { entity: 'Amazon Web Services', spend: 100_000_000_000 },
      { entity: 'Microsoft',           spend:   3_000_000_000 },
      { entity: 'Meta',                spend:   2_000_000_000 },
    ],
    narrative:
      'Placeholder narrative: tracked hyperscaler capex is concentrated in a handful of U.S. and global platforms; update once live data is wired.',
  },
  'Power Generation': {
    totalSpend: 15_000_000_000,
    companies: [
      { entity: 'NextEra Energy', spend: 15_000_000_000 },
    ],
    narrative:
      'Placeholder narrative: power‑sector spend here reflects large renewables and firm power programs tied to AI load growth.',
  },
  'REITs & Operators': {
    totalSpend: 20_000_000_000,
    companies: [
      { entity: 'Digital Realty', spend: 12_000_000_000 },
      { entity: 'Equinix',        spend:  8_000_000_000 },
    ],
    narrative:
      'Placeholder narrative: operator capex is split between wholesale hyperscale campuses and interconnection‑dense retail sites.',
  },
  'Power & Cooling OEMs': {
    totalSpend: 2_500_000_000,
    companies: [
      { entity: 'Vertiv', spend: 2_500_000_000 },
    ],
    narrative:
      'Placeholder narrative: OEM spend is dominated by a small set of global power and thermal manufacturers.',
  },
  'Chips & Networking': {
    totalSpend: 4_000_000_000,
    companies: [
      { entity: 'Broadcom', spend: 4_000_000_000 },
    ],
    narrative:
      'Placeholder narrative: silicon and networking capex reflects custom ASIC and interconnect investments.',
  },
  'Sovereign / Gov\'t': {
    totalSpend: 30_000_000_000,
    companies: [
      { entity: 'MGX (UAE Fund)', spend: 30_000_000_000 },
    ],
    narrative:
      'Placeholder narrative: sovereign AI infrastructure commitments are concentrated in a single flagship vehicle.',
  },
};
