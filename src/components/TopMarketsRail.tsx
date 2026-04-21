import React from 'react';

const TOP_MARKETS = [
  {
    slug: 'northern-virginia',
    name: 'Northern Virginia',
    tag: 'Data Center Alley',
  },
  {
    slug: 'dallas-fort-worth',
    name: 'Dallas–Fort Worth',
    tag: 'Sunbelt interconnect hub',
  },
  {
    slug: 'phoenix',
    name: 'Phoenix',
    tag: 'High‑growth desert market',
  },
  {
    slug: 'atlanta',
    name: 'Atlanta',
    tag: 'Southeast expansion node',
  },
  {
    slug: 'chicago',
    name: 'Chicago',
    tag: 'Midwestern backbone',
  },
];

export function TopMarketsRail() {
  return (
    <div className="grid gap-3 md:grid-cols-5 sm:grid-cols-3 grid-cols-1">
      {TOP_MARKETS.map(market => (
        <a
          key={market.slug}
          href={`/markets/${market.slug}`}
          className="group flex flex-col justify-between rounded-lg border border-[#d9d3c6] bg-[#fefdf9] px-3 py-3 hover:border-[#171614] hover:bg-[#f9f5ec] transition-colors"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8375]">
            {market.tag}
          </span>
          <span className="mt-1 text-[13px] font-semibold text-[#171614] group-hover:underline">
            {market.name}
          </span>
        </a>
      ))}
    </div>
  );
}
