// Interacting with the functional based createWebSocket in utils/

import { useEffect, useRef, useState, useCallback } from 'react';
import { createWebSocket, HypeHubEvents } from '../utils/websocket';

export function useWebSocket(url: string) {
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<HypeHubEvents[]>([]);
    const wsRef = useRef<ReturnType<typeof createWebSocket> | null>(null);

    useEffect(() => {
        wsRef.current = createWebSocket(url, {
            onOpen: () => setIsConnected(true),
            onClose: () => setIsConnected(false),
            onMessage: (event) => {
                setEvents((prevEvents) => [...prevEvents, event.data]);
            },
            onError: (error) => {
                console.error("WebSocket error: ", error); 
                setIsConnected(false)
            }
        });

        return () => {
            wsRef.current?.close();
        };
    }, [url]);

    const sendHypeHubEvent = useCallback((message: HypeHubEvents) => {
        wsRef.current?.send(message);
    }, []);

    return {
        isConnected,
        events,
        sendHypeHubEvent
    };
}