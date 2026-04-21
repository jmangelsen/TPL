export interface ConstraintCategorySchema {
  id: "power" | "cooling" | "water" | "permitting" | "supply" | "labor";
  label: string;
  description: string;
  weight?: number;
}

export interface MarketConstraintScores {
  marketId: string;
  categoryId: string;
  boundaryScore: number;
  pressureScore: number;
}
