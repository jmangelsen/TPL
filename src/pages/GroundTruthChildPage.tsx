import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { groundTruthSites } from '../data/groundTruthSites';
import { Droplets, Zap, FileText, Users, BarChart2, ArrowLeft, ChevronRight } from 'lucide-react';
import { GroundTruthSubscribeForm } from '../components/GroundTruthSubscribeForm';
import './GroundTruth.css';

const iconMap: { [key: string]: React.ElementType } = {
  Droplets,
  Zap,
  FileText,
  Users,
  BarChart2
};

export const GroundTruthChildPage = () => {
  const { slug } = useParams();
  const siteIndex = groundTruthSites.findIndex(s => s.slug === slug);
  const site = groundTruthSites[siteIndex];
  const nextSite = groundTruthSites[(siteIndex + 1) % groundTruthSites.length];
  const [shareText, setShareText] = useState('SHARE THIS BRIEF');

  if (!site) {
    return <div className="min-h-screen bg-black text-white p-24 text-center">Site not found</div>;
  }

  return (
    <div className="ground-truth-page min-h-screen">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Work+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      
      {/* SECTION A — PAGE HEADER */}
      <header className="py-24 px-6 gt-grain-section" style={{ backgroundColor: 'var(--gt-surface-warm)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12">
          <div className="md:col-span-3 space-y-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gt-text-muted)]">
              <Link to="/ground-truth" className="hover:text-[var(--gt-accent)]">GROUND TRUTH</Link> / {site.name.toUpperCase()}
            </div>
            <span className={`status-badge ${
              site.status === 'CRITICAL' ? 'status-badge-critical' : 
              site.status === 'ELEVATED' ? 'status-badge-elevated' :
              site.status === 'MONITORED' ? 'status-badge-monitored' :
              ''
            }`}>
              {site.status}
            </span>
            <h1 className="text-6xl font-bold tracking-tight" style={{ fontFamily: 'var(--gt-font-display)' }}>{site.name}</h1>
            <p className="text-xl text-[var(--gt-text-muted)]">{site.region} • {site.corridorDescription}</p>
            <p className="text-[10px] text-[var(--gt-text-faint)] uppercase tracking-widest">Last updated: {site.lastUpdated}</p>
          </div>
          <div className="md:col-span-2 border border-[var(--gt-accent-muted)] bg-[var(--gt-surface-2)] p-8 grid grid-cols-2 gap-4">
            {[
              { label: "POWER DEMAND", value: site.metrics.powerDrawMW ? `${site.metrics.powerDrawMW} MW` : "—" },
              { label: "WATER DRAW", value: site.metrics.waterGallonsDay ? `~${(site.metrics.waterGallonsDay / 1000000).toFixed(1)}M gal` : "—" }
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-3xl font-bold tracking-tight text-[var(--gt-accent)]" style={{ fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gt-text-muted)]">{m.value === "—" ? "NOT DISCLOSED" : m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* SECTION B — THE HUMAN HEADLINE */}
      <section className="bg-[var(--gt-surface)] text-[var(--gt-text)] py-24 px-6 relative gt-grain-section">
        <blockquote className="max-w-3xl mx-auto text-3xl font-serif italic text-center leading-snug" style={{ fontFamily: 'var(--gt-font-display)' }}>
          "{site.humanHeadline}"
        </blockquote>
      </section>

      {/* SECTION C — IMPACT DIMENSIONS */}
      {site.dimensions.map((dim, i) => (
        <section key={dim.id} className={`py-24 px-6 ${i % 2 === 0 ? 'bg-[var(--gt-bg)]' : 'bg-[var(--gt-surface-warm)]'}`}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2 space-y-4">
              {React.createElement(iconMap[dim.icon] || FileText, { size: 48, className: dim.severity === 'red' ? 'text-[var(--gt-critical)]' : 'text-[var(--gt-elevated)]' })}
              <h2 className="text-2xl font-bold uppercase tracking-widest text-[var(--gt-text-accent)]">{dim.name}</h2>
              {dim.metric && (
                <div className={`text-5xl font-bold tabular-nums ${dim.severity === 'red' ? 'text-[var(--gt-critical)]' : 'text-[var(--gt-elevated)]'}`} style={{ fontWeight: 300 }}>
                  {dim.metric}
                </div>
              )}
              {dim.unit && <p className="text-xs font-bold uppercase tracking-widest text-[var(--gt-text-muted)]">{dim.unit}</p>}
            </div>
            <div className="md:col-span-3 space-y-6">
              <h3 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--gt-font-display)' }}>{dim.headline}</h3>
              <div className="text-base text-[var(--gt-text)] leading-relaxed space-y-4">
                {dim.body.split('\n\n').map((p, j) => <p key={j}>{p}</p>)}
              </div>
              <p className="text-xs text-[var(--gt-text-muted)] italic">Source: {dim.source}</p>
            </div>
          </div>
        </section>
      ))}

      {/* SECTION D — CONSTRAINT TRANSLATION */}
      <section className="py-24 px-6 bg-[var(--gt-surface-warm)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--gt-text-accent)]">WHAT THE INFRASTRUCTURE DATA SHOWS</h4>
            <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--gt-font-display)' }}>Technical Constraint Analysis</h2>
            <p className="text-xl text-[var(--gt-text)] font-serif italic">
              TPL's Constraint Atlas scores this project at {site.constraintScore}/10 constraint severity — one of the highest recorded in the current dataset. This score reflects the gap between theoretical infrastructure capacity and observed infrastructure investment.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-[var(--gt-surface-2)] rounded-sm overflow-hidden">
              <div className="h-full bg-[var(--gt-critical)]" style={{ width: `${(site.constraintScore || 0) * 10}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--gt-text-muted)]">
              <span>TECHNICAL CONSTRAINT SEVERITY SCORE: {site.constraintScore}/10</span>
            </div>
          </div>

          <p className="text-sm text-[var(--gt-text-muted)]">
            Full technical analysis available in the Constraint Atlas (for infrastructure professionals) → <Link to="/constraint-atlas" className="underline hover:text-[var(--gt-accent)]">View in Constraint Atlas →</Link>
          </p>
        </div>
      </section>

      {/* SECTION E — VOICES & SOURCES */}
      <section className="py-24 px-6 bg-[var(--gt-surface)] text-[var(--gt-text)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--gt-text-accent)]">PUBLIC RECORD & COVERAGE</h4>
          <div className="grid md:grid-cols-2 gap-8">
            {site.sources.map((src, i) => (
              <div key={i} className="border border-[var(--gt-border)] p-6 space-y-3 bg-[var(--gt-surface-2)]">
                <p className="font-bold text-lg">{src.name}</p>
                <p className="text-xs text-[var(--gt-text-muted)] uppercase tracking-widest">{src.pub} · {src.date}</p>
                <p className="text-sm text-[var(--gt-text)]">{src.desc}</p>
                {src.url ? (
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--gt-accent)] hover:text-[var(--gt-accent-hover)]">VIEW SOURCE →</a>
                ) : (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gt-text-faint)]">Available via public records request</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F — BOTTOM NAVIGATION */}
      <section className="py-12 px-6 bg-[var(--gt-bg)] text-[var(--gt-text)] border-t border-[var(--gt-divider)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 items-center text-center">
          <Link to="/ground-truth" className="text-[10px] font-bold uppercase tracking-widest hover:text-[var(--gt-accent)]">← BACK TO GROUND TRUTH MAP</Link>
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gt-text-accent)]">WATCH THIS REGION</p>
            <GroundTruthSubscribeForm source="ground-truth" tag="region-alert" region={site.slug} />
          </div>
          <button 
            onClick={async (e) => {
              const btn = e.currentTarget;
              const originalText = btn.innerText;
              const originalColor = btn.style.color;
              try {
                await navigator.clipboard.writeText(window.location.href);
                btn.innerText = "✓ LINK COPIED";
                btn.style.color = "var(--gt-monitored)";
                setTimeout(() => {
                  btn.innerText = originalText;
                  btn.style.color = originalColor;
                }, 2500);
              } catch (err) {
                console.error("Failed to copy link: ", err);
                alert("Copy failed. Please copy this URL manually: " + window.location.href);
              }
            }}
            className="text-[10px] font-bold uppercase tracking-widest hover:text-[var(--gt-accent)]"
          >
            {shareText}
          </button>
          <Link to={`/ground-truth/${nextSite.slug}`} className="text-[10px] font-bold uppercase tracking-widest hover:text-[var(--gt-accent)]">NEXT BRIEF →</Link>
        </div>
      </section>
    </div>
  );
};
