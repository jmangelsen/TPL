import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate, Link } from 'react-router-dom';
import * as topojson from 'topojson-client';
import { groundTruthRegions } from '../data/groundTruthRegions';
import { proposedSites } from '../data/proposedSites';
import { ConstraintRadarChart } from '../components/ConstraintRadarChart';
import { GroundTruthSubscribeForm } from '../components/GroundTruthSubscribeForm';
import './GroundTruth.css';

export const GroundTruth = () => {
  const navigate = useNavigate();
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove(); // Clear previous rendering

    const width = 960;
    const height = 600;

    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Add watermark seal behind the map
    svg.append("image")
      .attr("xlink:href", "/tpl-seal.png")
      .attr("x", -50)
      .attr("y", 150)
      .attr("width", 500)
      .attr("height", 500)
      .attr("opacity", 0.08)
      .attr("filter", "invert(1)")
      .attr("pointer-events", "none");

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((us: any) => {
      if (!us || !us.objects || !us.objects.states) return;
      
      const states = topojson.feature(us, us.objects.states);
      
      svg.selectAll("path.state")
        .data(states.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)
        .attr("fill", "#1A1510")
        .attr("stroke", "#C49A52")
        .attr("stroke-width", 0.5)
        .attr("stroke-opacity", 0.25);
    });

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "gt-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "var(--gt-surface)")
      .style("padding", "8px 12px")
      .style("border", "1px solid var(--gt-border)")
      .style("color", "var(--gt-text)")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "100");

    // Add markers
    svg.selectAll("circle")
      .data(groundTruthRegions)
      .enter()
      .append("circle")
      .attr("cx", d => projection([d.lng, d.lat])![0])
      .attr("cy", d => projection([d.lng, d.lat])![1])
      .attr("r", 6)
      .attr("fill", d => d.status === 'CRITICAL' ? '#C4522A' : d.status === 'ELEVATED' ? '#C49A52' : '#5A7A52')
      .attr("class", "pulse")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.name}</strong><br/><span class="status-badge">${d.status}</span>`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedRegion(d);
        setSelectedSite(null);
      });

    // Add proposed site markers (diamonds)
    svg.selectAll("path.diamond")
      .data(proposedSites)
      .enter()
      .append("path")
      .attr("d", d3.symbol().type(d3.symbolDiamond).size(64))
      .attr("transform", d => `translate(${projection([d.coordinates[1], d.coordinates[0]])![0]},${projection([d.coordinates[1], d.coordinates[0]])![1]})`)
      .attr("fill", d => d.status === 'RUMORED' ? '#6A6460' : d.status === 'ANNOUNCED' ? '#C4A862' : d.status === 'PERMITTED' ? '#C49A52' : d.status === 'UNDER_REVIEW' ? '#C4722A' : '#C4522A')
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("class", "diamond")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.name}</strong><br/><span class="status-badge">${d.status}</span>`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedSite(d);
        setSelectedRegion(null);
      });

    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <div className="ground-truth-page min-h-screen">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Work+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      
      {/* Page Subtitle Area */}
      <header className="py-20 px-6 gt-grain-section" style={{ backgroundColor: 'var(--gt-surface-warm)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gt-accent)] mb-4 block">IMPACT INTELLIGENCE</span>
          <h1 className="text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--gt-font-display)' }}>Ground Truth</h1>
          <p className="text-xl text-[var(--gt-text-muted)]">Behind every constraint score is a community. This is what the data looks like from the ground.</p>
          <p className="text-sm text-[var(--gt-text-faint)] mt-4 italic">◇ Diamond markers indicate proposed or approved sites not yet in operation — early warning for affected communities.</p>
          <p className="text-sm text-[var(--gt-text-faint)] mt-2 italic">This is a public resource. No subscription required to read any impact brief.</p>
        </div>
      </header>

      {/* Map */}
      <div className="w-full h-[50vh] md:h-[65vh] bg-[var(--gt-bg)] cursor-pointer" onClick={() => { setSelectedRegion(null); setSelectedSite(null); }}>
        <svg ref={mapRef} width="100%" height="100%" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice" />
      </div>

      {/* Legend Bar */}
      <div className="bg-[var(--gt-bg)] border-y border-[var(--gt-border)] py-6">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Row 1 — Community Impact */}
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <span className="text-xs text-[var(--gt-text-faint)] tracking-[0.12em] uppercase mr-8 mb-4 md:mb-0 shrink-0">COMMUNITY IMPACT</span>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C4522A' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">CRITICAL IMPACT</span>
                <span className="text-xs text-[var(--gt-text-muted)]">— Active water, grid, or permitting conflict</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C49A52' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">ELEVATED IMPACT</span>
                <span className="text-xs text-[var(--gt-text-muted)]">— Measurable pressure on local resources</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5A7A52' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">MONITORED</span>
                <span className="text-xs text-[var(--gt-text-muted)]">— Active build — TPL is tracking</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--gt-border)]" />

          {/* Row 2 — Proposed Sites Pipeline */}
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <span className="text-xs text-[var(--gt-text-faint)] tracking-[0.12em] uppercase mr-8 mb-4 md:mb-0 shrink-0">PROPOSED SITES</span>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <span className="w-[10px] h-[10px] rotate-45" style={{ backgroundColor: '#6A6460' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">EARLY WARNING</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10px] h-[10px] rotate-45" style={{ backgroundColor: '#8A7A50' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">RUMORED</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10px] h-[10px] rotate-45" style={{ backgroundColor: '#C4A862' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">ANNOUNCED</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10px] h-[10px] rotate-45" style={{ backgroundColor: '#C4722A' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">UNDER REVIEW</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10px] h-[10px] rotate-45" style={{ backgroundColor: '#C4522A' }} />
                <span className="text-xs text-[var(--gt-text)] font-bold">APPROVED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Panel (Preview) */}
      {(selectedRegion || selectedSite) && (
        <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-[var(--gt-surface)] border-l border-[var(--gt-accent-muted)] z-50 p-8 shadow-2xl overflow-y-auto flex flex-col">
          <button onClick={() => { setSelectedRegion(null); setSelectedSite(null); }} className="absolute top-4 right-4 text-[var(--gt-text)] hover:text-[var(--gt-accent)] text-2xl">×</button>
          
          <div className="flex-grow space-y-6">
            {selectedRegion && (
              <>
                <h2 className="text-2xl font-bold text-[var(--gt-text)]" style={{ fontFamily: 'var(--gt-font-display)' }}>{selectedRegion.name}</h2>
                <span className={`status-badge ${
                  selectedRegion.status === 'CRITICAL' ? 'status-badge-critical' : 'status-badge-elevated'
                }`}>
                  {selectedRegion.status}
                </span>
                <p className="text-sm text-[var(--gt-text-muted)]">{selectedRegion.region}</p>
                <p className="text-sm text-[var(--gt-text)] leading-relaxed">{Object.values(selectedRegion.impact)[0] as string}</p>
              </>
            )}

            {selectedSite && (
              <>
                <h2 className="text-2xl font-bold text-[var(--gt-text)]" style={{ fontFamily: 'var(--gt-font-display)' }}>{selectedSite.name}</h2>
                <span className="status-badge" style={{ borderColor: selectedSite.statusColor, color: selectedSite.statusColor, background: 'transparent' }}>
                  {selectedSite.status}
                </span>
                <p className="text-sm text-[var(--gt-text-muted)]">{selectedSite.region}</p>
                <p className="text-sm text-[var(--gt-text)] leading-relaxed">{selectedSite.notes}</p>
              </>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <button 
              onClick={() => navigate(`/ground-truth/${selectedRegion ? selectedRegion.slug : selectedSite.slug}`)}
              className="btn-primary w-full"
            >
              READ FULL IMPACT BRIEF →
            </button>
          </div>
        </div>
      )}

      {/* Featured Brief */}
      <section className="bg-[var(--gt-surface-warm)] py-24 relative overflow-hidden gt-grain-section">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gt-accent)]">FEATURED GROUND TRUTH BRIEF</span>
            <blockquote className="text-4xl font-serif italic text-[var(--gt-text)] leading-tight" style={{ fontFamily: 'var(--gt-font-display)' }}>
              "The land cleared. The incentives signed. Then the grid said no."
            </blockquote>
            <div className="space-y-4 text-[var(--gt-text-muted)] text-sm leading-relaxed">
              <p>Across the U.S. Midwest, a wave of multi-billion dollar AI campus proposals advanced through land acquisition, state incentive packages, and early site works — only to stall when they met the physical limits of regional power grids, water systems, and environmental review processes.</p>
              <p>The Midwest AI Campuses scenario represents a stylized but evidence-grounded pattern: capital moves faster than infrastructure, and communities bear the cost of the gap.</p>
            </div>
            <span className="status-badge status-badge-critical">
              MIDWEST AI CORRIDOR · STATUS: CRITICAL
            </span>
            <div className="pt-4">
              <a href="/ground-truth/midwest-ai-corridor" className="btn-primary inline-block w-full text-center">
                READ THE FULL IMPACT BRIEF →
              </a>
            </div>
          </div>
          <div className="bg-[var(--gt-surface-2)] p-8 border border-[var(--gt-accent-muted)] h-[400px]">
            <ConstraintRadarChart projectId="midwest-ai-campuses-blocked" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="ground-truth-page py-24 px-6 border-t border-[var(--gt-divider)]">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--gt-text)]" style={{ fontFamily: 'var(--gt-font-display)' }}>Stay Informed About Your Community</h2>
          <p className="text-[var(--gt-text-muted)]">We'll notify you when data center activity is identified in your area. No spam. Unsubscribe anytime.</p>
          <div className="flex justify-center">
            <GroundTruthSubscribeForm source="ground-truth" tag="region-alert" />
          </div>
        </div>
      </section>
    </div>
  );
};
