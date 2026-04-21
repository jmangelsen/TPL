import { FeatureCollection, Point, LineString } from 'geojson';

export type MapProjectId =
  | 'midwest-ai-campuses-blocked'
  | 'cleanarc-va1'
  | 'wistron-alliance-texas'
  | 'aligned-phx-05'
  | 'project-bunkhouse'
  | 'hydravault-chicago';

export interface MapProject {
  id: MapProjectId;
  name: string;
  marketLabel: string;    // used in copy, not as a filter
  summary: string;
  status: 'FAILURE' | 'SUCCESS';
  // 0–10 constraint and capital scores per category
  constraintScores: {
    power: number;
    cooling: number;
    water: number;
    labor: number;
    supply: number;
    permitting: number;
  };
  capitalScores: {
    power: number;
    cooling: number;
    water: number;
    labor: number;
    supply: number;
    permitting: number;
  };
}

export const MAP_PROJECTS: MapProject[] = [
  {
    id: 'midwest-ai-campuses-blocked',
    name: 'Midwest AI Campuses — Blocked Build',
    marketLabel: 'Midwest AI Corridor',
    status: 'FAILURE',
    summary:
      'Stylized failure scenario based on multi‑billion AI data center campuses in the U.S. Midwest that advanced through land, incentives, and early works but stalled under power, environmental, and political constraints.',
    constraintScores: {
      power: 9.5,
      cooling: 7.0,
      water: 7.5,
      labor: 6.0,
      supply: 8.0,
      permitting: 9.0,
    },
    capitalScores: {
      power: 6.5,
      cooling: 7.5,
      water: 5.5,
      labor: 7.0,
      supply: 8.5,
      permitting: 4.5,
    },
  },
  {
    id: 'cleanarc-va1',
    name: 'CleanArc VA1 Hyperscale Campus',
    marketLabel: 'Northern Virginia / Virginia',
    status: 'SUCCESS',
    summary:
      'Three‑phase 900 MW campus illustrating power and policy constraints in Virginia.',
    constraintScores: { power: 9.0, cooling: 7.5, water: 6.5, labor: 6.5, supply: 8.5, permitting: 8.0 },
    capitalScores:    { power: 8.0, cooling: 7.0, water: 6.0, labor: 6.5, supply: 7.5, permitting: 6.5 },
  },
  {
    id: 'wistron-alliance-texas',
    name: 'Wistron AI Supercomputing Facilities',
    marketLabel: 'Dallas–Fort Worth',
    status: 'SUCCESS',
    summary:
      'Two AI supercomputing facilities at AllianceTexas capturing Sunbelt grid and labor dynamics.',
    constraintScores: { power: 8.0, cooling: 7.0, water: 5.5, labor: 6.0, supply: 7.5, permitting: 6.5 },
    capitalScores:    { power: 7.5, cooling: 7.0, water: 5.0, labor: 6.0, supply: 7.0, permitting: 5.5 },
  },
  {
    id: 'aligned-phx-05',
    name: 'Aligned PHX‑05 Hyperscale Data Center',
    marketLabel: 'Phoenix',
    status: 'SUCCESS',
    summary:
      'High‑density desert facility illustrating water and cooling constraints in Phoenix.',
    constraintScores: { power: 7.5, cooling: 8.5, water: 8.5, labor: 6.0, supply: 7.0, permitting: 6.0 },
    capitalScores:    { power: 7.0, cooling: 8.0, water: 7.5, labor: 5.5, supply: 6.5, permitting: 5.5 },
  },
  {
    id: 'project-bunkhouse',
    name: 'Project Bunkhouse Mega Campus',
    marketLabel: 'Atlanta Metro',
    status: 'FAILURE',
    summary:
      'Proposed $19B mega campus outside Atlanta facing zoning and community risk.',
    constraintScores: { power: 8.5, cooling: 7.0, water: 7.5, labor: 6.5, supply: 7.5, permitting: 9.0 },
    capitalScores:    { power: 7.0, cooling: 6.5, water: 6.0, labor: 6.0, supply: 7.0, permitting: 4.0 },
  },
  {
    id: 'hydravault-chicago',
    name: 'HydraVault AI Data Center',
    marketLabel: 'Chicago',
    status: 'SUCCESS',
    summary:
      'Urban AI data center retrofit with high‑density liquid cooling in Chicago.',
    constraintScores: { power: 8.0, cooling: 8.0, water: 7.0, labor: 6.0, supply: 7.0, permitting: 7.5 },
    capitalScores:    { power: 7.5, cooling: 8.0, water: 6.5, labor: 6.0, supply: 6.5, permitting: 6.5 },
  },
];

export const mapToTechnology = (primSource: string, plantName: string): string => {
  const source = primSource.toLowerCase();
  if (source.includes('solar')) return 'Solar';
  if (source.includes('wind')) return 'Wind';
  if (source.includes('nuclear')) return 'Nuclear';
  if (source.includes('hydro')) return 'Hydro';
  if (source.includes('gas') || source.includes('ng')) return 'Gas';
  if (source.includes('coal')) return 'Coal';
  if (source.includes('oil') || source.includes('petroleum')) return 'Oil';
  if (source.includes('geothermal')) return 'Geothermal';
  if (source.includes('biomass')) return 'Biomass';
  if (source.includes('storage') || source.includes('battery')) return 'Storage';
  return 'Other';
};

export const technologyColors: Record<string, string> = {
  Solar: '#FFE066',
  Wind: '#6BE0FF',
  'Offshore Wind': '#97A7FF',
  Storage: '#FF6BCB',
  Nuclear: '#A0FFEA',
  Hydro: '#8BD3FF',
  Gas: '#FFB85C',
  Coal: '#FF8C5C',
  Oil: '#FF9ED1',
  Geothermal: '#A5FF7A',
  Biomass: '#C3FF9E',
  Other: '#CCCCCC',
};

