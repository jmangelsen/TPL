import React from 'react';
import { FileText, Download, AlertCircle, TrendingUp, Activity } from 'lucide-react';

export const Q2Report = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
              Quarterly Report
            </span>
            <span className="text-slate-500 text-sm">Published: July 15, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Q2 2026 Infrastructure Constraints</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Analysis of power availability, cooling supply chain bottlenecks, and land permitting delays affecting high-density compute deployments.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Download size={16} />
          Export PDF
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Avg. Permitting Delay</h3>
            <Activity size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">18.4 Months</div>
          <div className="text-xs text-amber-400 flex items-center gap-1">
            <TrendingUp size={12} />
            +2.1 months YoY
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Transformer Lead Time</h3>
            <AlertCircle size={16} className="text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">115 Weeks</div>
          <div className="text-xs text-rose-400 flex items-center gap-1">
            <TrendingUp size={12} />
            +12 weeks QoQ
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Available Power (Tier 1)</h3>
            <Activity size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">&lt; 50 MW</div>
          <div className="text-xs text-slate-500">Across Northern Virginia</div>
        </div>
      </div>

      {/* Content Body */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 md:p-8 prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Executive Summary</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          The second quarter of 2026 saw an unprecedented tightening of physical infrastructure constraints for AI data center buildouts. While capital remains abundant, the physical layer—specifically high-voltage transformers, liquid cooling distribution units (CDUs), and transmission-level power interconnections—has become the primary bottleneck for scaling frontier models.
        </p>
        
        <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4 mt-8">Power & Transmission</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Utilities in primary markets (PJM, ERCOT) are increasingly rejecting large load interconnection requests or quoting timelines extending into 2030. The shift toward "behind-the-meter" generation (natural gas, small modular reactors) has accelerated, though regulatory hurdles remain significant.
        </p>

        {/* Data Table */}
        <div className="overflow-x-auto my-8">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Available Capacity</th>
                <th className="px-4 py-3 font-medium">Interconnection Queue</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3">Northern Virginia (PJM)</td>
                <td className="px-4 py-3">&lt; 50 MW</td>
                <td className="px-4 py-3">48-60 months</td>
                <td className="px-4 py-3"><span className="text-rose-400">Severely Constrained</span></td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3">Dallas (ERCOT)</td>
                <td className="px-4 py-3">150 MW</td>
                <td className="px-4 py-3">24-36 months</td>
                <td className="px-4 py-3"><span className="text-amber-400">Constrained</span></td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3">Phoenix (SRP/APS)</td>
                <td className="px-4 py-3">80 MW</td>
                <td className="px-4 py-3">36-48 months</td>
                <td className="px-4 py-3"><span className="text-amber-400">Constrained</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources Section */}
      <div className="mt-12 pt-8 border-t border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText size={16} className="text-slate-500" />
          Sources & Methodology
        </h3>
        <ul className="space-y-3 text-xs text-slate-500">
          <li className="flex gap-3">
            <span className="text-slate-600">[1]</span>
            <span><strong>PJM Interconnection Queue Data:</strong> Extracted from public filings and verified through interviews with 4 major data center developers. Data current as of June 30, 2026.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-600">[2]</span>
            <span><strong>Transformer Lead Times:</strong> Aggregated procurement data from Tier 1 electrical equipment suppliers (Hitachi Energy, Siemens Energy, GE Vernova).</span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-600">[3]</span>
            <span><strong>Methodology Notes:</strong> "Available Capacity" is defined as contiguous power blocks capable of supporting &gt;20MW deployments within a 12-month delivery window. Excludes speculative capacity.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
