import { WebSocketServer, WebSocket } from 'ws'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080
const HEARTBEAT_INTERVAL = 30000 // 30 seconds

interface CustomWebSocket extends WebSocket {
    isAlive: boolean;
}

const wss = new WebSocketServer({ port: PORT })

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
        console.log('Received raw message:', data.toString())
        try {
            const message = JSON.parse(data.toString())
            console.log('Parsed message:', message)
            
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
    ws.on('close', () => console.log('Client disconnected'))
    ws.on('error', console.error)
})

// Heartbeat check
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!(ws as CustomWebSocket).isAlive) {
            console.log('Terminating inactive client')
            return ws.terminate()
        }
        (ws as CustomWebSocket).isAlive = false
        ws.ping()
        console.log('Sent ping to client')
    })
}, HEARTBEAT_INTERVAL)

console.log(`WebSocket server running on ws://localhost:${PORT}`)
