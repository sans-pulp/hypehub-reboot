import { GOAL_TYPES } from "@/components/ui/constants";
import { AttributeType } from "@/db/schema";

/**
 * Type representing the possible goal types (Daily, Mission, Quest)
 */
export type GoalType = typeof GOAL_TYPES[number];

/**
 * Type representing the possible attribute types (Strength, Vitality, etc.)
 */

/**
 * Interface for goal form data used in goal creation/editing
 */
export interface GoalFormData {
    name: string;
    description: string;
    type: GoalType;
    attributes: AttributeType[];
    attributePoints: Partial<Record<AttributeType, number>>;
    targetDate: string;
}

/**
 * Interface for goal template data used in quick goal creation
 */
export interface GoalTemplate {
    name: string;
    description: string;
    type: GoalType;
    attributes: AttributeType[];
    attributePoints: Partial<Record<AttributeType, number>>;
}

/**
 * Props interface for attribute selection components
 */
export interface AttributeSelectionProps {
    selectedAttributes: AttributeType[];
    attributePoints: Partial<Record<AttributeType, number>>;
    onAttributeToggle: (attribute: AttributeType) => void;
    onPointsChange: (attribute: AttributeType, points: number) => void;
}

/**
 * Props interface for goal creation/editing components
 */
export interface GoalFormProps {
    profileId: number;
    onGoalCreated: () => void;
    initialData?: Partial<GoalFormData>;
}

/**
 * Props interface for goal display components
 */
export interface GoalDisplayProps {
    goalId: number;
    name: string;
    description: string;
    type: GoalType;
    attributes: AttributeType[];
    attributePoints: Partial<Record<AttributeType, number>>;
    targetDate: string;
    isComplete: boolean;
    onComplete?: (goalId: number) => void;
} 