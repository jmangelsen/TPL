export type CompanyTier = 'featured' | 'stub';

export type Filing = {
  type: '10-K' | '10-Q' | '8-K' | 'DEF 14A' | '20-F' | '6-K' | 'Earnings Call';
  label: string;
  date: string;
  url: string;
  summary: string;
};

export type Company = {
  slug: string;
  ticker: string;
  name: string;
  exchange: 'NASDAQ' | 'NYSE' | 'PRIVATE' | 'EPA';
  category: string;
  tier: CompanyTier;
  role: string;
  datacenterAngle: string;
  stockPrice: string;
  marketCap: string;
  latestActivity: string;
  filings: Filing[];
  constraintExposure: string[];
  whyWeTrack: string;
  logoUrl?: string;
  logoAlt?: string;
  newsQuery?: string;
};

export const categories = [
  {
    id: 'hyperscalers',
    name: 'AI Cloud Builders & Hyperscalers',
    description: "The firms committing the largest multi‑year AI capex programs and shaping demand for every layer of the data‑center supply chain. Track their announced spend, geography mix, and power procurement strategies to gauge the pace and direction of AI buildout."
  },
  {
    id: 'power-cooling',
    name: 'Power, Cooling & Electrical Infrastructure',
    description: "The OEMs and contractors supplying the transformers, switchgear, UPS, and liquid‑cooling systems that constrain how quickly AI capacity can be brought online. Backlog size, lead times, and thermal‑management footprint are direct signals of build velocity and bottlenecks."
  },
  {
    id: 'chips-networking',
    name: 'Chips, Switching & Optical Networking',
    description: "The silicon and networking vendors that determine effective AI training capacity, rack density, and cluster scale. Follow GPU allocation, custom XPU programs, and optical design wins to understand which architectures are setting the physical limits of AI compute."
  },
  {
    id: 'power-generation-grid',
    name: 'Power Generation & Grid',
    description: "The generation companies and grid infrastructure providers supplying the firm, continuous power that AI training clusters demand. Their capacity commitments and utility agreements determine whether approved data-center projects can actually turn on."
  },
  {
    id: 'reits-operators',
    name: 'Data‑Center REITs & Developers',
    description: "The owners and developers of the powered shells, land banks, and interconnection campuses where AI infrastructure actually lives. Their pre‑leasing, MW deliveries, and regional mix reveal where hyperscaler demand is being absorbed — and where physical constraints are emerging."
  }
];

