'use client';

import { useEffect } from 'react';
import { useAuthStore } from './store';

export const useAuthSession = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const initializeFromStorage = useAuthStore((state) => state.initializeFromStorage);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return {
    accessToken,
    user,
    setUser,
    logout,
    isHydrated,
    isAuthenticated: Boolean(accessToken),
  };
};
