import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function FailureCaseStudies() {
  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link to="/constraint-atlas/interactive" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={12} />
          Back to Simulator
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Data Center Failure Case Studies</h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            Projects where billions in capital were committed but capacity was delayed, blocked, or never delivered. These cases anchor the constraints and risk narratives used across The Physical Layer.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards */}
          <div className="border border-white/5 bg-[#0f1a24] p-6 rounded-sm">
            <h3 className="font-bold text-white mb-2">Oracle / Saline Township</h3>
            <p className="text-sm text-slate-400">Analysis of local resistance and permitting failure.</p>
          </div>
          <div className="border border-white/5 bg-[#0f1a24] p-6 rounded-sm">
            <h3 className="font-bold text-white mb-2">Blocked AI Campuses</h3>
            <p className="text-sm text-slate-400">Overview of projects stalled across 11 states.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
