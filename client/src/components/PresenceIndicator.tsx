
'use client'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { useWebSocketContext } from '@/contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { ConnectedUsersCountPayload } from '@hypehub/types'

export const PresenceIndicator = () => {
    const {isConnected, latestEvent} = useWebSocketContext()
    // get connected users from ConnectedUsersCountPayload
    const [connectedUsers, setConnectedUsers] = useState<number>(0)

    useEffect(() => {
        if (!latestEvent) return;
        
        if (latestEvent.type === 'CONNECTED_USERS_COUNT') {
            const payload = latestEvent.payload as ConnectedUsersCountPayload
            setConnectedUsers(payload.count)
        }
    }, [latestEvent])

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='flex items-center gap-2'>
                        <Badge variant="secondary">Server Status</Badge>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {isConnected ? `🟢 Connected: ${connectedUsers} users` : '🔴 Disconnected'}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}