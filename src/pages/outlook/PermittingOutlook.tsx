import React from 'react';
import { CategoryForecast } from '../forecast/CategoryForecast';

export const PermittingOutlook = ({ user, isSubscribed }: { user: any, isSubscribed: boolean }) => {
  return <CategoryForecast user={user} isSubscribed={isSubscribed} slug="permitting" />;
};
