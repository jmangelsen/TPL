export const groundTruthRegions = [
  {
    id: 'midwest-ai-corridor',
    name: 'Midwest AI Corridor',
    status: 'CRITICAL',
    lat: 41.5,
    lng: -90.5,
    impact: {
      water: "Projected municipal water draw: 5M+ gallons/day from regional aquifers serving agricultural and residential communities.",
      grid: "Power demand equivalent to 3-4 mid-sized cities added to a grid already operating near baseload capacity in peak summer months.",
      permitting: "Multiple environmental review processes compressed or bypassed under economic development fast-track provisions. Local opposition documented in [counties].",
      community: "Stylized scenario based on documented patterns from multi-billion dollar AI campus proposals in the U.S. Midwest that stalled under power, environmental, and political constraints."
    },
    atlasScenarioId: 'midwest-ai-campuses-blocked'
  },
  {
    id: 'northern-virginia',
    name: 'Northern Virginia',
    status: 'ELEVATED',
    lat: 39.0,
    lng: -77.5,
    impact: {
      water: "[RESEARCH PENDING]",
      grid: "[RESEARCH PENDING]",
      permitting: "[RESEARCH PENDING]",
      community: "[RESEARCH PENDING]"
    },
    atlasScenarioId: 'cleanarc-va1'
  },
  {
    id: 'phoenix-chandler',
    name: 'Phoenix / Chandler AZ',
    status: 'ELEVATED',
    lat: 33.3,
    lng: -111.8,
    impact: {
      water: "[RESEARCH PENDING]",
      grid: "[RESEARCH PENDING]",
      permitting: "[RESEARCH PENDING]",
      community: "[RESEARCH PENDING]"
    },
    atlasScenarioId: 'aligned-phx-05'
  },
  {
    id: 'columbus-oh',
    name: 'Columbus OH Metro',
    status: 'ELEVATED',
    lat: 39.9,
    lng: -82.9,
    impact: {
      water: "[RESEARCH PENDING]",
      grid: "[RESEARCH PENDING]",
      permitting: "[RESEARCH PENDING]",
      community: "[RESEARCH PENDING]"
    },
    atlasScenarioId: null
  },
  {
    id: 'dallas-fort-worth',
    name: 'Dallas-Fort Worth TX',
    status: 'ELEVATED',
    lat: 32.7,
    lng: -97.0,
    impact: {
      water: "[RESEARCH PENDING]",
      grid: "[RESEARCH PENDING]",
      permitting: "[RESEARCH PENDING]",
      community: "[RESEARCH PENDING]"
    },
    atlasScenarioId: 'wistron-alliance-texas'
  }
];
