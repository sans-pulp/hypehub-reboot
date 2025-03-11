import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
import { GoalFormFieldProps } from "@/components/goal-creation/types"

export const GoalFormField = ({ label, placeholder, type, value, onChange }: GoalFormFieldProps) => {
    return (
        <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor={label.split(' ').join('').toLowerCase()} className="text-left font-medium">
                {label}
            </Label>
            <Input id={label.split(' ').join('').toLowerCase()} type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}