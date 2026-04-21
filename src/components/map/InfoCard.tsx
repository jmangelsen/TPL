import React from 'react';
import { X, Zap, Server, Radio } from 'lucide-react';

export type InspectedKind = 'plant' | 'dataCenter' | 'substation' | 'transmission';

export interface InspectedFeature {
  kind: InspectedKind; id: string; title: string; subtitle?: string;
  metrics: { label: string; value: string }[];
  lngLat: [number, number]; screenPoint?: { x: number; y: number }; pinned?: boolean;
}

interface InfoCardProps {
  inspected: InspectedFeature; mapWidth: number; mapHeight: number; onClose: () => void;
}

const KIND_META: Record<InspectedKind, { icon: React.ReactNode; accentColor: string; label: string }> = {
  plant:        { icon: <Zap    size={12} />, accentColor: '#F7C948', label: 'Power Plant'  },
  dataCenter:   { icon: <Server size={12} />, accentColor: '#FFD166', label: 'Data Center'  },
  substation:   { icon: <Radio  size={12} />, accentColor: '#A78BFA', label: 'Substation'   },
  transmission: { icon: <Zap    size={12} />, accentColor: '#60A5FA', label: 'Transmission' },
};

export function InfoCard({ inspected, mapWidth, mapHeight, onClose }: InfoCardProps) {
  const CARD_W = 260, CARD_H = 170, OFFSET = 16;
  const sx = inspected.screenPoint?.x ?? 0, sy = inspected.screenPoint?.y ?? 0;
  let left = sx + OFFSET, top = sy - CARD_H / 2;
  if (left + CARD_W > mapWidth - 16)  left = sx - CARD_W - OFFSET;
  if (top  + CARD_H > mapHeight - 16) top  = mapHeight - CARD_H - 16;
  if (top  < 16) top  = 16;
  if (left < 16) left = 16;
  const meta = KIND_META[inspected.kind];

  return (
    <div className="tpl-info-card" style={{ left: `${left}px`, top: `${top}px`, width: `${CARD_W}px` }}>
      <div className="tpl-ic-kind" style={{ color: meta.accentColor, borderColor: `${meta.accentColor}44` }}>
        {meta.icon}<span>{meta.label}</span>
        {inspected.pinned && <span className="tpl-ic-pinned-dot" style={{ background: meta.accentColor }} />}
      </div>
      <div className="tpl-ic-title">{inspected.title}</div>
      {inspected.subtitle && <div className="tpl-ic-subtitle">{inspected.subtitle}</div>}
      {inspected.metrics.length > 0 && (
        <div className="tpl-ic-metrics">
          {inspected.metrics.map(m => (
            <div key={m.label} className="tpl-ic-metric-row">
              <span className="tpl-ic-metric-label">{m.label}</span>
              <span className="tpl-ic-metric-value" style={{ color: meta.accentColor }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}
      <button className="tpl-ic-close" onClick={onClose}><X size={12} /></button>
    </div>
  );
}
