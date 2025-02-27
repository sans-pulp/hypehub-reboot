import {GOAL_TYPES} from "./constants";
import { AttributeType } from "@/db/schema";
export type GoalType = typeof GOAL_TYPES[number]

export interface GoalFormData {
    name: string;
    description: string;
    type: GoalType;
    attributes: AttributeType[];
    attributePoints: Record<AttributeType, number>;
    targetDate: string;
}

// Props interfaces for sub-components
export interface AttributeCheckboxesProps {
    attributePoints: Record<AttributeType, number>;
    selectedAttributes: AttributeType[];
    onChange: (attributes: AttributeType[]) => void;
    setAttributePoints: (points: Record<AttributeType, number>) => void;
}

export interface GoalFormFieldProps {
    label: string;
    placeholder: string;
    value: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectGoalTypeProps {
    setGoalType: (goalType: GoalType) => void;
}

export interface TargetDateFieldProps {
    goalType: GoalType;
    targetDate: string;
    setTargetDate: (date: string) => void;
}