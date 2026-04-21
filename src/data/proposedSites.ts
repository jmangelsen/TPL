export const proposedSites = [
  {
    id: 'stargate-abilene',
    name: "Project Stargate — Abilene TX",
    operator: "OpenAI / SoftBank / Oracle (Stargate JV)",
    coordinates: [32.4487, -99.7331],
    status: "APPROVED",
    statusColor: "#C44A1E",
    region: "West Texas",
    state: "TX",
    source: {
      label: "Stargate Project Public Announcement, January 2025",
      url: "https://openai.com/index/announcing-the-stargate-project/",
      date: "2025-01-21"
    },
    projectedData: {
      powerDrawMW: 1200,
      waterGallonsDay: null,
      acreage: null,
      estimatedCapex: "$100B+ (total Stargate commitment)"
    },
    projectedConstraintScore: null,
    projectedCapexScore: null,
    notes: "First Stargate campus site. 10 buildings planned on existing Oracle land in Abilene."
  },
  {
    id: 'meta-louisiana',
    name: "Meta — Louisiana AI Data Center",
    operator: "Meta Platforms",
    coordinates: [31.2448, -92.4451],
    status: "ANNOUNCED",
    statusColor: "#E8D5A0",
    region: "Central Louisiana",
    state: "LA",
    source: {
      label: "Meta Public Announcement, January 2025",
      url: "https://about.fb.com/news/2025/01/meta-ai-data-center-louisiana/",
      date: "2025-01-24"
    },
    projectedData: {
      powerDrawMW: null,
      waterGallonsDay: null,
      acreage: 4000,
      estimatedCapex: "$10B"
    },
    projectedConstraintScore: null,
    projectedCapexScore: null,
    notes: "Described by Meta as largest data center in the world upon completion. Located in Richland Parish."
  },
  {
    id: 'microsoft-mt-pleasant',
    name: "Microsoft — Mount Pleasant WI",
    operator: "Microsoft",
    coordinates: [42.7198, -88.0165],
    status: "APPROVED",
    statusColor: "#C44A1E",
    region: "Southeast Wisconsin",
    state: "WI",
    source: {
      label: "Village of Mount Pleasant Development Agreement",
      url: "https://www.mtpleasantwi.gov",
      date: "2023-06-01"
    },
    projectedData: {
      powerDrawMW: null,
      waterGallonsDay: null,
      acreage: 315,
      estimatedCapex: "$3.3B"
    },
    projectedConstraintScore: null,
    projectedCapexScore: null,
    notes: "Site of former Foxconn development. Microsoft acquired and repurposed for data center campus."
  },
  {
    id: 'google-nebraska',
    name: "Google — Central Nebraska",
    operator: "Google",
    coordinates: [41.1254, -100.7601],
    status: "PERMITTED",
    statusColor: "#D4A017",
    region: "Central Nebraska",
    state: "NE",
    source: {
      label: "Nebraska Public Power District Interconnection Filing",
      url: "https://www.nppd.com",
      date: "2024-01-01"
    },
    projectedData: {
      powerDrawMW: null,
      waterGallonsDay: null,
      acreage: null,
      estimatedCapex: null
    },
    projectedConstraintScore: null,
    projectedCapexScore: null,
    notes: "Google has existing data center presence in Council Bluffs IA and has filed interconnection requests with NPPD for Nebraska expansion."
  },
  {
    id: 'amazon-indiana',
    name: "Amazon — Indiana Campus Expansion",
    operator: "Amazon Web Services",
    coordinates: [39.7684, -86.1581],
    status: "ANNOUNCED",
    statusColor: "#E8D5A0",
    region: "Central Indiana",
    state: "IN",
    source: {
      label: "Indiana Economic Development Corporation",
      url: "https://iedc.in.gov",
      date: "2024-06-01"
    },
    projectedData: {
      powerDrawMW: null,
      waterGallonsDay: null,
      acreage: null,
      estimatedCapex: "$11B"
    },
    projectedConstraintScore: null,
    projectedCapexScore: null,
    notes: "AWS announced $11B Indiana investment commitment. Multiple sites across central Indiana corridor."
  }
];
