/**
 * src/lib/mapData.ts
 *
 * Client-side loaders for map GeoJSON files.
 * Files are served from /public/data/ and built by scripts/build-map-data.ts.
 *
 * No localStorage caching (causes stale data bugs between deploys).
 * In-memory module-level cache is enough for a single session.
 */

import type { Feature, FeatureCollection, Point, LineString, MultiLineString } from 'geojson';

// ─── PROPERTY TYPES ───────────────────────────────────────────────────────────

export interface PlantProps {
  id:         string;
  name:       string;
  capacityMW: number;
  technology: string;
  state:      string;
  status:     string;
}

export interface TxProps {
  id:        string;
  voltageKV: number | null;
  owner:     string;
  type:      string;
}

export interface SubstationProps {
  NAME: string;
  CITY: string;
  COUNTY: string;
  ZIP: string;
  STATUS: string;
  STATE: string;
  NAICS_DESC: string;
  MAX_VOLT: number | null;
  voltageKV: number | null; // Keep for mapping/filtering
}

export interface DataCenterProps {
  id:          string;
  name:        string;
  type:        string;
  status:      string;
  powerDrawMW: number | null;
}

export type PlantsGeoJSON      = FeatureCollection<Point,                       PlantProps>;
export type TxGeoJSON          = FeatureCollection<LineString | MultiLineString, TxProps>;
export type SubstationsGeoJSON = FeatureCollection<Point,                       SubstationProps>;
export type DataCentersGeoJSON = FeatureCollection<Point,                       DataCenterProps>;

export interface MapData {
  plants:       PlantsGeoJSON;
  transmission: TxGeoJSON | null;
  substations:  SubstationsGeoJSON;
  dataCenters:  DataCentersGeoJSON;
}

// ─── IN-MEMORY CACHE ──────────────────────────────────────────────────────────

let _cache: MapData | null = null;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function fetchJSON(url: string): Promise<any> {
  const resp = await fetch(url);
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`[mapData] Fetch failed ${resp.status} for ${url}: ${body.slice(0, 200)}`);
  }
  return resp.json();
}

function emptyFC(): FeatureCollection<any, any> {
  return { type: 'FeatureCollection', features: [] };
}

// ─── LOADERS ─────────────────────────────────────────────────────────────────

const PLANT_ARCGIS_URL = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Power_Plants_in_the_US/FeatureServer/0/query';

async function fetchAllFeatures(baseUrl: string, whereClause: string, outFields: string): Promise<any[]> {
  let allFeatures: any[] = [];
  let offset = 0;
  const batchSize = 2000;
  
  while (true) {
    const params = new URLSearchParams({
      where: whereClause,
      outFields,
      f: 'geojson',
      returnGeometry: 'true',
      outSR: '4326',
      resultOffset: offset.toString(),
      resultRecordCount: batchSize.toString()
    });
    
    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) throw new Error(`ArcGIS fetch failed: ${response.status}`);
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) break;
    
    allFeatures = allFeatures.concat(data.features);
    if (data.features.length < batchSize) break;
    offset += data.features.length;
  }
  return allFeatures;
}

// Map ArcGIS PrimSource values to the plantType vocabulary used everywhere 
// else in the app (plants-fill color match, FilterPanel tech filter, etc.)
const PRIM_SOURCE_TO_PLANT_TYPE: Record<string, string> = {
  'solar':            'Solar',
  'wind':             'Wind',
  'nuclear':          'Nuclear',
  'natural gas':      'Natural Gas',
  'hydroelectric':    'Hydro',
  'pumped storage':   'Hydro',
  'coal':             'Coal',
  'batteries':        'Storage',
  'petroleum':        'Other',
  'biomass':          'Other',
  'geothermal':       'Other',
  'other':            'Other'
};

function normalizePlantFeature(f: any): any {
  const p = f.properties || {};
  const primLower = String(p.PrimSource || '').toLowerCase().trim();
  
  // Capacity: prefer Total_MW, fall back to Install_MW, then 0
  const cap = Number(p.Total_MW);
  const capInstall = Number(p.Install_MW);
  const capacityMW = Number.isFinite(cap) && cap > 0
    ? cap
    : (Number.isFinite(capInstall) && capInstall > 0 ? capInstall : 0);
  
  return {
    ...f,
    properties: {
      // Preserve originals (for info-card raw access if needed)
      ...p,
      // Normalized keys used by layers/InfoCard
      id:          p.OBJECTID ?? p.FID ?? null,
      name:        p.Plant_Name || 'Unknown Plant',
      capacityMW,
      plantType:   PRIM_SOURCE_TO_PLANT_TYPE[primLower] || 'Other',
      state:       p.State || '',
      status:      'Operating',   // This dataset is operating-plants only
      primSource:  p.PrimSource || '',
      techDesc:    p.tech_desc || '',
      sector:      p.sector_nam || ''
    }
  };
}

