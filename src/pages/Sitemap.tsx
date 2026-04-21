import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Copy, 
  Check, 
  Shield, 
  Activity, 
  Zap, 
  FileText, 
  AlertCircle,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { TrackerLayout } from '../components/tracker/TrackerLayout';
import { isAdminEmail } from '../lib/adminUtils';

interface RouteItem {
  path: string;
  title: string;
  status: 'live' | 'staged' | 'gated' | 'dev' | 'admin';
  access: 'Public' | 'Subscriber' | 'Admin';
  description?: string;
  group: string;
}

interface SiteError {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  stack?: string;
}

const ROUTES: RouteItem[] = [
  // Admin / Internal
  { path: '/sitemap', title: 'Site Navigator', status: 'admin', access: 'Admin', group: 'Admin / Internal' },
  { path: '/admin', title: 'Admin Dashboard', status: 'admin', access: 'Admin', group: 'Admin / Internal' },
  { path: '/admin/navigator', title: 'Navigator', status: 'admin', access: 'Admin', group: 'Admin / Internal' },
  { path: '/admin/map-projects', title: 'Map Projects', status: 'admin', access: 'Admin', group: 'Admin / Internal' },

  // Core / Public
  { path: '/', title: 'Home', status: 'live', access: 'Public', group: 'Core / Public' },
  { path: '/about', title: 'About', status: 'live', access: 'Public', group: 'Core / Public' },
  { path: '/contact', title: 'Contact', status: 'live', access: 'Public', group: 'Core / Public' },
  { path: '/get-access', title: 'Get Access', status: 'live', access: 'Public', group: 'Core / Public' },
  { path: '/enterprise-request', title: 'Enterprise Request', status: 'live', access: 'Public', group: 'Core / Public' },
  { path: '/login', title: 'Login', status: 'live', access: 'Public', group: 'Core / Public' },
  { path: '/signup', title: 'Sign Up', status: 'live', access: 'Public', group: 'Core / Public' },
  
  // Intelligence Products
  { path: '/intelligence', title: 'Intelligence Archive', status: 'gated', access: 'Subscriber', group: 'Intelligence Products' },
  { 
    path: '/monitor', 
    title: 'Constraint Monitor', 
    status: 'gated', 
    access: 'Subscriber', 
    description: "TPL's quarterly constraint index across power, supply chain, water, cooling, land, permitting, and labor.",
    group: 'Intelligence Products' 
  },
  { 
    path: '/monitor/methodology', 
    title: 'Monitor Methodology', 
    status: 'live', 
    access: 'Public', 
    description: "Explains the indicator framework, signal sources, normalization, and state labels behind the Monitor.",
    group: 'Intelligence Products' 
  },
  { path: '/monitor/report', title: 'Monitor Report', status: 'gated', access: 'Subscriber', group: 'Intelligence Products' },
  { 
    path: '/market-tracker', 
    title: 'Market Tracker', 
    status: 'live', 
    access: 'Public', 
    description: "Publicly traded companies organized by infrastructure role — hyperscalers, power & cooling, chips & networking, REITs.",
    group: 'Intelligence Products' 
  },
  { 
    path: '/buildout-tracker', 
    title: 'AI Data Center Buildout Tracker', 
    status: 'staged', 
    access: 'Public', 
    description: "Parent intelligence hub: capital flows, cooling technology, and policy friction. Links to Market Tracker as child page.",
    group: 'Intelligence Products' 
  },
  { path: '/constraint-atlas', title: 'Constraint Atlas', status: 'admin', access: 'Admin', group: 'Intelligence Products' },
  { path: '/constraint-atlas/interactive', title: 'Interactive Constraint Atlas', status: 'admin', access: 'Admin', group: 'Intelligence Products' },
  
  // Constraint Pages
  { path: '/power', title: 'Power Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/power/grid-monitor', title: 'Grid Monitor', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/supply-chain', title: 'Supply Chain Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/supply-chain/infrastructure-monitor', title: 'Infrastructure Monitor', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/water', title: 'Water Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/water/resource-monitor', title: 'Resource Monitor', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/cooling', title: 'Cooling Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/cooling/system-monitor', title: 'System Monitor', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/land', title: 'Land Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/permitting', title: 'Permitting Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/permitting/process-monitor', title: 'Process Monitor', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/labor', title: 'Labor Constraint', status: 'live', access: 'Public', group: 'Constraint Details' },
  { path: '/labor/workforce-monitor', title: 'Workforce Monitor', status: 'live', access: 'Public', group: 'Constraint Details' },

  // Forecasts & Reports
  { 
    path: '/forecast', 
    title: 'Forecast Index', 
    status: 'gated', 
    access: 'Subscriber', 
    description: "Forward-looking infrastructure forecast modules.",
    group: 'Forecasts & Reports' 
  },
  { path: '/article', title: 'Flagship Article', status: 'live', access: 'Public', group: 'Forecasts & Reports' },
  { path: '/reports', title: 'Operator Reports', status: 'live', access: 'Public', group: 'Forecasts & Reports' },
  { path: '/failures', title: 'Failure Case Studies', status: 'live', access: 'Public', group: 'Forecasts & Reports' },
  { path: '/failures/midwest-ai-campus', title: 'Midwest AI Campus Failure', status: 'live', access: 'Public', group: 'Forecasts & Reports' },

  // Constraint Outlooks
  { path: '/constraints/national/power', title: 'Power Outlook', status: 'gated', access: 'Subscriber', group: 'Constraint Outlooks' },
  { path: '/constraints/national/cooling', title: 'Cooling Outlook', status: 'gated', access: 'Subscriber', group: 'Constraint Outlooks' },
  { path: '/constraints/national/water', title: 'Water Outlook', status: 'gated', access: 'Subscriber', group: 'Constraint Outlooks' },
  { path: '/constraints/national/permitting', title: 'Permitting Outlook', status: 'gated', access: 'Subscriber', group: 'Constraint Outlooks' },
  { path: '/constraints/national/supply-chain', title: 'Supply Chain Outlook', status: 'gated', access: 'Subscriber', group: 'Constraint Outlooks' },
  { path: '/constraints/national/labor', title: 'Labor Outlook', status: 'gated', access: 'Subscriber', group: 'Constraint Outlooks' },

  // Market Dossiers
  { path: '/markets/northern-va', title: 'Northern Virginia Market Dossier', status: 'gated', access: 'Subscriber', group: 'Market Dossiers' },
  { path: '/markets/phoenix', title: 'Phoenix Market Dossier', status: 'gated', access: 'Subscriber', group: 'Market Dossiers' },
  { path: '/markets/texas', title: 'Texas Market Dossier', status: 'gated', access: 'Subscriber', group: 'Market Dossiers' },

  // Company Deep-Dives
  { path: '/market-tracker/microsoft', title: 'Microsoft Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/alphabet', title: 'Alphabet Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/amazon', title: 'Amazon Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/nvidia', title: 'Nvidia Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/broadcom', title: 'Broadcom Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/arista', title: 'Arista Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/vertiv', title: 'Vertiv Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/modine', title: 'Modine Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/johnson-controls', title: 'Johnson Controls Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/equinix', title: 'Equinix Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/digital-realty', title: 'Digital Realty Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
  { path: '/market-tracker/iron-mountain', title: 'Iron Mountain Infrastructure Deep-Dive', status: 'gated', access: 'Subscriber', group: 'Company Deep-Dives' },
];

export const Sitemap = ({ user, isAdmin, isSubscribed }: { user: any, isAdmin: boolean, isSubscribed: boolean }) => {
  const navigate = useNavigate();
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [errors, setErrors] = useState<SiteError[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchErrors = async () => {
      try {
        const q = query(collection(db, 'site_errors'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const siteErrors: SiteError[] = [];
        snapshot.forEach((doc) => {
          siteErrors.push({ id: doc.id, ...doc.data() } as SiteError);
        });
        setErrors(siteErrors);
      } catch (error) {
        console.error("Error fetching site errors:", error);
      }
    };
    fetchErrors();
  }, [isAdmin]);

  const handleCopy = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const visibleRoutes = isAdmin ? ROUTES : ROUTES.filter(r => r.access !== 'Admin' && r.status !== 'admin');

  const stats = {
    live: visibleRoutes.filter(r => r.status === 'live').length,
    staged: visibleRoutes.filter(r => r.status === 'staged').length,
    gated: visibleRoutes.filter(r => r.status === 'gated').length,
    dev: visibleRoutes.filter(r => r.status === 'dev').length,
    total: visibleRoutes.length
  };

  const groups = Array.from(new Set(visibleRoutes.map(r => r.group)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-emerald-500';
      case 'staged': return 'bg-amber-500';
      case 'gated': return 'bg-slate-500';
      case 'dev': return 'bg-rose-500';
      case 'admin': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <TrackerLayout 
      title="Site Navigator"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Admin', path: '/admin' }
      ]}
      headerContent={
        <>
          <p className="text-lg text-slate-300 max-w-4xl leading-relaxed mb-4">
            Complete visibility into every route, page status, and access tier on The Physical Layer. Includes staged, hidden, and paywalled pages not visible in public navigation.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Last updated: {new Date().toLocaleDateString()}</span>
            <span>Total routes: {stats.total}</span>
          </div>
        </>
      }
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Status Legend */}
        <div className="flex flex-wrap gap-6 mb-12 p-6 bg-[#f9f8f5] border border-[#dcd9d5] shadow-sm rounded-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">🟢 Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">🟡 Staged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">🔒 Gated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">🔴 In Development</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3182ce]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">🔵 Admin Only</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Route Inventory */}
          <div className="space-y-16">
            {/* Site Errors */}
            {isAdmin && (
              <section>
                <h2 className="text-[10px] font-bold text-[#3182ce] uppercase tracking-[0.3em] mb-8 border-b border-[#dcd9d5] pb-4 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-rose-500" /> Site Errors
                </h2>
                {errors.length === 0 ? (
                  <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm text-center text-slate-500 text-xs shadow-sm">
                    No site errors detected.
                  </div>
                ) : (
                  <div className="grid gap-px bg-[#dcd9d5] border border-[#dcd9d5]">
                    {errors.map(err => (
                      <div key={err.id} className="bg-[#f9f8f5] p-6 hover:bg-white transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{err.message}</h3>
                            <div className="font-mono text-[10px] text-slate-500">{err.url}</div>
                            <div className="text-[10px] text-slate-500">{new Date(err.timestamp).toLocaleString()}</div>
                          </div>
                          <AlertTriangle size={16} className="text-rose-500 shrink-0" />
                        </div>
                        {err.stack && (
                          <pre className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700 overflow-auto max-h-32">
                            {err.stack}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {groups.map(group => (
              <section key={group}>
                <h2 className="text-[10px] font-bold text-[#3182ce] uppercase tracking-[0.3em] mb-8 border-b border-[#dcd9d5] pb-4">
                  {group}
                </h2>
                <div className="grid gap-px bg-[#dcd9d5] border border-[#dcd9d5]">
                  {ROUTES.filter(r => r.group === group).map(route => (
                    <div key={route.path} className="bg-[#f9f8f5] p-6 hover:bg-white transition-all group">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Link to={route.path} className="text-lg font-bold text-slate-900 tracking-tight hover:text-[#3182ce] transition-colors">{route.title}</Link>
                            <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-white ${getStatusColor(route.status)}`}>
                              {route.status}
                            </div>
                            <div className="px-2 py-0.5 border border-[#dcd9d5] text-[8px] font-bold uppercase tracking-widest text-slate-600 rounded">
                              {route.access}
                            </div>
                            {route.status === 'staged' && (
                              <div className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-[8px] font-bold uppercase tracking-widest text-amber-700 rounded flex items-center gap-1">
                                <AlertCircle size={10} /> Not in nav
                              </div>
                            )}
                            {route.status === 'gated' && <Lock size={12} className="text-slate-400" />}
                          </div>
                          <Link to={route.path} className="font-mono text-[10px] text-slate-500 hover:text-[#3182ce] transition-colors block">{route.path}</Link>
                          {route.description && (
                            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{route.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => handleCopy(route.path)}
                            className="p-2 bg-white border border-[#dcd9d5] rounded hover:border-slate-400 transition-colors text-slate-600 hover:text-[#3182ce] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm"
                            title="Copy URL"
                          >
                            {copiedPath === route.path ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            {copiedPath === route.path ? 'Copied' : 'Copy URL'}
                          </button>
                          <Link 
                            to={route.path}
                            target="_blank"
                            className="p-2 bg-white border border-[#dcd9d5] rounded hover:border-slate-400 transition-colors text-[#3182ce] hover:text-[#2b6cb0] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm"
                          >
                            <ExternalLink size={14} />
                            Open Page
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-12 sticky top-32">
            {/* Status Summary */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-8">Status Summary</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Pages</span>
                  <span className="text-2xl font-bold text-slate-900">{stats.live}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Staged Pages</span>
                  <span className="text-2xl font-bold text-slate-900">{stats.staged}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gated Pages</span>
                  <span className="text-2xl font-bold text-slate-900">{stats.gated}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Development</span>
                  <span className="text-2xl font-bold text-slate-900">{stats.dev}</span>
                </div>
                <div className="pt-6 border-t border-[#dcd9d5] flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Total Routes</span>
                  <span className="text-3xl font-bold text-[#3182ce]">{stats.total}</span>
                </div>
              </div>
            </div>

            {/* Navigation Health */}
            {isAdmin && (
              <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-8">Navigation Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <Check size={14} className="text-emerald-600" />
                    All live pages have meta descriptions
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <Check size={14} className="text-emerald-600" />
                    All gated pages have login redirects
                  </div>
                  <div className="flex items-start gap-3 text-[11px] text-slate-600">
                    <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      Staged pages not in sitemap:
                      <div className="mt-1 text-[10px] font-mono text-slate-500">
                        /buildout-tracker<br />
                        /constraint-atlas
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[11px] text-slate-600">
                    <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      Pages without a back-link or breadcrumb:
                      <div className="mt-1 text-[10px] font-mono text-slate-500">
                        /signup<br />
                        /login
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-8">Quick Actions</h3>
              <div className="grid gap-3">
                <Link to="/market-tracker" className="flex items-center justify-between p-4 bg-white border border-[#dcd9d5] hover:border-slate-400 transition-colors group shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#3182ce]">Open Market Tracker</span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-[#3182ce]" />
                </Link>
                <Link to="/monitor" className="flex items-center justify-between p-4 bg-white border border-[#dcd9d5] hover:border-slate-400 transition-colors group shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#3182ce]">Open Monitor</span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-[#3182ce]" />
                </Link>
                <Link to="/buildout-tracker" className="flex items-center justify-between p-4 bg-white border border-[#dcd9d5] hover:border-slate-400 transition-colors group shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#3182ce]">Open Buildout Tracker</span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-[#3182ce]" />
                </Link>
                {isAdmin && (
                  <Link to="/constraint-atlas" className="flex items-center justify-between p-4 bg-white border border-[#dcd9d5] hover:border-slate-400 transition-colors group shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#3182ce]">Open Constraint Atlas</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-[#3182ce]" />
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </TrackerLayout>
  );
};
