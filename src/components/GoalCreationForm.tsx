'use client'
import { AttributeTypes } from "@/db/schema"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Checkbox } from "./ui/checkbox"
   
const goalTypes = ['Daily', 'Mission', 'Quest']
const SelectGoalType = () => {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select goal type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {goalTypes.map((goalType) => (
              <SelectItem key={goalType} value={goalType}>
                  {goalType}
              </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const AttributeCheckboxes = ({ selectedAttributes, onChange }: {
  selectedAttributes: string[],
  onChange: (attributes: string[]) => void
}) => {
  // Convert AttributeTypes object to array for easier mapping
  const attributeOptions = Object.values(AttributeTypes);
  
  const handleToggleAttribute = (attribute: string) => {
    if (selectedAttributes.includes(attribute)) {
      // Remove attribute if already selected
      onChange(selectedAttributes.filter(a => a !== attribute));
    } else {
      // Add attribute if not selected
      onChange([...selectedAttributes, attribute]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {attributeOptions.map((attribute) => (
        <div key={attribute} className="flex items-center">
          <input
            type="checkbox"
            id={`attribute-${attribute}`}
            checked={selectedAttributes.includes(attribute)}
            onChange={() => handleToggleAttribute(attribute)}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor={`attribute-${attribute}`} className="capitalize text-sm sm:text-base">
            {attribute.slice(0, 3).toUpperCase()}
          </label>
        </div>
      ))}
    </div>
  );
};

export const GoalCreationForm = ({profileId}: {profileId: number}) => {
    console.log("profileId", profileId)
    // form for creating a new goal
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Create Goal</span>
                    <span className="sm:hidden">New</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-3xl p-6">
                <DialogHeader>
                    <DialogTitle>Create Goal</DialogTitle>
                    <DialogDescription>
                        Create a new goal to work towards. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="goalName" className="text-left font-medium">
                            Name
                        </Label>
                        <Input id="goalName" placeholder="Name of Goal" className="w-full" />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="goalDescription" className="text-left font-medium">
                            Description
                        </Label>
                        <Input id="goalDescription" placeholder="Description of Goal" className="w-full" />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="goalType" className="text-left font-medium">
                            Type
                        </Label>
                        <div className="w-full">
                            <SelectGoalType />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 items-start gap-2">
                        <Label htmlFor="goalAttributes" className="text-left font-medium pt-1">
                            Attributes
                        </Label>
                        <div className="w-full">
                            <AttributeCheckboxes 
                                selectedAttributes={selectedAttributes} 
                                onChange={setSelectedAttributes} 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="goalReward" className="text-left font-medium">
                            Reward
                        </Label>
                        <Input id="goalReward" placeholder="Reward for Goal" className="w-full" />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
