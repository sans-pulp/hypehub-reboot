declare global {
    interface WebSocket {
        onping: (event: Event) => void;
        pong(): void;
    }
}

export interface SystemPayload {
    message: string;
    timestamp: string;
    userId?: number;
    displayName?: string;
}

export interface LevelUpPayload {
    level: number;
    userId: number;
    displayName: string;
}

export interface AchievementPayload {
    userId: number;
    achievementName: string;
    timestamp: string;
}

export interface GoalCompletedPayload {
    goalName: string;
    timestamp: string;
    userId: number;
    goalType: string;
}

export interface ChatMessagePayload {
    userId: number;
    displayName: string;
    message: string;
    timestamp: string;
}

export interface PresencePayload {
    type: 'join' | 'leave';
    userId: number;
    displayName: string;
    timestamp: string;
    connectedUsers: number;
}

export interface ConnectedUsersCountPayload {
    count: number;
    timestamp: string;
}

export type HypeHubPayload = 
    | SystemPayload 
    | LevelUpPayload 
    | AchievementPayload 
    | GoalCompletedPayload 
    | ChatMessagePayload 
    | PresencePayload
    | ConnectedUsersCountPayload;

export type HypeHubEvent = {
    type: 'SYSTEM' | 'LEVEL_UP' | 'ACHIEVEMENT' | 'GOAL_COMPLETED' | 'CHAT_MESSAGE' | 'PRESENCE_UPDATE' | 'CONNECTED_USERS_COUNT';
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
