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
            {/* <SelectLabel>Goal Type</SelectLabel> */}
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
      <div className="flex flex-row">
        {attributeOptions.map((attribute) => (
          <div key={attribute} className="flex mr-4">
            <Checkbox 
            className="mr-2 h-4 w-4"
            id={`attribute-${attribute}`}
            checked={selectedAttributes.includes(attribute)}
            onCheckedChange={() => handleToggleAttribute(attribute)}
            />
            <label htmlFor={`attribute-${attribute}`} className="capitalize">
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
                    <Plus />
                    Create Goal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1080px]">
                <DialogHeader>
                    <DialogTitle>Create Goal</DialogTitle>
                    <DialogDescription>
                        Create a new goal to work towards. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalName" className="text-right">
                            Name
                        </Label>
                        <Input id="goalName" value="Name of Goal" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalDescription" className="text-right">
                            Description
                        </Label>
                        <Input id="goalDescription" value="Description of Goal" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalType" className="text-right">
                            Type
                        </Label>
                        <SelectGoalType />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalAttributes" className="text-right">
                            Attributes
                        </Label>
                        <AttributeCheckboxes selectedAttributes={selectedAttributes} onChange={setSelectedAttributes} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalReward" className="text-right">
                            Reward
                        </Label>
                        <Input id="goalReward" value="Reward for Goal" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}