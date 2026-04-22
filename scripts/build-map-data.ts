import fetch from 'node-fetch';
import { parse as parseCsv } from 'csv-parse/sync';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'data');

const GPPD_CSV_URL = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Power_Plants_in_the_US/FeatureServer/0/query';
// Transmission Lines (60kV+)
const HIFLD_TX_BASE = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Electric_Power_Transmission_Lines/FeatureServer/0/query';
const HIFLD_TX_PARAMS = new URLSearchParams({
  where: 'VOLTAGE >= 60',
  outFields: '*',
  f: 'geojson',
  returnGeometry: 'true',
  outSR: '4326',
  resultRecordCount: '4000'
});
const HIFLD_TX_URL = `${HIFLD_TX_BASE}?${HIFLD_TX_PARAMS.toString()}`;

// Substations
const HIFLD_SUBS_BASE = 'https://services6.arcgis.com/OO2s4OoyCZkYJ6oE/arcgis/rest/services/Substations/FeatureServer/0/query';
const HIFLD_SUBS_PARAMS = new URLSearchParams({
  where: '1=1',
  outFields: '*',
  f: 'geojson',
  returnGeometry: 'true',
  outSR: '4326',
  resultRecordCount: '5000'
});
const HIFLD_SUBS_URL = `${HIFLD_SUBS_BASE}?${HIFLD_SUBS_PARAMS.toString()}`;
const DATA_CENTERS_CSV = path.join(__dirname, 'input', 'data_centers.csv');

const isFiniteNum = (v: any): v is number => typeof v === 'number' && Number.isFinite(v);
const validLngLat = (lng: any, lat: any) => isFiniteNum(lng) && isFiniteNum(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;

function validateFC(name: string, fc: any) {
  if (!fc || fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) throw new Error(`[${name}] Not a valid FeatureCollection`);
  console.log(`[${name}] ${fc.features.length === 0 ? 'WARNING: 0' : 'OK: ' + fc.features.length} features`);
}

function normalizeTech(s: string) {
  s = (s||'').toLowerCase();
  if (s.includes('solar')) return 'Solar';
  if (s.includes('wind')) return 'Wind';
  if (s.includes('nuclear')) return 'Nuclear';
  if (s.includes('hydro') || s.includes('water') || s.includes('pumped storage')) return 'Hydro';
  if (s.includes('gas') || s.includes('ng') || s.includes('natural gas')) return 'Natural Gas';
  if (s.includes('coal')) return 'Coal';
  if (s.includes('stor') || s.includes('battery')) return 'Storage';
  return 'Other';
}

async function fetchAllFeatures(baseUrl: string, whereClause: string): Promise<any[]> {
  let allFeatures: any[] = [];
  let offset = 0;
  const batchSize = 2000;
  
  while (true) {
    const params = new URLSearchParams({
      where: whereClause,
      outFields: '*',
      f: 'geojson',
      returnGeometry: 'true',
      outSR: '4326',
      resultOffset: offset.toString(),
      resultRecordCount: batchSize.toString()
    });
    
    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`ArcGIS fetch failed: ${response.status} ${response.statusText}`);
    }
    const data: any = await response.json();
    
    if (data.error) {
      throw new Error(`ArcGIS Error: ${JSON.stringify(data.error)}`);
    }

    if (!data.features || data.features.length === 0) break;
    
    allFeatures = allFeatures.concat(data.features);
    console.log(`  Fetched ${allFeatures.length} features so far...`);
    
    // Check if we hit the limit or have more
    if (data.features.length < batchSize) break;
    if (data.properties?.exceededTransferLimit === false) break;
    
    offset += data.features.length;
  }
  
  return allFeatures;
}

