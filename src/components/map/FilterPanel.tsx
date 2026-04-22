import React, { useState } from 'react';
import { Layers, Zap, Server, ChevronDown, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import type { LayerVisibility, TechFilter, TxBandFilter } from './InfrastructureMap';

const TECH_ORDER = [
  { id: 'Solar',       color: '#F59E0B', label: 'Solar' },
  { id: 'Wind',        color: '#06B6D4', label: 'Wind' },
  { id: 'Nuclear',     color: '#10B981', label: 'Nuclear' },
  { id: 'Natural Gas', color: '#8B5CF6', label: 'Natural Gas' },
  { id: 'Hydro',       color: '#0EA5E9', label: 'Hydro' },
  { id: 'Coal',        color: '#6B7280', label: 'Coal' },
  { id: 'Storage',     color: '#EC4899', label: 'Storage' },
  { id: 'Other',       color: '#9CA3AF', label: 'Other' },
];

const TX_BANDS = [
  { id: '345plus' as const, color: '#3B82F6', label: '345 kV+',     desc: 'Extra high voltage backbone' },
  { id: '230-344' as const, color: '#8B5CF6', label: '230-344 kV',  desc: 'Regional backbone' },
  { id: '115-229' as const, color: '#6366F1', label: '115-229 kV',  desc: 'Local transmission' },
  { id: '60-114'  as const, color: '#94A3B8', label: '60-114 kV',   desc: 'Sub-transmission' }
];

const DC_COLORS: Record<string, string> = {
  Hyperscale: '#FFD166', Colo: '#6BE0FF', Edge: '#FF6BCB', IX: '#97A7FF',
};

interface FilterPanelProps {
  layerVis: LayerVisibility; onToggleLayer: (key: keyof LayerVisibility) => void;
  techFilter: TechFilter; onToggleTech: (tech: string) => void;
  txBands: TxBandFilter; onToggleTxBand: (band: keyof TxBandFilter) => void;
}

function Section({ title, icon, expanded, onToggle, children }: {
  title: string; icon: React.ReactNode; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="tpl-fp-section">
      <button className="tpl-fp-section-header" onClick={onToggle}>
        <span className="tpl-fp-section-icon">{icon}</span>
        <span className="tpl-fp-section-title">{title}</span>
        <span className="tpl-fp-section-chevron">{expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
      </button>
      {expanded && <div className="tpl-fp-section-body">{children}</div>}
    </div>
  );
}

function ToggleRow({ label, dot, active, onClick, sublabel }: {
  label: string; dot?: string; active: boolean; onClick: () => void; sublabel?: string;
}) {
  const isGradient = dot?.includes('gradient');
  return (
    <button className={'tpl-fp-row ' + (active ? 'tpl-fp-row--active' : 'tpl-fp-row--muted')} onClick={onClick}>
      {dot && (
        <span 
          className="tpl-fp-dot" 
          style={{ 
            background: active ? dot : 'transparent', 
            borderColor: isGradient ? '#6B7280' : dot 
          }} 
        />
      )}
      <span className="tpl-fp-row-text">
        <span className="tpl-fp-row-label">{label}</span>
        {sublabel && <span className="tpl-fp-row-sub">{sublabel}</span>}
      </span>
      <span className={'tpl-fp-pill ' + (active ? 'tpl-fp-pill--on' : 'tpl-fp-pill--off')}>{active ? 'ON' : 'OFF'}</span>
    </button>
  );
}

function TxBandRow({ band, active, onClick }: { band: typeof TX_BANDS[0]; active: boolean; onClick: () => void }) {
  return (
    <button className={'tpl-fp-row ' + (active ? 'tpl-fp-row--active' : 'tpl-fp-row--muted')} onClick={onClick}>
      <span className="tpl-fp-tx-line" style={{ background: active ? band.color : 'rgba(255,255,255,0.15)' }} />
      <span className="tpl-fp-row-text">
        <span className="tpl-fp-row-label">{band.label}</span>
        <span className="tpl-fp-row-sub">{band.desc}</span>
      </span>
    </button>
  );
}

export function FilterPanel({ layerVis, onToggleLayer, techFilter, onToggleTech, txBands, onToggleTxBand }: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSecs, setOpenSecs] = useState({ layers: true, plants: true, tx: true, dc: false });
  const toggle = (key: keyof typeof openSecs) => setOpenSecs(prev => ({ ...prev, [key]: !prev[key] }));

  if (collapsed) {
    return <button className="tpl-fp-fab" onClick={() => setCollapsed(false)} title="Open layers panel"><SlidersHorizontal size={18} /></button>;
  }

  return (
    <aside className="tpl-filter-panel">
      <div className="tpl-fp-header">
        <div className="tpl-fp-header-text">
          <span className="tpl-fp-header-title">US Infrastructure</span>
          <span className="tpl-fp-header-sub">Power · Transmission · Data Centers</span>
        </div>
        <button className="tpl-fp-close" onClick={() => setCollapsed(true)} title="Collapse"><X size={14} /></button>
      </div>
      <div className="tpl-fp-stats">
        <div className="tpl-fp-stat"><span className="tpl-fp-stat-value">~10k</span><span className="tpl-fp-stat-label">Plants</span></div>
        <div className="tpl-fp-stat-divider" />
        <div className="tpl-fp-stat"><span className="tpl-fp-stat-value">450k+</span><span className="tpl-fp-stat-label">Miles TX</span></div>
        <div className="tpl-fp-stat-divider" />
        <div className="tpl-fp-stat"><span className="tpl-fp-stat-value">~1k</span><span className="tpl-fp-stat-label">Data Centers</span></div>
      </div>
      <div className="tpl-fp-scroll">
        <Section title="Layers" icon={<Layers size={13} />} expanded={openSecs.layers} onToggle={() => toggle('layers')}>
          <ToggleRow label="Power Plants" dot="#F7C948" active={layerVis.plants}       onClick={() => onToggleLayer('plants')} />
          <ToggleRow label="Transmission" dot="#60A5FA" active={layerVis.transmission} onClick={() => onToggleLayer('transmission')} />
          <ToggleRow label="Substations"  dot="#FFFFFF" active={layerVis.substations}  onClick={() => onToggleLayer('substations')} />
          <ToggleRow label="Data Centers" dot="#FFD166" active={layerVis.dataCenters}  onClick={() => onToggleLayer('dataCenters')} />
        </Section>
        <Section title="Plant Technology" icon={<Zap size={13} />} expanded={openSecs.plants} onToggle={() => toggle('plants')}>
          {TECH_ORDER.map(tech => (
            <ToggleRow key={tech.id} label={tech.label} dot={tech.color} active={techFilter[tech.id] ?? false} onClick={() => onToggleTech(tech.id)} />
          ))}
        </Section>
        <Section title="Transmission Voltage" icon={<Zap size={13} />} expanded={openSecs.tx} onToggle={() => toggle('tx')}>
          {TX_BANDS.map(band => <TxBandRow key={band.id} band={band} active={txBands[band.id]} onClick={() => onToggleTxBand(band.id)} />)}
        </Section>
        <Section title="Data Center Types" icon={<Server size={13} />} expanded={openSecs.dc} onToggle={() => toggle('dc')}>
          {Object.entries(DC_COLORS).map(([type, color]) => (
            <div key={type} className="tpl-fp-dc-row">
              <span className="tpl-fp-dot" style={{ background: color, borderColor: color }} />
              <span className="tpl-fp-row-label">{type}</span>
            </div>
          ))}
        </Section>
      </div>
      <div className="tpl-fp-footer">
        <span className="tpl-fp-footer-text">Data: EIA · HIFLD · GPPD</span>
        <span className="tpl-fp-footer-badge">BETA</span>
      </div>
    </aside>
  );
}
