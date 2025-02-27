import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TargetDateFieldProps } from "../types";

export const TargetDateField = ({ 
  goalType, 
  targetDate, 
  setTargetDate 
}: TargetDateFieldProps) => {

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
