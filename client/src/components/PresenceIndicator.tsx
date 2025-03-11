'use client'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { useWebSocketContext } from '@/WebSocketContext'

export const PresenceIndicator = () => {
    const {isConnected} = useWebSocketContext()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='flex items-center gap-2'>
                        <Badge variant="secondary">Status</Badge>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
