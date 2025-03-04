import { WebSocketServer, WebSocket } from 'ws'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080
const wss = new WebSocketServer({port: PORT})

// Extend WebSocket type to include our custom property
interface HypeHubWebSocket extends WebSocket {
    isAlive: boolean;
}

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

wss.on('connection', (ws: HypeHubWebSocket) => {
    console.log('Client connected')

    // on initial connection, set isAlive to true
    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);

    // handle incoming messages
    ws.on('message', (data) => {
        console.log(`Received message => ${data.toString()}`)
        // echo/broadcast message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(`Broadcast: ${data.toString()}`)
            }
        }) 
    })
    // handle errors
    ws.on('error', console.error)

    // send initial message
    ws.send('Hello from server!')

    // handle client DC
    ws.on('close', () => {
        console.log('Client disconnected')
    })

})

// setup heartbeat interval for clients
const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        const hypehubWs = ws as HypeHubWebSocket;
        if (hypehubWs.isAlive) {
            hypehubWs.ping()
            hypehubWs.isAlive = false;
        }
        else {
            console.log('Client terminated due to failed heartbeat');
            hypehubWs.terminate();
        }
    })
}, HEARTBEAT_INTERVAL);

// clear interval on server close
wss.on('close', () => {
    clearInterval(heartbeatInterval);
})
console.log(`WebSocket server is running on wss://localhost:${PORT}`)
