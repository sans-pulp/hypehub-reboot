import { HypeHubEvent } from "@hypehub/types";

declare global {
    interface WebSocket {
        onping: (event: Event) => void;
        pong(): void;
    }
}


export const createWebSocket = (url: string, onMessage: (event: HypeHubEvent) => void) => {
    const ws = new WebSocket(url)
    
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            onMessage({
                type: data.type || 'SYSTEM',
                payload: data.payload || data
            })
        } catch (error) {
            console.warn('Failed to parse message:', error)
        }
    }

    // Respond to server's ping with pong
    ws.onping = () => {
        ws.pong()
    }

    return {
        socket: ws,
        send: (message: HypeHubEvent): boolean => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message))
                return true
            }
            return false
        },
        close: () => ws.close()
    }
}
