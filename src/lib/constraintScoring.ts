// constraintScoring.ts

export type ConstraintStatus = 'UNDER_FUNDED' | 'IN_BAND' | 'OVER_ALLOCATED' | 'OVERWEIGHT';

export interface ConstraintInputs {
  constraintScore: number; // 0–10
  capitalScore: number;    // 0–10
}

export function getConstraintStatus(constraintScore: number, capitalScore: number): ConstraintStatus {
  const delta = capitalScore - constraintScore;

  if (delta < -1.0) return 'UNDER_FUNDED';
  if (delta > 2.5) return 'OVERWEIGHT';
  if (delta > 1.0) return 'OVER_ALLOCATED';
  return 'IN_BAND';
}

export const CATEGORY_COLORS = {
  power: '#f5a623',
  cooling: '#4f98a3',
  water: '#5a7fb8',
  labor: '#8b6ec5',
  supply: '#9f6b4f',
  permitting: '#c35b5b',
};

export const STATUS_COLORS = {
  UNDER_FUNDED: '#c35b5b',   // red
  IN_BAND: '#437a22',        // green
  OVER_ALLOCATED: '#e0b15a', // amber
  OVERWEIGHT: '#b46de0',     // violet / at-risk focus
};
