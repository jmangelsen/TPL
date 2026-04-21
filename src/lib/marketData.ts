export interface Market {
  id: string;
  name: string;
  slug: string;
  hasDossier: boolean;
}

export const MARKETS: Market[] = [
  {
    id: 'midwest-ai-corridor',
    name: 'Midwest AI Corridor',
    slug: 'midwest-ai-corridor',
    hasDossier: true,
  },
  {
    id: 'northern-virginia',
    name: 'Northern Virginia',
    slug: 'northern-virginia',
    hasDossier: true,
  },
  {
    id: 'dallas-fort-worth',
    name: 'Dallas–Fort Worth',
    slug: 'dallas-fort-worth',
    hasDossier: true,
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    slug: 'phoenix',
    hasDossier: true,
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    slug: 'atlanta',
    hasDossier: true,
  },
  {
    id: 'chicago',
    name: 'Chicago',
    slug: 'chicago',
    hasDossier: true,
  },
];

export type OutcomeMode = 'FAILURE' | 'SUCCESS';

export interface Project {
  id: string;
  name: string;
}

export const PROJECTS_BY_MARKET: Record<string, Record<OutcomeMode, Project[]>> = {
  'midwest-ai-corridor': {
    FAILURE: [
      { id: 'midwest-campus-failure', name: 'Blocked AI Campus (stylized)' },
    ],
    SUCCESS: [
      { id: 'midwest-campus-success', name: 'Staged, grid‑aligned build' },
    ],
  },
  'northern-virginia': {
    FAILURE: [{ id: 'nova-failure', name: 'Power-constrained expansion' }],
    SUCCESS: [{ id: 'nova-success', name: 'Optimized hyperscale cluster' }],
  },
  'dallas-fort-worth': {
    FAILURE: [{ id: 'dfw-failure', name: 'Interconnection delay' }],
    SUCCESS: [{ id: 'dfw-success', name: 'Rapid growth hub' }],
  },
  'phoenix': {
    FAILURE: [{ id: 'phx-failure', name: 'Water-constrained site' }],
    SUCCESS: [{ id: 'phx-success', name: 'Water-efficient campus' }],
  },
  'atlanta': {
    FAILURE: [{ id: 'atl-failure', name: 'Grid capacity bottleneck' }],
    SUCCESS: [{ id: 'atl-success', name: 'Fast-track expansion' }],
  },
  'chicago': {
    FAILURE: [{ id: 'chi-failure', name: 'Network density limit' }],
    SUCCESS: [{ id: 'chi-success', name: 'Mature backbone integration' }],
  },
};
