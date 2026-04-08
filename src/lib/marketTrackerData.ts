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
  exchange: 'NASDAQ' | 'NYSE' | 'PRIVATE';
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
    role: "AWS is the world's largest cloud provider, with the deepest global data-center footprint.",
    datacenterAngle: "Greenfield construction, land acquisition, power procurement, network backbone",
    stockPrice: "$185.00 [Live data: connect to API]",
    marketCap: "$1.9T [Live data: connect to API]",
    latestActivity: "AWS committed to $100B+ in U.S. data-center investment in 2026",
    constraintExposure: ["power", "land & permitting", "networking"],
    whyWeTrack: "Anchor driver of U.S. AI‑data‑center demand with $100B+ 2026 commitment; watch U.S. grid connections and land‑banking in constrained metros.",
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
    slug: 'alphabet',
    ticker: 'GOOGL',
    name: 'Alphabet',
    exchange: 'NASDAQ',
    category: 'AI Cloud Builders & Hyperscalers',
    tier: 'featured',
    logoUrl: 'https://logo.clearbit.com/abc.xyz',
    logoAlt: 'Alphabet logo',
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
    role: "EMCOR is a leading mechanical and electrical contractor for mission-critical data-center construction projects.",
    datacenterAngle: "Electrical contracting, mechanical installation",
    stockPrice: "$350.00 [Live data]",
    marketCap: "$16B [Live data]",
    latestActivity: "EMCOR's data-center segment hit record revenue in 2025, driven by hyperscaler construction contracts",
    constraintExposure: ["labor & construction"],
    whyWeTrack: "",
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
    role: "Lumentum supplies the optical transceivers and laser components that underpin high-bandwidth data-center interconnects.",
    datacenterAngle: "Optical transceivers, fiber interconnects",
    stockPrice: "$50.00 [Live data]",
    marketCap: "$3.5B [Live data]",
    latestActivity: "Lumentum secured major 800G and 1.6T optical transceiver design wins for hyperscale customers",
    constraintExposure: ["networking density", "fiber & optical"],
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
    role: "CyrusOne (now private under KKR) remains one of the most active data-center developers in North America; relevant for tracking private market pressure on REIT pricing.",
    datacenterAngle: "Hyperscale build-to-suit, private equity capital",
    stockPrice: "N/A [Private]",
    marketCap: "N/A [Private]",
    latestActivity: "CyrusOne pursuing large campus builds in Texas and Northern Virginia under new KKR ownership",
    constraintExposure: ["power availability", "land"],
    whyWeTrack: "",
    filings: []
  }
];
