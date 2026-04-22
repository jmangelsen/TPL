import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebase';
import { TrackerLayout } from '../../components/tracker/TrackerLayout';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SiteError {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  stack?: string;
  status?: 'pending' | 'resolved';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  occurrenceCount?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export const SiteErrors = () => {
  const [errors, setErrors] = useState<SiteError[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const q = query(collection(db, 'site_errors'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const siteErrors: SiteError[] = [];
        snapshot.forEach((docSnap) => {
          siteErrors.push({ id: docSnap.id, ...docSnap.data() } as SiteError);
        });
        setErrors(siteErrors);
      } catch (error) {
        console.error("Error fetching site errors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchErrors();
  }, []);

  const toggleStatus = async (errorId: string, currentStatus?: string) => {
    if (currentStatus === 'pending') {
      setResolvingId(errorId);
      setResolutionText('');
      return;
    }
    
    // Reopening
    try {
      const errorRef = doc(db, 'site_errors', errorId);
      await updateDoc(errorRef, { 
        status: 'pending',
        resolvedAt: null,
        resolvedBy: null,
        resolutionNote: null 
      });
      setErrors(prev =>
        prev.map(err =>
          err.id === errorId ? { ...err, status: 'pending', resolvedAt: undefined, resolvedBy: undefined, resolutionNote: undefined } : err
        )
      );
    } catch (error) {
      console.error("Error updating error status:", error);
    }
  };

  const confirmResolve = async (errorId: string, skipNote: boolean = false) => {
    try {
      const errorRef = doc(db, 'site_errors', errorId);
      const now = new Date().toISOString();
      const by = auth.currentUser?.email || 'Unknown Admin';
      const note = skipNote ? null : (resolutionText.trim() || null);
      
      await updateDoc(errorRef, { 
        status: 'resolved',
        resolvedAt: now,
        resolvedBy: by,
        resolutionNote: note
      });
      
      setErrors(prev =>
        prev.map(err =>
          err.id === errorId ? { 
            ...err, 
            status: 'resolved',
            resolvedAt: now,
            resolvedBy: by,
            resolutionNote: note || undefined
          } : err
        )
      );
      setResolvingId(null);
      setResolutionText('');
    } catch (error) {
      console.error("Error resolving error:", error);
    }
  };

  const pendingErrors = errors.filter(e => e.status !== 'resolved');
  const resolvedErrors = errors.filter(e => e.status === 'resolved');

  // Group resolved errors by week
  const getWeekKey = (dateString: string) => {
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    return `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const groupedResolvedErrors = resolvedErrors.reduce((acc, err) => {
    const week = getWeekKey(err.resolvedAt || err.timestamp);
    if (!acc[week]) acc[week] = [];
    acc[week].push(err);
    return acc;
  }, {} as Record<string, SiteError[]>);

  const sortedWeeks = Object.keys(groupedResolvedErrors).sort((a, b) => {
    const dateA = new Date(a.replace('Week of ', ''));
    const dateB = new Date(b.replace('Week of ', ''));
    return dateB.getTime() - dateA.getTime();
  });

  const criticalCount = pendingErrors.filter(e => e.severity === 'critical').length;
  const highCount = pendingErrors.filter(e => e.severity === 'high').length;
  
  let counterText = `PENDING ISSUES: ${pendingErrors.length}`;
  if (criticalCount > 0 || highCount > 0) {
    const parts = [];
    if (criticalCount > 0) parts.push(`${criticalCount} CRITICAL`);
    if (highCount > 0) parts.push(`${highCount} HIGH`);
    counterText += ` (${parts.join(' · ')})`;
  }

  const getSeverityColor = (sev?: string) => {
    switch(sev) {
      case 'critical': return 'bg-red-600 text-white border-red-700';
      case 'high': return 'bg-orange-500 text-white border-orange-600';
      case 'medium': return 'bg-yellow-400 text-yellow-900 border-yellow-500';
      case 'low':
      default: return 'bg-slate-200 text-slate-700 border-slate-300';
    }
  };

  return (
    <TrackerLayout 
      title="System Error Logs"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Admin', path: '/admin' },
        { label: 'Error Logs', path: '/admin/errors' }
      ]}
      headerContent={
        <>
          <p className="text-lg text-slate-300 max-w-4xl leading-relaxed mb-4">
            A comprehensive log of website errors, exceptions, and boundary failures to monitor platform health.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>{counterText}</span>
            <span>|</span>
            <span>RESOLVED: {resolvedErrors.length}</span>
          </div>
        </>
      }
    >
      <div className="max-w-[1600px] mx-auto py-8">
        
        {loading ? (
          <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm text-center text-slate-500 text-xs shadow-sm">
            Loading error logs...
          </div>
        ) : errors.length === 0 ? (
          <div className="bg-[#f9f8f5] border border-[#dcd9d5] p-8 rounded-sm text-center text-slate-500 text-xs shadow-sm flex flex-col items-center">
            <CheckCircle className="text-emerald-500 mb-2" size={24} />
            No site errors detected.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            <section>
              <h2 className="text-[10px] font-bold text-rose-600 uppercase tracking-[0.3em] mb-4 border-b border-[#dcd9d5] pb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> Pending Actions ({pendingErrors.length})
              </h2>
              {pendingErrors.length === 0 ? (
                <div className="text-sm text-slate-500 bg-[#f9f8f5] border border-[#dcd9d5] p-6 text-center shadow-sm">No pending errors at this time.</div>
              ) : (
                <div className="grid gap-px bg-[#dcd9d5] border border-[#dcd9d5]">
                  {pendingErrors.map(err => (
                    <div key={err.id} className="bg-[#f9f8f5] p-6 hover:bg-white transition-colors relative">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 max-w-4xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] uppercase font-bold tracking-widest rounded-sm border border-rose-200">Pending</span>
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-sm border ${getSeverityColor(err.severity)}`}>
                              {err.severity || 'low'}
                            </span>
                            {err.occurrenceCount && err.occurrenceCount > 1 && (
                              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-100 text-[9px] uppercase font-bold tracking-widest rounded-sm border border-slate-700">
                                ×{err.occurrenceCount}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 tracking-widest uppercase flex items-center gap-1">
                               <Clock size={10} /> {(err.lastSeenAt || err.timestamp) ? new Date(err.lastSeenAt || err.timestamp).toLocaleString() : ''}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">{err.message}</h3>
                          <div className="font-mono text-xs text-slate-600 truncate bg-slate-100 p-2 rounded-sm border border-slate-200 break-all">{err.url}</div>
                        </div>
                        <div className="shrink-0 mt-4 md:mt-0">
                          {resolvingId === err.id ? (
                            <div className="space-y-2 bg-white p-3 border border-emerald-200 shadow-sm rounded-sm">
                              <input 
                                type="text"
                                autoFocus
                                value={resolutionText}
                                onChange={e => setResolutionText(e.target.value)}
                                placeholder="What was done to fix this?"
                                className="w-full md:w-64 px-3 py-2 text-xs border border-slate-300 rounded-sm focus:outline-none focus:border-emerald-500 selection:bg-emerald-100"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => confirmResolve(err.id, false)}
                                  // disable if note is empty
                                  disabled={!resolutionText.trim()}
                                  className="flex-1 py-1.5 px-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-[9px] font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 disabled:hover:bg-emerald-600"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => confirmResolve(err.id, true)}
                                  className="flex-1 py-1.5 px-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-[9px] font-bold uppercase tracking-widest rounded-sm"
                                >
                                  Skip Note
                                </button>
                                <button
                                  onClick={() => { setResolvingId(null); setResolutionText(''); }}
                                  className="py-1.5 px-2 text-slate-400 hover:text-slate-600 transition-colors text-[9px] font-bold uppercase tracking-widest rounded-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleStatus(err.id, err.status)}
                              className="w-full md:w-auto px-4 py-2 border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                      {err.stack && (
                        <pre className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-sm text-[10px] text-slate-300 overflow-auto max-h-48 shadow-inner whitespace-pre-wrap">
                          {err.stack}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            <section>
              <h2 className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mb-4 border-b border-[#dcd9d5] pb-4 flex items-center gap-2">
                <CheckCircle size={14} /> Resolved Logs ({resolvedErrors.length})
              </h2>
              {resolvedErrors.length === 0 ? (
                <div className="text-sm text-slate-500 bg-[#f9f8f5] border border-[#dcd9d5] p-8 text-center shadow-sm rounded-sm">
                  No resolved errors yet. Errors marked as resolved will appear here grouped by week.
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedWeeks.map(week => (
                    <div key={week} className="space-y-4">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-sm shadow-sm inline-block">{week}</h3>
                      <div className="grid gap-px bg-[#dcd9d5] border border-[#dcd9d5] opacity-80">
                        {groupedResolvedErrors[week].map(err => (
                          <div key={err.id} className="bg-[#f9f8f5] p-6 hover:bg-white transition-colors relative">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="space-y-2 max-w-4xl min-w-0">
                                 <div className="flex flex-wrap items-center gap-3">
                                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-widest rounded-sm border border-slate-300">Resolved</span>
                                  <span className="text-[10px] text-slate-500 tracking-widest uppercase flex items-center gap-1">
                                     <Clock size={10} /> {(err.firstSeenAt || err.timestamp) ? new Date(err.firstSeenAt || err.timestamp).toLocaleDateString() : ''}
                                  </span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight break-all">{err.message}</h3>
                                {err.resolutionNote && (
                                  <div className="text-xs bg-emerald-50 border border-emerald-100 p-2 rounded-sm text-emerald-800 font-medium">
                                    {err.resolutionNote}
                                  </div>
                                )}
                                {(err.resolvedBy || err.resolvedAt) && (
                                  <div className="text-[10px] text-slate-500 tracking-tight flex gap-2">
                                    {err.resolvedBy && <span>Resolved by {err.resolvedBy}</span>}
                                    {err.resolvedAt && <span>on {new Date(err.resolvedAt).toLocaleString()}</span>}
                                  </div>
                                )}
                              </div>
                              <div className="shrink-0 mt-4 md:mt-0">
                                <button
                                  onClick={() => toggleStatus(err.id, err.status)}
                                  className="w-full md:w-auto px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors text-[9px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap"
                                >
                                  Reopen
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </TrackerLayout>
  );
};
