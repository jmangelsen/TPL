export const CONSTRAINT_SIMULATOR_MARKETS = [
  { id: "nva",        tier: 1, label: "Northern Virginia",      city: "Ashburn / Manassas",   county: "Loudoun / Prince William", state: "VA" },
  { id: "dfw",        tier: 1, label: "Dallas–Fort Worth",      city: "Dallas / Fort Worth",  county: "Dallas / Tarrant",          state: "TX" },
  { id: "sv",         tier: 1, label: "Silicon Valley",         city: "San Jose / Santa Clara", county: "Santa Clara",             state: "CA" },
  { id: "chi",        tier: 1, label: "Chicago",                city: "Chicago / Elk Grove",  county: "Cook / DuPage",             state: "IL" },
  { id: "phx",        tier: 1, label: "Phoenix",                city: "Phoenix / Mesa / Goodyear", county: "Maricopa",            state: "AZ" },
  { id: "ny-tri",     tier: 1, label: "New York Tri-State",     city: "NYC / Secaucus / Newark", county: "New York / Bergen / Hudson", state: "NY / NJ" },
  { id: "atl",        tier: 1, label: "Atlanta",                city: "Atlanta / Douglasville", county: "Fulton / Douglas",      state: "GA" },
  { id: "hillsboro",  tier: 1, label: "Hillsboro / Portland",   city: "Hillsboro",            county: "Washington",                state: "OR" },
  { id: "aus-san",    tier: 2, label: "Austin–San Antonio",     city: "Austin / San Antonio", county: "Travis / Bexar",           state: "TX" },
  { id: "central-wa", tier: 2, label: "Central Washington",     city: "Quincy",               county: "Grant / Douglas",          state: "WA" },
  { id: "seattle",    tier: 2, label: "Seattle",                city: "Seattle",              county: "King",                      state: "WA" },
  { id: "so-cal",     tier: 2, label: "Southern California",    city: "Los Angeles / Inland Empire", county: "Los Angeles / San Bernardino", state: "CA" },
  { id: "denver",     tier: 2, label: "Denver",                 city: "Denver / Aurora",      county: "Denver / Adams",           state: "CO" },
  { id: "msp",        tier: 2, label: "Minneapolis–Saint Paul", city: "Minneapolis / Saint Paul", county: "Hennepin",            state: "MN" },
  { id: "clt-rdu",    tier: 2, label: "Charlotte–Raleigh",      city: "Charlotte / Raleigh",  county: "Mecklenburg / Wake",       state: "NC" },
  { id: "cmh",        tier: 2, label: "Columbus",               city: "Columbus",             county: "Franklin",                  state: "OH" },
  { id: "houston",    tier: 2, label: "Houston",                city: "Houston",              county: "Harris",                    state: "TX" },
  { id: "slc",        tier: 2, label: "Salt Lake City",         city: "Salt Lake City",       county: "Salt Lake",                 state: "UT" },
  { id: "kc",         tier: 2, label: "Kansas City",            city: "Kansas City",          county: "Jackson / Johnson",         state: "MO / KS" },
  { id: "reno",       tier: 2, label: "Reno / Tahoe-Reno",      city: "Reno / Tahoe-Reno",    county: "Storey / Washoe",           state: "NV" },
  { id: "central-or", tier: 2, label: "Central Oregon",         city: "Prineville / Bend",    county: "Crook / Deschutes",         state: "OR" },
  { id: "pa",         tier: 3, label: "Central / Eastern Pennsylvania", city: "Harrisburg / Wilkes-Barre", county: "Dauphin / Luzerne", state: "PA" },
  { id: "carolinas",  tier: 3, label: "Carolinas (Emerging)",  city: "York / Cabarrus",       county: "York / Cabarrus",           state: "SC / NC" },
  { id: "nj",         tier: 3, label: "New Jersey (Emerging)", city: "Middlesex / Mercer",    county: "Middlesex / Mercer",        state: "NJ" },
  { id: "ma",         tier: 3, label: "Massachusetts (Suburban)", city: "Boston Suburbs",    county: "Middlesex",                  state: "MA" },
  { id: "iowa",       tier: 3, label: "Iowa (Des Moines)",      city: "Des Moines",           county: "Polk",                      state: "IA" },
  { id: "montana",    tier: 3, label: "Montana (Emerging)",     city: "Bozeman / Billings",   county: "Gallatin / Yellowstone",    state: "MT" },
  { id: "mississippi",tier: 3, label: "Mississippi (Emerging)", city: "Madison County",       county: "Madison",                   state: "MS" },
];

export const DEFAULT_SIMULATOR_PRIORS: Record<string, Record<string, number>> = {
  "nva": { power: 9.0, cooling: 7.0, water: 6.0, permitting: 7.5, supply: 8.5, labor: 7.5 },
  "phx": { power: 8.0, cooling: 8.0, water: 9.0, permitting: 6.0, supply: 7.0, labor: 6.0 },
};

export const DEFAULT_SIMULATOR_SIGNALS: Record<string, Record<string, string>> = {
  "nva": {
    "Permitting Delay": "14.2 months",
    "Interconnection Queue": "5.8 years",
    "Transformer Lead Time": "118 weeks",
    "Water Risk": "Elevated",
    "Utility Capacity": "Constrained",
    "Cooling Pressure": "Rising",
    "Site Control Friction": "High",
    "Labor Tightness": "-12%"
  },
  "phx": {
    "Permitting Delay": "8.0 months",
    "Interconnection Queue": "3.0 years",
    "Transformer Lead Time": "90 weeks",
    "Water Risk": "Critical",
    "Utility Capacity": "Moderate",
    "Cooling Pressure": "High",
    "Site Control Friction": "Moderate",
    "Labor Tightness": "-8%"
  }
};
