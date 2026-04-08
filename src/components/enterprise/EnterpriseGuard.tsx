import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { useEffectiveTier } from '../../hooks/useEffectiveTier';

export const EnterpriseGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;
  const location = useLocation();
  
  // In a real app, we'd fetch the actual subscription status from Firestore or an API.
  // For now, we'll use the effective tier logic or assume logged-in users have access
  // if they are admins, or we can just mock the subscription check.
  const effectiveTier = useEffectiveTier('free', user?.email || undefined);
  
  useEffect(() => {
    // Simulate API call to /api/users/me/subscription
    const checkSubscription = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsLoading(false);
    };
    checkSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/get-access" state={{ from: location }} replace />;
  }

  // If we wanted to strictly enforce 'pro' or 'admin':
  // if (effectiveTier !== 'pro' && effectiveTier !== 'admin') {
  //   return <Navigate to="/pricing" replace />;
  // }

  return <>{children}</>;
};
