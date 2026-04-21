import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on these pages
  const hideOn = ['/', '/login', '/signup', '/about'];
  if (hideOn.includes(location.pathname)) return null;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Intelligence parent
  const intelligenceRoutes = ['monitor', 'market-tracker', 'buildout-tracker', 'constraint-atlas', 'forecast'];
  if (pathnames.some(p => intelligenceRoutes.includes(p))) {
    breadcrumbs.push({ label: 'Intelligence' });
  }

  pathnames.forEach((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    
    // Format labels
    let label = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Special cases
    if (value === 'monitor') label = 'Constraint Monitor';
    if (value === 'market-tracker') label = 'Market Tracker';
    if (value === 'buildout-tracker') label = 'AI Data Center Buildout Tracker';
    if (value === 'constraint-atlas') label = 'Constraint Atlas';
    if (value === 'forecast') label = 'Forecast Index';

    breadcrumbs.push({ label, path });
  });

  return (
    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-slate-700">/</span>}
            {isLast || !crumb.path ? (
              <span className={isLast ? "text-slate-300" : ""}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-[#3b82f6] hover:text-white transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
