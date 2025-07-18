import { createContext, useContext, useState, type ReactNode } from 'react';

interface LayoutContextType {
  showBottomNav: boolean;
  setShowBottomNav: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [showBottomNav, setShowBottomNav] = useState(true);

  return (
    <LayoutContext.Provider value={{ showBottomNav, setShowBottomNav }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
