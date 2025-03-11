import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { GOAL_TYPES } from "@/components/goal-creation/constants"
import { SelectGoalTypeProps } from "@/components/goal-creation/types"

export  const SelectGoalType = ({ setGoalType }: SelectGoalTypeProps) => {
    return (
      <Select onValueChange={setGoalType} defaultValue={GOAL_TYPES[0]}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select goal type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {GOAL_TYPES.map((goalType) => (
                <SelectItem key={goalType} value={goalType} >
                    {goalType}
                </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  