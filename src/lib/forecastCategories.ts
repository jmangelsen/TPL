export type ForecastCategoryId = 'power' | 'water' | 'cooling' | 'permitting' | 'supply_chain' | 'labor';

export type ForecastCategory = {
  id: ForecastCategoryId;
  slug: string;
  name: string;
  description: string;
  heroKicker: string;
  relatedIndicators: string[];
};

export const FORECAST_CATEGORIES: ForecastCategory[] = [
  {
    id: 'power',
    slug: 'power',
    name: 'Power & Grid Outlook',
    heroKicker: 'Constraint Outlook',
    description: 'Forward view on grid queues, interconnection timelines, and power availability in major AI data center markets.',
    relatedIndicators: ['grid_queue', 'transformer_backlog', 'power_price_pressure'],
  },
  {
    id: 'cooling',
    slug: 'cooling',
    name: 'Cooling & Thermal Outlook',
    heroKicker: 'Constraint Outlook',
    description: 'Forward view on thermal management, liquid-to-chip transitions, and HVAC supply chain pressure.',
    relatedIndicators: ['cooling_capacity', 'thermal_design_limits'],
  },
  {
    id: 'water',
    slug: 'water',
    name: 'Water & Ecological Outlook',
    heroKicker: 'Constraint Outlook',
    description: 'Forward view on water stress, municipal allocation, and regulatory pressure for high-density sites.',
    relatedIndicators: ['water_risk', 'water_policy_pressure'],
  },
  {
    id: 'permitting',
    slug: 'permitting',
    name: 'Permitting & Land Use Outlook',
    heroKicker: 'Constraint Outlook',
    description: 'Forward view on permit cycles, land approvals, and zoning headwinds for new data center builds.',
    relatedIndicators: ['permit_cycle', 'land_use_risk'],
  },
  {
    id: 'supply_chain',
    slug: 'supply-chain',
    name: 'Equipment & Supply Chain Outlook',
    heroKicker: 'Constraint Outlook',
    description: 'Forward view on transformer lead times, switchgear backlog, and specialty equipment availability.',
    relatedIndicators: ['supply_backlog', 'lead_time_index'],
  },
  {
    id: 'labor',
    slug: 'labor',
    name: 'Labor & Construction Outlook',
    heroKicker: 'Constraint Outlook',
    description: 'Forward view on labor availability, wage pressure, and construction capacity.',
    relatedIndicators: ['labor_tightness', 'construction_capacity'],
  },
];
