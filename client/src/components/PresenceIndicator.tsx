'use client'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

export const PresenceIndicator = () => {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='flex items-center gap-2'>
                        <Badge variant="secondary">1 online</Badge>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    Connected
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
