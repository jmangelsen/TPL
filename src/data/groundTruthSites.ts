export const groundTruthSites = [
  {
    slug: "midwest-ai-corridor",
    name: "Midwest AI Campuses",
    status: "CRITICAL",
    region: "Iowa · Illinois · Indiana",
    corridorDescription: "Estimated build corridor: 340 miles",
    lastUpdated: "April 2026",
    coordinates: [41.5, -93.0],
    metrics: {
      powerDrawMW: 1200,
      waterGallonsDay: 5000000,
      estimatedCapex: "$2.1B+"
    },
    humanHeadline: "Multi-billion dollar AI campus proposals advanced through land acquisition and state incentives — then stalled when they met the physical limits of the communities they were built to displace.",
    dimensions: [
      {
        id: "water",
        name: "WATER",
        icon: "Droplets",
        metric: "5,000,000",
        unit: "GALLONS PER DAY",
        severity: "red",
        headline: "A water system built for farming communities, now serving machine cooling",
        body: "Hyperscale AI data center campuses rely on evaporative cooling systems that consume water at industrial scale. A single large campus can draw 3-5 million gallons per day from regional water systems — equivalent to the daily consumption of a city of 30,000-50,000 people.\n\nIn the U.S. Midwest, these draws pull from the same aquifer systems and municipal water sources that serve agricultural operations and residential communities across rural counties. Unlike urban water systems designed for high-density demand, rural Midwestern water infrastructure was built for a fundamentally different load profile.\n\nWhen build proposals advance faster than water impact assessments, communities often learn of the draw only after permits are filed — leaving limited time for public comment or infrastructure planning.",
        source: "Based on publicly reported water consumption figures for hyperscale data center cooling systems. See: Goldman Sachs Research, AI Data Center Water Consumption, 2024"
      },
      {
        id: "grid",
        name: "GRID",
        icon: "Zap",
        metric: "3-4 CITIES",
        unit: "EQUIVALENT POWER DEMAND",
        severity: "red",
        headline: "Power demand equivalent to multiple mid-sized cities, added to a grid near its limit",
        body: "A single hyperscale AI campus in the 100-500MW range adds power demand equivalent to 3-4 mid-sized cities to the regional grid. In the Midwest, where grid operators like MISO are already managing aging transmission infrastructure and increasing renewable intermittency, new large loads require costly interconnection upgrades that can take 5-7 years to complete.\n\nThe gap between when a developer announces a project and when the grid can actually support it creates a constraint window — a period where either the build stalls, the community absorbs grid instability, or ratepayers fund the upgrade through increased utility rates.\n\nCommunities adjacent to proposed campus sites rarely receive advance notice about how interconnection costs will be allocated across the regional rate base.",
        source: "MISO 2024 Transmission Expansion Plan; Lawrence Berkeley National Laboratory, Queued Up: Characteristics of Power Plants Seeking Transmission Interconnection, 2024"
      },
      {
        id: "permitting",
        name: "PERMITTING",
        icon: "FileText",
        metric: null,
        unit: null,
        severity: null,
        headline: "Environmental review under pressure from economic development timelines",
        body: "State economic development frameworks in the Midwest — including those in Iowa, Indiana, and Illinois — include provisions that allow permitting timelines to be compressed when projects meet certain job creation or capital investment thresholds.\n\nThese fast-track provisions can shorten or modify environmental impact review processes that would otherwise require extended public comment periods, detailed water use studies, or cumulative impact assessments. The result is that communities affected by a proposed build may have weeks rather than months to understand and respond to its implications.\n\nMultiple AI campus proposals in the Midwest corridor have encountered organized opposition from local agricultural associations, environmental groups, and county governments after early permitting disclosures revealed scale of water and grid demands.",
        source: "Iowa Economic Development Authority fast-track provisions; documented public comment records from applicable county zoning boards (available via public records request)"
      },
      {
        id: "community",
        name: "COMMUNITY",
        icon: "Users",
        metric: null,
        unit: null,
        severity: null,
        headline: "Who bears the cost when capital moves faster than infrastructure?",
        body: "The Midwest AI Campuses scenario is a stylized but evidence-grounded pattern: a build proposal advances through land acquisition, state incentive packages, and early site works — generating significant local optimism about jobs and tax revenue — only to stall when it meets the physical limits of power grids, water systems, and environmental review processes.\n\nWhen a stall occurs, the community bears asymmetric costs. Land values near proposed sites fluctuate. Agricultural operations that deferred investment decisions based on anticipated water constraints face uncertainty. Local governments that built budget projections around anticipated tax revenue must revise them.\n\nThe jobs and tax revenue that justified the incentive packages and permitting accommodations may not materialize on the promised timeline — or at all. The infrastructure pressure on water and grid systems, however, begins the moment construction starts.",
        source: "Stylized scenario based on documented patterns from multiple Midwest AI campus proposals. TPL Ground Truth analysis."
      },
      {
        id: "economics",
        name: "ECONOMICS",
        icon: "BarChart2",
        metric: null,
        unit: null,
        severity: null,
        headline: "The jobs and tax revenue argument — and what it leaves out",
        body: "State incentive packages for AI data center campuses routinely cite job creation and property tax revenue as primary community benefits. These projections are real — a large campus does create permanent jobs and generates significant property tax revenue once operational.\n\nWhat the projections often do not include: the construction phase relies heavily on specialized out-of-state labor, meaning job creation in the local community is concentrated in the operational phase. Tax abatement agreements — common in Midwest economic development packages — can defer the community's receipt of property tax revenue for 10-15 years after the campus opens.\n\nThe net fiscal impact for host communities depends heavily on whether the abatement period, the grid and water infrastructure upgrade costs allocated to ratepayers, and the operational job count all meet initial projections. In constrained build scenarios, where the project stalls before full operation, none of these benefits are realized.",
        source: "Good Jobs First, Subsidy Tracker: Data Center Tax Incentives, 2023-2024; National Conference of State Legislatures, Data Center Tax Incentive Policies, 2024"
      }
    ],
    constraintScore: 9.5,
    capexScore: 6.5,
    sources: [
      {
        name: "Queued Up: Characteristics of Power Plants Seeking Interconnection",
        pub: "Lawrence Berkeley National Laboratory",
        date: "2024",
        desc: "Documents the multi-year queue and cost burden of grid interconnection requests across the U.S., including Midwest MISO.",
        url: "https://emp.lbl.gov/queues"
      },
      {
        name: "AI and Energy: The Data Center Boom",
        pub: "Goldman Sachs Research",
        date: "2024",
        desc: "Estimates water consumption and power demand implications of hyperscale AI data center buildout.",
        url: "https://www.goldmansachs.com/insights/articles/AI-poised-to-drive-160-increase-in-power-demand"
      },
      {
        name: "Data Center Tax Incentives — Subsidy Tracker",
        pub: "Good Jobs First",
        date: "2023-2024",
        desc: "Tracks state and local tax incentives granted to data center developers, including abatement periods and job commitments.",
        url: "https://subsidytracker.goodjobsfirst.org"
      },
      {
        name: "MISO Transmission Expansion Plan 2024",
        pub: "Midcontinent Independent System Operator",
        date: "2024",
        desc: "Documents planned transmission upgrades and interconnection queue for the Midwest grid region.",
        url: "https://www.misoenergy.org/planning/transmission-planning/"
      },
      {
        name: "Data Center Tax Incentive Policies by State",
        pub: "National Conference of State Legislatures",
        date: "2024",
        desc: "Overview of state-level economic development frameworks including fast-track permitting provisions.",
        url: "https://www.ncsl.org"
      }
    ]
  },
  {
    slug: "northern-virginia",
    name: "Northern Virginia",
    status: "RESEARCH PENDING",
    region: "Virginia",
    corridorDescription: "[RESEARCH PENDING]",
    lastUpdated: "April 2026",
    coordinates: [38.8, -77.5],
    metrics: { powerDrawMW: null, waterGallonsDay: null, estimatedCapex: null },
    humanHeadline: "[RESEARCH PENDING]",
    dimensions: [],
    constraintScore: null,
    capexScore: null,
    sources: []
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    status: "RESEARCH PENDING",
    region: "Arizona",
    corridorDescription: "[RESEARCH PENDING]",
    lastUpdated: "April 2026",
    coordinates: [33.4, -112.0],
    metrics: { powerDrawMW: null, waterGallonsDay: null, estimatedCapex: null },
    humanHeadline: "[RESEARCH PENDING]",
    dimensions: [],
    constraintScore: null,
    capexScore: null,
    sources: []
  },
  {
    slug: "columbus",
    name: "Columbus",
    status: "RESEARCH PENDING",
    region: "Ohio",
    corridorDescription: "[RESEARCH PENDING]",
    lastUpdated: "April 2026",
    coordinates: [39.9, -82.9],
    metrics: { powerDrawMW: null, waterGallonsDay: null, estimatedCapex: null },
    humanHeadline: "[RESEARCH PENDING]",
    dimensions: [],
    constraintScore: null,
    capexScore: null,
    sources: []
  },
  {
    slug: "dallas-fort-worth",
    name: "Dallas-Fort Worth",
    status: "RESEARCH PENDING",
    region: "Texas",
    corridorDescription: "[RESEARCH PENDING]",
    lastUpdated: "April 2026",
    coordinates: [32.7, -97.0],
    metrics: { powerDrawMW: null, waterGallonsDay: null, estimatedCapex: null },
    humanHeadline: "[RESEARCH PENDING]",
    dimensions: [],
    constraintScore: null,
    capexScore: null,
    sources: []
  }
];
