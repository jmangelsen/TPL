import React from 'react';
import { CategoryForecast } from '../forecast/CategoryForecast';

export const CoolingOutlook = ({ user, isSubscribed }: { user: any, isSubscribed: boolean }) => {
  return <CategoryForecast user={user} isSubscribed={isSubscribed} slug="cooling" />;
};
