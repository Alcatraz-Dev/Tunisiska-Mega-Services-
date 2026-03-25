'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '@/app/admin/actions';

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);

  const refreshSettings = async () => {
    const data = await getSettings();
    if (data) setSettings(data);
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
