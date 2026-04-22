import fs from 'node:fs/promises';
import path from 'node:path';

const ARCGIS_URL = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Electric_Power_Transmission_Lines/FeatureServer/0/query';
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'data', 'transmission.geojson');
const BATCH_SIZE = 2000;
const MAX_FEATURES = 500_000;

async function buildTransmission() {
  console.log('Fetching transmission lines from ArcGIS...');
  
  const allFeatures: any[] = [];
  let offset = 0;
  let hasMore = true;
  const startTime = Date.now();
  
  while (hasMore && allFeatures.length < MAX_FEATURES) {
    const params = new URLSearchParams({
      where: 'VOLTAGE >= 60',
      outFields: 'OBJECTID,TYPE,STATUS,NAICS_DESC,SUB_1,SUB_2,OWNER,VOLTAGE,VOLT_CLASS',
      f: 'geojson',
      resultOffset: String(offset),
      resultRecordCount: String(BATCH_SIZE),
      orderByFields: 'OBJECTID ASC'
    });
    
    // Retry logic — important for build reliability
    let data: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await fetch(`${ARCGIS_URL}?${params}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        data = await resp.json();
        break;
      } catch (err) {
        if (attempt === 2) throw err;
        const wait = 2000 * (attempt + 1);
        console.log(`  Retry ${attempt + 1} after ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
    
    if (!data?.features?.length) { hasMore = false; break; }
    
    allFeatures.push(...data.features);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  Loaded ${allFeatures.length.toLocaleString()} features (${elapsed}s elapsed)`);
    
    if (data.features.length < BATCH_SIZE && !data.properties?.exceededTransferLimit) {
      hasMore = false;
    } else {
      offset += BATCH_SIZE;
    }
  }
  
  const geojson = { type: 'FeatureCollection', features: allFeatures };
  
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(geojson));
  
  const stats = await fs.stat(OUTPUT_PATH);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`✓ Wrote ${allFeatures.length.toLocaleString()} features to ${OUTPUT_PATH}`);
  console.log(`  File size: ${sizeMB} MB`);
  console.log(`  Total time: ${totalElapsed}s`);
}

buildTransmission().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
