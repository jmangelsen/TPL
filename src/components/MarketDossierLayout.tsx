import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface MarketDossierLayoutProps {
  name: string;
  descriptor: string;
  summary: string;
  children: React.ReactNode;
}

export function MarketDossierLayout({ name, descriptor, summary, children }: MarketDossierLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f1a24] text-[#171614] font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/constraint-atlas" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8a8375] hover:text-[#171614] transition-colors mb-8">
          <ArrowLeft size={12} />
          Back to Constraint Atlas
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{name}</h1>
          <p className="text-[14px] font-semibold text-[#8a8375] uppercase tracking-[0.1em] mb-4">{descriptor}</p>
          <p className="text-lg text-[#4b4740] leading-relaxed max-w-3xl">{summary}</p>
        </header>

        <main className="space-y-12">
          {children}
        </main>

        <footer className="mt-20 pt-8 border-t border-[#d9d3c6]">
          <p className="text-[11px] text-[#797876]">
            This market dossier is evidence‑backed. Constraint scores here are supported by public filings, press releases, and infrastructure reports. Markets without a dossier on the Map reflect independent research and are not yet tied to specific tracked projects.
          </p>
        </footer>
      </div>
    </div>
  );
}
