import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PAGE_METADATA } from '../../lib/pageMetadata';
import { Globe, Lock } from 'lucide-react';
import { ViewModeContext } from '../../context/ViewModeContext';

export const Navigator = () => {
  const unpaidPages = PAGE_METADATA.filter(p => !p.isPaid);
  const paidPages = PAGE_METADATA.filter(p => p.isPaid);
  const ctx = useContext(ViewModeContext);

  return (
    <div className="min-h-screen bg-tpl-bg font-sans">
      {/* Topography Header */}
      <div className="bg-black text-white py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Constraint Monitor Site Navigator & Previewer</h1>
          <p className="text-white/70 text-lg mb-6">Administrator tool for inspecting paid and unpaid experiences.</p>
          <div className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black bg-white p-4 rounded-sm">
            <span>Admin Access Active</span>
            <span className="w-1 h-1 rounded-full bg-black/30"></span>
            <span>Current View Mode: {ctx?.viewMode || 'admin'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Globe className="text-tpl-slate" size={24} />
              <h2 className="text-2xl font-bold">Unpaid / Public Pages</h2>
            </div>
            <div className="grid gap-4">
              {unpaidPages.map(page => (
                <div key={page.path} className="flex items-center justify-between p-6 bg-white border border-tpl-ink/10 hover:border-tpl-ink/30 transition-colors">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{page.name}</h3>
                    <p className="text-sm text-tpl-slate mb-2">{page.description}</p>
                    <code className="text-xs bg-tpl-bg px-2 py-1 text-tpl-ink">{page.path}</code>
                  </div>
                  <Link to={page.path} className="px-6 py-3 bg-tpl-bg border border-tpl-ink/20 text-xs font-bold uppercase tracking-widest hover:bg-tpl-ink hover:text-tpl-bg transition-colors">
                    View Page
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <Lock className="text-tpl-ink" size={24} />
              <h2 className="text-2xl font-bold">Paid / Protected Pages</h2>
            </div>
            <div className="grid gap-4">
              {paidPages.map(page => (
                <div key={page.path} className="flex items-center justify-between p-6 bg-white border border-tpl-ink/10 hover:border-tpl-ink/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{page.name}</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${page.requiredTier === 'pro' ? 'bg-tpl-ink text-tpl-bg' : 'bg-tpl-ink/10 text-tpl-ink'}`}>
                        Requires: {page.requiredTier}
                      </span>
                    </div>
                    <p className="text-sm text-tpl-slate mb-2">{page.description}</p>
                    <code className="text-xs bg-tpl-bg px-2 py-1 text-tpl-ink">{page.path}</code>
                  </div>
                  <Link to={page.path} className="px-6 py-3 bg-tpl-bg border border-tpl-ink/20 text-xs font-bold uppercase tracking-widest hover:bg-tpl-ink hover:text-tpl-bg transition-colors">
                    View Page
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
