/**
 * src/lib/mapData.ts
 *
 * Client-side loaders for map GeoJSON files.
 * Files are served from /public/data/ and built by scripts/build-map-data.ts.
 *
 * No localStorage caching (causes stale data bugs between deploys).
 * In-memory module-level cache is enough for a single session.
 */

import type { FeatureCollection, Point, LineString, MultiLineString } from 'geojson';

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
  id:        string;
  name:      string;
  voltageKV: number | null;
  owner:     string;
  state:     string;
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
  transmission: TxGeoJSON;
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

async function loadPlants(): Promise<PlantsGeoJSON> {
  try {
    const raw = await fetchJSON('/data/plants.geojson');
    if (raw?.type !== 'FeatureCollection') throw new Error('Not a FeatureCollection');
    return raw as PlantsGeoJSON;
  } catch (err) {
    console.error('[mapData] plants.geojson failed:', err);
    return emptyFC() as PlantsGeoJSON;
  }
}

async function loadTransmission(): Promise<TxGeoJSON> {
  try {
    const raw = await fetchJSON('/data/transmission.geojson');
    if (raw?.type !== 'FeatureCollection') throw new Error('Not a FeatureCollection');
    // Filter out any features with missing/bad geometry
    const features = (raw.features || []).filter((f: any) => {
      const t = f?.geometry?.type;
      return t === 'LineString' || t === 'MultiLineString';
    });
    return { type: 'FeatureCollection', features } as TxGeoJSON;
  } catch (err) {
    console.warn('[mapData] transmission.geojson failed (will use Mapbox tileset if configured):', err);
    return emptyFC() as TxGeoJSON;
  }
}

async function loadSubstations(): Promise<SubstationsGeoJSON> {
  try {
    const raw = await fetchJSON('/data/substations.geojson');
    if (raw?.type !== 'FeatureCollection') throw new Error('Not a FeatureCollection');
    return raw as SubstationsGeoJSON;
  } catch (err) {
    console.error('[mapData] substations.geojson failed:', err);
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
    plants:       plants.features.length,
    transmission: transmission.features.length,
    substations:  substations.features.length,
    dataCenters:  dataCenters.features.length,
  });

  _cache = { plants, transmission, substations, dataCenters };
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
