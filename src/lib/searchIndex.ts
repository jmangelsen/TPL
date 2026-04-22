import type { FeatureCollection, Feature, Point, LineString } from 'geojson';

export type SearchResultType = 'plant' | 'substation' | 'transmission';

export interface SearchResult {
  type: SearchResultType;
  id: string | number;
  label: string;         // Main display line ("Bluestem Wind Farm")
  sublabel: string;      // Context line ("Wind • 198 MW • TX")
  center: [number, number];     // [lng, lat] — where to fly to
  props: any;            // Full properties for info card / highlight
}

interface IndexedFeature {
  haystack: string;              // lowercased concat of all searchable fields
  result: Omit<SearchResult, never>;
}

let plantsIndex: IndexedFeature[] = [];
let substationsIndex: IndexedFeature[] = [];
let transmissionIndex: IndexedFeature[] = [];

const safeStr = (v: any) => (v == null ? '' : String(v).trim());

function centroidOfLine(coords: number[][]): [number, number] {
  if (!coords?.length) return [0, 0];
  const mid = coords[Math.floor(coords.length / 2)];
  return [mid[0], mid[1]];
}

export function buildSearchIndex(
  plants: FeatureCollection | null,
  substations: FeatureCollection | null,
  transmission: FeatureCollection | null
) {
  plantsIndex = [];
  substationsIndex = [];
  transmissionIndex = [];

  // --- PLANTS ---
  plants?.features.forEach((f: any) => {
    const p = f.properties || {};
    const name = safeStr(p.name || p.Plant_Name);
    if (!name) return;
    const city = safeStr(p.City);
    const state = safeStr(p.state || p.State);
    const source = safeStr(p.plantType || p.PrimSource);
    const sector = safeStr(p.sector || p.sector_nam);
    const cap = Number(p.capacityMW || p.Total_MW || 0);
    const coords = (f.geometry as Point)?.coordinates;
    if (!coords) return;
    
    plantsIndex.push({
      haystack: [name, city, state, source, sector].join(' ').toLowerCase(),
      result: {
        type: 'plant',
        id: p.id || p.OBJECTID || name,
        label: name,
        sublabel: [source, cap > 0 ? `${cap.toLocaleString()} MW` : '', state]
          .filter(Boolean).join(' • '),
        center: coords as [number, number],
        props: p
      }
    });
  });

  // --- SUBSTATIONS ---
  substations?.features.forEach((f: any) => {
    const p = f.properties || {};
    const name = safeStr(p.NAME);
    // Skip UNKNOWN placeholders from the index — they match nothing useful
    if (!name || /^UNKNOWN\d*$/i.test(name)) return;
    const city = safeStr(p.CITY);
    const state = safeStr(p.STATE);
    const county = safeStr(p.COUNTY);
    const zip = safeStr(p.ZIP);
    const volt = Number(p.MAX_VOLT || p.voltageKV || 0);
    const coords = (f.geometry as Point)?.coordinates;
    if (!coords) return;
    
    substationsIndex.push({
      haystack: [name, city, state, county, zip].join(' ').toLowerCase(),
      result: {
        type: 'substation',
        id: p.NAME,
        label: name,
        sublabel: [volt > 0 ? `${volt} kV` : '', city, state]
          .filter(Boolean).join(' • '),
        center: coords as [number, number],
        props: p
      }
    });
  });

  // --- TRANSMISSION LINES ---
  transmission?.features.forEach((f: any) => {
    const p = f.properties || {};
    const sub1 = safeStr(p.SUB_1);
    const sub2 = safeStr(p.SUB_2);
    const owner = safeStr(p.OWNER);
    const volt = Number(p.VOLTAGE || 0);
    const named1 = sub1 && !/^UNKNOWN\d*$/i.test(sub1) && sub1 !== 'NOT AVAILABLE';
    const named2 = sub2 && !/^UNKNOWN\d*$/i.test(sub2) && sub2 !== 'NOT AVAILABLE';
    if (!named1 && !named2 && owner === 'NOT AVAILABLE') return;
    
    const coords = (f.geometry as LineString)?.coordinates;
    if (!coords?.length) return;
    
    const label = named1 && named2 
      ? `${sub1} ↔ ${sub2}` 
      : `${named1 ? sub1 : sub2} Transmission Line`;
    
    transmissionIndex.push({
      haystack: [sub1, sub2, owner, `${volt}kv`, `${volt} kv`].join(' ').toLowerCase(),
      result: {
        type: 'transmission',
        id: p.OBJECTID,
        label,
        sublabel: [volt > 0 ? `${volt} kV` : '', owner !== 'NOT AVAILABLE' ? owner : '']
          .filter(Boolean).join(' • '),
        center: centroidOfLine(coords),
        props: p
      }
    });
  });
  
  console.log(`[search] Indexed ${plantsIndex.length} plants, ${substationsIndex.length} substations, ${transmissionIndex.length} lines`);
}

export function searchFeatures(query: string, maxPerGroup = 8): {
  plants: SearchResult[];
  substations: SearchResult[];
  transmission: SearchResult[];
  total: number;
} {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { plants: [], substations: [], transmission: [], total: 0 };
  
  const matches = (idx: IndexedFeature[]) => {
    const hits: SearchResult[] = [];
    for (const entry of idx) {
      if (entry.haystack.includes(q)) {
        hits.push(entry.result);
        if (hits.length >= maxPerGroup) break;
      }
    }
    return hits;
  };
  
  const plants = matches(plantsIndex);
  const substations = matches(substationsIndex);
  const transmission = matches(transmissionIndex);
  
  return {
    plants,
    substations,
    transmission,
    total: plants.length + substations.length + transmission.length
  };
}
