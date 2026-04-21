import { useCallback } from 'react';
import { useApp } from './use-app';

export function useSendToolListChanged(): () => Promise<void> {
  const app = useApp();
  return useCallback(async () => {
    if (!app) {
      console.warn('[useSendToolListChanged] App not connected');
      return;
    }
    await app.sendToolListChanged();
  }, [app]);
}
