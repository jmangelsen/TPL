import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { loadMapData, type MapData } from '../../lib/mapData';
import { FilterPanel } from './FilterPanel';
import { InfoCard, type InspectedFeature, type InspectedKind } from './InfoCard';

// Ensure mapbox token is available
const MAPBOX_TOKEN = (import.meta.env as any).VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const TX_TILESET_URL = 'mapbox://your_username.your_tileset_id';
const TX_SOURCE_LAYER = 'your_source_layer_name';

export const InfrastructureMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);

  const [roadsVisible, setRoadsVisible] = useState(true);
  const [roadsOpacity, setRoadsOpacity] = useState(0.35);
  const [techVisibility, setTechVisibility] = useState<Record<string, boolean>>({ Solar: true, Wind: true, Nuclear: true, Gas: true, Other: true });
  const [txBands, setTxBands] = useState<Record<string, boolean>>({ '115-230kV': true, '345kV+': true });
  const [dcsVisible, setDcsVisible] = useState(true);
  const [substationsVisible, setSubstationsVisible] = useState(true);
  const bubbleScale = 0.65;
  const [inspected, setInspected] = useState<InspectedFeature | null>(null);
  const [layersAdded, setLayersAdded] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const setupHandlers = (map: mapboxgl.Map, layerId: string, kind: InspectedKind) => {
    map.on('mousemove', layerId, (e) => {
      const f = e.features?.[0];
      if (!f) return;
      map.getCanvas().style.cursor = 'pointer';
      setInspected((prev) => (prev?.pinned ? prev : buildInspectedFromFeature(kind, f, map, false)));
    });
    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
      setInspected((prev) => (prev?.pinned ? prev : null));
    });
    map.on('click', layerId, (e) => {
      const f = e.features?.[0];
      if (!f) return;
      setInspected(buildInspectedFromFeature(kind, f, map, true));
    });
  };

  useEffect(() => {
    const el = mapContainer.current;
    if (!el) return;

    const updateSize = () => {
      setMapSize({
        width: el.clientWidth,
        height: el.clientHeight
      });
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  function buildInspectedFromFeature(
    kind: InspectedKind,
    f: mapboxgl.MapboxGeoJSONFeature,
    map: mapboxgl.Map,
    pinned = false
  ): InspectedFeature {
    const props = f.properties || {};

    let lngLat: [number, number] = [0, 0];
    if (f.geometry.type === 'Point') {
      lngLat = f.geometry.coordinates as [number, number];
    }

    const projected = map.project(lngLat);

    if (kind === 'plant') {
      return {
        kind,
        id: String(props.id),
        title: props.name || 'Power plant',
        subtitle: props.technology || '',
        metrics: [
          { label: 'Capacity', value: `${props.capacityMW ?? '?'} MW` },
          { label: 'State', value: props.state || '' },
          { label: 'Status', value: props.status || '' },
        ],
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
      };
    }
    if (kind === 'dataCenter') {
      return {
        kind,
        id: String(props.id),
        title: props.name || 'Data center',
        subtitle: props.type || '',
        metrics: [
          { label: 'Draw', value: props.powerDrawMW ? `${props.powerDrawMW} MW` : 'Unknown' },
          { label: 'Status', value: props.status || '' },
        ],
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
      };
    }
    if (kind === 'substation') {
      return {
        kind,
        id: String(props.id),
        title: props.name || 'Substation',
        subtitle: props.owner || '',
        metrics: [
          { label: 'Voltage', value: `${props.voltageKV ?? '?'} kV` },
          { label: 'Owner', value: props.owner || 'Unknown' },
        ],
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
      };
    }
    return {
      kind,
      id: String(props.id),
      title: props.name || 'Asset',
      metrics: [],
      lngLat,
      screenPoint: { x: projected.x, y: projected.y },
      pinned,
    };
  }

  const technologyColors: Record<string, string> = {
    Solar: '#F7C948',
    Wind: '#6BE0FF',
    Nuclear: '#FF6BCB',
    Gas: '#FF8C42',
    Hydro: '#6BCBFF',
    Coal: '#555555',
    Oil: '#888888',
    Geothermal: '#FFD166',
    Biomass: '#A8E063',
    Storage: '#B39DDB',
    Other: '#FFFFFF',
  };

  const PLANT_BASE_RADIUS = [
    'interpolate', ['linear'], ['sqrt', ['get', 'capacityMW']],
    0, 2,
    10, 4,
    50, 6,
    250, 9,
    1000, 12,
    5000, 18
  ];

  const buildPlantRadiusExpression = (scale: number) => [
    'interpolate', ['linear'], ['zoom'],
    3, ['*', PLANT_BASE_RADIUS, scale],
    6, ['*', PLANT_BASE_RADIUS, scale * 1.2],
    9, ['*', PLANT_BASE_RADIUS, scale * 1.5]
  ];

  const buildPlantCoreRadiusExpression = (scale: number) => [
    'interpolate', ['linear'], ['zoom'],
    3, ['*', PLANT_BASE_RADIUS, scale * 0.6],
    6, ['*', PLANT_BASE_RADIUS, scale * 0.9],
    9, ['*', PLANT_BASE_RADIUS, scale * 1.1]
  ];

  const DC_BASE_RADIUS = [
    'interpolate', ['linear'], ['sqrt', ['coalesce', ['get', 'powerDrawMW'], 50]],
    0, 3,
    50, 5,
    100, 7,
    300, 10,
    1000, 14
  ];

  const buildDataCenterRadiusExpression = (scale: number) => [
    'interpolate', ['linear'], ['zoom'],
    3, ['*', DC_BASE_RADIUS, scale],
    6, ['*', DC_BASE_RADIUS, scale * 1.3],
    9, ['*', DC_BASE_RADIUS, scale * 1.6]
  ];

  const buildDataCenterCoreRadiusExpression = (scale: number) => [
    'interpolate', ['linear'], ['zoom'],
    3, ['*', DC_BASE_RADIUS, scale * 0.7],
    6, ['*', DC_BASE_RADIUS, scale * 1.0],
    9, ['*', DC_BASE_RADIUS, scale * 1.3]
  ];

  const techColorExpr = [
    'match', ['get', 'technology'],
    'Solar', technologyColors['Solar'],
    'Wind', technologyColors['Wind'],
    'Nuclear', technologyColors['Nuclear'],
    'Gas', technologyColors['Gas'],
    'Hydro', technologyColors['Hydro'],
    'Coal', technologyColors['Coal'],
    'Oil', technologyColors['Oil'],
    'Geothermal', technologyColors['Geothermal'],
    'Biomass', technologyColors['Biomass'],
    'Storage', technologyColors['Storage'],
    technologyColors['Other']
  ];

  const dcColorExpr = [
    'match', ['get', 'type'],
    'Hyperscale', '#FFD166',
    'Colo', '#6BE0FF',
    'Edge', '#FF6BCB',
    'IX', '#97A7FF',
    '#FFFFFF'
  ];

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    map.on('load', () => {
      setMapLoaded(true);

      console.log('known-good-line source?', !!map.getSource('known-good-line'));
      console.log('known-good-line-layer?', !!map.getLayer('known-good-line-layer'));
      console.log('tx-debug-line?', !!map.getLayer('tx-debug-line'));



      map.on('click', (e) => {
        const layersToQuery = [
          'plants-fill',
          'data-centers-fill',
          'substations-fill'
        ].filter(layerId => map.getLayer(layerId));

        if (layersToQuery.length === 0) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: layersToQuery
        });
        if (!features.length) {
          setInspected(null);
        }
      });

      // Add roads source
      if (!map.getSource('roads-base')) {
        map.addSource('roads-base', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-streets-v8'
        });
      }

      const majorRoadFilter = ['in', ['get', 'class'], ['literal', ['motorway', 'trunk']]];
      const regionalRoadFilter = ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary']]];
      const localRoadFilter = ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'street']]];

      map.addLayer({
        id: 'tpl-roads-base',
        type: 'line',
        source: 'composite',
        'source-layer': 'road',
        paint: {
          'line-color': 'rgba(140, 160, 255, 1.0)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.4, 8, 1.2, 12, 1.8],
          'line-opacity': roadsOpacity,
        },
      });

      map.addLayer({
        id: 'tpl-roads-glow',
        type: 'line',
        source: 'composite',
        'source-layer': 'road',
        paint: {
          'line-color': 'rgba(140, 160, 255, 1.0)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1.0, 8, 2.0, 12, 3.0],
          'line-opacity': roadsOpacity * 0.6,
          'line-blur': 1.0,
        },
      }, 'tpl-roads-base');

      map.on('zoom', () => {
        const z = map.getZoom();
        let filter = z < 5 ? majorRoadFilter : z < 9 ? regionalRoadFilter : localRoadFilter;
        if (map.getLayer('tpl-roads-base')) map.setFilter('tpl-roads-base', filter);
        if (map.getLayer('tpl-roads-glow')) map.setFilter('tpl-roads-glow', filter);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const vis = roadsVisible ? 'visible' : 'none';
    if (map.getLayer('tpl-roads-base')) map.setLayoutProperty('tpl-roads-base', 'visibility', vis);
    if (map.getLayer('tpl-roads-glow')) map.setLayoutProperty('tpl-roads-glow', 'visibility', vis);
    if (map.getLayer('tpl-roads-base')) map.setPaintProperty('tpl-roads-base', 'line-opacity', roadsOpacity);
    if (map.getLayer('tpl-roads-glow')) map.setPaintProperty('tpl-roads-glow', 'line-opacity', roadsOpacity * 0.6);
  }, [roadsVisible, roadsOpacity, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !mapData || !layersAdded) return;
    
    const activeTechs = Object.keys(techVisibility).filter(k => techVisibility[k]);
    console.log('Filtering tech:', activeTechs);
    const techFilter = activeTechs.length === 0 
      ? ['==', 'false', 'true'] 
      : ['in', ['get', 'technology'], ['literal', activeTechs]];
    
    if (map.getLayer('plants-fill')) {
      map.setFilter('plants-fill', techFilter);
    }
    if (map.getLayer('plants-halo')) {
      map.setFilter('plants-halo', techFilter);
    }

    const activeBands = Object.keys(txBands).filter(k => txBands[k]);
    console.log('Filtering TX bands:', activeBands);
    
    const txFilter = activeBands.length === 0
      ? ['==', ['coalesce', ['to-number', ['get', 'voltageKV']], -1], -9999]
      : ['any',
          ...(activeBands.includes('115-230kV')
            ? [['all',
                ['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 115],
                ['<',  ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 345]
              ]]
            : []),
          ...(activeBands.includes('345kV+')
            ? [['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 345]]
            : [])
        ];
        
    if (map.getLayer('tx-line')) {
      map.setFilter('tx-line', txFilter as any);
    }

    if (map.getLayer('data-centers-fill')) map.setLayoutProperty('data-centers-fill', 'visibility', dcsVisible ? 'visible' : 'none');
    if (map.getLayer('data-centers-halo')) map.setLayoutProperty('data-centers-halo', 'visibility', dcsVisible ? 'visible' : 'none');
  }, [techVisibility, txBands, dcsVisible, mapLoaded, mapData, layersAdded]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const data = await loadMapData();
        if (!cancelled) setMapData(data);
      } catch (err) {
        console.error('Failed to load map data', err);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapData || !mapLoaded || layersAdded) return;
    const map = mapRef.current;

      // -----------------------------------------------------------------
      // 1️⃣  SET / UPDATE SOURCES FROM THE LOADED MAP DATA
      // -----------------------------------------------------------------
      const upsertSource = (id: string, data: any) => {
        if (!data || typeof data !== 'object' || data.type !== 'FeatureCollection') {
          console.error(`Invalid GeoJSON for ${id}:`, data);
          return;
        }

        // LOG COORDINATE STRUCTURE
        if (id === 'transmission-lines') {
            data.features.slice(0, 5).forEach((f: any, i: number) => {
              console.log(`TX feature (before addSource) ${i}`, {
                geometryType: f.geometry?.type,
                coordPreview: JSON.stringify(f.geometry?.coordinates).slice(0, 500),
                coordLength: Array.isArray(f.geometry?.coordinates)
                  ? f.geometry.coordinates.length
                  : null,
                properties: f.properties
              });
            });

            const countVertices = (geometry: any): number => {
                if (!geometry) return 0;
                if (geometry.type === 'LineString') return geometry.coordinates.length;
                if (geometry.type === 'MultiLineString') {
                  return geometry.coordinates.reduce(
                    (sum: number, line: any[]) => sum + (Array.isArray(line) ? line.length : 0),
                    0
                  );
                }
                return 0;
            };
            const vertexCounts = data.features.slice(0, 200).map((f: any) => countVertices(f.geometry));
            console.log('TX vertex count sample', vertexCounts);
        }

        console.log(`Upserting source ${id} with ${data.features.length} features`);
        const src = map.getSource(id) as any;
        if (src && src.setData) {
          console.log(`Source ${id} exists, updating data`);
          src.setData(data);
        } else if (!src) {
          console.log(`Source ${id} does not exist, adding source`);
          map.addSource(id, { type: 'geojson', data });
        }

        if (id === 'transmission-lines') {
          // Log only ID reference, not the full source object which has circular references
          console.log('Mapbox source transmission-lines ID exists:', !!map.getSource('transmission-lines'));
        }
      };

      if (mapData) {
        console.log('MapData loaded:', {
          plants: mapData.plants?.features?.length,
          transmission: mapData.transmission?.features?.length,
          substations: mapData.substations?.features?.length,
          dataCenters: mapData.dataCenters?.features?.length
        });
        // Power plants
        if (mapData.plants) upsertSource('power-plants', mapData.plants);
        // Data centers
        if (mapData.dataCenters) upsertSource('data-centers', mapData.dataCenters);
        // Substations (if you use them elsewhere)
        if (mapData.substations) upsertSource('substations', mapData.substations);
      }

      // -----------------------------------------------------------------
      // 2️⃣  ADD LAYERS ONLY IF THEIR SOURCE EXISTS
      // -----------------------------------------------------------------
      if (layersAdded) return; // avoid duplicate adds

      // ----- HELPER: check source exists -----
      const sourceExists = (id: string) => !!map.getSource(id);

      // ----- TRANSMISSION LINES -----
      if (!map.getSource('transmission-lines')) {
        map.addSource('transmission-lines', {
          type: 'vector',
          url: TX_TILESET_URL
        });
        console.log('TX tileset source added', TX_TILESET_URL);
        console.log('TX source-layer configured', TX_SOURCE_LAYER);
      }

      if (!map.getLayer('tx-line')) {
        map.addLayer({
          id: 'tx-line',
          type: 'line',
          source: 'transmission-lines',
          'source-layer': TX_SOURCE_LAYER,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': [
              'case',
              ['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 735], '#4BE0FF',
              ['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 500], '#2CA9D6',
              ['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 345], '#1C7AA5',
              ['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 230], '#6054C8',
              ['>=', ['coalesce', ['to-number', ['get', 'voltageKV']], 0], 115], '#7B61FF',
              '#444A70'
            ],
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              3, 0.8,
              6, 1.4,
              8, 2.0
            ],
            'line-opacity': 0.85
          }
        });
      }

      map.once('idle', () => {
        const rendered = map.queryRenderedFeatures(undefined, {
          layers: ['tx-line']
        });
        console.log('Rendered TX tileset features on screen', rendered.length);
        console.log('Has tx source?', !!map.getSource('transmission-lines'));
        console.log('Has tx layer?', !!map.getLayer('tx-line'));
      });

    // ----- POWER PLANT LAYERS -----
    if (sourceExists('power-plants')) {
      const plantRadius = [
        'interpolate', ['linear'], ['zoom'],
        3, ['*', PLANT_BASE_RADIUS, bubbleScale],
        6, ['*', PLANT_BASE_RADIUS, bubbleScale * 1.2],
        9, ['*', PLANT_BASE_RADIUS, bubbleScale * 1.5]
      ];
      const techColorExpr = [
        'match', ['get', 'technology'],
        'Solar', '#FDD835',
        'Wind', '#4FC3F7',
        'Offshore Wind', '#29B6F6',
        'Storage', '#90A4AE',
        'Nuclear', '#EF5350',
        'Hydro', '#66BB6A',
        'Gas', '#FFA726',
        'Coal', '#795548',
        'Oil', '#D32F2F',
        'Geothermal', '#8E24AA',
        'Biomass', '#66BB6A',
        '#9E9E9E'
      ];

      // halo
      if (!map.getLayer('plants-halo')) {
        map.addLayer({
          id: 'plants-halo',
          type: 'circle',
          source: 'power-plants',
          paint: {
            'circle-color': techColorExpr as any,
            'circle-radius': plantRadius as any,
            'circle-opacity': 0.28,
            'circle-blur': 0.8
          }
        });
      }
      // fill
      if (!map.getLayer('plants-fill')) {
        map.addLayer({
          id: 'plants-fill',
          type: 'circle',
          source: 'power-plants',
          paint: {
            'circle-color': techColorExpr as any,
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              3, ['*', PLANT_BASE_RADIUS, bubbleScale * 0.6],
              6, ['*', PLANT_BASE_RADIUS, bubbleScale * 0.9],
              9, ['*', PLANT_BASE_RADIUS, bubbleScale * 1.1]
            ] as any,
            'circle-opacity': 0.92
          }
        });
        setupHandlers(map, 'plants-fill', 'plant');
      }
    } else {
      console.warn('Power‑plants source missing – skipping plant layers');
    }

    // ----- DATA CENTER LAYERS -----
    if (sourceExists('data-centers')) {
      const dcRadius = [
        'interpolate', ['linear'], ['zoom'],
        3, ['*', DC_BASE_RADIUS, bubbleScale],
        6, ['*', DC_BASE_RADIUS, bubbleScale * 1.3],
        9, ['*', DC_BASE_RADIUS, bubbleScale * 1.6]
      ];
      const dcColorExpr = [
        'match', ['get', 'type'],
        'Hyperscale', '#FFD166',
        'Colo', '#6BE0FF',
        'Edge', '#FF6BCB',
        'IX', '#97A7FF',
        '#FFFFFF'
      ];

      // halo
      if (!map.getLayer('data-centers-halo')) {
        map.addLayer({
          id: 'data-centers-halo',
          type: 'circle',
          source: 'data-centers',
          paint: {
            'circle-color': dcColorExpr as any,
            'circle-radius': dcRadius as any,
            'circle-opacity': 0.25,
            'circle-blur': 0.9
          }
        });
      }
      // fill
      if (!map.getLayer('data-centers-fill')) {
        map.addLayer({
          id: 'data-centers-fill',
          type: 'circle',
          source: 'data-centers',
          paint: {
            'circle-color': dcColorExpr as any,
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              3, ['*', DC_BASE_RADIUS, bubbleScale * 0.7],
              6, ['*', DC_BASE_RADIUS, bubbleScale * 1.0],
              9, ['*', DC_BASE_RADIUS, bubbleScale * 1.3]
            ] as any,
            'circle-opacity': 0.95
          }
        });
        setupHandlers(map, 'data-centers-fill', 'dataCenter');
      }
    } else {
      console.warn('Data‑centers source missing – skipping DC layers');
    }

    // ----- SUBSTATIONS SOURCE -----
    upsertSource('substations', mapData.substations);

    // ----- SUBSTATION LAYERS (after source is confirmed) -----
    if (map.getSource('substations')) {
      // diamond marker using circle layer
      if (!map.getLayer('substations-fill')) {
        map.addLayer({
          id: 'substations-fill',
          type: 'circle',
          source: 'substations',
          paint: {
            'circle-color': [
              'interpolate', ['linear'], ['get', 'voltageKV'],
              0,   '#444A70',
              115, '#7B61FF',
              230, '#6054C8',
              345, '#1C7AA5',
              500, '#2CA9D6',
              735, '#4BE0FF'
            ] as any,
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              4, 2,
              8, 4,
              12, 6
            ] as any,
            'circle-opacity': 0.9,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'rgba(255,255,255,0.4)'
          }
        });
        setupHandlers(map, 'substations-fill', 'substation');
      }
    } else {
      console.warn('Substations source missing – skipping substation layers');
    }

    // -----------------------------------------------------------------
    // 3️⃣  MARK THAT LAYERS HAVE BEEN ADDED
    // -----------------------------------------------------------------
    setLayersAdded(true);

    // Technology filter – start with all technologies allowed
    const defaultTechFilter = ['all'];
    if (map.getLayer('plants-fill')) {
      map.setFilter('plants-fill', defaultTechFilter);
    }
    if (map.getLayer('plants-halo')) {
      map.setFilter('plants-halo', defaultTechFilter);
    }

    // Data-center toggle – start visible
    if (map.getLayer('data-centers-fill')) {
      map.setLayoutProperty('data-centers-fill', 'visibility', dcsVisible ? 'visible' : 'none');
    }
    if (map.getLayer('data-centers-halo')) {
      map.setLayoutProperty('data-centers-halo', 'visibility', dcsVisible ? 'visible' : 'none');
    }

    // Substation toggle
    if (map.getLayer('substations-fill')) {
      map.setLayoutProperty(
        'substations-fill',
        'visibility',
        substationsVisible ? 'visible' : 'none'
      );
    }
  }, [mapData, mapLoaded, layersAdded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // plant halo
    if (map.getLayer('plants-halo')) {
      map.setPaintProperty('plants-halo', 'circle-radius', buildPlantRadiusExpression(bubbleScale) as any);
    }
    // plant fill
    if (map.getLayer('plants-fill')) {
      map.setPaintProperty('plants-fill', 'circle-radius', [
        'interpolate', ['linear'], ['zoom'],
        3, ['*', PLANT_BASE_RADIUS, bubbleScale * 0.6],
        6, ['*', PLANT_BASE_RADIUS, bubbleScale * 0.9],
        9, ['*', PLANT_BASE_RADIUS, bubbleScale * 1.1]
      ] as any);
    }
    // data-center halo
    if (map.getLayer('data-centers-halo')) {
      map.setPaintProperty('data-centers-halo', 'circle-radius', buildDataCenterRadiusExpression(bubbleScale) as any);
    }
    // data-center fill
    if (map.getLayer('data-centers-fill')) {
      map.setPaintProperty('data-centers-fill', 'circle-radius', [
        'interpolate', ['linear'], ['zoom'],
        3, ['*', DC_BASE_RADIUS, bubbleScale * 0.7],
        6, ['*', DC_BASE_RADIUS, bubbleScale * 1.0],
        9, ['*', DC_BASE_RADIUS, bubbleScale * 1.3]
      ] as any);
    }
  }, [bubbleScale, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !inspected) return;

    const updatePosition = () => {
      if (!inspected.lngLat) return;
      const p = map.project(inspected.lngLat);
      setInspected((prev) =>
        prev
          ? {
              ...prev,
              screenPoint: { x: p.x, y: p.y }
            }
          : prev
      );
    };

    map.on('move', updatePosition);
    map.on('zoom', updatePosition);
    map.on('resize', updatePosition);

    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
      map.off('resize', updatePosition);
    };
  }, [inspected]);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <FilterPanel
        layerVis={{
          plants: true,
          transmission: true,
          substations: substationsVisible,
          dataCenters: dcsVisible
        }}
        onToggleLayer={(key) => {
          if (key === 'plants') return; // Not implemented yet
          if (key === 'substations') setSubstationsVisible(!substationsVisible);
          if (key === 'dataCenters') setDcsVisible(!dcsVisible);
          if (key === 'transmission') return; // Not implemented yet
        }}
        techFilter={techVisibility}
        onToggleTech={(tech) => setTechVisibility(prev => ({ ...prev, [tech]: !prev[tech] }))}
        txBands={txBands}
        onToggleTxBand={(band) => setTxBands(prev => ({ ...prev, [band]: !prev[band] }))}
        roadsVisible={roadsVisible}
        onToggleRoads={setRoadsVisible}
      />
      {inspected && (
        <InfoCard
          inspected={inspected}
          mapWidth={mapSize.width}
          mapHeight={mapSize.height}
          onClose={() => setInspected(null)}
        />
      )}
    </div>
  );
};
