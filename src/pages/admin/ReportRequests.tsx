import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import {
  collection, query, orderBy, onSnapshot,
  doc, updateDoc, serverTimestamp
} from 'firebase/firestore';

interface ReportRequest {
  id: string;
  persona: string;
  name: string;
  email: string;
  organization: string;
  instructions: string;
  status: 'new' | 'reviewed' | 'actioned';
  date: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string;
}

const STATUS_STYLES = {
  new:      { bg: 'bg-blue-950',   text: 'text-blue-400',   border: 'border-blue-800',   label: 'NEW' },
  reviewed: { bg: 'bg-yellow-950', text: 'text-yellow-400', border: 'border-yellow-800', label: 'REVIEWED' },
  actioned: { bg: 'bg-green-950',  text: 'text-green-400',  border: 'border-green-800',  label: 'ACTIONED' }
};

const PERSONA_COLORS: Record<string, string> = {
  'strategic stakeholders':     '#8B5CF6',
  'institutional interpreters': '#F59E0B',
  'commercial partners':        '#10B981',
  'core operators':             '#3B82F6',
};

function getPersonaColor(persona: string): string {
  const key = Object.keys(PERSONA_COLORS).find(k => 
    persona.toLowerCase().includes(k)
  );
  return key ? PERSONA_COLORS[key] : '#94A3B8';
}

export function ReportRequests() {
  const [requests, setRequests] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'actioned'>('all');
  const [personaFilter, setPersonaFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'report_requests'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as ReportRequest)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = async (id: string, status: ReportRequest['status']) => {
    const user = auth.currentUser;
    await updateDoc(doc(db, 'report_requests', id), {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.email ?? 'admin'
    });
  };

  const saveNote = async (id: string) => {
    await updateDoc(doc(db, 'report_requests', id), { notes: noteText });
    setEditingNote(null);
  };

  const filtered = requests.filter(r => {
    const statusMatch = filter === 'all' || r.status === filter;
    const personaMatch = personaFilter === 'all' || r.persona === personaFilter;
    return statusMatch && personaMatch;
  });

  const counts = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    reviewed: requests.filter(r => r.status === 'reviewed').length,
    actioned: requests.filter(r => r.status === 'actioned').length,
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Report Requests</h1>
            <p className="text-sm text-slate-500 mt-1">
              Submissions from the report request form — admin only
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {counts.new > 0 && (
              <span className="bg-blue-900 border border-blue-700 text-blue-300 
                text-xs px-3 py-1 rounded-full font-medium mr-2">
                {counts.new} new
              </span>
            )}
            {counts.all} total
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-4">
          {(['all', 'new', 'reviewed', 'actioned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${ 
                filter === f
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Persona tabs */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {(['all', 'Strategic Stakeholders', 'Institutional Interpreters', 'Commercial Partners', 'Core Operators']).map(p => {
             const count = requests.filter(r => p === 'all' ? true : r.persona === p).length;
             return (
              <button
                key={p}
                onClick={() => setPersonaFilter(p)}
                className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-sm border transition-colors ${ 
                  personaFilter === p
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'border-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                {p} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Request list */}
      <div className="px-8 py-6 max-w-4xl">
        {loading ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No {filter === 'all' ? '' : filter} requests</p>
          </div>
        ) : (
          filtered.map(req => {
            const style = STATUS_STYLES[req.status];
            const isExpanded = expanded === req.id;
            const personaColor = getPersonaColor(req.persona);

            return (
              <div
                key={req.id}
                className={`rounded-lg border ${style.border} ${style.bg} 
                  mb-4 overflow-hidden`}
              >
                {/* Card header */}
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/5"
                  onClick={() => setExpanded(isExpanded ? null : req.id)}
                >
                  {/* Persona badge */}
                  <span
                    className="text-xs font-bold uppercase px-2 py-0.5 rounded 
                      shrink-0 mt-0.5 border"
                    style={{
                      color: personaColor,
                      borderColor: personaColor + '40',
                      backgroundColor: personaColor + '15'
                    }}
                  >
                    {req.persona}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{req.name}</p>
                      <span className="text-slate-600">·</span>
                      <p className="text-sm text-slate-400">{req.organization}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {req.email} · {new Date(req.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    {!isExpanded && (
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {req.instructions}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 
                      rounded border ${style.text} ${style.border}`}>
                      {style.label}
                    </span>
                    <span className="text-slate-600 text-xs">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-white/5 p-4 space-y-4">
                    {/* Instructions */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 
                        uppercase tracking-wide mb-1">Request</p>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {req.instructions}
                      </p>
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 
                        uppercase tracking-wide mb-1">Admin Notes</p>
                      {editingNote === req.id ? (
                        <div className="flex gap-2">
                          <textarea
                            className="flex-1 bg-slate-800 border border-slate-600 
                              rounded px-2 py-1.5 text-xs text-white 
                              placeholder-slate-500 outline-none 
                              focus:border-blue-500 resize-none"
                            rows={3}
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            placeholder="Add notes about this request..."
                            autoFocus
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              className="bg-blue-700 hover:bg-blue-600 text-white 
                                text-xs px-3 py-1 rounded"
                              onClick={() => saveNote(req.id)}
                            >Save</button>
                            <button
                              className="text-slate-500 hover:text-slate-300 
                                text-xs px-2"
                              onClick={() => setEditingNote(null)}
                            >Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="text-sm text-slate-400 cursor-pointer 
                            hover:text-slate-300 min-h-[24px]"
                          onClick={() => {
                            setEditingNote(req.id);
                            setNoteText(req.notes || '');
                          }}
                        >
                          {req.notes || (
                            <span className="italic text-slate-600">
                              Click to add notes...
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Review info */}
                    {req.reviewedAt && (
                      <p className="text-xs text-slate-600">
                        Last updated by {req.reviewedBy} · {' '}
                        {new Date(req.reviewedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {req.status !== 'new' && (
                        <button
                          className="bg-blue-900 hover:bg-blue-800 border 
                            border-blue-700 text-blue-300 text-xs px-3 py-1 rounded"
                          onClick={() => updateStatus(req.id, 'new')}
                        >Mark New</button>
                      )}
                      {req.status !== 'reviewed' && (
                        <button
                          className="bg-yellow-900 hover:bg-yellow-800 border 
                            border-yellow-700 text-yellow-300 text-xs px-3 py-1 rounded"
                          onClick={() => updateStatus(req.id, 'reviewed')}
                        >Mark Reviewed</button>
                      )}
                      {req.status !== 'actioned' && (
                        <button
                          className="bg-green-900 hover:bg-green-800 border 
                            border-green-700 text-green-300 text-xs px-3 py-1 rounded"
                          onClick={() => updateStatus(req.id, 'actioned')}
                        >Mark Actioned</button>
                      )}
                      <a
                        href={`mailto:${req.email}`}
                        className="bg-slate-800 hover:bg-slate-700 border 
                          border-slate-600 text-slate-300 text-xs px-3 py-1 
                          rounded inline-block"
                      >Reply by Email</a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