export interface PlantProps { id: string; name: string; capacityMW: number; technology: string; state: string; status: string; }
export interface TxProps { id: string; voltageKV: number; owner: string; }
export interface SubstationProps { id: string; name: string; voltageKV: number; owner: string; }
export interface DataCenterProps { id: string; name: string; type: string; status: string; powerDrawMW?: number; }

export type PlantsGeoJSON = FeatureCollection<Point, PlantProps>;

const getCachedData = (key: string, ttl: number) => {
  const cached = typeof window === 'undefined' ? null : localStorage.getItem(key);
  if (!cached) return null;
  const { fetchedAt, data } = JSON.parse(cached);
  if (Date.now() - fetchedAt > ttl) return null;
  return data;
};

const setCachedData = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), data }));
};

export async function getPlantsGeoJSON(): Promise<PlantsGeoJSON> {
  const key = 'tpl_plants_v1';
  const cached = getCachedData(key, 36 * 60 * 60 * 1000);
  if (cached) return cached;

  const resp = await fetch('/data/plants.geojson');
  if (!resp.ok) {
    const text = await resp.text();
    console.error('Plants fetch failed', resp.status, text);
    throw new Error('Plants fetch failed');
  }

  const raw = await resp.json();

  const features = raw.features.map((f: any) => ({
    type: 'Feature',
    geometry: f.geometry,
    properties: {
      id: f.properties.id ?? f.properties.OBJECTID,
      name: f.properties.name ?? f.properties.Plant_Name,
      capacityMW: f.properties.capacityMW ?? f.properties.Total_MW,
      technology: mapToTechnology(
        f.properties.primSource ?? f.properties.PrimSource ?? '',
        f.properties.name ?? f.properties.Plant_Name ?? ''
      ),
      state: f.properties.state ?? f.properties.State_Name ?? '',
      status: f.properties.status ?? f.properties.Status ?? '',
    },
  }));

  const geojson: PlantsGeoJSON = { type: 'FeatureCollection', features };
  setCachedData(key, geojson);
  return geojson;
}

export async function getTransmissionGeoJSON(): Promise<FeatureCollection<LineString, TxProps>> {
  const key = 'tpl_tx_v1';
  const cached = getCachedData(key, 7 * 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const resp = await fetch('/data/transmission.geojson');
  if (!resp.ok) {
    const text = await resp.text();
    console.error('Transmission fetch failed', resp.status, text);
    throw new Error('Transmission fetch failed');
  }

  const raw = await resp.json();
  const features = raw.features.map((f: any) => ({
    type: 'Feature',
    geometry: f.geometry,
    properties: {
      id: f.properties.id ?? f.properties.OBJECTID,
      voltageKV: f.properties.voltageKV ?? f.properties.VOLTAGE,
      owner: f.properties.owner ?? f.properties.OWNER ?? '',
    },
  }));

  const geojson: FeatureCollection<LineString, TxProps> = {
    type: 'FeatureCollection',
    features,
  };
  setCachedData(key, geojson);
  return geojson;
}

export async function getSubstationsGeoJSON(): Promise<FeatureCollection<Point, SubstationProps>> {
  const key = 'tpl_substations_v1';
  const cached = getCachedData(key, 7 * 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const resp = await fetch('/data/substations.geojson');
  if (!resp.ok) {
    const text = await resp.text();
    console.error('Substations fetch failed', resp.status, text);
    throw new Error('Substations fetch failed');
  }

  const raw = await resp.json();
  const features = raw.features.map((f: any) => ({
    type: 'Feature',
    geometry: f.geometry,
    properties: {
      id: f.properties.id ?? f.properties.OBJECTID,
      name: f.properties.name ?? f.properties.SUB_NAME ?? f.properties.NAME,
      voltageKV: f.properties.voltageKV ?? f.properties.MAX_VOLT,
      owner: f.properties.owner ?? f.properties.OWNER ?? '',
    },
  }));

  const geojson: FeatureCollection<Point, SubstationProps> = {
    type: 'FeatureCollection',
    features,
  };
  setCachedData(key, geojson);
  return geojson;
}

export async function getDataCentersGeoJSON(): Promise<FeatureCollection<Point, DataCenterProps>> {
  const key = 'tpl_datacenters_v1';
  const cached = getCachedData(key, 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const resp = await fetch('/data/data_centers.json');
  if (!resp.ok) {
    const text = await resp.text();
    console.error('Data centers fetch failed', resp.status, text);
    throw new Error('Data centers fetch failed');
  }

  const rows = await resp.json();
  const features = rows.map((r: any) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [r.lng, r.lat] },
    properties: {
      id: r.id,
      name: r.name,
      type: r.type,
      status: r.status,
      powerDrawMW: r.powerDrawMW,
    },
  }));

  const geojson: FeatureCollection<Point, DataCenterProps> = {
    type: 'FeatureCollection',
    features,
  };
  setCachedData(key, geojson);
  return geojson;
}

export interface MapData {
  plants: PlantsGeoJSON;
  transmission: FeatureCollection<LineString, TxProps>;
  substations: FeatureCollection<Point, SubstationProps>;
  dataCenters: FeatureCollection<Point, DataCenterProps>;
}

export async function loadMapData(): Promise<MapData> {
  const [plants, transmission, substations, dataCenters] = await Promise.all([
    getPlantsGeoJSON(),
    getTransmissionGeoJSON(),
    getSubstationsGeoJSON(),
    getDataCentersGeoJSON(),
  ]);
  return { plants, transmission, substations, dataCenters };
}
