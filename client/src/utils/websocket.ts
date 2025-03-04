export type HypeHubEvents = {
    type: 'LEVEL_UP' | 'ACHIEVEMENT' | 'GOAL_COMPLETED' | 'CHAT_MESSAGE';
    payload: any;
};

type WebSocketHandlers = {
    onMessage?: (event: MessageEvent<HypeHubEvents>) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: ErrorEvent) => void;
};

const PING_TIMEOUT = 31000; // 30 seconds + 1 second grace period to account for latency

export const createWebSocket = (url: string, handlers: WebSocketHandlers = {}) => {
    const ws = new WebSocket(url);
    let pingTimeout: NodeJS.Timeout;

    const heartbeat = () => {
        clearTimeout(pingTimeout);
        
        pingTimeout = setTimeout(() => {
            console.log('connection lost, terminating connection');
            ws.close();
        }, PING_TIMEOUT);
    }
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handlers.onMessage?.(data);
    }
    ws.onopen = () => {
        handlers.onOpen?.(); 
        heartbeat(); // start heartbeat on connection
    }
  
    ws.onclose = () =>{ 
        clearTimeout(pingTimeout); // clean up timeout on close
        handlers.onClose?.(); 
    }
    ws.onerror = (error) => {
        clearTimeout(pingTimeout); // clean up timeout on error
        handlers.onError?.(error as ErrorEvent);
    }
    // handle server pings
    ws.addEventListener('ping', heartbeat);

    return {
        send: (message: HypeHubEvents) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(message)),
        close: () => {
            clearTimeout(pingTimeout);
            ws.close()
        },
        getStatus: () => ws.readyState
    };
};