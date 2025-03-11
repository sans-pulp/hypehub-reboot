declare global {
    interface WebSocket {
        onping: (event: Event) => void;
        pong(): void;
    }
}

export interface SystemPayload {
    message: string;
    timestamp: string;
    userId?: string;
    displayName?: string;
}

export interface LevelUpPayload {
    id: number;
    level: number;
    userId: string;
    displayName: string;
}

export interface AchievementPayload {
    userId: string;
    achievementName: string;
    timestamp: string;
}

export interface GoalCompletedPayload {
    goalName: string;
    timestamp: string;
    userId: string;
    goalType: string;
}

export interface ChatMessagePayload {
    userId: string;
    displayName: string;
    message: string;
    timestamp: string;
}

export interface PresencePayload {
    type: 'join' | 'leave';
    userId: string;
    displayName: string;
    timestamp: string;
    connectedUsers: number;
}

export type HypeHubPayload = 
    | SystemPayload 
    | LevelUpPayload 
    | AchievementPayload 
    | GoalCompletedPayload 
    | ChatMessagePayload 
    | PresencePayload;

export type HypeHubEvent = {
    type: 'SYSTEM' | 'LEVEL_UP' | 'ACHIEVEMENT' | 'GOAL_COMPLETED' | 'CHAT_MESSAGE' | 'PRESENCE_UPDATE';
    payload: HypeHubPayload;
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
