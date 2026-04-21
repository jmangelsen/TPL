import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../lib/marketTrackerData';
import { FilingsTable } from './FilingsTable';
import { ConstraintExposureBox } from './ConstraintExposureBox';
import { ArrowLeft, Lock, TrendingUp, TrendingDown, Minus, Activity, FileText, ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

export const CompanyDetailTemplate = ({ company }: { company: Company }) => {
  const [imgError, setImgError] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    /*
    const fetchNews = async () => {
      try {
        setLoadingNews(true);
        // Fetch news for this company
        const newsRef = collection(db, 'company_news');
        const q = query(newsRef, where('companyId', '==', company.slug));
        const snapshot = await getDocs(q);
        
        const newsItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];

        // Sort by publishedAt descending and take top 5
        newsItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setNews(newsItems.slice(0, 5));
      } catch (error) {
        console.error("Error fetching company news:", error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
    */
    setLoadingNews(false);
  }, [company.slug]);

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white relative">
      {/* Topography Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[2]" />
      </div>

      {/* Header Section */}
      <div className="relative border-b border-white/5 bg-[#0f1a24] py-12 z-10">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none overflow-hidden">
          <img 
            src="/tpl-seal.png" 
            alt="TPL Seal" 
            className="w-full h-full object-contain invert"
          />
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/market-tracker" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8">
            <ArrowLeft size={12} />
            Back to Tracker
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              {company.logoUrl && !imgError ? (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded flex items-center justify-center p-2 shrink-0 shadow-lg border border-white/10">
                  <img 
                    src={company.logoUrl} 
                    alt={company.logoAlt || `${company.name} logo`} 
                    className="max-w-full max-h-full object-contain"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-[#3b82f6] text-xl font-bold">{company.ticker.substring(0, 4)}</span>
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[9px] font-bold uppercase tracking-[0.2em] border border-[#3b82f6]/20">
                    {company.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase mb-4">
                  {company.name}
                </h1>
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest">
                  <span className="text-[#3b82f6] font-bold">{company.ticker}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">{company.exchange}</span>
                </div>
              </div>
            </div>

            {/* Stock Widget */}
            <div className="bg-[#0f1a24]/50 border border-white/5 p-6 min-w-[200px] text-right">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Current Price</div>
              <div className="text-3xl font-bold text-white mb-2">{company.stockPrice.split(' ')[0]}</div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mb-4">
                <Minus size={12} /> 0.00% (1D)
              </div>
              <div className="text-[9px] text-slate-500 border-t border-white/5 pt-3 mt-3 uppercase tracking-widest">
                Cap: {company.marketCap.split(' ')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Why We Track */}
            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-6 border-b border-white/5 pb-4">Why We Track {company.ticker}</h2>
              <div className="bg-[#0f1a24]/50 border border-white/5 p-8">
                <p className="text-[10px] font-bold text-[#3b82f6] mb-4 uppercase tracking-widest">
                  Primary Exposure: {company.datacenterAngle}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-serif italic">
                  {company.whyWeTrack}
                </p>
              </div>
            </section>

            {/* Latest News & Signals */}
            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-6 border-b border-white/5 pb-4">Latest News & Signals</h2>
              {loadingNews ? (
                <div className="text-sm text-slate-500 italic">Loading latest headlines...</div>
              ) : news.length > 0 ? (
                <div className="space-y-4">
                  {news.map((item) => {
                    const hoursAgo = Math.floor((Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60));
                    const timeString = hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;
                    
                    return (
                      <div key={item.id} className="bg-[#0f1a24]/50 border border-white/5 p-6 hover:border-[#3b82f6]/30 transition-colors group">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                          <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#3b82f6] transition-colors flex items-start gap-2">
                            {item.headline}
                            <ExternalLink size={12} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest mb-3">
                            <span className="text-slate-400 font-bold">{item.source}</span>
                            <span>•</span>
                            <span>{timeString}</span>
                          </div>
                          {item.summary && (
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                              {item.summary}
                            </p>
                          )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#0f1a24]/30 border border-white/5 p-6 text-center">
                  <p className="text-sm text-slate-500 italic">No recent headlines matching our AI infrastructure filters in the last few days.</p>
                </div>
              )}
            </section>

            {/* Latest Activity */}
            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-6 border-b border-white/5 pb-4">Latest Data Center Activity</h2>
              <div className="text-sm text-slate-300 leading-relaxed mb-8">
                {company.latestActivity}
              </div>

              {/* Paywalled Commentary */}
              <div className="bg-[#0f1a24]/50 border border-white/5 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a2633]/90 z-10" />
                <div className="relative z-0 opacity-30 blur-[2px] select-none space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">TPL Analyst Note</h3>
                  <p className="text-sm text-slate-400">The recent capex expansion signals a structural shift in how the company approaches power procurement...</p>
                </div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <Lock size={20} className="text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Subscribers Only</h3>
                  <p className="text-xs text-slate-400 mb-6 max-w-sm">
                    Unlock our proprietary analysis on what {company.ticker}'s latest moves mean for the physical infrastructure supply chain.
                  </p>
                  <Link to="/get-access" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors">
                    Upgrade Access
                  </Link>
                </div>
              </div>
            </section>

            {/* Key Filings */}
            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-6 border-b border-white/5 pb-4">Key Filings</h2>
              <FilingsTable filings={company.filings} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <ConstraintExposureBox exposures={company.constraintExposure} />

            {/* Related TPL Content */}
            <div className="bg-[#0f1a24]/50 border border-white/5 p-8">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-6">Related TPL Content</h3>
              <ul className="space-y-6">
                <li>
                  <Link to="/monitor" className="group flex items-start gap-4">
                    <div className="mt-0.5 text-slate-600 group-hover:text-[#3b82f6] transition-colors">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-widest">Constraint Monitor</div>
                      <div className="text-[10px] text-slate-500 mt-1">Track the macro bottlenecks affecting {company.ticker}</div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="group flex items-start gap-4">
                    <div className="mt-0.5 text-slate-600 group-hover:text-[#3b82f6] transition-colors">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-widest">Quarterly Reports</div>
                      <div className="text-[10px] text-slate-500 mt-1">Deep dives into infrastructure buildout pacing</div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-[9px] text-slate-600 max-w-2xl mx-auto uppercase tracking-widest">
            This page is for informational purposes only and does not constitute investment advice. All filing links direct to public SEC EDGAR or company investor relations pages.
          </p>
        </div>
      </div>
    </div>
  );
};
