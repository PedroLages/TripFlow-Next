import { useCallback, useRef, useState } from 'react';
import type { CameraRequest, CameraPriority } from '@/types/map';

const PRIORITY_RANK: Record<CameraPriority, number> = {
  idle: 0,
  'day-select': 1,
  'item-select': 2,
  'user-interaction': 3,
  exclusive: 4,
};

export function useCameraDirector() {
  const [currentRequest, setCurrentRequest] = useState<CameraRequest | null>(null);
  const lastPriorityRef = useRef<number>(-1);

  const requestCamera = useCallback((request: CameraRequest) => {
    const rank = PRIORITY_RANK[request.priority];
    // Accept if same or higher priority than current
    if (rank >= lastPriorityRef.current) {
      lastPriorityRef.current = rank;
      setCurrentRequest(request);

      // Auto-decay priority after animation completes
      // so lower-priority requests can take over
      const duration = request.duration ?? 600;
      setTimeout(() => {
        lastPriorityRef.current = Math.max(0, rank - 1);
      }, duration + 100);
    }
  }, []);

  const clearRequest = useCallback(() => {
    setCurrentRequest(null);
    lastPriorityRef.current = -1;
  }, []);

  return { currentRequest, requestCamera, clearRequest };
}
