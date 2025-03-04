export type HypeHubEvent = {
    type: 'SYSTEM' | 'LEVEL_UP' | 'ACHIEVEMENT' | 'GOAL_COMPLETED' | 'CHAT_MESSAGE';
    payload: any;
}

type WebSocketHandlers = {
    onMessage?: (event: HypeHubEvent) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
}

export const createWebSocket = (url: string, handlers: WebSocketHandlers = {}) => {
    const ws = new WebSocket(url)
    
    // Handle messages
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            const message: HypeHubEvent = {
                type: data.type || 'SYSTEM',
                payload: data.payload || data
            }
            handlers.onMessage?.(message)
        } catch (error) {
            console.warn('Failed to parse message:', error)
        }
    }

    // Handle connection events
    ws.onopen = () => handlers.onOpen?.()
    ws.onclose = () => handlers.onClose?.()
    ws.onerror = (error) => handlers.onError?.(error)

    // Return WebSocket interface
    return {
        send: (message: HypeHubEvent): boolean => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message))
                return true
            }
            return false
        },
        close: () => ws.close(),
        getStatus: () => ws.readyState
    }
}
