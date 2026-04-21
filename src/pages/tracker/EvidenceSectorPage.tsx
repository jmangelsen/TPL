import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { EVIDENCE_DRAWER_DATA, SECTOR_ROUTES } from '../../lib/evidenceDrawerData';
import { TrackerLayout } from '../../components/tracker/TrackerLayout';
import { TplSealOverlay } from '../../components/ui/TplSealOverlay';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export function EvidenceSectorPage() {
  const { sectorSlug } = useParams<{ sectorSlug: string }>();
  
  const config = useMemo(() => {
    return Object.values(EVIDENCE_DRAWER_DATA).find(c => c.slug === sectorSlug);
  }, [sectorSlug]);

  if (!config) return <Navigate to="/buildout-tracker" />;

  return (
    <TrackerLayout title={config.headline}>
      <header className="mb-12">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6] mb-2">Evidence Drawer</p>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{config.trackedCapexLabel}</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-[#0f1a24] p-8 rounded-sm border border-white/5 shadow-2xl relative flex items-center justify-center">
          <TplSealOverlay size={150} opacity={0.05} variant="dark-on-light" className="absolute bottom-4 left-4 pointer-events-none" />
          <div className="h-[300px] w-full relative z-10 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={config.pieSlices.map(s => ({ name: s.label, value: s.spend }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${(value / 1000000000).toFixed(1)}B`}
                  labelLine={true}
                >
                  {config.pieSlices.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f1a24', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number, name: string) => [`$${(value / 1000000000).toFixed(1)}B`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-4 uppercase tracking-widest">
            Breakdown of {config.id.toLowerCase()} spend for this category, as tracked in the Evidence Drawer.
          </p>
        </div>

        <article className="text-slate-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Sector breakdown</p>
          <p className="text-lg font-serif italic mb-6 text-slate-300">{config.narrativeIntro}</p>
          <p className="text-sm leading-relaxed text-slate-400">{config.narrativeBody}</p>
        </article>
      </section>

      <section className="mt-16 pt-12 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8">Recent Records</p>
        <div className="space-y-4">
          {config.records.map((record, i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <p className="text-sm font-bold text-white">{record.title}</p>
                <p className="text-[10px] text-slate-500">{record.entity} · {record.date}</p>
              </div>
              <p className="text-sm font-bold text-white">
                {record.spend ? `$${(record.spend / 1000000000).toFixed(1)}B` : 'Undisclosed'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </TrackerLayout>
  );
}
