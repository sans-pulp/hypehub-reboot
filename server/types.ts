export type HypeHubEvent = {
    type: 'SYSTEM' | 'LEVEL_UP' | 'ACHIEVEMENT' | 'GOAL_COMPLETED' | 'CHAT_MESSAGE' | 'PRESENCE_UPDATE';
    payload: any;
}

export interface PresencePayload {
    type: 'join' | 'leave';
    userId: string;
    displayName: string;
    timestamp: string;
    connectedUsers: number
} 