import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { loadMapData, type MapData } from '../../lib/mapData';
import { FilterPanel } from './FilterPanel';
import { InfoCard, type InspectedFeature, type InspectedKind } from './InfoCard';
import { buildSearchIndex } from '../../lib/searchIndex';
import { SearchBar } from './SearchBar';

// Ensure mapbox token is available
const MAPBOX_TOKEN = (import.meta.env as any).VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

export type LayerVisibility = {
  plants: boolean;
  transmission: boolean;
  substations: boolean;
  dataCenters: boolean;
};

export type TechFilter = Record<string, boolean>;
export type TxBandFilter = Record<string, boolean>;

export const InfrastructureMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);

  const [techVisibility, setTechVisibility] = useState<Record<string, boolean>>({ Solar: true, Wind: true, Nuclear: true, 'Natural Gas': true, Hydro: true, Coal: true, Storage: true, Other: true });
  const [txBands, setTxBands] = useState<Record<string, boolean>>({
    '345plus': true,
    '230-344': true,
    '115-229': true,
    '60-114': true
  });
  const [plantsVisible, setPlantsVisible] = useState(true);
  const [transmissionVisible, setTransmissionVisible] = useState(true);
  const [dcsVisible, setDcsVisible] = useState(true);
  const [substationsVisible, setSubstationsVisible] = useState(true);
  const bubbleScale = 0.65;
  const [inspected, setInspected] = useState<InspectedFeature | null>(null);
  const [selection, setSelection] = useState<{
    type: 'transmission' | 'substation';
    props: any;
  } | null>(null);
  const [layersAdded, setLayersAdded] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const setupHandlers = (map: mapboxgl.Map, layerId: string, kind: InspectedKind) => {
    map.on('mousemove', layerId, (e) => {
      const f = e.features?.[0];
      if (!f) return;
      map.getCanvas().style.cursor = 'pointer';
      setInspected((prev) => (prev?.pinned ? prev : buildInspectedFromFeature(kind, f, map, false, e.lngLat)));
    });
    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
      setInspected((prev) => (prev?.pinned ? prev : null));
    });
    map.on('click', layerId, (e) => {
      const f = e.features?.[0];
      if (!f) return;
      setSelection({ type: kind === 'transmission' ? 'transmission' : 'substation', props: f.properties });
      setInspected(buildInspectedFromFeature(kind, f, map, true, e.lngLat));
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
    pinned = false,
    clickLngLat?: mapboxgl.LngLat
  ): InspectedFeature {
    const props = f.properties || {};

    let lngLat: [number, number] = [0, 0];
    if (f.geometry.type === 'Point') {
      lngLat = f.geometry.coordinates as [number, number];
    } else if (clickLngLat) {
      lngLat = [clickLngLat.lng, clickLngLat.lat];
    }

    const projected = map.project(lngLat);

    if (kind === 'plant') {
      const p = props as any;
      const metrics = [
        { label: 'City', value: p.City || 'N/A' },
        { label: 'County', value: p.County || 'N/A' },
        { label: 'Energy Sources', value: p.Energy_sources || 'N/A' },
        { label: 'Maximum Output', value: p.Maximum_output_MW ? `${p.Maximum_output_MW} MW` : 'N/A' },
      ];

      // Energy Source Breakdown
      const sources = [
        { label: 'Battery Capacity', key: 'Bat_MW' },
        { label: 'Biomass Capacity', key: 'Bio_MW' },
        { label: 'Coal Capacity', key: 'Coal_MW' },
        { label: 'Other Energy Capacity', key: 'Oth_MW' },
        { label: 'Geothermal Capacity', key: 'Geo_MW' },
        { label: 'Hydro Capacity', key: 'Hydro_MW' },
        { label: 'Natural Gas Capacity', key: 'Ng_MW' },
        { label: 'Nuclear Capacity', key: 'Nuc_MW' },
        { label: 'Petroleum Capacity', key: 'Pet_MW' },
        { label: 'Pumped Storage Capacity', key: 'Ps_MW' },
        { label: 'Solar Capacity', key: 'Sol_MW' },
        { label: 'Wind Capacity', key: 'Wnd_MW' },
      ];

      sources.forEach(s => {
        const val = Number(p[s.key]);
        if (val >= 0.01) {
          metrics.push({ label: s.label, value: `${val.toFixed(2)} MW` });
        }
      });

      // Plant Details
      metrics.push(
        { label: 'Primary Energy Source', value: (p.Primsource && p.Primsource !== 'N/A') ? p.Primsource : (p.plantType || 'N/A') },
        { label: 'Street Address', value: p.Street || 'N/A' },
        { label: 'Nameplate Capacity', value: p.Nameplate || 'N/A' },
        { label: 'Utility Operator', value: p.Utility || p.Util_name || 'N/A' },
        { label: 'ZIP Code', value: p.Zip || 'N/A' }
      );

      const filteredMetrics = metrics.filter(m => {
        const v = String(m.value || '').trim().toUpperCase();
        return v !== '' && v !== 'N/A' && v !== 'NULL' && v !== 'UNDEFINED' && v !== 'NOT AVAILABLE';
      });

      return {
        kind,
        id: String(p.id),
        title: p.Plant_Name || p.name || 'Power plant',
        subtitle: p.plantType || '',
        metrics: filteredMetrics,
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
        properties: p
      };
    }
    if (kind === 'dataCenter') {
      return {
        kind,
        id: String(props.id),
        title: props.name || 'Data center',
        subtitle: props.type || '',
        metrics: [
          { label: 'Draw', value: props.powerDrawMW ? `${props.powerDrawMW} MW` : '' },
          { label: 'Status', value: props.status || '' },
        ].filter(m => {
          const v = String(m.value || '').trim().toUpperCase();
          return v !== '' && v !== 'UNKNOWN' && v !== 'N/A' && v !== 'NOT AVAILABLE';
        }),
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
        properties: props
      };
    }
    if (kind === 'substation') {
      const sProps = props as any; // Cast as we updated the interface but properties coming from GeoJSON
      return {
        kind,
        id: String(sProps.NAME), // Use name as ID if unique ID not available or keep generic
        title: sProps.NAME || 'Substation',
        subtitle: sProps.COUNTY ? `${sProps.COUNTY}, ${sProps.STATE}` : (sProps.STATE || ''),
        metrics: [
          { label: 'City', value: sProps.CITY || 'N/A' },
          { label: 'County', value: sProps.COUNTY || 'N/A' },
          { label: 'ZIP', value: sProps.ZIP || 'N/A' },
          { label: 'Status', value: sProps.STATUS || 'N/A' },
          { label: 'State', value: sProps.STATE || 'N/A' },
          { label: 'Description', value: sProps.NAICS_DESC || 'N/A' },
          { label: 'Max Voltage', value: sProps.MAX_VOLT ? `${sProps.MAX_VOLT} kV` : 'N/A' },
        ].filter(m => {
          const v = String(m.value || '').trim().toUpperCase();
          return v !== '' && v !== 'N/A' && v !== 'NULL' && v !== 'UNDEFINED' && v !== 'NOT AVAILABLE';
        }),
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
        properties: sProps
      };
    }
    if (kind === 'transmission') {
      const txRedact = (val: any) => {
        if (val === null || val === undefined) return null;
        const str = String(val).trim();
        if (!str || str === 'NOT AVAILABLE' || str === '-999999' || str === '-999999.0') return null;
        return str;
      };

      const txRows = [
        { label: 'Line Type', value: txRedact(props.TYPE) },
        { label: 'NAICS Description', value: txRedact(props.NAICS_DESC) },
        { label: 'Operational Status', value: txRedact(props.STATUS) },
        { label: 'Substation 1', value: txRedact(props.SUB_1) },
        { label: 'Substation 2', value: txRedact(props.SUB_2) },
        { label: 'Transmission Line Owner', value: txRedact(props.OWNER) },
        { 
          label: 'Voltage (Kilovolts)', 
          value: (props.VOLTAGE && Number(props.VOLTAGE) > 0) 
            ? `${Number(props.VOLTAGE).toFixed(1)} kV` 
            : null,
          emphasize: true
        },
        { label: 'Voltage Class', value: txRedact(props.VOLT_CLASS) }
      ].filter(row => row.value !== null);

      return {
        kind,
        id: String(props.id),
        title: props.owner || 'Transmission Line',
        subtitle: props.type || '',
        metrics: txRows,
        lngLat,
        screenPoint: { x: projected.x, y: projected.y },
        pinned,
        properties: props
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
    Solar: '#F59E0B',
    Wind: '#06B6D4',
    Nuclear: '#10B981',
    'Natural Gas': '#8B5CF6',
    Hydro: '#0EA5E9',
    Coal: '#6B7280',
    Storage: '#EC4899',
    Other: '#9CA3AF',
  };

  const buildPlantRadiusExpression = () => [
    'interpolate',
    ['linear'],
    ['zoom'],
    3,
    [
      'interpolate',
      ['linear'],
      ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
      0, 4,
      10, 6,
      100, 12,
      500, 20,
      1000, 28,
      5000, 45
    ],
    6,
    [
      'interpolate',
      ['linear'],
      ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
      0, 6,
      10, 10,
      100, 18,
      500, 32,
      1000, 44,
      5000, 70
    ],
    9,
    [
      'interpolate',
      ['linear'],
      ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
      0, 10,
      10, 16,
      100, 28,
      500, 48,
      1000, 64,
      5000, 100
    ]
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

const txColorExpr = (): mapboxgl.Expression => [
  'case',
  ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 345], '#FFFFFF',
  ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 230], '#A78BFA',
  ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 115], '#7C6FCD',
  ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 60], '#5B8FD8',
  '#555577'
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
        ].filter(layerId => !!map.getLayer(layerId));

        if (layersToQuery.length === 0) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: layersToQuery
        });
        if (!features.length) {
          setInspected(null);
          setSelection(null);
        }
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
    if (!map || !mapLoaded || !mapData || !layersAdded) return;
    
    // 1. Plants Visibility & Filtering
    const activeTechs = Object.keys(techVisibility).filter(k => techVisibility[k]);
    const techFilter = activeTechs.length === 0 
      ? ['==', 'false', 'true'] 
      : ['in', ['get', 'plantType'], ['literal', activeTechs]];
    
    if (map.getLayer('plants-fill')) {
      map.setLayoutProperty('plants-fill', 'visibility', plantsVisible ? 'visible' : 'none');
      map.setFilter('plants-fill', techFilter);
    }

    // 2. Transmission Visibility & Filtering
    const txLayers = [
      'tx-345plus',
      'tx-230-344',
      'tx-115-229'
    ];

    txLayers.forEach(id => {
      if (map.getLayer(id)) {
        let isBandVisible = false;
        if (id === 'tx-345plus') {
          isBandVisible = txBands['345plus'];
        } else if (id === 'tx-230-344') {
          isBandVisible = txBands['230-344'];
        } else if (id === 'tx-115-229') {
          isBandVisible = txBands['115-229'];
        } else if (id === 'tx-60-114') {
          isBandVisible = txBands['60-114'];
        }
        map.setLayoutProperty(id, 'visibility', (transmissionVisible && isBandVisible) ? 'visible' : 'none');
      }
    });

    // 3. Substations Visibility
    const subVis = substationsVisible ? 'visible' : 'none';
    if (map.getLayer('substations-fill')) {
      map.setLayoutProperty('substations-fill', 'visibility', subVis);
    }
    if (map.getLayer('substations-glow')) {
      map.setLayoutProperty('substations-glow', 'visibility', subVis);
    }

    // 4. Data Centers Visibility
    const dcVis = dcsVisible ? 'visible' : 'none';
    if (map.getLayer('data-centers-fill')) map.setLayoutProperty('data-centers-fill', 'visibility', dcVis);
    if (map.getLayer('data-centers-halo')) map.setLayoutProperty('data-centers-halo', 'visibility', dcVis);

  }, [plantsVisible, transmissionVisible, techVisibility, txBands, dcsVisible, substationsVisible, mapLoaded, mapData, layersAdded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    
    const hasTxHighlight = !!map.getLayer('tx-highlighted');
    const hasSubHighlight = !!map.getLayer('substations-highlighted');
    if (!hasTxHighlight || !hasSubHighlight) return;
    
    const txBaseLayers = ['tx-60-114', 'tx-115-229', 'tx-230-344', 'tx-345plus'];
    const subBaseLayers = ['substations-fill', 'substations-glow'];
    
    // Original opacity values (must match your addLayer definitions)
    const originalOpacity: Record<string, any> = {
      'tx-60-114':  ['interpolate', ['linear'], ['zoom'], 3, 0.3, 6, 0.5, 9, 0.7],
      'tx-115-229': ['interpolate', ['linear'], ['zoom'], 3, 0.4, 6, 0.6, 9, 0.8],
      'tx-230-344': 0.75,
      'tx-345plus': 0.9,
      'substations-fill': 1,
      'substations-glow': 0.2
    };
    
    const applyTxHighlightFilter = (filter: any[] | null) => {
      if (!filter) return;
      const safeFilter = JSON.parse(
        JSON.stringify(filter, (_, v) => v === undefined ? null : v)
      );
      if (map.getLayer('tx-highlighted'))      map.setFilter('tx-highlighted', safeFilter);
      if (map.getLayer('tx-highlighted-glow')) map.setFilter('tx-highlighted-glow', safeFilter);
    };

    if (!selection) {
      // Clear highlights
      applyTxHighlightFilter(['==', ['get', 'OBJECTID'], null]);
      map.setFilter('substations-highlighted', ['==', ['get', 'NAME'], '__never__']);
      // Restore base-layer opacity
      txBaseLayers.forEach(id => {
        if (map.getLayer(id)) {
          map.setPaintProperty(id, 'line-opacity', originalOpacity[id]);
        }
      });
      subBaseLayers.forEach(id => {
        if (map.getLayer(id)) {
          map.setPaintProperty(id, 'circle-opacity', originalOpacity[id]);
        }
      });
      return;
    }
    
    // Something is selected — dim base layers
    txBaseLayers.forEach(id => {
      if (map.getLayer(id)) map.setPaintProperty(id, 'line-opacity', 0.15);
    });
    if (map.getLayer('substations-fill')) {
      map.setPaintProperty('substations-fill', 'circle-opacity', 0.2);
    }
    if (map.getLayer('substations-glow')) {
      map.setPaintProperty('substations-glow', 'circle-opacity', 0.05);
    }
    
    if (selection.type === 'transmission') {
      const { OBJECTID, SUB_1, SUB_2 } = selection.props;
      
      // Highlight the clicked line
      applyTxHighlightFilter(['==', ['get', 'OBJECTID'], OBJECTID]);
      
      // Highlight both endpoints (skip UNKNOWN and NOT AVAILABLE placeholders)
      const sub1 = selection.props?.SUB_1 ?? null;
      const sub2 = selection.props?.SUB_2 ?? null;
      
      const connectedNames = [sub1, sub2].filter(
        (n): n is string =>
          typeof n === 'string' &&
          n.length > 0 &&
          n !== 'null' &&
          n !== 'undefined' &&
          n !== 'NOT AVAILABLE' &&
          !/^UNKNOWN\d*$/i.test(n)
      );
      
      map.setFilter(
        'substations-highlighted',
        connectedNames.length > 0
          ? ['in', ['get', 'NAME'], ['literal', connectedNames]]
          : ['==', ['get', 'NAME'], '__never__']
      );
    } else if (selection.type === 'substation') {
      const rawSubName = selection?.props?.NAME ?? selection?.props?.name ?? null;
      const subName = (rawSubName && 
        rawSubName !== 'null' && 
        rawSubName !== 'undefined' && 
        !/^UNKNOWN\d*$/i.test(rawSubName)
      ) ? rawSubName : null;
      
      if (subName) {
        map.setFilter('substations-highlighted', 
          ['==', ['get', 'NAME'], subName]
        );
      } else {
        map.setFilter('substations-highlighted', 
          ['==', ['get', 'NAME'], '__never__']
        );
        applyTxHighlightFilter(['==', ['get', 'OBJECTID'], null]);
        return;
      }
      
      // Highlight every line touching this substation
      applyTxHighlightFilter([
        'any',
        ['==', ['get', 'SUB_1'], subName],
        ['==', ['get', 'SUB_2'], subName]
      ]);
    }
  }, [selection]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const data = await loadMapData();
        if (!cancelled) {
          setMapData(data);
          buildSearchIndex(data.plants, data.substations, data.transmission);
        }
      } catch (err) {
        console.error('Failed to load map data', err);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  // Enforce visual stacking order: transmission at bottom, then substations, 
  // then plants/data centers on top. Call AFTER all layers are added.
  const enforceLayerOrder = (map: mapboxgl.Map) => {
    // Order from BOTTOM to TOP (later entries render on top of earlier ones)
    const orderedLayers = [
      // Transmission lines — drawn first (behind everything)
      'tx-60-114',
      'tx-115-229',
      'tx-230-344',
      'tx-345plus',
      'tx-voltage-labels',        // Labels above lines
      // Substations — drawn on top of transmission
      'substations-glow',
      'substations-fill',
      // Data centers — drawn on top of substations
      'data-centers-halo',
      'data-centers-fill',
      // Power plants — drawn on top of everything (most important visual)
      'plants-fill',
      'tx-highlighted-glow',       // NEW — glow halo underneath
      'tx-highlighted',             // core line on top of glow
      'substations-highlighted'  // NEW — topmost
    ];
    
    orderedLayers.forEach(id => {
      if (map.getLayer(id)) {
        map.moveLayer(id);
      }
    });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !mapData) return;

    // ----- SET / UPDATE SOURCES FROM THE LOADED MAP DATA -----
    const upsertSource = (id: string, data: any) => {
      if (!data || typeof data !== 'object' || data.type !== 'FeatureCollection') return;
      
      const src = map.getSource(id) as any;
      if (src && src.setData) {
        src.setData(data);
      } else if (!src) {
        map.addSource(id, { type: 'geojson', data });
      }
    };

    if (mapData.plants) upsertSource('power-plants', mapData.plants);
    if (mapData.dataCenters) upsertSource('data-centers', mapData.dataCenters);
    if (mapData.substations) upsertSource('substations', mapData.substations);
    if (mapData.transmission) upsertSource('tpl-transmission', mapData.transmission);

    // ----- POWER PLANT LAYERS -----
    if (map.getSource('power-plants')) {
      const techColorExpr = [
        'match', ['get', 'plantType'],
        'Solar', technologyColors['Solar'],
        'Wind', technologyColors['Wind'],
        'Nuclear', technologyColors['Nuclear'],
        'Natural Gas', technologyColors['Natural Gas'],
        'Hydro', technologyColors['Hydro'],
        'Coal', technologyColors['Coal'],
        'Storage', technologyColors['Storage'],
        technologyColors['Other']
      ];

      // fill
      if (!map.getLayer('plants-fill')) {
        map.addLayer({
          id: 'plants-fill',
          type: 'circle',
          source: 'power-plants',
          minzoom: 3,
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              ['interpolate', ['linear'], ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
                0, 2,
                10, 3,
                100, 6,
                500, 12,
                1000, 18,
                5000, 30
              ],
              6,
              ['interpolate', ['linear'], ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
                0, 3,
                10, 5,
                100, 10,
                500, 18,
                1000, 28,
                5000, 45
              ],
              9,
              ['interpolate', ['linear'], ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
                0, 5,
                10, 8,
                100, 15,
                500, 28,
                1000, 42,
                5000, 68
              ]
            ],
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              [
                'interpolate',
                ['linear'],
                ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
                0, 0.15,
                10, 0.25,
                100, 0.45,
                500, 0.7,
                1000, 0.85,
                5000, 0.95
              ],
              7,
              [
                'interpolate',
                ['linear'],
                ['sqrt', ['coalesce', ['to-number', ['get', 'capacityMW']], 1]],
                0, 0.5,
                10, 0.6,
                100, 0.75,
                500, 0.9,
                1000, 0.95,
                5000, 1.0
              ],
              10,
              1.0
            ],
            'circle-color': [
              'match',
              ['get', 'plantType'],
              'Solar', '#F59E0B',
              'Wind', '#06B6D4',
              'Nuclear', '#10B981',
              'Natural Gas', '#8B5CF6',
              'Hydro', '#0EA5E9',
              'Coal', '#6B7280',
              'Storage', '#EC4899',
              '#9CA3AF'
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000000'
          }
        });
        setupHandlers(map, 'plants-fill', 'plant');
      }
    } else {
      console.warn('Power‑plants source missing – skipping plant layers');
    }

    // ----- DATA CENTER LAYERS -----
    if (map.getSource('data-centers')) {
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
      // Glow layer
      if (!map.getLayer('substations-glow')) {
        map.addLayer({
          id: "substations-glow",
          type: "circle",
          source: "substations",
          minzoom: 7,  // Glow only at higher zoom
          filter: [">=", ["to-number", ["get", "MAX_VOLT"]], 230],  // Only high-voltage glow
          paint: {
            "circle-radius": [
              "interpolate", ["linear"], ["zoom"],
              7, ["*", ["/", ["to-number", ["get", "MAX_VOLT"]], 100], 1.2],
              12, ["*", ["/", ["to-number", ["get", "MAX_VOLT"]], 100], 3.5]
            ],
            "circle-color": "#FFFFFF",
            "circle-opacity": 0.2,
            "circle-blur": 1.2
          }
        });
      }

      // Main layer
      if (!map.getLayer('substations-fill')) {
        map.addLayer({
          id: "substations-fill",
          type: "circle",
          source: "substations",
          minzoom: 6,
          filter: [">=", ["to-number", ["get", "MAX_VOLT"]], 69],
          paint: {
            "circle-radius": [
              "interpolate", ["linear"], ["zoom"],
              6, [
                "interpolate", ["linear"], ["to-number", ["get", "MAX_VOLT"]],
                69, 1,
                230, 2.5,
                500, 5,
                765, 8
              ],
              12, [
                "interpolate", ["linear"], ["to-number", ["get", "MAX_VOLT"]],
                69, 3,
                230, 6,
                500, 12,
                765, 20
              ]
            ],
            "circle-color": "#FFFFFF",
            "circle-opacity": [
              "interpolate", ["linear"], ["to-number", ["get", "MAX_VOLT"]],
              69, 0.4,
              230, 0.7,
              500, 1.0
            ]
          }
        });
        setupHandlers(map, 'substations-fill', 'substation');
      }
    } else {
      console.warn('Substations source missing – skipping substation layers');
    }

    // Transmission lines (OpenGridWorks style)
    if (map.getSource('tpl-transmission')) {
      // TIER 0: Sub-transmission — 60-115 kV (drawn first, lowest priority)
      if (!map.getLayer("tx-60-114")) {
        map.addLayer({
          id: "tx-60-114",
          type: "line",
          source: "tpl-transmission",
          filter: [
            "all",
            [">=", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 60],
            ["<", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 115]
          ],
          paint: {
            "line-color": "#94A3B8",  // Matches 60-114 kV
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              3, 0.2, 6, 0.4, 9, 0.7, 12, 1.0
            ],
            "line-opacity": [
              "interpolate", ["linear"], ["zoom"],
              3, 0.3, 6, 0.5, 9, 0.7
            ]
          }
        });
        setupHandlers(map, 'tx-60-114', 'transmission');
      }

      // TIER 1: Local transmission — 115-229 kV
      if (!map.getLayer("tx-115-229")) {
        map.addLayer({
          id: "tx-115-229",
          type: "line",
          source: "tpl-transmission",
          filter: [
            "all",
            [">=", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 115],
            ["<", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 230]
          ],
          paint: {
            "line-color": "#6366F1",  // Matches 115-229 kV (indigo)
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              3, 0.3, 6, 0.6, 9, 1.0, 12, 1.5
            ],
            "line-opacity": [
              "interpolate", ["linear"], ["zoom"],
              3, 0.4, 6, 0.6, 9, 0.8
            ]
          }
        });
        setupHandlers(map, 'tx-115-229', 'transmission');
      }

      // TIER 2: Regional backbone — 230-344 kV
      if (!map.getLayer("tx-230-344")) {
        map.addLayer({
          id: "tx-230-344",
          type: "line",
          source: "tpl-transmission",
          filter: [
            "all",
            [">=", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 230],
            ["<", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 345]
          ],
          paint: {
            "line-color": "#8B5CF6",  // Matches 230-344 kV (purple)
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              3, 0.6, 6, 1.2, 9, 2.0, 12, 3.0
            ],
            "line-opacity": 0.75
          }
        });
        setupHandlers(map, 'tx-230-344', 'transmission');
      }

      // TIER 3: Extra high voltage backbone — 345 kV+ (drawn last, on top)
      if (!map.getLayer("tx-345plus")) {
        map.addLayer({
          id: "tx-345plus",
          type: "line",
          source: "tpl-transmission",
          filter: [">=", ["coalesce", ["to-number", ["get", "VOLTAGE"]], 0], 345],
          paint: {
            "line-color": "#3B82F6",  // Matches 345 kV+ (blue)
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              3, 1.0, 6, 2.0, 9, 3.2, 12, 5.0
            ],
            "line-opacity": 0.9
          }
        });
        setupHandlers(map, 'tx-345plus', 'transmission');
      }

      // Transmission labels
      if (!map.getLayer('tx-voltage-labels')) {
        map.addLayer({
          id: 'tx-voltage-labels',
          type: 'symbol',
          source: 'tpl-transmission',
          minzoom: 8,  // Only show when zoomed in enough to read
          // Skip placeholder / missing voltages
          filter: [
            'all',
            ['has', 'VOLTAGE'],
            ['>', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 0]
          ],
          layout: {
            'symbol-placement': 'line',       // Labels follow the line path
            'symbol-spacing': 250,             // Repeat every 250px along long lines
            'text-field': [
              'concat',
              // Format as "345 kV" — strip decimals for whole-number voltages
              ['to-string', ['round', ['to-number', ['get', 'VOLTAGE']]]],
              ' kV'
            ],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': [
              'interpolate', ['linear'], ['zoom'],
              8, 9,
              10, 11,
              13, 13
            ],
            'text-rotation-alignment': 'map',  // Rotate with line (not screen)
            'text-pitch-alignment': 'viewport',
            'text-keep-upright': true,         // Flip labels so they're never upside-down
            'text-anchor': 'center',
            'text-offset': [0, -0.6],          // Nudge slightly above the line
            'text-allow-overlap': false,       // Let Mapbox dedupe overlapping labels
            'text-ignore-placement': false,
            'text-padding': 2
          },
          paint: {
            // Color matches the voltage tier
            'text-color': [
              'case',
              ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 345], '#3B82F6',  // 345+    blue
              ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 230], '#8B5CF6',  // 230-344 purple
              ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 115], '#6366F1',  // 115-229 indigo
              ['>=', ['coalesce', ['to-number', ['get', 'VOLTAGE']], 0], 60],  '#94A3B8',  // 60-114  slate
              '#64748B'  // fallback gray
            ],
            'text-halo-color': '#0B1220',     // dark halo so it reads on dark basemap
            'text-halo-width': 1.5,
            'text-halo-blur': 0.5,
            'text-opacity': [
              'interpolate', ['linear'], ['zoom'],
              8, 0,      // fade in starting at zoom 8
              8.5, 0.8,
              10, 1
            ]
          }
        });
      }

      // --- GLOW halo underneath the core line ---
      if (!map.getLayer('tx-highlighted-glow')) {
        map.addLayer({
          id: 'tx-highlighted-glow',
          type: 'line',
          source: 'tpl-transmission',
          filter: ['==', ['get', 'OBJECTID'], null],   // matches nothing initially
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#00E5FF',        // electric cyan — spills outward as glow
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              3, 4,
              6, 6,
              9, 9,
              12, 13
            ],
            'line-opacity': 0.45,
            'line-blur': 6                  // this is what makes it glow
          }
        });
      }

      // --- Crisp core line on top of the glow ---
      if (!map.getLayer('tx-highlighted')) {
        map.addLayer({
          id: 'tx-highlighted',
          type: 'line',
          source: 'tpl-transmission',
          filter: ['==', ['get', 'OBJECTID'], null],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#3B82F6',        // electric blue — same hex as 345 kV+ tier
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              3, 1.2,
              6, 1.8,
              9, 2.6,
              12, 3.8
            ],
            'line-opacity': 1,
            'line-blur': 0
          }
        });
      }

      if (!map.getLayer('substations-highlighted')) {
        map.addLayer({
          id: 'substations-highlighted',
          type: 'circle',
          source: 'substations',
          filter: ['==', ['get', 'NAME'], '__never__'],  // matches nothing initially
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              6, 6,
              12, 18
            ],
            'circle-color': 'transparent',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#FFFFFF',
            'circle-opacity': 1
          }
        });
      }
    }

    if (mapData.plants && mapData.transmission && mapData.substations && mapData.dataCenters) {
      setLayersAdded(true);
    }
    enforceLayerOrder(map);
  }, [mapData, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // plant halo
    if (map.getLayer('plants-halo')) {
      map.setPaintProperty('plants-halo', 'circle-radius', buildPlantRadiusExpression() as any);
    }
    // plant fill
    if (map.getLayer('plants-fill')) {
      map.setPaintProperty('plants-fill', 'circle-radius', buildPlantRadiusExpression() as any);
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
      <SearchBar
        onSelect={(result) => {
          const map = mapRef.current;
          if (!map) return;
          
          // Zoom level chosen per feature type
          const zoom = result.type === 'transmission' ? 10 
                     : result.type === 'substation'   ? 11
                     : 11;
          
          map.flyTo({
            center: result.center,
            zoom,
            duration: 1200,
            essential: true
          });
          
          // Reuse existing selection state
          if (result.type !== 'plant') {
            setSelection({
              type: result.type as 'transmission' | 'substation',
              props: result.props
            });
          }
           
          // Mock feature to open InfoCard
          const mockedFeature = {
            properties: result.props,
            geometry: { type: 'Point', coordinates: result.center },
          } as any as mapboxgl.MapboxGeoJSONFeature;

          setInspected(buildInspectedFromFeature(result.type as any, mockedFeature, map, true));
        }}
      />
      <FilterPanel
        layerVis={{
          plants: plantsVisible,
          transmission: transmissionVisible,
          substations: substationsVisible,
          dataCenters: dcsVisible
        }}
        onToggleLayer={(key) => {
          if (key === 'plants') setPlantsVisible(!plantsVisible);
          if (key === 'substations') setSubstationsVisible(!substationsVisible);
          if (key === 'dataCenters') setDcsVisible(!dcsVisible);
          if (key === 'transmission') setTransmissionVisible(!transmissionVisible);
        }}
        techFilter={techVisibility}
        onToggleTech={(tech) => setTechVisibility(prev => ({ ...prev, [tech]: !prev[tech] }))}
        txBands={txBands}
        onToggleTxBand={(band: string) => setTxBands(prev => ({ ...prev, [band]: !prev[band] }))}
      />
      {inspected && (
        <InfoCard
          inspected={inspected}
          mapWidth={mapSize.width}
          mapHeight={mapSize.height}
          onClose={() => {
            setInspected(null);
            setSelection(null);
          }}
        />
      )}
    </div>
  );
};
