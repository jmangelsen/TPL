import React, { useContext } from 'react';
import { ViewModeContext, ViewMode } from '../../context/ViewModeContext';
import { isAdminEmail } from '../../lib/adminUtils';

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'admin',      label: 'Admin (true view)' },
  { value: 'free',       label: 'View as Free' },
  { value: 'essentials', label: 'View as Essentials' },
  { value: 'pro',        label: 'View as Pro' },
];

export function ViewModeToggle({ userEmail, isDarkNavPage }: { userEmail?: string, isDarkNavPage?: boolean }) {
  const ctx = useContext(ViewModeContext);
  if (!ctx) return null;
  if (!isAdminEmail(userEmail)) return null;

  const { viewMode, setViewMode } = ctx;

  return (
    <div className={`flex items-center space-x-2 rounded-full text-xs px-3 py-1 border ${
      isDarkNavPage 
        ? 'bg-tpl-ink text-tpl-bg border-tpl-bg/20 md:bg-[#0f1a24] md:text-slate-900 md:border-black/20' 
        : 'bg-tpl-ink text-tpl-bg border-tpl-bg/20'
    }`}>
      <span className="font-bold uppercase tracking-widest text-[9px] opacity-70">Viewing as:</span>
      <select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value as ViewMode)}
        className="bg-transparent border-none text-xs focus:outline-none font-bold cursor-pointer"
      >
        {VIEW_MODES.map((m) => (
          <option key={m.value} value={m.value} className="text-white bg-[#1a2633]">
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
