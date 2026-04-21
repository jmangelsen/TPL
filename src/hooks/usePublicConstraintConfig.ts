import { useState, useEffect } from 'react';
import { getPublicConstraintData } from '../services/constraintService';
import { ConstraintCategorySchema, MarketConstraintScores } from '../types/constraints';

export const usePublicConstraintConfig = () => {
  const [data, setData] = useState<{ categories: ConstraintCategorySchema[], scores: MarketConstraintScores[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicConstraintData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return { data, loading };
};