export const companies: Company[] = [
  // CATEGORY 1: AI Cloud Builders & Hyperscalers
  {
    slug: 'amazon',
    ticker: 'AMZN',
    name: 'Amazon',
    exchange: 'NASDAQ',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    logoAlt: 'Amazon logo',
    newsQuery: '"Amazon" AND ("data center" OR "AI infrastructure" OR "AWS")',
    role: "AWS is the world's largest cloud provider, with the deepest global data-center footprint.",
    datacenterAngle: "Greenfield construction, land acquisition, power procurement, network backbone",
    stockPrice: "$185.00 [Live data: connect to API]",
    marketCap: "$1.9T [Live data: connect to API]",
    latestActivity: "AWS committed to $100B+ in U.S. data-center investment in 2026",
    constraintExposure: ["power", "land & permitting", "networking"],
    whyWeTrack: "Anchor driver of U.S. data‑center demand; watch U.S. grid connections and land‑banking in constrained metros.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-01', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AMZN', summary: 'Detailed AWS capex expansion plans and infrastructure depreciation schedules.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-04-25', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AMZN', summary: 'Updates on data center construction pacing and capital leases.' },
      { type: '8-K', label: 'Material Event', date: '2026-03-15', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AMZN', summary: 'Announcement of major nuclear power purchase agreement.' }
    ]
  },
  {
    slug: 'microsoft',
    ticker: 'MSFT',
    name: 'Microsoft',
    exchange: 'NASDAQ',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
    logoAlt: 'Microsoft logo',
    newsQuery: '"Microsoft" AND ("data center" OR "AI infrastructure" OR "Azure")',
    role: "Azure's hyperscale buildout includes the largest committed AI infrastructure partnership with OpenAI.",
    datacenterAngle: "AI-dedicated campus builds, grid procurement, cooling scale-out",
    stockPrice: "$420.00 [Live data: connect to API]",
    marketCap: "$3.1T [Live data: connect to API]",
    latestActivity: "Microsoft scaling 2026 data-center capacity across 40+ countries, including a major grid-scale power agreement",
    constraintExposure: ["power", "cooling", "labor"],
    whyWeTrack: "Most diversified global AI buildout with major grid‑scale power deal; key read‑through on non‑U.S. interconnection, labor, and permitting friction.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2025-07-25', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MSFT', summary: 'Outlines Azure infrastructure investments and OpenAI partnership costs.' },
      { type: '10-Q', label: 'Q3 2026 Earnings', date: '2026-04-20', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MSFT', summary: 'Cloud revenue growth and server lifespan accounting changes.' },
      { type: '8-K', label: 'Material Event', date: '2026-02-10', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MSFT', summary: 'Disclosure of new multi-gigawatt renewable energy portfolio.' }
    ]
  },
  {
    slug: 'apple',
    ticker: 'AAPL',
    name: 'Apple',
    exchange: 'NASDAQ',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    logoAlt: 'Apple logo',
    newsQuery: '"Apple" AND ("data center" OR "AI infrastructure" OR "silicon")',
    role: "Apple operates one of the largest private data-center fleets globally and is a major driver of custom silicon supply chain constraints.",
    datacenterAngle: "Custom silicon, proprietary data-center buildout",
    stockPrice: "$180.00 [Live data]",
    marketCap: "$2.8T [Live data]",
    latestActivity: "Apple expanding custom silicon deployment across private data-center fleet",
    constraintExposure: ["custom silicon supply chain", "power"],
    whyWeTrack: "Custom silicon, proprietary data-center buildout, and supply chain execution are the primary physical-layer constraints.",
    filings: []
  },
  {
    slug: 'alphabet',
    ticker: 'GOOGL',
    name: 'Alphabet',
    exchange: 'NASDAQ',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/abc.xyz',
    logoAlt: 'Alphabet logo',
    newsQuery: '("Alphabet" OR "Google") AND ("data center" OR "AI infrastructure" OR "GCP")',
    role: "Google Cloud's infrastructure division operates one of the world's most energy-efficient large-scale data center fleets.",
    datacenterAngle: "Custom silicon, cooling R&D, land and water resource procurement",
    stockPrice: "$170.00 [Live data: connect to API]",
    marketCap: "$2.1T [Live data: connect to API]",
    latestActivity: "Alphabet disclosed $75B in 2026 capex, majority allocated to data-center infrastructure",
    constraintExposure: ["water & cooling", "power", "custom silicon supply chain"],
    whyWeTrack: "Leader in efficiency and custom silicon; water rights, cooling innovation, and supply chain execution are primary constraints.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-01-30', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=GOOGL', summary: 'Details on Google Cloud capex and TPUs deployment.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-04-22', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=GOOGL', summary: 'Updates on infrastructure spending and AI compute capacity.' },
      { type: '8-K', label: 'Material Event', date: '2026-03-05', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=GOOGL', summary: 'Announcement of new proprietary liquid cooling technology deployment.' }
    ]
  },
  {
    slug: 'meta',
    ticker: 'META',
    name: 'Meta Platforms',
    exchange: 'NASDAQ',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/meta.com',
    logoAlt: 'Meta Platforms logo',
    newsQuery: '"Meta" AND ("data center" OR "AI infrastructure" OR "GPU")',
    role: "Meta's AI infrastructure division is scaling data-center capacity specifically for LLM training and inference at hyperscale.",
    datacenterAngle: "AI training clusters, custom network fabric",
    stockPrice: "$500.00 [Live data]",
    marketCap: "$1.2T [Live data]",
    latestActivity: "Meta committed to $65B in AI infrastructure in 2026",
    constraintExposure: ["power", "networking"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'oracle',
    ticker: 'ORCL',
    name: 'Oracle',
    exchange: 'NYSE',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/oracle.com',
    logoAlt: 'Oracle logo',
    newsQuery: '"Oracle" AND ("data center" OR "OCI" OR "cloud infrastructure")',
    role: "Oracle Cloud Infrastructure is one of the fastest-growing public cloud platforms by data-center expansion footprint.",
    datacenterAngle: "Colocation expansion, sovereign cloud",
    stockPrice: "$120.00 [Live data]",
    marketCap: "$330B [Live data]",
    latestActivity: "Oracle secured major colocation and cloud expansion deals in MENA and Southeast Asia in early 2026",
    constraintExposure: ["land & permitting", "power"],
    whyWeTrack: "",
    filings: []
  },

  // CATEGORY 2: Power & Cooling Infrastructure
  {
    slug: 'vertiv',
    ticker: 'VRT',
    name: 'Vertiv',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/vertiv.com',
    logoAlt: 'Vertiv logo',
    newsQuery: '"Vertiv" AND ("data center" OR cooling OR "power systems")',
    role: "Vertiv is the dominant supplier of power distribution, UPS systems, and thermal management for data centers globally.",
    datacenterAngle: "Power distribution units, liquid cooling systems, rack-scale thermal",
    stockPrice: "$95.00 [Live data: connect to API]",
    marketCap: "$35B [Live data: connect to API]",
    latestActivity: "Vertiv reported record 2025 backlog exceeding $7B, driven by AI data-center orders",
    constraintExposure: ["power", "cooling", "supply chain lead times"],
    whyWeTrack: "Backlog and lead times are a direct proxy for how fast hyperscalers can add megawatts of AI capacity.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-15', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=VRT', summary: 'Full year backlog metrics and thermal management revenue breakdown.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-04-28', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=VRT', summary: 'Updates on liquid cooling product line expansion and order velocity.' },
      { type: '8-K', label: 'Material Event', date: '2026-01-10', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=VRT', summary: 'Acquisition of specialized liquid cooling component manufacturer.' }
    ]
  },
  {
    slug: 'modine',
    ticker: 'MOD',
    name: 'Modine Manufacturing',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/modine.com',
    logoAlt: 'Modine Manufacturing logo',
    newsQuery: '"Modine" AND ("data center" OR cooling OR thermal)',
    role: "Modine's data-center cooling segment is one of the fastest-growing in the thermal management sector.",
    datacenterAngle: "Precision cooling, liquid cooling infrastructure, airside economizers",
    stockPrice: "$110.00 [Live data: connect to API]",
    marketCap: "$5.8B [Live data: connect to API]",
    latestActivity: "Modine guided to 5-year data-center revenue runway driven by AI liquid cooling demand",
    constraintExposure: ["cooling", "thermal management capacity"],
    whyWeTrack: "Liquid‑cooling ramp is a key signal of rack‑level power density actually being deployed rather than just announced.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2025-05-25', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MOD', summary: 'Data center segment growth and margin expansion details.' },
      { type: '10-Q', label: 'Q3 2026 Earnings', date: '2026-02-05', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MOD', summary: 'Quarterly update on precision cooling order intake.' },
      { type: '8-K', label: 'Material Event', date: '2025-11-15', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MOD', summary: 'Announcement of new manufacturing facility dedicated to data center thermal products.' }
    ]
  },
  {
    slug: 'johnson-controls',
    ticker: 'JCI',
    name: 'Johnson Controls',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/johnsoncontrols.com',
    logoAlt: 'Johnson Controls logo',
    newsQuery: '"Johnson Controls" AND ("data center" OR cooling OR HVAC)',
    role: "Johnson Controls provides HVAC, chilled water, and building automation systems at the scale required for hyperscale data centers.",
    datacenterAngle: "Chilled water systems, CRAC/CRAH units, building management",
    stockPrice: "$70.00 [Live data: connect to API]",
    marketCap: "$48B [Live data: connect to API]",
    latestActivity: "Johnson Controls expanded its data-center division after divesting non-core segments, focusing on large-scale cooling contracts",
    constraintExposure: ["cooling", "water usage", "power efficiency"],
    whyWeTrack: "Portfolio tilt toward hyperscale HVAC and chilled water makes JCI a read‑through on large‑campus cooling demand and water‑usage policy risk.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2025-11-15', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=JCI', summary: 'Strategic shift towards data center applied HVAC solutions.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-01-30', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=JCI', summary: 'Data center vertical revenue growth and chiller backlog.' },
      { type: '8-K', label: 'Material Event', date: '2026-03-20', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=JCI', summary: 'Major hyperscale contract win for next-gen chilled water plants.' }
    ]
  },
  {
    slug: 'amphenol',
    ticker: 'APH',
    name: 'Amphenol',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/amphenol.com',
    logoAlt: 'Amphenol logo',
    newsQuery: '"Amphenol" AND ("data center" OR interconnect OR power)',
    role: "Amphenol supplies high-density interconnect and power connector systems critical to AI server and power distribution architecture.",
    datacenterAngle: "Power connectors, high-speed interconnects",
    stockPrice: "$120.00 [Live data]",
    marketCap: "$70B [Live data]",
    latestActivity: "Amphenol reported data-center as fastest-growing end market in Q4 2025 earnings",
    constraintExposure: ["supply chain lead times"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'emcor',
    ticker: 'EME',
    name: 'EMCOR Group',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/emcorgroup.com',
    logoAlt: 'EMCOR Group logo',
    newsQuery: '"EMCOR" AND ("data center" OR construction OR electrical)',
    role: "EMCOR is a leading mechanical and electrical contractor for mission-critical data-center construction projects.",
    datacenterAngle: "Electrical contracting, mechanical installation",
    stockPrice: "$350.00 [Live data]",
    marketCap: "$16B [Live data]",
    latestActivity: "EMCOR's data-center segment hit record revenue in 2025, driven by hyperscaler construction contracts",
    constraintExposure: ["labor & construction"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'eaton',
    ticker: 'ETN',
    name: 'Eaton',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/eaton.com',
    logoAlt: 'Eaton logo',
    newsQuery: '"Eaton" AND ("data center" OR "power distribution" OR "UPS")',
    role: "Eaton provides power distribution, UPS, and electrical management systems for AI data centers, with a 'chip-to-grid' strategy and recent acquisition of Boyd Thermal for liquid cooling.",
    datacenterAngle: "Power distribution, UPS, liquid cooling",
    stockPrice: "$320.00 [Live data]",
    marketCap: "$125B [Live data]",
    latestActivity: "Eaton's Electrical Americas data-center orders surged 200% in Q4 2025; $19.6B total backlog; NVIDIA Beam Rubin DSX platform co-developed for AI factory infrastructure",
    constraintExposure: ["power", "cooling", "supply chain lead times"],
    whyWeTrack: "Backlog size, lead times on electrical gear, and liquid cooling ramp are the most direct proxies for how fast AI factories can go from land to live megawatts.",
    filings: []
  },
  {
    slug: 'trane-technologies',
    ticker: 'TT',
    name: 'Trane Technologies',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/tranetechnologies.com',
    logoAlt: 'Trane Technologies logo',
    newsQuery: '"Trane Technologies" AND ("data center" OR cooling OR thermal)',
    role: "Trane provides thermal management and HVAC systems for AI data centers, including a 1GW liquid cooling reference design co-developed with NVIDIA.",
    datacenterAngle: "Thermal management, HVAC, liquid cooling",
    stockPrice: "$340.00 [Live data]",
    marketCap: "$75B [Live data]",
    latestActivity: "Trane optimized NVIDIA Omniverse DSX blueprint, freeing 22MW of cooling capacity and improving thermal performance by nearly 10% in Q1 2026",
    constraintExposure: ["cooling", "thermal management capacity", "water usage"],
    whyWeTrack: "Cooling efficiency directly determines usable compute density per MW; Trane's NVIDIA partnership and 1GW design wins are forward indicators of next-generation AI cluster buildout.",
    filings: []
  },
  {
    slug: 'schneider-electric',
    ticker: 'SU',
    name: 'Schneider Electric',
    exchange: 'EPA',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/se.com',
    logoAlt: 'Schneider Electric logo',
    newsQuery: '"Schneider Electric" AND ("data center" OR "power management" OR "EcoStruxure")',
    role: "Schneider Electric is the global leader in data-center power management, UPS systems, PDUs, and intelligent energy monitoring through its EcoStruxure IT platform.",
    datacenterAngle: "Power management, UPS, PDUs",
    stockPrice: "€220.00 [Live data]",
    marketCap: "€125B [Live data]",
    latestActivity: "Schneider Electric leads the global data-center power market with EcoStruxure, serving hyperscalers with integrated UPS, PDUs, and energy management across large-scale deployments",
    constraintExposure: ["power", "cooling", "supply chain lead times"],
    whyWeTrack: "As the largest global power management provider for data centers, Schneider's order visibility and lead times are a bellwether for electrical infrastructure constraints globally.",
    filings: []
  },
  {
    slug: 'parker-hannifin',
    ticker: 'PH',
    name: 'Parker-Hannifin',
    exchange: 'NYSE',
    category: 'Power, Cooling & Electrical Infrastructure',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/parker.com',
    logoAlt: 'Parker-Hannifin logo',
    newsQuery: '"Parker-Hannifin" AND ("data center" OR cooling OR thermal)',
    role: "Parker-Hannifin supplies fluid conveyance and thermal management systems for mission-critical data-center cooling applications.",
    datacenterAngle: "Fluid conveyance, thermal management",
    stockPrice: "$580.00 [Live data]",
    marketCap: "$75B [Live data]",
    latestActivity: "Parker-Hannifin named a top data-center cooling stock by Barclays in April 2026 for its fluid and thermal management exposure to AI density ramp",
    constraintExposure: ["cooling", "thermal management capacity"],
    whyWeTrack: "Fluid conveyance and thermal management at the rack level are hard constraints on liquid cooling deployments; Parker's component supply signals cooling buildout velocity.",
    filings: []
  },

  // CATEGORY 3: Chips & Networking Infrastructure
  {
    slug: 'nvidia',
    ticker: 'NVDA',
    name: 'Nvidia',
    exchange: 'NASDAQ',
    category: 'Chips, Switching & Optical Networking',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/nvidia.com',
    logoAlt: 'Nvidia logo',
    newsQuery: '"Nvidia" AND ("data center" OR GPU OR Blackwell OR "AI compute")',
    role: "Nvidia's GPU platforms are the primary compute substrate for AI training and inference in data centers globally.",
    datacenterAngle: "AI compute density, power per rack, liquid cooling requirements, GPU supply allocation",
    stockPrice: "$900.00 [Live data: connect to API]",
    marketCap: "$2.2T [Live data: connect to API]",
    latestActivity: "Nvidia Blackwell GPU allocation remains constrained through mid-2026 despite record production ramp",
    constraintExposure: ["supply chain", "power per rack", "liquid cooling requirements"],
    whyWeTrack: "GPU allocation, power envelope, and cooling requirements set the upper bound on practical cluster design for the rest of the stack.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-20', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=NVDA', summary: 'Data center revenue breakdown and supply chain commitments.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-05-20', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=NVDA', summary: 'Updates on Blackwell architecture shipments and networking attach rates.' },
      { type: '8-K', label: 'Material Event', date: '2026-03-18', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=NVDA', summary: 'Announcement of expanded foundry partnerships to ease supply constraints.' }
    ]
  },
  {
    slug: 'broadcom',
    ticker: 'AVGO',
    name: 'Broadcom',
    exchange: 'NASDAQ',
    category: 'Chips, Switching & Optical Networking',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/broadcom.com',
    logoAlt: 'Broadcom logo',
    newsQuery: '"Broadcom" AND ("data center" OR ASIC OR networking OR optical)',
    role: "Broadcom supplies networking ASICs, custom AI accelerators, and the high-speed switching infrastructure underpinning hyperscale data-center backbones.",
    datacenterAngle: "Custom AI chips (XPUs), Ethernet switching silicon, optical interconnects",
    stockPrice: "$1300.00 [Live data: connect to API]",
    marketCap: "$600B [Live data: connect to API]",
    latestActivity: "Broadcom disclosed 3 hyperscaler XPU partnerships in 2025 annual filings, signaling a major custom chip revenue ramp",
    constraintExposure: ["networking density", "custom silicon supply", "fiber & optical"],
    whyWeTrack: "Custom XPU and networking ASIC programs indicate where next‑generation AI fabrics and memory hierarchies will concentrate.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2025-12-15', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AVGO', summary: 'Custom silicon revenue metrics and networking switch port shipments.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-03-05', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AVGO', summary: 'Updates on Tomahawk 5 deployments and AI revenue guidance.' },
      { type: '8-K', label: 'Material Event', date: '2026-01-20', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AVGO', summary: 'Confirmation of new multi-year custom ASIC agreement with major cloud provider.' }
    ]
  },
  {
    slug: 'arista',
    ticker: 'ANET',
    name: 'Arista Networks',
    exchange: 'NYSE',
    category: 'Chips, Switching & Optical Networking',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/arista.com',
    logoAlt: 'Arista Networks logo',
    newsQuery: '"Arista Networks" AND ("data center" OR switching OR ethernet)',
    role: "Arista is the dominant Ethernet switching vendor inside AI data-center fabrics, enabling the spine-leaf architectures that connect GPU clusters.",
    datacenterAngle: "AI back-end network fabric, high-density Ethernet switching, spine-leaf topology",
    stockPrice: "$300.00 [Live data: connect to API]",
    marketCap: "$95B [Live data: connect to API]",
    latestActivity: "Arista disclosed that AI/cloud customers now represent over 50% of revenue in 2025 filings",
    constraintExposure: ["networking density", "fiber & optical interconnect"],
    whyWeTrack: "Switching roadmap and cloud revenue mix show how quickly AI fabrics are moving to higher‑radix, higher‑bandwidth designs.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-12', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ANET', summary: 'Cloud titan revenue concentration and 800G switch cycle updates.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-05-05', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ANET', summary: 'AI networking revenue contribution and supply chain lead times.' },
      { type: '8-K', label: 'Material Event', date: '2025-11-02', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ANET', summary: 'Launch of next-generation AI spine switches.' }
    ]
  },
  {
    slug: 'amd',
    ticker: 'AMD',
    name: 'AMD',
    exchange: 'NASDAQ',
    category: 'Chips, Switching & Optical Networking',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/amd.com',
    logoAlt: 'AMD logo',
    newsQuery: '"AMD" AND ("data center" OR GPU OR Instinct OR "AI compute")',
    role: "AMD Instinct GPUs are the primary competitive alternative to Nvidia for AI compute in data centers, with growing adoption by hyperscalers.",
    datacenterAngle: "AI accelerators, server CPUs",
    stockPrice: "$170.00 [Live data]",
    marketCap: "$275B [Live data]",
    latestActivity: "AMD MI350 GPU ramp targeting hyperscaler deployments through 2026",
    constraintExposure: ["supply chain", "power per rack"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'lumentum',
    ticker: 'LITE',
    name: 'Lumentum',
    exchange: 'NASDAQ',
    category: 'Chips, Switching & Optical Networking',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/lumentum.com',
    logoAlt: 'Lumentum logo',
    newsQuery: '"Lumentum" AND ("data center" OR optical OR transceiver)',
    role: "Lumentum supplies the optical transceivers and laser components that underpin high-bandwidth data-center interconnects.",
    datacenterAngle: "Optical transceivers, fiber interconnects",
    stockPrice: "$50.00 [Live data]",
    marketCap: "$3.5B [Live data]",
    latestActivity: "Lumentum secured major 800G and 1.6T optical transceiver design wins for hyperscale customers",
    constraintExposure: ["networking density", "fiber & optical"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'marvell',
    ticker: 'MRVL',
    name: 'Marvell Technology',
    exchange: 'NASDAQ',
    category: 'Chips, Switching & Optical Networking',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/marvell.com',
    logoAlt: 'Marvell Technology logo',
    newsQuery: '"Marvell" AND ("data center" OR ASIC OR optical OR DSP)',
    role: "Marvell supplies custom AI silicon, high-speed interconnects, and optical DSPs for hyperscaler XPU programs and AI cluster networking.",
    datacenterAngle: "Custom AI silicon, optical DSPs, high-speed interconnects",
    stockPrice: "$75.00 [Live data]",
    marketCap: "$65B [Live data]",
    latestActivity: "Marvell disclosed multiple hyperscaler custom AI accelerator programs contributing to a projected multi-billion AI silicon revenue ramp through 2027",
    constraintExposure: ["custom silicon supply", "networking density", "fiber & optical"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'coherent',
    ticker: 'COHR',
    name: 'Coherent Corp',
    exchange: 'NYSE',
    category: 'Chips, Switching & Optical Networking',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/coherent.com',
    logoAlt: 'Coherent Corp logo',
    newsQuery: '"Coherent" AND ("data center" OR optical OR transceiver OR laser)',
    role: "Coherent is a major supplier of 800G and 1.6T optical transceivers and laser components for hyperscale data-center interconnects.",
    datacenterAngle: "Optical transceivers, laser components",
    stockPrice: "$60.00 [Live data]",
    marketCap: "$9B [Live data]",
    latestActivity: "Coherent secured major 800G and 1.6T design wins for hyperscale optical interconnect deployments in 2025–2026",
    constraintExposure: ["fiber & optical interconnect", "networking density"],
    whyWeTrack: "",
    filings: []
  },

  // CATEGORY 4: Data Center REITs & Operators
  {
    slug: 'equinix',
    ticker: 'EQIX',
    name: 'Equinix',
    exchange: 'NASDAQ',
    category: 'Data‑Center REITs & Developers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/equinix.com',
    logoAlt: 'Equinix logo',
    newsQuery: '"Equinix" AND ("data center" OR colocation OR interconnection)',
    role: "Equinix is the world's largest colocation provider, operating across 70+ metros globally with a dense interconnection fabric.",
    datacenterAngle: "Colocation, interconnection, private network exchange, edge deployments",
    stockPrice: "$850.00 [Live data: connect to API]",
    marketCap: "$80B [Live data: connect to API]",
    latestActivity: "Equinix xScale expansion with hyperscalers continues in APAC, EMEA, and North America through 2026",
    constraintExposure: ["power procurement", "land & permitting", "interconnection density"],
    whyWeTrack: "Interconnection density and xScale JV activity reveal where multitenant campuses can still accommodate AI megawatt blocks.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-25', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=EQIX', summary: 'Global cabinet billing metrics and xScale joint venture capitalization.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-05-01', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=EQIX', summary: 'Updates on power pricing trends and interconnection revenue.' },
      { type: '8-K', label: 'Material Event', date: '2026-03-10', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=EQIX', summary: 'Announcement of new multi-market hyperscale leasing agreements.' }
    ]
  },
  {
    slug: 'digital-realty',
    ticker: 'DLR',
    name: 'Digital Realty',
    exchange: 'NYSE',
    category: 'Data‑Center REITs & Developers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/digitalrealty.com',
    logoAlt: 'Digital Realty logo',
    newsQuery: '"Digital Realty" AND ("data center" OR wholesale OR leasing)',
    role: "Digital Realty is the largest wholesale data-center REIT, serving hyperscalers with large-block power and space across key global markets.",
    datacenterAngle: "Wholesale colocation, build-to-suit, multi-market platform",
    stockPrice: "$145.00 [Live data: connect to API]",
    marketCap: "$45B [Live data: connect to API]",
    latestActivity: "Digital Realty completed 100MW+ of new capacity in key U.S. and European markets in late 2025",
    constraintExposure: ["power availability", "land", "permitting"],
    whyWeTrack: "Wholesale deliveries and land pipeline are a proxy for hyperscaler absorption in power‑constrained metros.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-28', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=DLR', summary: 'Development pipeline yields and regional power constraint disclosures.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-05-05', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=DLR', summary: 'Leasing volume updates and renewal spread metrics.' },
      { type: '8-K', label: 'Material Event', date: '2026-01-15', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=DLR', summary: 'Formation of new development joint venture for AI campuses.' }
    ]
  },
  {
    slug: 'iron-mountain',
    ticker: 'IRM',
    name: 'Iron Mountain',
    exchange: 'NYSE',
    category: 'Data‑Center REITs & Developers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/ironmountain.com',
    logoAlt: 'Iron Mountain logo',
    newsQuery: '"Iron Mountain" AND ("data center" OR colocation OR leasing)',
    role: "Iron Mountain's data-center division is one of the fastest-growing REIT-based operators, with an emerging AI-focused infrastructure strategy.",
    datacenterAngle: "Colocation, hyperscale partnerships, renewable energy-aligned campuses",
    stockPrice: "$80.00 [Live data: connect to API]",
    marketCap: "$23B [Live data: connect to API]",
    latestActivity: "Iron Mountain guided to 500MW+ of data-center IT capacity by 2027 in Q4 2025 earnings",
    constraintExposure: ["power procurement", "renewable energy alignment", "capacity ramp"],
    whyWeTrack: "Fastest‑growing REIT data‑center platform; disclosures on MW ramp and PPA strategy are early signals of secondary‑market AI buildout.",
    filings: [
      { type: '10-K', label: 'Annual Report 2025', date: '2026-02-20', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=IRM', summary: 'Data center segment growth vs legacy storage business.' },
      { type: '10-Q', label: 'Q1 2026 Earnings', date: '2026-05-02', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=IRM', summary: 'Updates on pre-leasing activity for under-construction campuses.' },
      { type: '8-K', label: 'Material Event', date: '2025-12-10', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=IRM', summary: 'Major land acquisition for future data center development.' }
    ]
  },
  {
    slug: 'american-tower',
    ticker: 'AMT',
    name: 'American Tower',
    exchange: 'NYSE',
    category: 'Data‑Center REITs & Developers',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/americantower.com',
    logoAlt: 'American Tower logo',
    newsQuery: '"American Tower" AND ("data center" OR CoreSite OR edge)',
    role: "American Tower's data-center and edge compute expansion represents a structural shift from tower REIT to multi-asset infrastructure platform.",
    datacenterAngle: "Edge compute, interconnection",
    stockPrice: "$200.00 [Live data]",
    marketCap: "$93B [Live data]",
    latestActivity: "American Tower CoreSite division continues expanding in primary U.S. data-center markets through 2026",
    constraintExposure: ["land & permitting", "networking"],
    whyWeTrack: "",
    filings: []
  },
  {
    slug: 'cyrusone',
    ticker: 'PRIVATE',
    name: 'CyrusOne',
    exchange: 'PRIVATE',
    category: 'Data‑Center REITs & Developers',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/cyrusone.com',
    logoAlt: 'CyrusOne logo',
    newsQuery: '"CyrusOne" AND ("data center" OR development OR leasing)',
    role: "CyrusOne (now private under KKR) remains one of the most active data-center developers in North America; relevant for tracking private market pressure on REIT pricing.",
    datacenterAngle: "Hyperscale build-to-suit, private equity capital",
    stockPrice: "N/A [Private]",
    marketCap: "N/A [Private]",
    latestActivity: "CyrusOne pursuing large campus builds in Texas and Northern Virginia under new KKR ownership",
    constraintExposure: ["power availability", "land"],
    whyWeTrack: "",
    filings: []
  },

  // CATEGORY 5: Power Generation & Grid
  {
    slug: 'ge-vernova',
    ticker: 'GEV',
    name: 'GE Vernova',
    exchange: 'NYSE',
    category: 'Power Generation & Grid',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/gevernova.com',
    logoAlt: 'GE Vernova logo',
    newsQuery: '"GE Vernova" AND ("data center" OR power OR turbine)',
    role: "GE Vernova supplies gas turbines, grid solutions, and electrification products directly tied to AI data-center power infrastructure, including JVs with Chevron and NRG for multi-gigawatt AI data-center power delivery.",
    datacenterAngle: "Gas turbines, grid solutions, electrification",
    stockPrice: "$180.00 [Live data]",
    marketCap: "$50B [Live data]",
    latestActivity: "GE Vernova backlog tied to AI data-center power agreements; multi-GW turbine JVs with Chevron and NRG confirmed for dedicated AI campus power",
    constraintExposure: ["power", "supply chain lead times"],
    whyWeTrack: "Gas turbine lead times and order backlog are a direct constraint on how quickly new AI campuses can achieve firm, on-site power — independent of grid interconnection timelines.",
    filings: []
  },
  {
    slug: 'constellation-energy',
    ticker: 'CEG',
    name: 'Constellation Energy',
    exchange: 'NASDAQ',
    category: 'Power Generation & Grid',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/constellationenergy.com',
    logoAlt: 'Constellation Energy logo',
    newsQuery: '"Constellation Energy" AND ("data center" OR nuclear OR PPA)',
    role: "Constellation is the largest US nuclear fleet operator, securing 20-year PPAs with Microsoft and Meta to supply carbon-free baseload power for 24/7 AI compute loads.",
    datacenterAngle: "Nuclear baseload power, PPAs",
    stockPrice: "$220.00 [Live data]",
    marketCap: "$70B [Live data]",
    latestActivity: "Constellation restarting Three Mile Island under 20-year Microsoft PPA; signed 1.1GW Meta PPA for Clinton Clean Energy Center; DOE backing with $1B loan guarantee",
    constraintExposure: ["power", "water & cooling"],
    whyWeTrack: "Nuclear baseload power is increasingly the only energy source that satisfies hyperscaler 24/7, carbon-free, firm power requirements — making Constellation's nuclear fleet a physical constraint on the most premium AI campuses.",
    filings: []
  },
  {
    slug: 'vistra',
    ticker: 'VST',
    name: 'Vistra',
    exchange: 'NYSE',
    category: 'Power Generation & Grid',
    tier: 'stub',
    logoUrl: 'https://logo.clearbit.com/vistracorp.com',
    logoAlt: 'Vistra logo',
    newsQuery: '"Vistra" AND ("data center" OR power OR generation)',
    role: "Vistra is an integrated merchant power company securing major long-term data-center power contracts in Texas and expanding its generation fleet for AI electricity demand.",
    datacenterAngle: "Merchant power, long-term contracts",
    stockPrice: "$85.00 [Live data]",
    marketCap: "$30B [Live data]",
    latestActivity: "Vistra secured major Texas data-center power contracts in early 2026; acquiring 2,600MW of natural gas capacity to serve growing AI power demand",
    constraintExposure: ["power"],
    whyWeTrack: "As AI data-center power demand strains competitive power markets, Vistra's merchant generation and long-term contract visibility is a read-through on power availability and pricing in key AI buildout markets like Texas.",
    filings: []
  }
];
