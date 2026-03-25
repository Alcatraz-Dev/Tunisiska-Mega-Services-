'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSettings } from '@/app/admin/actions';

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const refreshSettings = async () => {
    const data = await getSettings();
    if (data) setSettings(data);
  };

  // Broadcaster function for when we manually refresh from this provider
  const broadcastUpdate = () => {
    if (channelRef.current) {
      channelRef.current.postMessage('settings_updated');
    }
  };

  // Wrapped refresh that also tells other tabs to update
  const syncRefresh = async () => {
    await refreshSettings();
    broadcastUpdate();
  };

  useEffect(() => {
    refreshSettings();

    // Setup cross-tab synchronization
    if (typeof window !== 'undefined') {
      const channel = new BroadcastChannel('settings_sync');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data === 'settings_updated') {
          // Another tab updated settings, so we should refresh too
          refreshSettings();
        }
      };

      // Also refresh when tab becomes visible after being in background
      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          refreshSettings();
        }
      };

      window.addEventListener('visibilitychange', handleVisibility);

      return () => {
        channel.close();
        window.removeEventListener('visibilitychange', handleVisibility);
      };
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: syncRefresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
