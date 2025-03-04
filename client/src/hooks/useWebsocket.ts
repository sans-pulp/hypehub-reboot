// Interacting with the functional based createWebSocket in utils/

import { useState, useEffect, useRef, useCallback } from 'react'
import { createWebSocket, HypeHubEvent } from '../utils/websocket'

export function useWebSocket(url: string) {
    const [isConnected, setIsConnected] = useState(false)
    const [events, setEvents] = useState<HypeHubEvent[]>([])
    const wsRef = useRef<ReturnType<typeof createWebSocket> | null>(null)

    useEffect(() => {
        // Create WebSocket connection
        wsRef.current = createWebSocket(url, {
            onOpen: () => setIsConnected(true),
            onClose: () => setIsConnected(false),
            onMessage: (event) => setEvents(prev => [...prev, event]),
            onError: () => setIsConnected(false)
        })

        // Cleanup on unmount
        return () => wsRef.current?.close()
    }, [url])

    const sendHypeHubEvent = useCallback((event: HypeHubEvent) => {
        if (!wsRef.current) {
            console.warn('WebSocket not initialized');
            return false;
        }
        console.log('Sending HypeHub event:', event);
        return wsRef.current.send(event); 
    }, [])

    return {
        isConnected,
        events,
        sendHypeHubEvent
    }
}
