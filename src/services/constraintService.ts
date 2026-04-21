import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ConstraintCategorySchema, MarketConstraintScores } from '../types/constraints';

export const getPublicConstraintData = async () => {
  // In a real app, this would fetch from a read-only endpoint or Firebase
  // For now, return mock data
  const categories: ConstraintCategorySchema[] = [
    { id: 'power', label: 'Power', description: 'Grid capacity, interconnection timelines, price…' },
    { id: 'cooling', label: 'Cooling', description: 'Thermal profile, density limits, cooling tech…' },
    { id: 'water', label: 'Water', description: 'Basin stress, rights, discharge permits…' },
    { id: 'permitting', label: 'Permitting', description: 'Zoning, entitlements, political risk…' },
    { id: 'supply', label: 'Supply Chain', description: 'Lead times for long-lead infra equipment…' },
    { id: 'labor', label: 'Labor', description: 'Availability and cost of skilled trades…' },
  ];
  
  const scores: MarketConstraintScores[] = [
    { marketId: 'nva', categoryId: 'power', boundaryScore: 8.5, pressureScore: 9.0 },
    { marketId: 'phx', categoryId: 'power', boundaryScore: 7.5, pressureScore: 8.3 },
  ];
  
  return { categories, scores };
};