async function buildPlants() {
  console.log('[plants] Downloading ArcGIS Power Plants data (paginated)...');
  const allFeatures = await fetchAllFeatures(GPPD_CSV_URL, '1=1');
  
  if (!allFeatures.length) {
    console.warn('[plants] 0 features returned');
    return;
  }

  const features = allFeatures.map((f: any) => {
    if (!f.geometry || !f.geometry.coordinates) return null;
    const p = f.properties || {};
    const capacity = p.SUMMER_CAP ?? p.CAPACITY ?? p.capacity_mw ?? 0;
    const fuel = p.PrimSource ?? p.FUEL_TYPE ?? p.PRIM_FUEL ?? p.primary_fuel ?? 'Other';
    
    return {
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        id: String(p.OBJECTID || p.FID || ''),
        name: p.Plant_Name || p.NAME || 'Unknown',
        capacityMW: Math.round(Number(capacity)),
        plantType: normalizeTech(fuel),
        state: p.State || p.STATE || '',
        status: 'Operating',
        
        // Detailed fields requested by user
        Plant_Name: p.Plant_Name || p.NAME || 'Unknown',
        City: p.City || p.CITY || 'N/A',
        County: p.County || p.COUNTY || 'N/A',
        Energy_sources: p.Gentech || p.Energy_sources || 'N/A',
        Maximum_output_MW: p.Total_MW || p.Maximum_output_MW || p.capacity_mw || 0,
        
        // Breakdown
        Bat_MW: Number(p.Bat_MW || 0),
        Bio_MW: Number(p.Bio_MW || 0),
        Coal_MW: Number(p.Coal_MW || 0),
        Oth_MW: Number(p.Oth_MW || 0),
        Geo_MW: Number(p.Geo_MW || 0),
        Hydro_MW: Number(p.Hydro_MW || 0),
        Ng_MW: Number(p.Ng_MW || 0),
        Nuc_MW: Number(p.Nuc_MW || 0),
        Pet_MW: Number(p.Pet_MW || 0),
        Ps_MW: Number(p.Ps_MW || 0),
        Sol_MW: Number(p.Sol_MW || 0),
        Wnd_MW: Number(p.Wnd_MW || 0),
        
        // Details
        Sector_name: p.Sector_name || 'N/A',
        Primsource: p.Primsource || p.PrimSource || 'N/A',
        Street: p.Street || 'N/A',
        Nameplate: p.Nameplate || p.Total_MW || 'N/A',
        Tech: p.Tech || 'N/A',
        Util_name: p.Util_name || 'N/A',
        Utility: p.Utility || p.Utility_Na || p.Util_name || 'N/A',
        Zip: p.Zip || 'N/A'
      }
    };
  }).filter(Boolean);
  
  validateFC('plants', { type: 'FeatureCollection', features });
  
  const ws = createWriteStream(path.join(OUT_DIR, 'plants.geojson'));
  ws.write('{"type":"FeatureCollection","features":[');
  for (let i = 0; i < features.length; i++) {
    ws.write(JSON.stringify(features[i]));
    if (i < features.length - 1) ws.write(',');
  }
  ws.write(']}');
  ws.end();
  await new Promise<void>((resolve, reject) => {
    ws.on('finish', () => resolve());
    ws.on('error', (err) => reject(err));
  });
  console.log('[plants] Written to public/data/plants.geojson');
}

async function buildTransmission() {
  console.log('Fetching transmission lines...');
  
  const baseUrl = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Electric_Power_Transmission_Lines/FeatureServer/0/query';
  const allFeatures = [];
  let offset = 0;
  const batchSize = 2000;
  
  while (true) {
    const params = new URLSearchParams({
      where: '1=1',
      outFields: '*',
      f: 'geojson',
      resultOffset: String(offset),
      resultRecordCount: String(batchSize)
    });
    
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await fetch(`${baseUrl}?${params}`);
        if (!response.ok) {
          console.error(`HTTP ${response.status}: ${response.statusText}`);
          break;
        }
        
        const data: any = await response.json();
        
        if (!data.features || data.features.length === 0) {
          console.log('No more features to fetch');
          offset = -1; // signal end
          break;
        }
        
        allFeatures.push(...data.features);
        console.log(`Fetched ${allFeatures.length} transmission lines so far...`);
        
        if (data.features.length < batchSize) offset = -1;
        else offset += batchSize;
        
        break; // Success, exit retry loop
      } catch (error) {
        retries--;
        console.error(`Fetch error (retries left: ${retries}):`, error);
        if (retries === 0) {
          offset = -1; // Give up
        } else {
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait longer before retry
        }
      }
    }
    
    if (offset === -1) break;
    
    // Delay between normal batches
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  const geojson = {
    type: 'FeatureCollection',
    features: allFeatures
  };
  
  await fs.writeFile(
    path.join(process.cwd(), 'public', 'data', 'transmission.geojson'),
    JSON.stringify(geojson),
    'utf-8'
  );
  
  console.log(`✓ Successfully built ${allFeatures.length} transmission lines`);
  return allFeatures.length;
}

