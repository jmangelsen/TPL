import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Edit2, Trash2, Plus, RefreshCw, X } from 'lucide-react';

export interface SectorSpend {
  id: string; // This will be the sectorId
  totalSpend: number;
  companies: { entity: string; spend: number }[];
  narrative: string;
  updatedAt: string;
}

export const SectorSpendAdmin = () => {
  const [sectorSpends, setSectorSpends] = useState<SectorSpend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpend, setEditingSpend] = useState<SectorSpend | null>(null);
  const [formData, setFormData] = useState<Partial<SectorSpend>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sector_spend'), (snapshot) => {
      const fetched: SectorSpend[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as SectorSpend);
      });
      setSectorSpends(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sector spend?')) return;
    try {
      await deleteDoc(doc(db, 'sector_spend', id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingSpend?.id || `sector_${Date.now()}`;
      const dataToSave = { 
        ...formData, 
        id, 
        updatedAt: new Date().toISOString() 
      } as SectorSpend;
      await setDoc(doc(db, 'sector_spend', id), dataToSave);
      setIsModalOpen(false);
      setEditingSpend(null);
      setFormData({});
    } catch (error) {
      console.error(error);
      alert('Failed to save.');
    }
  };

  const openCreateModal = () => {
    setEditingSpend(null);
    setFormData({ companies: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (spend: SectorSpend) => {
    setEditingSpend(spend);
    setFormData(spend);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-[#0f1a24] p-6 border border-white/5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold uppercase tracking-widest">Sector Spend Management</h3>
        <button onClick={openCreateModal} className="px-4 py-2 bg-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2563eb] flex items-center gap-2">
          <Plus size={14} /> Add Sector Spend
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">Sector ID</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">Total Spend</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">Updated</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sectorSpends.map(s => (
            <tr key={s.id}>
              <td className="px-4 py-3 text-sm">{s.id}</td>
              <td className="px-4 py-3 text-sm">${(s.totalSpend / 1000000000).toFixed(1)}B</td>
              <td className="px-4 py-3 text-xs text-slate-400">{new Date(s.updatedAt).toLocaleString()}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => openEditModal(s)} className="text-slate-400 hover:text-white mr-3"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-sm p-4">
          <div className="bg-[#0f1a24] p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Edit Sector Spend</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Sector ID" value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full p-2 bg-[#1a2633] border border-white/10 text-white focus:outline-none focus:border-[#3b82f6]/50" />
              <input required type="number" placeholder="Total Spend" value={formData.totalSpend || ''} onChange={e => setFormData({...formData, totalSpend: parseFloat(e.target.value)})} className="w-full p-2 bg-[#1a2633] border border-white/10 text-white focus:outline-none focus:border-[#3b82f6]/50" />
              <textarea required placeholder="Narrative" value={formData.narrative || ''} onChange={e => setFormData({...formData, narrative: e.target.value})} className="w-full p-2 bg-[#1a2633] border border-white/10 text-white focus:outline-none focus:border-[#3b82f6]/50" rows={4} />
              <button type="submit" className="w-full py-2 bg-[#3b82f6] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#2563eb]">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
