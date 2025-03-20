import { useState, useEffect } from 'react';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import type { ConnectedUsersCountPayload } from '@hypehub/types';

export const useConnectedUsers = () => {
  const { latestEvent } = useWebSocketContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (latestEvent?.type === "CONNECTED_USERS_COUNT") {
      setCount((latestEvent.payload as ConnectedUsersCountPayload).count);
    }
  }, [latestEvent]);

  return count;
}; 