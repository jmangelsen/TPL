import React from 'react';
import { Link, ChevronRight } from 'lucide-react';

export function TrackerLayout({ 
  children, 
  title,
  breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Intelligence', path: '/intelligence' },
    { label: 'AI Data Center Buildout Tracker', path: '/buildout-tracker' }
  ],
  headerContent
}: { 
  children: React.ReactNode, 
  title: string,
  breadcrumbs?: { label: string, path: string }[],
  headerContent?: React.ReactNode
}) {
  return (
    <div className="relative bg-[#1a2633] min-h-screen text-slate-300 pb-24 font-sans selection:bg-[#3b82f6]/30">
      {/* Header - Shared */}
      <div className="relative min-h-[20vh] py-16 flex items-center overflow-hidden border-b border-white/5 bg-[#0f1a24]">
        <div className="absolute top-0 left-0 w-full z-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="max-w-[1600px] mx-auto px-6 h-10 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <a href={crumb.path} className="hover:text-white transition-colors">{crumb.label}</a>
                <ChevronRight size={8} />
              </React.Fragment>
            ))}
            <span className="text-white">{title}</span>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-6 relative z-10 w-full pt-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-[0.9] tracking-tighter uppercase max-w-4xl">
            {title}
          </h1>
          {headerContent}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 pt-12">
        {children}
      </main>
    </div>
  );
}
