import { useContext } from 'react';
import { ViewModeContext } from '../context/ViewModeContext';
import { isAdminEmail } from '../lib/adminUtils';

export function useEffectiveTier(userTier: 'free' | 'essentials' | 'pro' | 'admin', userEmail?: string) {
  const ctx = useContext(ViewModeContext);
  const viewMode = ctx?.viewMode ?? 'admin';

  if (isAdminEmail(userEmail)) {
    if (viewMode === 'admin') return 'admin'; // True bypass
    return viewMode; // Override with simulated tier
  }

  return userTier;
}
