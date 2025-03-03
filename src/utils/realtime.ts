// MVP 1: Basic Infrastructure
// track who's online via profilesTable
// handle connection status indicators and basic health checks with broadcastChannel
import {createClient} from './supabase/client'
import { REALTIME_PRESENCE_LISTEN_EVENTS, REALTIME_SUBSCRIBE_STATES, REALTIME_CHANNEL_STATES, REALTIME_LISTEN_TYPES, RealtimeChannel } from '@supabase/supabase-js'

export const REALTIME_EVENTS = {
  CONNECTION: {
    STATUS: 'connection:status'
  },
  SYSTEM: {
    GAME_EVENT: 'system:game-event',
    ANNOUNCEMENT: 'system:announcement'
  }
} as const

const supabase = createClient()

// Initialize channels
const hypeHubPresenceChannel = supabase.channel('hypehub-online-presence', {
  config: { presence: { key: 'userList' } },
})
const hypeHubBroadcastChannel = supabase.channel('hypehub-broadcast')

const setupPresenceHandlers = () => {
    hypeHubPresenceChannel
    .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC }, () => {
        const presenceState = hypeHubPresenceChannel.presenceState()
        // Components can directly use presenceState for online users
    })
    .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN }, () => {
        const presenceState = hypeHubPresenceChannel.presenceState()
        // Handle user joined
    })
    .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE }, () => {
        const presenceState = hypeHubPresenceChannel.presenceState()
        // Handle user left
    })
}

const setupBroadcastHandlers = () => {
    hypeHubBroadcastChannel
    .on(REALTIME_LISTEN_TYPES.BROADCAST, {event: REALTIME_EVENTS.CONNECTION.STATUS}, ({payload}) => {
        // handle received connection status updates. ex: update ui, trigger notifications, etc
        console.log('Connection status:', payload)
    })
    .on(REALTIME_LISTEN_TYPES.BROADCAST, {event: REALTIME_EVENTS.SYSTEM.GAME_EVENT}, ({payload}) => {
        // handle  game events. ex: level up, attribute gains, goal completions, etc
        console.log('Game event:', payload)
    })
    .on(REALTIME_LISTEN_TYPES.BROADCAST, {event: REALTIME_EVENTS.SYSTEM.ANNOUNCEMENT}, ({payload}) => {
        // Handle system-wide announcements for all online users
        console.log('Announcement:', payload)
    })
}

// Connection Broadcast senders
export const broadcastConnection = {
    sendStatus: (userId: string, status: 'online' | 'offline') => {
        return hypeHubBroadcastChannel.send({
            type: 'broadcast',
            event: REALTIME_EVENTS.CONNECTION.STATUS,
            payload: {userId, status, timestamp: new Date().toISOString()}
        })
    }
}

// System Broadcast senders
export const broadcastSystem = {
    sendGameEvent(eventName: string, eventData: Record<string, any>) {
        return hypeHubBroadcastChannel.send({
            type: 'broadcast',
            event: REALTIME_EVENTS.SYSTEM.GAME_EVENT,
            payload: {
                name: eventName,
                data: eventData,
                timestamp: new Date().toISOString()
            }
        })
    },
    sendAnnouncement(title: string, message: string) {
        return hypeHubBroadcastChannel.send({
            type: 'broadcast',
            event: REALTIME_EVENTS.SYSTEM.ANNOUNCEMENT,
            payload: {
                title,
                message,
                timestamp: new Date().toISOString()
            }
        })
    }
}
// Broadcast: connection status updates, system-wide state changes, simple status indicators, one-way communication flow
// Presence: who else is online, user-to-user interactions, real-time user lists, multi-user state tracking



export const initializeHypeHubRealtime = () => {
    setupPresenceHandlers()
    hypeHubPresenceChannel.subscribe()
}

// Export methods to get presence info
export const getPresenceState = () => hypeHubPresenceChannel.presenceState()
export const getChannelState = () => hypeHubPresenceChannel.state
hypeHubPresenceChannel.state
