import React, { useState, useMemo } from 'react';
import { categories, companies } from '../../lib/marketTrackerData';
import { CompanyCard } from '../../components/tracker/CompanyCard';
import { StubCard } from '../../components/tracker/StubCard';
import { Filter, ArrowDownWideNarrow } from 'lucide-react';

const parseMarketCap = (mc: string) => {
  const num = parseFloat(mc.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return 0;
  if (mc.includes('T')) return num * 1000;
  if (mc.includes('B')) return num;
  if (mc.includes('M')) return num / 1000;
  return num;
};

const parsePrice = (price: string) => {
  const num = parseFloat(price.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};

export const MarketTrackerHub = () => {
  const [sortBy, setSortBy] = useState('marketCapDesc');
  const [roleFilter, setRoleFilter] = useState('all');
  const [signalFilter, setSignalFilter] = useState('all');

  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    // Apply Role Filter
    if (roleFilter !== 'all') {
      result = result.filter(c => {
        if (roleFilter === 'hyperscaler') return c.category.includes('Hyperscaler');
        if (roleFilter === 'power-cooling') return c.category.includes('Power');
        if (roleFilter === 'chips-networking') return c.category.includes('Chips');
        if (roleFilter === 'reit-operator') return c.category.includes('REIT');
        return true;
      });
    }

    // Apply Signal Filter
    if (signalFilter !== 'all') {
      result = result.filter(c => {
        const tags = c.constraintExposure.map(t => t.toLowerCase());
        if (signalFilter === 'power') return tags.some(t => t.includes('power'));
        if (signalFilter === 'cooling') return tags.some(t => t.includes('cooling') || t.includes('thermal'));
        if (signalFilter === 'water') return tags.some(t => t.includes('water'));
        if (signalFilter === 'networking-density') return tags.some(t => t.includes('networking') || t.includes('fiber') || t.includes('optical'));
        if (signalFilter === 'supply-chain') return tags.some(t => t.includes('supply chain') || t.includes('lead time'));
        return true;
      });
    }

    // Apply Sort
    result.sort((a, b) => {
      if (sortBy === 'marketCapDesc') {
        return parseMarketCap(b.marketCap) - parseMarketCap(a.marketCap);
      }
      if (sortBy === 'priceDesc') {
        return parsePrice(b.stockPrice) - parsePrice(a.stockPrice);
      }
      if (sortBy === 'nameAsc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [sortBy, roleFilter, signalFilter]);

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white relative">
      {/* Topography Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
      </div>

      {/* Hero Atmosphere */}
      <div className="relative h-[40vh] flex items-center overflow-hidden border-b border-white/5 bg-[#0f1a24] z-10">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-xl opacity-10 pointer-events-none">
          <img 
            src="/tpl-seal.png" 
            alt="TPL Seal" 
            className="w-full h-auto object-contain invert drop-shadow-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2633] via-[#1a2633]/60 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-6 relative z-10 w-full">
          <span className="inline-block px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-[#3b82f6]/20">
            Market Intelligence
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-[0.9] tracking-tighter uppercase max-w-4xl">
            AI Physical Infrastructure Stack
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-serif italic mb-4">
            Publicly traded companies powering AI-scale data centers — organized by their role in power, cooling, compute, networking, and real-estate capacity.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Page Objective Banner */}
        <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-6 mb-12 rounded-sm">
          <p className="text-[#3b82f6] text-sm md:text-base font-medium leading-relaxed">
            Use this tracker to understand which public companies are gating AI data‑center buildout through power, cooling, networking, and real‑estate constraints — and to jump into deeper infrastructure notes on each name.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 p-4 bg-white/5 border border-white/10 rounded-sm relative z-20">
          <div className="flex items-center gap-2 mr-6">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Filters</span>
          </div>
          
          <div className="flex flex-wrap gap-4 flex-grow">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#0f1a24] border border-white/10 text-slate-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-[#3b82f6]/50"
            >
              <option value="all">All Infrastructure Roles</option>
              <option value="hyperscaler">Hyperscaler / Cloud</option>
              <option value="power-cooling">Power & Cooling</option>
              <option value="chips-networking">Chips & Networking</option>
              <option value="reit-operator">REITs & Developers</option>
            </select>

            <select 
              value={signalFilter}
              onChange={(e) => setSignalFilter(e.target.value)}
              className="bg-[#0f1a24] border border-white/10 text-slate-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-[#3b82f6]/50"
            >
              <option value="all">All Key Constraints</option>
              <option value="power">Power</option>
              <option value="cooling">Cooling</option>
              <option value="water">Water</option>
              <option value="networking-density">Networking Density</option>
              <option value="supply-chain">Supply Chain / Lead Times</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowDownWideNarrow size={16} className="text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0f1a24] border border-white/10 text-slate-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-[#3b82f6]/50"
            >
              <option value="marketCapDesc">Market cap (high → low)</option>
              <option value="priceDesc">Share price (high → low)</option>
              <option value="nameAsc">Name (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-20">
          {categories.map(category => {
            const categoryCompanies = filteredAndSortedCompanies.filter(c => c.category === category.name);
            if (categoryCompanies.length === 0) return null;

            const featured = categoryCompanies.filter(c => c.tier === 'featured');
            const stubs = categoryCompanies.filter(c => c.tier === 'stub');

            return (
              <section key={category.id}>
                <div className="mb-12 border-b border-white/5 pb-6">
                  <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">{category.name}</h2>
                  <p className="text-sm text-slate-400 max-w-4xl">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map(company => (
                    <CompanyCard key={company.slug} company={company} />
                  ))}
                  {stubs.map(company => (
                    <StubCard key={company.slug} company={company} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
