// WebSocket Message Types

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
