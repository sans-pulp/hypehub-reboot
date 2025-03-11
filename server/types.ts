export type HypeHubEvent = {
    type: 'SYSTEM' | 'LEVEL_UP' | 'ACHIEVEMENT' | 'GOAL_COMPLETED' | 'CHAT_MESSAGE' | 'PRESENCE_UPDATE' | 'CONNECTED_USERS_COUNT';
    payload: any;
}

export interface PresencePayload {
    type: 'join' | 'leave';
    userId: string;
    displayName: string;
    timestamp: string;
    connectedUsers: number
} 

export interface ConnectedUsersCountPayload {
    count: number;
    timestamp: string;
}