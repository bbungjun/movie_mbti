'use client';

import React, { createContext, useContext } from 'react';
import { useTasteTest as useTasteTestHook } from '../hooks/useTasteTest';

type TasteTestContextType = ReturnType<typeof useTasteTestHook>;

const TasteTestContext = createContext<TasteTestContextType | null>(null);

export function TasteTestProvider({ children }: { children: React.ReactNode }) {
  const value = useTasteTestHook();
  return (
    <TasteTestContext.Provider value={value}>
      {children}
    </TasteTestContext.Provider>
  );
}

export function useTasteTest() {
  const context = useContext(TasteTestContext);
  if (!context) {
    throw new Error('useTasteTest must be used within a TasteTestProvider');
  }
  return context;
}
