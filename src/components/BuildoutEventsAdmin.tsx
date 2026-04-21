import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { BuildoutEvent, buildoutEvents as staticEvents } from '../lib/buildoutTrackerData';
import { Edit2, Trash2, Plus, Download, RefreshCw, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortColumn = 'eventDate' | 'entityName' | 'announcedSpend' | 'title';
type SortDirection = 'asc' | 'desc';

export const BuildoutEventsAdmin = () => {
  const [events, setEvents] = useState<BuildoutEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BuildoutEvent | null>(null);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>('eventDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Form state
  const [formData, setFormData] = useState<Partial<BuildoutEvent>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'buildout_events'), (snapshot) => {
      const fetchedEvents: BuildoutEvent[] = [];
      snapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as BuildoutEvent);
      });
      setEvents(fetchedEvents);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to desc when switching columns
    }
  };

  const parseSpend = (spendStr?: string) => {
    if (!spendStr) return 0;
    let num = parseFloat(spendStr.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 0;
    const lower = spendStr.toLowerCase();
    if (lower.includes('b')) num *= 1000000000;
    else if (lower.includes('m')) num *= 1000000;
    else if (lower.includes('k')) num *= 1000;
    return num;
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let valA: any = a[sortColumn];
      let valB: any = b[sortColumn];

      if (sortColumn === 'announcedSpend') {
        valA = parseSpend(a.announcedSpend);
        valB = parseSpend(b.announcedSpend);
      } else if (sortColumn === 'eventDate') {
        valA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
        valB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
      } else {
        valA = valA ? String(valA).toLowerCase() : '';
        valB = valB ? String(valB).toLowerCase() : '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [events, sortColumn, sortDirection]);

  const handleSeed = async () => {
    if (!window.confirm('Seed static data? This overwrites existing events with the same IDs.')) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      staticEvents.forEach(e => {
        batch.set(doc(db, 'buildout_events', e.id), e);
      });
      await batch.commit();
      alert('Seeded successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to seed.');
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedPlaceholder = async () => {
    if (!window.confirm('Seed placeholder data? This will add 5 dummy events.')) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      const placeholders: BuildoutEvent[] = [
        {
          id: `evt_ph_1`,
          title: 'Placeholder Hyperscaler Project Alpha',
          entityName: 'Tech Giant A',
          entityType: 'Hyperscaler',
          category: 'capital',
          announcedSpend: '$15B',
          eventDate: '2026-05-01',
          summary: 'A massive placeholder investment in new AI infrastructure.',
          publicationStatus: 'approved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `evt_ph_2`,
          title: 'Placeholder Power Generation Beta',
          entityName: 'Energy Corp B',
          entityType: 'Power Generation',
          category: 'capital',
          announcedSpend: '$5B',
          eventDate: '2026-06-15',
          summary: 'Placeholder nuclear PPA to support data center growth.',
          publicationStatus: 'approved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `evt_ph_3`,
          title: 'Placeholder REIT Expansion Gamma',
          entityName: 'Data Center REIT C',
          entityType: 'REIT / Operator',
          category: 'capital',
          announcedSpend: '$8B',
          eventDate: '2026-07-20',
          summary: 'Placeholder expansion of colocation facilities.',
          publicationStatus: 'approved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `evt_ph_4`,
          title: 'Placeholder Cooling Partnership Delta',
          entityName: 'Cooling OEM D',
          entityType: 'Power & Cooling',
          category: 'capital',
          announcedSpend: '$2B',
          eventDate: '2026-08-10',
          summary: 'Placeholder investment in liquid cooling manufacturing.',
          publicationStatus: 'approved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `evt_ph_5`,
          title: 'Placeholder Sovereign AI Initiative Epsilon',
          entityName: 'Nation State E',
          entityType: 'Sovereign / Gov\'t',
          category: 'capital',
          announcedSpend: '$12B',
          eventDate: '2026-09-05',
          summary: 'Placeholder sovereign wealth fund investment in domestic AI compute.',
          publicationStatus: 'approved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      placeholders.forEach(e => {
        batch.set(doc(db, 'buildout_events', e.id), e);
      });
      await batch.commit();
      alert('Seeded placeholder data successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to seed placeholder data.');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'buildout_events', id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingEvent?.id || `evt_${Date.now()}`;
      const eventToSave = { ...formData, id } as BuildoutEvent;
      await setDoc(doc(db, 'buildout_events', id), eventToSave);
      setIsModalOpen(false);
      setEditingEvent(null);
      setFormData({});
    } catch (error) {
      console.error(error);
      alert('Failed to save.');
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      category: 'capital',
      publicationStatus: 'draft',
      entityType: 'Hyperscaler'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: BuildoutEvent) => {
    setEditingEvent(event);
    setFormData(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 bg-[#0f1a24] border border-white/5">
        <RefreshCw size={32} className="animate-spin text-slate-400" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Loading Database...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1a24] border border-white/5 p-6 md:p-10 shadow-2xl relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/5 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 block mb-2">
            Database Management
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Buildout Events
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSeedPlaceholder} 
            disabled={seeding} 
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            {seeding ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            Seed Placeholders
          </button>
          <button 
            onClick={handleSeed} 
            disabled={seeding} 
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            {seeding ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            Seed Static Data
          </button>
          <button 
            onClick={openCreateModal} 
            className="px-4 py-2 bg-[#0f1a24] text-[#f9f8f4] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            Add Event
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('eventDate')}>
                <div className="flex items-center gap-1">
                  Event Date
                  {sortColumn === 'eventDate' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-1">
                  Title
                  {sortColumn === 'title' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('entityName')}>
                <div className="flex items-center gap-1">
                  Entity
                  {sortColumn === 'entityName' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Type</th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('announcedSpend')}>
                <div className="flex items-center gap-1">
                  Spend
                  {sortColumn === 'announcedSpend' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedEvents.map(event => (
              <tr key={event.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-4 px-4 text-sm text-slate-400 whitespace-nowrap">{event.eventDate || '-'}</td>
                <td className="py-4 px-4 text-sm font-medium text-white max-w-[200px] truncate" title={event.title}>{event.title}</td>
                <td className="py-4 px-4 text-sm text-slate-400">{event.entityName}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-[#1a2633] text-slate-300 border border-white/10 rounded-sm">
                    {event.entityType}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-slate-400 font-mono">{event.announcedSpend || '-'}</td>
                <td className="py-4 px-4">
                   <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm ${event.publicationStatus === 'approved' ? 'bg-green-500/20 text-green-400' : event.publicationStatus === 'archived' ? 'bg-white/10 text-slate-300' : 'bg-amber-500/20 text-amber-400'}`}>
                    {event.publicationStatus || 'draft'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEditModal(event)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(event.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedEvents.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-slate-500 italic">
                  No events found. Click "Seed Data" to populate or "Add Event" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-sm p-4">
          <div className="bg-[#0f1a24] border border-white/5 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#0f1a24]">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="event-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title *</label>
                    <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" placeholder="e.g. Project Echo Data Center" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entity Name *</label>
                    <input required type="text" value={formData.entityName || ''} onChange={e => setFormData({...formData, entityName: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" placeholder="e.g. Amazon Web Services" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entity Type *</label>
                    <select required value={formData.entityType || ''} onChange={e => setFormData({...formData, entityType: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors">
                      <option value="Hyperscaler">Hyperscaler</option>
                      <option value="Power Generation">Power Generation</option>
                      <option value="REIT / Operator">REIT / Operator</option>
                      <option value="Power & Cooling">Power & Cooling OEMs</option>
                      <option value="Chips & Networking">Chips & Networking</option>
                      <option value="Sovereign / Gov't">Sovereign / Gov't</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category *</label>
                    <select required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors">
                      <option value="capital">Capital</option>
                      <option value="cooling">Cooling</option>
                      <option value="policy">Policy</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Event Date *</label>
                    <input required type="date" value={formData.eventDate || ''} onChange={e => setFormData({...formData, eventDate: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Announced Spend</label>
                    <input type="text" placeholder="e.g. $10B" value={formData.announcedSpend || ''} onChange={e => setFormData({...formData, announcedSpend: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Geography</label>
                    <input type="text" placeholder="e.g. Northern Virginia" value={formData.geography || ''} onChange={e => setFormData({...formData, geography: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Jurisdiction</label>
                    <input type="text" placeholder="e.g. Loudoun County" value={formData.jurisdiction || ''} onChange={e => setFormData({...formData, jurisdiction: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Summary *</label>
                    <textarea required rows={3} value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Brief summary of the event..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Publication Status</label>
                    <select value={formData.publicationStatus || 'draft'} onChange={e => setFormData({...formData, publicationStatus: e.target.value as any})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors">
                      <option value="approved">Approved (Visible)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Impact Label</label>
                    <select value={formData.impactLabel || ''} onChange={e => setFormData({...formData, impactLabel: e.target.value as any})} className="w-full p-3 bg-[#0f1a24] border border-white/5 text-sm focus:outline-none focus:border-black transition-colors">
                      <option value="">None</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-[#0f1a24]">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" form="event-form" className="px-8 py-3 bg-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2563eb] transition-colors">
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
