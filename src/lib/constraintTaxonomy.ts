export const CONSTRAINT_LABELS: Record<string, string> = {
  Power: 'Power Infrastructure',
  Cooling: 'Cooling & Thermal',
  Water: 'Water & Environmental',
  Labor: 'Labor & Trades',
  Permitting: 'Permitting & Political Friction',
  'Supply Chain': 'Supply Chain & Equipment',
};

export const CONSTRAINT_DESCRIPTIONS: Record<string, string> = {
  Power: 'grid capacity, substations, transmission, interconnection queues.',
  Cooling: 'mechanical capacity, high‑density and liquid cooling complexity, temperature limits.',
  Water: 'water rights, discharge limits, wetlands, and environmental impacts.',
  Labor: 'availability of skilled construction labor, specialty MEP trades, and commissioning teams.',
  Permitting: 'zoning, approvals, local opposition, referendums, and state‑level pushback that can delay or block projects.',
  'Supply Chain': 'long‑lead electrical and mechanical equipment (transformers, switchgear, generators, chillers, etc.).',
};
