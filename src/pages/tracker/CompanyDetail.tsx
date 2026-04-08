import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { companies } from '../../lib/marketTrackerData';
import { CompanyDetailTemplate } from '../../components/tracker/CompanyDetailTemplate';

export const CompanyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const company = companies.find(c => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!company) {
    return <Navigate to="/market-tracker" replace />;
  }

  // If a user tries to navigate to a stub page directly via URL, redirect them back
  if (company.tier === 'stub') {
    return <Navigate to="/market-tracker" replace />;
  }

  return <CompanyDetailTemplate company={company} />;
};
