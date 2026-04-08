import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  LogOut, 
  RefreshCw, 
  Search,
  Download,
  Calendar,
  Building2,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore/lite';

interface Subscriber {
  id: string;
  email: string;
  date: string;
}

interface ReportRequest {
  id: string;
  persona: string;
  name: string;
  email: string;
  organization: string;
  instructions: string;
  date: string;
}

export const AdminDashboard: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [requests, setRequests] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'subscribers' | 'requests'>('subscribers');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Subscribers
      const subSnap = await getDocs(query(collection(db, 'subscribers'), orderBy('date', 'desc'), limit(100)));
      const subData = subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscriber));
      setSubscribers(subData);

      // Fetch Requests
      const reqSnap = await getDocs(query(collection(db, 'report_requests'), orderBy('date', 'desc'), limit(100)));
      const reqData = reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReportRequest));
      setRequests(reqData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.persona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#000000] font-sans">
      {/* Sidebar / Header */}
      <nav className="bg-black text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-50 relative overflow-hidden">
        {/* Topography Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4]" />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-bold">TPL</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight leading-none">Admin Control</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Infrastructure Intelligence Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={fetchData}
            className="p-2 hover:bg-white/10 transition-colors rounded-full"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all text-[10px] font-bold uppercase tracking-widest border border-white/10"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Users size={20} className="text-[#2D3748]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel">Total Subscribers</span>
            </div>
            <p className="text-4xl font-bold tracking-tighter">{subscribers.length}</p>
          </div>
          <div className="bg-white p-6 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <FileText size={20} className="text-[#2D3748]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel">Report Requests</span>
            </div>
            <p className="text-4xl font-bold tracking-tighter">{requests.length}</p>
          </div>
          <div className="bg-white p-6 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 size={20} className="text-[#2D3748]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel">Conversion Rate</span>
            </div>
            <p className="text-4xl font-bold tracking-tighter">
              {subscribers.length > 0 ? ((requests.length / subscribers.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10 pb-6">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('subscribers')}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'subscribers' ? 'bg-black text-white' : 'bg-white text-black border border-black/10 hover:bg-black/5'}`}
            >
              Subscribers
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-black text-white' : 'bg-white text-black border border-black/10 hover:bg-black/5'}`}
            >
              Report Requests
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tpl-steel" size={16} />
            <input 
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-black/10 focus:outline-none focus:border-black transition-all text-sm"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <RefreshCw size={32} className="animate-spin text-tpl-steel" />
              <p className="text-xs font-bold uppercase tracking-widest text-tpl-steel">Loading Intelligence...</p>
            </div>
          ) : activeTab === 'subscribers' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/5 border-b border-black/10">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-tpl-steel">Email Address</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-tpl-steel">Subscription Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-tpl-steel text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{sub.email}</td>
                      <td className="px-6 py-4 text-xs text-tpl-steel">
                        {new Date(sub.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-tpl-steel hover:text-black transition-colors">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSubscribers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-sm italic text-tpl-steel">No subscribers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {filteredRequests.map((req) => (
                <div key={req.id} className="p-6 hover:bg-black/[0.02] transition-colors space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest">
                          {req.persona}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel">
                          {new Date(req.date).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold tracking-tight uppercase">{req.name}</h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-tpl-steel">
                        <Building2 size={14} />
                        {req.organization}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-tpl-steel">
                        <Mail size={14} />
                        {req.email}
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/5 p-4 border-l-2 border-black">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel mb-2">Instructions / Scope</p>
                    <p className="text-sm text-tpl-slate italic leading-relaxed">{req.instructions}</p>
                  </div>
                </div>
              ))}
              {filteredRequests.length === 0 && (
                <div className="p-20 text-center text-sm italic text-tpl-steel">No report requests found.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
