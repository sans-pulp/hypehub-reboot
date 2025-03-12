// Interacting with the functional based createWebSocket in utils/

import { useState, useEffect, useRef, useCallback } from 'react'
import { createWebSocket } from '../utils/websocket'
import { HypeHubEvent } from '@hypehub/types'

export function useWebSocket(url: string) {
    const [isConnected, setIsConnected] = useState(false)
    const [latestEvent, setLatestEvent] = useState<HypeHubEvent | null>(null)
    const wsRef = useRef<ReturnType<typeof createWebSocket> | null>(null)

    useEffect(() => {
        if (wsRef.current) {
            wsRef.current.close()
        }

        const ws = createWebSocket(url, (event) => {
            // Handle messages here if needed
            console.log('Received:', event)
            setLatestEvent(event)
        })

        ws.socket.onopen = () => {
            console.log('WebSocket connected')
            setIsConnected(true)
        }

        ws.socket.onclose = () => {
            console.log('WebSocket disconnected')
            setIsConnected(false)
        }

        // Set initial connection state
        setIsConnected(ws.socket.readyState === WebSocket.OPEN)
        wsRef.current = ws

        return () => {
            ws.close()
            wsRef.current = null
            setIsConnected(false)
        }
    }, [url])

    const send = useCallback((event: HypeHubEvent) => {
        if (!wsRef.current?.socket || wsRef.current.socket.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket not connected')
            return false
        }
        return wsRef.current.send(event)
    }, [])

    return {
        isConnected,
        latestEvent,
        send
    }
}
