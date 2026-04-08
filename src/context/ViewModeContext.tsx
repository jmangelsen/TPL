import React, { createContext, useState, useEffect } from 'react';

export type ViewMode = 'admin' | 'free' | 'essentials' | 'pro';

interface ViewModeContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>('admin');

  useEffect(() => {
    const storedMode = localStorage.getItem('tpl_view_mode') as ViewMode;
    if (storedMode && ['admin', 'free', 'essentials', 'pro'].includes(storedMode)) {
      setViewModeState(storedMode);
    }
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('tpl_view_mode', mode);
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};
