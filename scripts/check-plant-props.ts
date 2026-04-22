import fetch from 'node-fetch';

async function checkProperties() {
  const url = 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Power_Plants_in_the_US/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&resultRecordCount=1';
  const res = await fetch(url);
  const data = await res.json() as any;
  console.log('First plant properties:', data.features[0].properties);
}

checkProperties();