async function buildSubstations(): Promise<void> {
  console.log('\n📍 Building substations data (paginated)...');
  
  try {
    const allFeatures = await fetchAllFeatures(HIFLD_SUBS_BASE, '1=1');
    console.log(`  ✓ Total fetched ${allFeatures.length} substations`);
    
    if (allFeatures.length === 0) {
      console.warn('  ⚠ No substation features returned');
      await fs.writeFile(
        path.join(OUT_DIR, 'substations.geojson'),
        JSON.stringify({ type: 'FeatureCollection', features: [] })
      );
      return;
    }
    
    const collection = {
      type: 'FeatureCollection',
      features: allFeatures.map((f: any) => {
        const props = f.properties || {};
        const v = props.MAX_VOLT ?? props.voltage ?? props.VOLTAGE ?? null;
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            NAME: props.NAME || 'Unknown',
            CITY: props.CITY || 'N/A',
            COUNTY: props.COUNTY || 'N/A',
            ZIP: props.ZIP || 'N/A',
            STATUS: props.STATUS || 'N/A',
            STATE: props.STATE || 'N/A',
            NAICS_DESC: props.NAICS_DESC || 'N/A',
            MAX_VOLT: (v != null && v > 0) ? Number(v) : null,
            voltageKV: (v != null && v > 0) ? Number(v) : null,
          }
        };
      })
    };
    
    await fs.writeFile(
      path.join(OUT_DIR, 'substations.geojson'),
      JSON.stringify(collection)
    );
    
    console.log(`  ✓ Wrote ${collection.features.length} substations to file`);
  } catch (error) {
    console.error('  ✗ Substations fetch failed:', error);
    await fs.writeFile(
      path.join(OUT_DIR, 'substations.geojson'),
      JSON.stringify({ type: 'FeatureCollection', features: [] })
    );
  }
}

async function buildDataCenters() {
  let rows: any[];
  try {
    rows = parseCsv((await fs.readFile(DATA_CENTERS_CSV)).toString('utf8'), { columns: true, skip_empty_lines: true });
  } catch {
    console.warn('[data_centers] CSV not found, using example data');
    rows = [
      { id:'dc-001', name:'Ashburn VA',    lat:'39.0438',  lng:'-77.4874',  type:'Hyperscale', status:'Operating', powerDrawMW:'200' },
      { id:'dc-002', name:'Phoenix AZ',    lat:'33.4484',  lng:'-112.0740', type:'Hyperscale', status:'Operating', powerDrawMW:'150' },
      { id:'dc-003', name:'Dallas TX',     lat:'32.7767',  lng:'-96.7970',  type:'Colo',       status:'Operating', powerDrawMW:'80'  },
      { id:'dc-004', name:'Chicago IL',    lat:'41.8781',  lng:'-87.6298',  type:'Hyperscale', status:'Operating', powerDrawMW:'120' },
      { id:'dc-005', name:'San Jose CA',   lat:'37.3861',  lng:'-121.9839', type:'Edge',       status:'Operating', powerDrawMW:'60'  },
      { id:'dc-006', name:'Quincy WA',     lat:'47.2340',  lng:'-119.8526', type:'Hyperscale', status:'Operating', powerDrawMW:'180' },
      { id:'dc-007', name:'Des Moines IA', lat:'41.5913',  lng:'-93.6037',  type:'Hyperscale', status:'Operating', powerDrawMW:'100' },
    ];
  }
  let dropped = 0;
  const out = rows.map((r: any) => {
    const lng = Number(r.lng), lat = Number(r.lat);
    if (!validLngLat(lng, lat)) { dropped++; return null; }
    return { id: r.id||'', name: r.name||'Data Center', lat: +lat.toFixed(4), lng: +lng.toFixed(4), type: r.type||'Unknown', status: r.status||'Unknown', powerDrawMW: r.powerDrawMW?Number(r.powerDrawMW):null };
  }).filter(Boolean);
  console.log('[data_centers] OK: ' + out.length + ' data centers');
  await fs.writeFile(path.join(OUT_DIR, 'data_centers.json'), JSON.stringify(out, null, 2));
  console.log('[data_centers] Written to public/data/data_centers.json');
}

async function main() {
  console.log('=== TPL Map Data Builder ===');
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.join(__dirname, 'input'), { recursive: true });
  const tasks = [
    { name: 'Plants',       fn: buildPlants       },
    { name: 'Transmission', fn: buildTransmission },
    { name: 'Substations',  fn: buildSubstations  },
    { name: 'DataCenters',  fn: buildDataCenters  },
  ];
  const results: string[] = [];
  for (const task of tasks) {
    try { await task.fn(); results.push('OK  ' + task.name); }
    catch (err) { console.error('[ERROR]', task.name, err); results.push('ERR ' + task.name); }
  }
  console.log('\n=== Results ===');
  results.forEach(r => console.log(r));
  console.log('\nNext: set VITE_MAPBOX_TOKEN in .env, then npm run dev');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
