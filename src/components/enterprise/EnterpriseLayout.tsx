import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Database } from 'lucide-react';

export const EnterpriseLayout = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Enterprise Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Database size={16} className="text-white" />
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <span className="font-semibold tracking-wide text-sm text-slate-200">Constraint Monitor Data</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-xs text-slate-400">{user?.email || 'Enterprise User'}</span>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <Outlet />
      </main>
    </div>
  );
};
