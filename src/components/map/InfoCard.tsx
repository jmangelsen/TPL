import React from 'react';
import { X, Zap, Server, Radio } from 'lucide-react';

export type InspectedKind = 'plant' | 'dataCenter' | 'substation' | 'transmission';

export interface InspectedFeature {
  kind: InspectedKind; id: string; title: string; subtitle?: string;
  metrics: { label: string; value: string; emphasize?: boolean }[];
  lngLat: [number, number]; screenPoint?: { x: number; y: number }; pinned?: boolean;
  properties?: any;
}

interface InfoCardProps {
  inspected: InspectedFeature; mapWidth: number; mapHeight: number; onClose: () => void;
}

const KIND_META: Record<InspectedKind, any> = {
  plant:        { icon: <Zap    size={12} />, accentColor: '#F7C948', label: 'Power Plant'  },
  dataCenter:   { icon: <Server size={12} />, accentColor: '#FFD166', label: 'Data Center'  },
  substation:   { icon: <Radio  size={12} />, accentColor: '#A78BFA', label: 'Substation'   },
  transmission: (props: any) => ({
    icon: <Zap size={12} />,
    accentColor: getTransmissionColor(Number(props?.VOLTAGE) || 0),
    label: getTransmissionTitle(props)
  }),
};

// Voltage tier → color (must match FilterPanel voltageBands)
const getTransmissionColor = (voltage: number): string => {
  if (voltage >= 345) return '#3B82F6';   // 345 kV+    blue
  if (voltage >= 230) return '#8B5CF6';   // 230-344   purple
  if (voltage >= 115) return '#6366F1';   // 115-229   indigo
  if (voltage >= 60)  return '#94A3B8';   // 60-114    slate
  return '#64748B';                        // fallback  gray
};

// Build the transmission card title from substation data
const getTransmissionTitle = (props: any): string => {
  const sub1 = String(props.SUB_1 || '').trim();
  const sub2 = String(props.SUB_2 || '').trim();
  
  // Prefer a readable substation name; skip "UNKNOWN######" placeholders
  const isNamed = (s: string) => s && !/^UNKNOWN\d*$/i.test(s) && s !== 'NOT AVAILABLE';
  
  if (isNamed(sub1)) return `${sub1} Transmission Line`;
  if (isNamed(sub2)) return `${sub2} Transmission Line`;
  return 'Transmission Line';  // fallback when both substations are UNKNOWN
};

const PLANT_TYPE_COLORS: Record<string, string> = {
  'Solar': '#F59E0B',
  'Wind': '#06B6D4',
  'Nuclear': '#10B981',
  'Natural Gas': '#8B5CF6',
  'Hydro': '#0EA5E9',
  'Coal': '#6B7280',
  'Storage': '#EC4899',
  'Other': '#9CA3AF'
};

export function InfoCard({ inspected, mapWidth, mapHeight, onClose }: InfoCardProps) {
  const CARD_W = 280, MAX_H = 400, OFFSET = 16;
  const sx = inspected.screenPoint?.x ?? 0, sy = inspected.screenPoint?.y ?? 0;
  
  // Approximate height based on metrics count + headers
  const estimatedH = 80 + (inspected.metrics.length * 34);
  const cardH = Math.min(estimatedH, MAX_H);

  let left = sx + OFFSET, top = sy - cardH / 2;
  if (left + CARD_W > mapWidth - 16)  left = sx - CARD_W - OFFSET;
  if (top  + cardH > mapHeight - 16) top  = mapHeight - cardH - 16;
  if (top  < 16) top  = 16;
  if (left < 16) left = 16;
  
  const baseMeta = KIND_META[inspected.kind];
  const meta = typeof baseMeta === 'function' ? baseMeta(inspected.properties) : baseMeta;
  
  const isTransmission = inspected.kind === 'transmission';
  const txColor = isTransmission 
    ? getTransmissionColor(Number(inspected.properties?.VOLTAGE) || 0)
    : null;

  const isHighVoltSubstation = inspected.kind === 'substation';
  const substationValueColor = '#FFFFFF';

  // Custom color based on plant type if it's a plant
  const accentColor = (inspected.kind === 'plant' && inspected.subtitle) 
    ? (PLANT_TYPE_COLORS[inspected.subtitle] || meta.accentColor)
    : (isTransmission ? txColor! : (isHighVoltSubstation ? substationValueColor : meta.accentColor));

  const kindLabel = searchedKindLabel();
  function searchedKindLabel() {
    if (inspected.kind === 'plant') {
      return `${inspected.subtitle || 'Unknown'} PLANT`.toUpperCase();
    }
    return meta.label;
  }

  return (
    <div className="tpl-ic-root" style={{ left: `${left}px`, top: `${top}px`, width: `${CARD_W}px`, maxHeight: `${MAX_H}px` }}>
      <div className="tpl-ic-kind" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
        {meta.icon}<span>{kindLabel}</span>
        {inspected.pinned && <span className="tpl-ic-pinned-dot" style={{ background: accentColor }} />}
      </div>
      <div className="tpl-ic-content-scroll">
        <div className="tpl-ic-title" style={{ color: isTransmission ? txColor! : accentColor }}>{inspected.title}</div>
        {inspected.subtitle && inspected.kind !== 'plant' && (
          <div className="tpl-ic-subtitle" style={inspected.kind === 'substation' ? { color: accentColor } : {}}>
            {inspected.subtitle}
          </div>
        )}
        {inspected.metrics.length > 0 && (
          <div className="tpl-ic-metrics">
            {inspected.metrics.map(m => (
              <div key={m.label} className="tpl-ic-metric-row">
                <span className="tpl-ic-metric-label">{m.label}</span>
                <span 
                  className="tpl-ic-metric-value" 
                  style={{ color: isTransmission ? txColor! : accentColor, fontWeight: isTransmission && m.emphasize ? 700 : 500 }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="tpl-ic-close" onClick={onClose}><X size={12} /></button>
    </div>
  );
}
