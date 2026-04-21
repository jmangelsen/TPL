export const constraintStateColor: Record<string, { color: string | null, bg: string | null, border: string | null }> = {
  'constrained':      { color: '#a13544', bg: 'rgba(161,53,68,0.12)',   border: 'rgba(161,53,68,0.3)' },
  'elevated':         { color: '#b47828', bg: 'rgba(180,120,40,0.12)',  border: 'rgba(180,120,40,0.3)' },
  'tightening':       { color: '#a09028', bg: 'rgba(160,140,40,0.12)', border: 'rgba(160,140,40,0.3)' },
  'under-pressure':   { color: '#5078a0', bg: 'rgba(80,120,160,0.12)', border: 'rgba(80,120,160,0.3)' },
  'capacity-limited': { color: '#8c3c3c', bg: 'rgba(140,60,60,0.12)',  border: 'rgba(140,60,60,0.3)' },
  'neutral':          { color: null,      bg: null,                    border: null },
};

export const impactLabelColor: Record<string, { color: string | null, bg: string | null, border: string | null }> = {
  'tailwind':      { color: '#4a7a4a', bg: 'rgba(74,122,74,0.12)',  border: 'rgba(74,122,74,0.3)' },
  'neutral':       { color: null,      bg: null,                    border: null },
  'friction':      { color: '#8a7a3a', bg: 'rgba(138,122,58,0.12)', border: 'rgba(138,122,58,0.3)' },
  'high-friction': { color: '#8a3a3a', bg: 'rgba(138,58,58,0.12)',  border: 'rgba(138,58,58,0.3)' },
};

export const confidenceLevelColor: Record<string, { color: string | null, bg: string | null, border: string | null }> = {
  'confirmed':  { color: '#4a7a4a', bg: 'rgba(74,122,74,0.10)',  border: 'rgba(74,122,74,0.25)' },
  'guided':     { color: '#4a6a8a', bg: 'rgba(74,106,138,0.10)', border: 'rgba(74,106,138,0.25)' },
  'derived':    { color: '#8a7a3a', bg: 'rgba(138,122,58,0.10)', border: 'rgba(138,122,58,0.25)' },
  'estimated':  { color: '#5a5a5a', bg: 'rgba(90,90,90,0.10)',   border: 'rgba(90,90,90,0.25)' },
};

export const categoryTagColor: Record<string, { color: string | null, bg: string | null, border: string | null }> = {
  'power':         { color: '#4a7fa3', bg: 'rgba(74,127,163,0.10)', border: 'rgba(74,127,163,0.25)' },
  'cooling':       { color: '#3d8a8f', bg: 'rgba(61,138,143,0.10)', border: 'rgba(61,138,143,0.25)' },
  'water':         { color: '#5a9a7a', bg: 'rgba(90,154,122,0.10)', border: 'rgba(90,154,122,0.25)' },
  'networking':    { color: '#6b5f9a', bg: 'rgba(107,95,154,0.10)', border: 'rgba(107,95,154,0.25)' },
  'supply chain':  { color: '#8a7a3d', bg: 'rgba(138,122,61,0.10)', border: 'rgba(138,122,61,0.25)' },
  'labor':         { color: '#8a5f5f', bg: 'rgba(138,95,95,0.10)',  border: 'rgba(138,95,95,0.25)' },
  'land':          { color: '#7a6a4a', bg: 'rgba(122,106,74,0.10)', border: 'rgba(122,106,74,0.25)' },
  'permitting':    { color: '#8a6a3a', bg: 'rgba(138,106,58,0.10)', border: 'rgba(138,106,58,0.25)' },
  'capital':       { color: '#4a7fa3', bg: 'rgba(74,127,163,0.10)', border: 'rgba(74,127,163,0.25)' },
  'policy':        { color: '#8a7a3d', bg: 'rgba(138,122,61,0.10)', border: 'rgba(138,122,61,0.25)' },
};
