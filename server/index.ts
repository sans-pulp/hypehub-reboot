import { WebSocketServer, WebSocket } from 'ws'
import { HypeHubEvent, PresencePayload } from '../client/src/utils/websocket'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080
const HEARTBEAT_INTERVAL = 30000 // 30 seconds

interface CustomWebSocket extends WebSocket {
    isAlive: boolean;
}

const wss = new WebSocketServer({ port: PORT })

let heartbeatInterval: NodeJS.Timeout | null = null;

const startHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
    }
// Heartbeat check
 heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        const client = ws as CustomWebSocket
        if (!client.isAlive) {
            console.log('Terminating inactive client')
            return client.terminate()
        }
        client.isAlive = false
        client.ping()
        console.log('Sent ping to client')
    })
}, HEARTBEAT_INTERVAL)
}

const broadcastPresenceUpdate = (type: 'join' | 'leave', userId: string, displayName: string) => {
    const presenceEvent: HypeHubEvent = {
        type: 'PRESENCE_UPDATE',
        payload: {
            type,
            userId,
            displayName,
            timestamp: new Date().toISOString(),
            connectedUsers: wss.clients.size
        } as PresencePayload
    }

    wss.clients.forEach((client) => {
        console.log('Broadcasting presence update to client')
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(presenceEvent))
        }
    })
}

startHeartbeat()


wss.on('connection', (ws: CustomWebSocket) => {
    console.log('Client connected')
    
    // Set up connection state
    ws.isAlive = true
    ws.on('pong', () => {
        ws.isAlive = true
        console.log('Received pong from client')
    })
    
    // Handle messages
    ws.on('message', (data) => {
        // console.log('Received raw message:', data.toString())
        try {
            const message = JSON.parse(data.toString())
            // console.log('Parsed message:', message)
            // Handle user identification
            if (message.type === 'SYSTEM' && message.payload.userId) {
                broadcastPresenceUpdate('join', message.payload.userId, message.payload.displayName)
            }
            
            // Broadcast to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message))
                }
            })
        } catch (error) {
            console.warn('Invalid message received:', error)
        }
    })

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected')
    })
    ws.on('error', console.error)
})


console.log(`WebSocket server running on ws://localhost:${PORT}`)
