import { useCallback, useMemo, useState } from 'react';
import type { PaddingRect, PaddingRegistration } from '@/types/map';

export function usePaddingProvider() {
  const [registrations, setRegistrations] = useState<PaddingRegistration[]>([]);

  const registerPadding = useCallback((reg: PaddingRegistration) => {
    setRegistrations(prev => {
      const filtered = prev.filter(r => r.id !== reg.id);
      return [...filtered, reg];
    });
  }, []);

  const unregisterPadding = useCallback((id: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
  }, []);

  const padding: PaddingRect = useMemo(() => {
    if (registrations.length === 0) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }
    return registrations.reduce(
      (acc, reg) => ({
        top: Math.max(acc.top, reg.rect.top),
        right: Math.max(acc.right, reg.rect.right),
        bottom: Math.max(acc.bottom, reg.rect.bottom),
        left: Math.max(acc.left, reg.rect.left),
      }),
      { top: 0, right: 0, bottom: 0, left: 0 }
    );
  }, [registrations]);

  return { padding, registerPadding, unregisterPadding };
}
