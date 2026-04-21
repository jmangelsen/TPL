import React from 'react';
import { CategoryForecast } from '../forecast/CategoryForecast';

export const PowerOutlook = ({ user, isSubscribed }: { user: any, isSubscribed: boolean }) => {
  return <CategoryForecast user={user} isSubscribed={isSubscribed} slug="power" />;
};
