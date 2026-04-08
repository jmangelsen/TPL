import React from 'react';
import { Link } from 'react-router-dom';

export const Sitemap = ({ user, isSubscribed, isAdmin }: { user: any, isSubscribed: boolean, isAdmin: boolean }) => {
  const sections = [
    {
      title: 'Main',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Articles', path: '/article' },
        { name: 'Reports', path: '/reports' },
        { name: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'Monitor & Insights',
      links: [
        { name: 'Constraint Monitor', path: '/monitor' },
        { name: 'Market Tracker', path: '/market-tracker' },
        { name: 'Forecasts', path: '/forecast' },
        { name: 'Intelligence Archive', path: '/intelligence', proOnly: true },
      ]
    },
    {
      title: 'Enterprise',
      links: [
        { name: 'Enterprise Dashboard', path: '/enterprise', enterpriseOnly: true },
      ]
    },
    {
      title: 'Admin',
      links: [
        { name: 'Admin Dashboard', path: '/admin', adminOnly: true },
      ]
    }
  ];

  return (
    <main className="bg-tpl-bg min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Sitemap</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-xl font-bold mb-6 text-tpl-ink">{section.title}</h2>
              <ul className="space-y-4">
                {section.links.map(link => {
                  if (link.proOnly && !isSubscribed) return null;
                  if (link.adminOnly && !isAdmin) return null;
                  if (link.enterpriseOnly && !isSubscribed) return null; // Assuming enterprise access is linked to subscription
                  return (
                    <li key={link.path}>
                      <Link to={link.path} className="text-tpl-slate hover:text-tpl-ink transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