async function fetchPlantsFromArcGIS(): Promise<PlantsGeoJSON> {
  console.log('[mapData] Falling back to runtime ArcGIS fetch for plants...');
  const allFeatures = await fetchAllFeatures(
    PLANT_ARCGIS_URL, 
    '1=1', 
    'OBJECTID,Plant_Name,Total_MW,Install_MW,PrimSource,tech_desc,State,sector_nam'
  );
  
  console.log(`[mapData] ✓ ArcGIS fallback loaded ${allFeatures.length.toLocaleString()} power plants`);
  return {
    type: 'FeatureCollection',
    features: allFeatures.map(normalizePlantFeature)
  } as PlantsGeoJSON;
}

async function loadPlants(): Promise<PlantsGeoJSON> {
  try {
    const resp = await fetch('/data/plants.geojson');
    if (resp.ok) {
      const text = await resp.text();
      try {
        const data = JSON.parse(text) as PlantsGeoJSON;
        if (data.features?.length > 0) return data;
      } catch (e) {
        console.warn('[mapData] plants.geojson truncated');
      }
    }
  } catch (err) {
    console.warn('[mapData] Local plants load failed', err);
  }
  
  try {
    return await fetchPlantsFromArcGIS();
  } catch (err) {
    console.error('[mapData] ArcGIS plants fallback failed', err);
    return emptyFC() as PlantsGeoJSON;
  }
}

// Module-level cache prevents double-fetching (StrictMode) and repeated 
// re-fetches across component remounts.
let transmissionCache: TxGeoJSON | null = null;
let transmissionPromise: Promise<TxGeoJSON | null> | null = null;

const ARCGIS_TX_URL = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Electric_Power_Transmission_Lines/FeatureServer/0/query';

async function fetchFromArcGIS(): Promise<TxGeoJSON | null> {
  console.log('[mapData] Falling back to runtime ArcGIS fetch...');
  const allFeatures: Feature<LineString | MultiLineString, TxProps>[] = [];
  let offset = 0;
  const batchSize = 2000;
  const MAX_FEATURES = 500_000;
  let hasMore = true;
  
  while (hasMore && allFeatures.length < MAX_FEATURES) {
    const params = new URLSearchParams({
      where: 'VOLTAGE >= 60',
      outFields: 'OBJECTID,TYPE,STATUS,NAICS_DESC,SUB_1,SUB_2,OWNER,VOLTAGE,VOLT_CLASS',
      f: 'geojson',
      resultOffset: String(offset),
      resultRecordCount: String(batchSize),
      orderByFields: 'OBJECTID ASC'
    });
    
    const resp = await fetch(`${ARCGIS_TX_URL}?${params}`);
    if (!resp.ok) {
      console.warn(`[mapData] ArcGIS batch at offset ${offset} returned ${resp.status} — stopping`);
      break;
    }
    
    const data = await resp.json();
    if (!data.features?.length) { hasMore = false; break; }
    
    // Validate and cast features
    const validFeatures = data.features.filter((f: any) => 
      f.geometry?.type === 'LineString' || f.geometry?.type === 'MultiLineString'
    ) as Feature<LineString | MultiLineString, TxProps>[];
    
    allFeatures.push(...validFeatures);
    if (allFeatures.length % 10000 === 0) {
      console.log(`[mapData] ArcGIS: loaded ${allFeatures.length.toLocaleString()} lines...`);
    }
    
    if (data.features.length < batchSize && !data.properties?.exceededTransferLimit) {
      hasMore = false;
    } else {
      offset += batchSize;
    }
  }
  
  console.log(`[mapData] ✓ ArcGIS fallback loaded ${allFeatures.length.toLocaleString()} transmission lines`);
  return { type: 'FeatureCollection', features: allFeatures } as unknown as TxGeoJSON;
}

export async function loadTransmission(): Promise<TxGeoJSON | null> {
  if (transmissionCache) return transmissionCache;
  if (transmissionPromise) return transmissionPromise;
  
  transmissionPromise = (async () => {
    // Attempt 1: local static file (fast path, used in production builds)
    try {
      const resp = await fetch('/data/transmission.geojson');
      if (resp.ok) {
        const text = await resp.text();
        // Guard against truncation — make sure it's valid JSON
        try {
          const data = JSON.parse(text) as unknown as TxGeoJSON;
          if (data.features?.length > 0) {
            console.log(`[mapData] ✓ Loaded ${data.features.length.toLocaleString()} transmission lines from local file`);
            transmissionCache = data;
            return data;
          }
          console.warn('[mapData] Local transmission file parsed but has no features — falling back to ArcGIS');
        } catch (parseErr) {
          console.warn('[mapData] Local transmission file is truncated or invalid — falling back to ArcGIS', parseErr);
        }
      } else {
        console.warn(`[mapData] Local transmission file not available (HTTP ${resp.status}) — falling back to ArcGIS`);
      }
    } catch (err) {
      console.warn('[mapData] Local file fetch failed — falling back to ArcGIS', err);
    }
    
    // Attempt 2: runtime ArcGIS fetch (slow path, used in AI Studio preview)
    try {
      const data = await fetchFromArcGIS() as unknown as TxGeoJSON;
      transmissionCache = data;
      return data;
    } catch (err) {
      console.error('[mapData] ArcGIS fallback also failed:', err);
      transmissionPromise = null;  // allow retry
      return null;
    }
  })();
  
  return transmissionPromise;
}

