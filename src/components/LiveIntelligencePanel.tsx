import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ConstraintRadarChart } from './ConstraintRadarChart';

interface LiveIntelligencePanelProps {
  embedReady?: boolean;
}

export const LiveIntelligencePanel: React.FC<LiveIntelligencePanelProps> = ({ embedReady = false }) => {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    }));
  }, []);

  return (
    <section className="w-full bg-tpl-ink text-tpl-bg border-y border-tpl-bg/10 py-16 md:py-24 relative overflow-hidden">
      {/* Topography Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4] blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Where capital is moving. Where it can't.
          </h2>
          <p className="text-sm md:text-base font-serif italic text-white/60">
            Live snapshots from the TPL Intelligence Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT PANEL — Infrastructure Spend Tracker */}
          <div className="flex flex-col h-full">
            <div className="bg-[#0D0D0D] border border-[#dcd9d5]/20 p-6 flex-1 relative flex flex-col shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  INFRASTRUCTURE SPEND BY SECTOR
                </span>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">LIVE</span>
                </div>
              </div>

              {embedReady ? (
                <div className="flex-1 flex items-center justify-center min-h-[240px]">
                  {/* Live Embed goes here */}
                  <div className="text-white/50 text-sm">Live Embed Ready</div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-end min-h-[240px] space-y-4">
                  <div className="flex items-end gap-2 h-40 border-b border-white/10 pb-2">
                    <div className="w-1/5 bg-white/10 h-[40%] animate-pulse" />
                    <div className="w-1/5 bg-white/10 h-[70%] animate-pulse" />
                    <div className="w-1/5 bg-white/20 h-[100%] animate-pulse" />
                    <div className="w-1/5 bg-white/10 h-[60%] animate-pulse" />
                    <div className="w-1/5 bg-white/5 h-[30%] animate-pulse" />
                  </div>
                  <div className="text-[10px] text-white/40 text-center font-mono">
                    Live data · Updated {timestamp}
                  </div>
                </div>
              )}
            </div>
            <Link 
              to="/buildout-tracker"
              className="mt-4 w-full py-4 border border-white/20 text-white text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-tpl-ink transition-colors flex items-center justify-center gap-2 group"
            >
              OPEN ANALYZER <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* RIGHT PANEL — Constraint Atlas */}
          <div className="flex flex-col h-full">
            <div className="bg-[#0D0D0D] border border-[#dcd9d5]/20 p-6 flex-1 relative flex flex-col shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  CONSTRAINT ATLAS // MIDWEST AI CAMPUSES
                </span>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">LIVE</span>
                </div>
              </div>

              {embedReady ? (
                <div className="flex-1 flex items-center justify-center min-h-[240px]">
                  {/* Live Embed goes here */}
                  <div className="text-white/50 text-sm">Live Embed Ready</div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center min-h-[240px] space-y-2">
                  <div className="h-[200px] w-full">
                    <ConstraintRadarChart projectId="midwest-ai-campuses-blocked" />
                  </div>
                  <div className="mt-4 text-[10px] text-white/40 text-center font-mono">
                    Live data · Updated {timestamp}
                  </div>
                </div>
              )}
            </div>
            <Link 
              to="/constraint-atlas"
              className="mt-4 w-full py-4 border border-white/20 text-white text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-tpl-ink transition-colors flex items-center justify-center gap-2 group"
            >
              VIEW CONSTRAINT ATLAS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
