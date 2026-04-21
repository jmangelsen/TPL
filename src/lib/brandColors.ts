/**
 * Canonical color system for The Physical Layer (TPL)
 * Unified across Map, Monitor, and Tracker.
 */

export const CONSTRAINT_STATUS_COLORS = {
  unconstrained:  '#437a22',  // green
  moderate:       '#e0b15a',  // muted gold
  constrained:    '#c35b5b',  // soft red
};

export const CONSTRAINT_CATEGORY_COLORS = {
  Power:          '#4f98a3',  // teal (matches map/tracker)
  Cooling:        '#5a7fb8',  // steel blue
  'Supply Chain': '#9f6b4f',  // clay
  Permitting:     '#e0b15a',  // gold
  Labor:          '#8b6ec5',  // violet
  Water:          '#c35b5b',  // soft red
};

// Legacy color helpers for backward compatibility
export const impactLabelColor: Record<string, { color: string; bg: string; border: string }> = {
  'Critical': { color: '#c35b5b', bg: '#c35b5b1f', border: '#c35b5b4d' },
  'High': { color: '#e0b15a', bg: '#e0b15a1f', border: '#e0b15a4d' },
  'Moderate': { color: '#4f98a3', bg: '#4f98a31f', border: '#4f98a34d' },
  'Low': { color: '#64748b', bg: '#64748b1f', border: '#64748b4d' },
};

export const categoryTagColor: Record<string, { color: string; bg: string; border: string }> = {
  'Power': { color: '#4f98a3', bg: '#4f98a31f', border: '#4f98a34d' },
  'Cooling': { color: '#5a7fb8', bg: '#5a7fb81f', border: '#5a7fb84d' },
  'Interconnect': { color: '#9f6b4f', bg: '#9f6b4f1f', border: '#9f6b4f4d' },
  'Policy': { color: '#e0b15a', bg: '#e0b15a1f', border: '#e0b15a4d' },
  'Supply Chain': { color: '#8b6ec5', bg: '#8b6ec51f', border: '#8b6ec54d' },
};

/**
 * Helper to map various status strings to canonical status colors
 */
export const getStatusColor = (status: string): string => {
  const s = status.toLowerCase();
  if (s.includes('constrained') || s.includes('limited') || s.includes('high')) {
    return CONSTRAINT_STATUS_COLORS.constrained;
  }
  if (s.includes('moderate') || s.includes('elevated') || s.includes('pressure') || s.includes('tightening')) {
    return CONSTRAINT_STATUS_COLORS.moderate;
  }
  return CONSTRAINT_STATUS_COLORS.unconstrained;
};
