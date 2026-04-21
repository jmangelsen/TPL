import fetch from 'node-fetch';
import { parse as parseCsv } from 'csv-parse/sync';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'data');

const GPPD_CSV_URL = 'https://raw.githubusercontent.com/wri/global-power-plant-database/master/output_database/global_power_plant_database.csv';
const HIFLD_TX_URL = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Electric_Power_Transmission_Lines/FeatureServer/0/query?where=1%3D1&outFields=ID,VOLTAGE,OWNER,TYPE&geometryPrecision=4&outSR=4326&f=geojson&resultRecordCount=2000';
const HIFLD_SUBS_URL = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Electric_Substations/FeatureServer/0/query?where=1%3D1&outFields=NAME,OWNER,VOLTAGES,COUNTY,STATE&geometryPrecision=4&outSR=4326&f=geojson&resultRecordCount=5000';
const DATA_CENTERS_CSV = path.join(__dirname, 'input', 'data_centers.csv');

const isFiniteNum = (v: any): v is number => typeof v === 'number' && Number.isFinite(v);
const validLngLat = (lng: any, lat: any) => isFiniteNum(lng) && isFiniteNum(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;

function validateFC(name: string, fc: any) {
  if (!fc || fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) throw new Error(`[${name}] Not a valid FeatureCollection`);
  console.log(`[${name}] ${fc.features.length === 0 ? 'WARNING: 0' : 'OK: ' + fc.features.length} features`);
}

function normalizeTech(s: string, n: string) {
  s = (s||'').toLowerCase(); n = (n||'').toLowerCase();
  if (s.includes('solar')) return 'Solar';
  if (s.includes('wind') && n.includes('offshore')) return 'Offshore Wind';
  if (s.includes('wind')) return 'Wind';
  if (s.includes('nuclear')) return 'Nuclear';
  if (s.includes('hydro') || s.includes('water')) return 'Hydro';
  if (s.includes('gas') || s.includes('ng')) return 'Gas';
  if (s.includes('coal')) return 'Coal';
  if (s.includes('oil') || s.includes('petroleum')) return 'Oil';
  if (s.includes('geo')) return 'Geothermal';
  if (s.includes('biom') || s.includes('waste')) return 'Biomass';
  if (s.includes('stor') || s.includes('battery')) return 'Storage';
  return 'Other';
}

async function buildPlants() {
  console.log('[plants] Downloading GPPD CSV...');
  const resp = await fetch(GPPD_CSV_URL);
  if (!resp.ok) throw new Error('GPPD fetch failed: ' + resp.status);
  const records = parseCsv(Buffer.from(await resp.arrayBuffer()).toString('utf8'), { columns: true });
  let dropped = 0;
  const features = records
    .filter((r: any) => r.country === 'USA' || r.country_long === 'United States of America')
    .map((r: any) => {
      const lng = Number(r.longitude), lat = Number(r.latitude);
      if (!validLngLat(lng, lat)) { dropped++; return null; }
      const cap = Number(r.capacity_mw);
      return { type: 'Feature', geometry: { type: 'Point', coordinates: [+lng.toFixed(4), +lat.toFixed(4)] },
        properties: { id: r.gppd_idnr||'', name: r.name||'Unknown', capacityMW: Number.isFinite(cap)?Math.round(cap):0, technology: normalizeTech(r.primary_fuel, r.name), state: r.country_long_sub1||'', status: r.commissioning_year?'Operating':'Unknown' } };
    }).filter(Boolean);
  const fc = { type: 'FeatureCollection', features };
  validateFC('plants', fc);
  if (dropped) console.warn('[plants] Dropped ' + dropped + ' invalid features');
  await fs.writeFile(path.join(OUT_DIR, 'plants.geojson'), JSON.stringify(fc));
  console.log('[plants] Written to public/data/plants.geojson');
}

async function buildTransmission() {
  console.log('[transmission] Downloading HIFLD sample...');
  const resp = await fetch(HIFLD_TX_URL);
  if (!resp.ok) throw new Error('HIFLD TX failed: ' + resp.status);
  const raw: any = await resp.json();
  if (!raw?.features?.length) { await fs.writeFile(path.join(OUT_DIR, 'transmission.geojson'), JSON.stringify({ type: 'FeatureCollection', features: [] })); return; }
  let dropped = 0;
  const features = raw.features.map((f: any) => {
    if (!f.geometry) { dropped++; return null; }
    if (f.geometry.type !== 'LineString' && f.geometry.type !== 'MultiLineString') { dropped++; return null; }
    const p = f.properties||{}, v = p.VOLTAGE!=null?Number(p.VOLTAGE):null;
    return { type: 'Feature', geometry: f.geometry, properties: { id: String(p.ID||''), voltageKV: Number.isFinite(v)?v:null, owner: p.OWNER||'', type: p.TYPE||'' } };
  }).filter(Boolean);
  const fc = { type: 'FeatureCollection', features };
  validateFC('transmission', fc);
  await fs.writeFile(path.join(OUT_DIR, 'transmission.geojson'), JSON.stringify(fc));
  console.log('[transmission] Written to public/data/transmission.geojson (dev sample - upload full dataset to Mapbox Tilesets for production)');
}

async function buildSubstations() {
  console.log('[substations] Downloading HIFLD...');
  const resp = await fetch(HIFLD_SUBS_URL);
  if (!resp.ok) throw new Error('HIFLD Subs failed: ' + resp.status);
  const raw: any = await resp.json();
  if (!raw?.features?.length) { await fs.writeFile(path.join(OUT_DIR, 'substations.geojson'), JSON.stringify({ type: 'FeatureCollection', features: [] })); return; }
  let dropped = 0;
  const features = raw.features.map((f: any) => {
    if (!f.geometry || f.geometry.type !== 'Point') { dropped++; return null; }
    const [lng, lat] = f.geometry.coordinates;
    if (!validLngLat(lng, lat)) { dropped++; return null; }
    const p = f.properties||{}, vRaw = String(p.VOLTAGES||'').split(';').map(Number).filter(Number.isFinite);
    return { type: 'Feature', geometry: { type: 'Point', coordinates: [+lng.toFixed(4), +lat.toFixed(4)] },
      properties: { id: String(p.ID||p.OBJECTID||''), name: p.NAME||'Substation', voltageKV: vRaw.length?Math.max(...vRaw):null, owner: p.OWNER||'', state: p.STATE||'' } };
  }).filter(Boolean);
  const fc = { type: 'FeatureCollection', features };
  validateFC('substations', fc);
  await fs.writeFile(path.join(OUT_DIR, 'substations.geojson'), JSON.stringify(fc));
  console.log('[substations] Written to public/data/substations.geojson');
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
