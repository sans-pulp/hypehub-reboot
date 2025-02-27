'use client'
import { AttributeType, AttributeTypes } from "@/db/schema"
import React, { useEffect, useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "./ui/badge"
import { addDays, format } from 'date-fns'
import { createGoal } from "@/app/goals/actions"
   
const goalTypes = ['Daily', 'Mission', 'Quest']
const attributeColors = {
  strength: 'bg-[#cc2936]',
  vitality: 'bg-[#4c8162]',
  knowledge: 'bg-[#209cee]',
  social: 'bg-[#fdca40]',
  willpower: 'bg-[#061826]',
}

const MIN_ATTRIBUTE_POINTS = 1;
const MAX_ATTRIBUTE_POINTS = 10;

const SelectGoalType = ({ setGoalType }: { setGoalType: (goalType: string) => void }) => {
  return (
    <Select onValueChange={setGoalType}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select goal type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {goalTypes.map((goalType) => (
              <SelectItem key={goalType} value={goalType} >
                  {goalType}
              </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const AttributeCheckboxes = ({ attributePoints, selectedAttributes, onChange,  setAttributePoints }: {
  attributePoints: Record<string, number>,
  selectedAttributes: string[],
  onChange: (attributes: string[]) => void,
  setAttributePoints: (attributePoints: Record<string, number>) => void
}) => {
  // Convert AttributeTypes object to array for easier mapping
  const attributeOptions = Object.values(AttributeTypes);
  
  const handleToggleAttribute = (attribute: string) => {
    if (selectedAttributes.includes(attribute)) {
      // Remove attribute if already selected
      onChange(selectedAttributes.filter(a => a !== attribute));
      // delete attributePoints[attribute];
      const updatedPoints = { ...attributePoints };
      delete updatedPoints[attribute];
      setAttributePoints(updatedPoints);
    } else {
      // Add attribute if not selected
      onChange([...selectedAttributes, attribute]);
      // add attributePoints[attribute] = 1;
      const updatedPoints = { ...attributePoints };
      updatedPoints[attribute] = 1;
      setAttributePoints(updatedPoints);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {attributeOptions.map((attribute) => (
        <div key={attribute} className="flex items-center space-x-2">
          <Checkbox
            id={`attribute-${attribute}`}
            checked={selectedAttributes.includes(attribute)}
            onCheckedChange={() => handleToggleAttribute(attribute)}
          />
          <Label 
            htmlFor={`attribute-${attribute}`} 
            className="capitalize text-sm sm:text-base cursor-pointer"
          >
            {attribute.slice(0, 3).toUpperCase()}
          </Label>
        </div>
      ))}
    </div>
  );
};

const GoalFormField = ({ label, placeholder, type, value, onChange }: {
    label: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    return (
        <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor={label.split(' ').join('').toLowerCase()} className="text-left font-medium">
                {label}
            </Label>
            <Input id={label.split(' ').join('').toLowerCase()} type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}

const TargetDateField = ({ 
  goalType, 
  targetDate, 
  setTargetDate 
}: {
  goalType: string,
  targetDate: string,
  setTargetDate: (date: string) => void
}) => {

  return (
     <div className="grid grid-cols-1 items-center gap-2">
        <Label htmlFor="targetDate" className="text-left font-medium">
          Target Date
        </Label>
        <Input 
        id="targetDate" 
        type="date" 
        placeholder="Select a target date"
        value={targetDate} 
        onChange={(e) => setTargetDate(e.target.value)}
        disabled={goalType === 'Daily'} />
        {goalType === 'Daily' && <p className="text-xs text-gray-500">Daily goals have a default target date of the next day.</p>}
     </div>
  );
};

interface GoalFormData {
  name: string;
  description: string;
  type: string;
  attributes: string[];
  attributePoints: Record<string, number>;
  targetDate: string;
}
const emptyGoalFormData: GoalFormData = {
  name: '',
  description: '',
  type: 'Daily',
  attributes: [],
  attributePoints: {},
  targetDate: '',
}

export const GoalCreationForm = ({profileId}: {profileId: number}) => {
  // dialog state control
  const [open, setOpen] = useState(false)
    // form for creating a new goal
    const [formData, setformData] = useState<GoalFormData>(emptyGoalFormData);

    const [isValid, setIsValid] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // set daily goal target date as tomorrow
    useEffect(() => {
      if (formData.type === 'Daily') {
        const tomorrow = addDays(new Date(), 1);
        setformData((prev) => ({
          ...prev, 
          targetDate: format(tomorrow, 'yyyy-MM-dd')
        }));
      }
    }, [formData.type])

    // Form validation
    useEffect(() => {
      // Only require target date for non-Daily goals
      const hasValidTargetDate = formData.type === 'Daily' || formData.targetDate !== '';
      const isFormValid = 
        formData.name.trim() !== '' &&
        formData.description.trim() !== '' &&
        formData.type !== '' &&
        formData.attributes.length > 0 &&
        hasValidTargetDate; 

      setIsValid(isFormValid);
      
    }, [formData])

    const resetForm = () => {
      setformData(emptyGoalFormData)
      setIsValid(false)
      setError(null)
    }

    const handleSubmit = async () => {
      // Handle form submission
      // console.log('Form submitted:', formData)
      if (!isValid) {
        setError('Form is not valid. Please fill in all required fields.')
        return
      }

      const { name, description, type, attributes, attributePoints, targetDate } = formData
      const goalsObject = {
          name,
          description,
          type: type.toLowerCase(),
          attributes,
          attributeRewards: attributes.map(attribute => ({ type: attribute.toLowerCase() as AttributeType, points: attributePoints[attribute] || 1 })),
          profileId: profileId,
          targetDate: targetDate ? new Date(targetDate) : null
      }
    
      try {
        const newGoal = await createGoal(goalsObject)
        console.log("newGoal created!...", newGoal)
        setOpen(false)
        resetForm()
      } catch(error) {
        console.error("Failed to create goal:", error)
        setError("Failed to create goal. Please try again.")
      }
    }


    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
            <GoalFormField label="Goal Name" placeholder="Name of Goal" value={formData.name} type="text" onChange={(e) => setformData((prev) => ({...prev, name: e.target.value}))} />
            <GoalFormField label="Goal Description" placeholder="Description of Goal" value={formData.description} type="text" onChange={(e) => setformData((prev) => ({...prev, description: e.target.value}))} />
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="goalType" className="text-left font-medium">
                Type
              </Label>
              <div className="w-full">
                <SelectGoalType setGoalType={(goalType) => setformData((prev) => ({...prev, type: goalType}))} />
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-2">
              <Label htmlFor="goalAttributes" className="text-left font-medium pt-1">
                Attributes
              </Label>
              <div className="w-full">
                <AttributeCheckboxes
                  attributePoints={formData.attributePoints}
                  selectedAttributes={formData.attributes}
                  onChange={(attributes) => setformData((prev) => ({...prev, attributes: attributes}))}
                  setAttributePoints={(attributePoints) => setformData((prev) => ({...prev, attributePoints: attributePoints}))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="goalPoints" className="text-left font-medium">
                Attribute Rewards
              </Label>
              {formData.attributes.map(attr => (
                <div key={attr} className="flex items-center mb-3">
                  <Badge className={`w-40 mr-4 ${attributeColors[attr as keyof typeof attributeColors]} justify-center text-sm capitalize`}>{attr}</Badge>
                  <div className="flex items-center">
                    <Button
                      onClick={() => {
                        const newValue = Math.max(MIN_ATTRIBUTE_POINTS, (formData.attributePoints[attr] || MIN_ATTRIBUTE_POINTS) - 1);
                        setformData((prev) => ({...prev, attributePoints: {...prev.attributePoints, [attr]: newValue}}));
                      }}
                      className="px-2 py-1 border rounded-l"
                    >
                      -
                    </Button>
                    <span className="px-3 py-1 border-t border-b">
                      {formData.attributePoints[attr] || 1}
                    </span>
                    <Button
                      onClick={() => {
                        const newValue = Math.min(MAX_ATTRIBUTE_POINTS, (formData.attributePoints[attr] || MIN_ATTRIBUTE_POINTS) + 1);
                        setformData((prev) => ({...prev, attributePoints: {...prev.attributePoints, [attr]: newValue}}));
                      }}
                      className="px-2 py-1 border rounded-r"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
              <TargetDateField goalType={formData.type} targetDate={formData.targetDate} setTargetDate={(date) => setformData((prev) => ({...prev, targetDate: date}))} />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto" onClick={handleSubmit} disabled={!isValid}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
