import React from 'react';
import { Filing } from '../../lib/marketTrackerData';
import { ExternalLink, FileText } from 'lucide-react';

export const FilingsTable = ({ filings }: { filings: Filing[] }) => {
  if (!filings || filings.length === 0) {
    return (
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 p-8 border border-white/5 bg-[#0f1a24]/50 text-center">
        No filings available at this time.
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0f1a24]/50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            <th className="px-8 py-5">Type</th>
            <th className="px-8 py-5">Date</th>
            <th className="px-8 py-5">Summary</th>
            <th className="px-8 py-5 text-right">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {filings.map((filing, idx) => (
            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <FileText size={12} className="text-[#3b82f6]" />
                  <span className="font-mono font-bold text-white text-xs tracking-tight">{filing.type}</span>
                </div>
              </td>
              <td className="px-8 py-6 whitespace-nowrap text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {filing.date}
              </td>
              <td className="px-8 py-6 text-[11px] text-slate-300 leading-relaxed">
                {filing.summary}
              </td>
              <td className="px-8 py-6 text-right">
                <a 
                  href={filing.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3b82f6] hover:text-white transition-colors"
                >
                  EDGAR <ExternalLink size={10} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
