import { ATTRIBUTE_POINTS_LIMITS } from '@/components/ui/constants'

export const GoalPointsGuide = ({ type }: { type: string }) => {
    const limits = ATTRIBUTE_POINTS_LIMITS[type.toLowerCase() as keyof typeof ATTRIBUTE_POINTS_LIMITS];
    
    return (
        <div className="text-sm text-muted-foreground mt-2">
            <p>Point range for {type} goals: {limits.min}-{limits.max} points per attribute</p>
        </div>
    )
}