import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TrackerLayout } from '../../components/tracker/TrackerLayout';
import { ViewModeContext } from '../../context/ViewModeContext';

export const Navigator = () => {
  const ctx = useContext(ViewModeContext);

  const navGroups = [
    {
      title: 'Core Tracker',
      links: [
        { name: 'Buildout Tracker', path: '/buildout-tracker' },
        { name: 'Market Tracker', path: '/market-tracker' },
      ]
    },
    {
      title: 'Constraint Outlooks',
      links: [
        { name: 'Power Outlook', path: '/constraints/national/power' },
        { name: 'Cooling Outlook', path: '/constraints/national/cooling' },
        { name: 'Water Outlook', path: '/constraints/national/water' },
        { name: 'Permitting Outlook', path: '/constraints/national/permitting' },
        { name: 'Supply Chain Outlook', path: '/constraints/national/supply-chain' },
        { name: 'Labor Outlook', path: '/constraints/national/labor' },
      ]
    },
    {
      title: 'Intelligence & Reports',
      links: [
        { name: 'Flagship Article', path: '/article' },
        { name: 'Operator Reports', path: '/reports' },
        { name: 'Constraint Monitor', path: '/monitor' },
        { name: 'Monitor Methodology', path: '/monitor/methodology' },
        { name: 'Monitor Report', path: '/monitor/report' },
        { name: 'Forecast Index', path: '/forecast' },
      ]
    },
    {
      title: 'Maps & Tools',
      links: [
        { name: 'Constraint Atlas', path: '/constraint-atlas' },
      ]
    },
    {
      title: 'Enterprise',
      links: [
        { name: 'Q2 2026 Report', path: '/enterprise/q2-2026' },
      ]
    }
  ];

  return (
    <TrackerLayout title="Admin Site Navigator">
      <div className="bg-[#f9f8f5] p-6 border border-[#dcd9d5] shadow-sm mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3182ce] mb-2">Admin Status</p>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-900">
          <span>Admin Access Active</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>Current View Mode: {ctx?.viewMode || 'admin'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#dcd9d5] border border-[#dcd9d5]">
        {navGroups.map(group => (
          <div key={group.title} className="bg-[#f9f8f5] p-8 flex flex-col min-h-[140px] hover:bg-white transition-all group relative overflow-hidden">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3182ce] mb-6 border-b border-[#dcd9d5] pb-4">{group.title}</h2>
            <div className="space-y-3">
              {group.links.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className="block text-sm font-medium text-slate-700 hover:text-[#3182ce] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TrackerLayout>
  );
};