const SUBSTATION_ARCGIS_URL = 'https://services6.arcgis.com/OO2s4OoyCZkYJ6oE/arcgis/rest/services/Substations/FeatureServer/0/query';

async function fetchSubstationsFromArcGIS(): Promise<SubstationsGeoJSON> {
  console.log('[mapData] Falling back to runtime ArcGIS fetch for substations...');
  const rawFeatures = await fetchAllFeatures(
    SUBSTATION_ARCGIS_URL, 
    '1=1', 
    'NAME,CITY,COUNTY,ZIP,STATUS,STATE,NAICS_DESC,MAX_VOLT'
  );
  
  const features = rawFeatures.map(f => ({
    type: 'Feature',
    geometry: f.geometry,
    properties: {
      NAME: f.properties.NAME,
      CITY: f.properties.CITY,
      COUNTY: f.properties.COUNTY,
      ZIP: f.properties.ZIP,
      STATUS: f.properties.STATUS,
      STATE: f.properties.STATE,
      NAICS_DESC: f.properties.NAICS_DESC,
      MAX_VOLT: f.properties.MAX_VOLT,
      voltageKV: f.properties.MAX_VOLT,
    }
  }));

  return { type: 'FeatureCollection', features } as SubstationsGeoJSON;
}

async function loadSubstations(): Promise<SubstationsGeoJSON> {
  try {
    const resp = await fetch('/data/substations.geojson');
    if (resp.ok) {
      const text = await resp.text();
      try {
        const data = JSON.parse(text) as SubstationsGeoJSON;
        if (data.features?.length > 0) return data;
      } catch (e) {
        console.warn('[mapData] substations.geojson truncated');
      }
    }
  } catch (err) {
    console.warn('[mapData] Local substations load failed', err);
  }
  
  try {
    return await fetchSubstationsFromArcGIS();
  } catch (err) {
    console.error('[mapData] ArcGIS substations fallback failed', err);
    return emptyFC() as SubstationsGeoJSON;
  }
}

async function loadDataCenters(): Promise<DataCentersGeoJSON> {
  try {
    const rows = await fetchJSON('/data/data_centers.json');
    if (!Array.isArray(rows)) throw new Error('Expected array');

    const features = rows
      .filter((r: any) => typeof r.lat === 'number' && typeof r.lng === 'number')
      .map((r: any) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [r.lng, r.lat] },
        properties: {
          id:          r.id    ?? '',
          name:        r.name  ?? 'Data Center',
          type:        r.type  ?? 'Unknown',
          status:      r.status ?? 'Unknown',
          powerDrawMW: r.powerDrawMW ?? null,
        },
      }));

    return { type: 'FeatureCollection', features } as DataCentersGeoJSON;
  } catch (err) {
    console.error('[mapData] data_centers.json failed:', err);
    return emptyFC() as DataCentersGeoJSON;
  }
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export async function loadMapData(): Promise<MapData> {
  if (_cache) return _cache;

  const [plants, transmission, substations, dataCenters] = await Promise.all([
    loadPlants(),
    loadTransmission(),
    loadSubstations(),
    loadDataCenters(),
  ]);

  console.info('[mapData] Loaded:', {
    plants:       plants?.features?.length ?? 0,
    transmission: transmission?.features?.length ?? 0,
    substations:  substations?.features?.length ?? 0,
    dataCenters:  dataCenters?.features?.length ?? 0,
  });

  if (!plants?.features || !substations?.features || !dataCenters?.features) {
    console.warn('[mapData] Missing features in map data:', {
      plants: !!plants?.features,
      substations: !!substations?.features,
      dataCenters: !!dataCenters?.features
    });
  }

  _cache = { plants, transmission, substations, dataCenters } as MapData;
  return _cache;
}

/** Call this to invalidate cache (e.g. after an admin data refresh) */
export function clearMapDataCache(): void {
  _cache = null;
}

// ─── TECH NORMALIZATION (re-exported for use in build script) ─────────────────

export function mapToTechnology(primSource: string, plantName = ''): string {
  const s = (primSource ?? '').toLowerCase();
  const n = (plantName  ?? '').toLowerCase();
  if (s.includes('solar'))                             return 'Solar';
  if (s.includes('wind') && n.includes('offshore'))   return 'Offshore Wind';
  if (s.includes('wind'))                             return 'Wind';
  if (s.includes('nuclear'))                          return 'Nuclear';
  if (s.includes('hydro') || s.includes('water'))     return 'Hydro';
  if (s.includes('gas')   || s.includes('ng'))        return 'Gas';
  if (s.includes('coal'))                             return 'Coal';
  if (s.includes('oil')   || s.includes('petroleum')) return 'Oil';
  if (s.includes('geo'))                              return 'Geothermal';
  if (s.includes('biom')  || s.includes('waste'))     return 'Biomass';
  if (s.includes('stor')  || s.includes('battery'))   return 'Storage';
  return 'Other';
}
