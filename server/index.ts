import { WebSocketServer, WebSocket } from 'ws';
import { HypeHubEvent, PresencePayload, ConnectedUsersCountPayload } from '@hypehub/types';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',');

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

interface CustomWebSocket extends WebSocket {
    isAlive: boolean;
}

const wss = new WebSocketServer({ 
    port: PORT,
    verifyClient: ({origin}: {origin?: string}) => {
        if (!origin) return true;
        return ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*');
    }
 });

let heartbeatInterval: NodeJS.Timeout | null = null;

const startHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
    }
// Heartbeat check
 heartbeatInterval = setInterval(() => {
    const connectedUsersCount = wss.clients.size;
    wss.clients.forEach((ws) => {
        const client = ws as CustomWebSocket;
        if (!client.isAlive) {
            console.log('Terminating inactive client');
            return client.terminate();
        }
        client.isAlive = false;
        client.ping();
        console.log('Sent ping to client');

        // Broadcast connected users count with heartbeat
        const counterEvent: HypeHubEvent = {
            type: 'CONNECTED_USERS_COUNT',
            payload: {
                count: connectedUsersCount,
                timestamp: new Date().toISOString()
            } as ConnectedUsersCountPayload
        };
        client.send(JSON.stringify(counterEvent));
    });
}, HEARTBEAT_INTERVAL);
};

const broadcastPresenceUpdate = (type: 'join' | 'leave', userId: number, displayName: string) => {
    const presenceEvent: HypeHubEvent = {
        type: 'PRESENCE_UPDATE',
        payload: {
            type,
            userId,
            displayName,
            timestamp: new Date().toISOString(),
            connectedUsers: wss.clients.size
        } as PresencePayload
    };

    wss.clients.forEach((client) => {
        console.log('Broadcasting presence update to client');
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(presenceEvent));
        }
    });
};

startHeartbeat();


wss.on('connection', (ws: CustomWebSocket) => {
    console.log('Client connected');
    const connectedUsersCount = wss.clients.size;
    const counterEvent: HypeHubEvent = {
        type: 'CONNECTED_USERS_COUNT',
        payload: {
            count: connectedUsersCount,
            timestamp: new Date().toISOString()
        } as ConnectedUsersCountPayload
    };
    ws.send(JSON.stringify(counterEvent));
    // Set up connection state
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
        console.log('Received pong from client');
    });
    
    // Handle messages
    ws.on('message', (data) => {
        // console.log('Received raw message:', data.toString())
        try {
            const message = JSON.parse(data.toString());
            // console.log('Parsed message:', message)
            // Handle user identification
            if (message.type === 'SYSTEM' && message.payload.userId) {
                broadcastPresenceUpdate('join', message.payload.userId, message.payload.displayName);
            }
            
            // Broadcast to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        } catch (error) {
            console.warn('Invalid message received:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    ws.on('error', console.error);
});


console.log(`WebSocket server running on ws://localhost:${PORT}`);
