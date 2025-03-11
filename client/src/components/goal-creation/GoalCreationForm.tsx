"use client";
import { AttributeType } from "@/db/schema";
import React, { useEffect, useState } from "react";
import {
  AttributeCheckboxes,
  AttributeRewards,
  GoalFormField,
  SelectGoalType,
  TargetDateField,
} from "./components";
import { GoalFormData } from "./types";
import { createGoal } from "@/app/goals/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addDays, format } from "date-fns";

const emptyGoalFormData: GoalFormData = {
  name: "",
  description: "",
  type: "Daily",
  attributes: [],
  attributePoints: {},
  targetDate: "",
};

export const GoalCreationForm = ({
  profileId,
  onGoalCreated,
}: {
  profileId: number;
  onGoalCreated: () => void;
}) => {
  // dialog state control
  const [open, setOpen] = useState(false);
  // form for creating a new goal
  const [formData, setformData] = useState<GoalFormData>(emptyGoalFormData);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // set daily goal target date as tomorrow
  useEffect(() => {
    if (formData.type === "Daily") {
      const tomorrow = addDays(new Date(), 1);
      setformData((prev) => ({
        ...prev,
        targetDate: format(tomorrow, "yyyy-MM-dd"),
      }));
    }
  }, [formData.type]);

  // Form validation
  useEffect(() => {
    // Only require target date for non-Daily goals
    const hasValidTargetDate =
      formData.type === "Daily" || formData.targetDate !== "";
    const isFormValid =
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.attributes.length > 0 &&
      hasValidTargetDate;

    setIsValid(isFormValid);
  }, [formData]);

  const resetForm = () => {
    setformData(emptyGoalFormData);
    setIsValid(false);
    setError(null);
  };

  const handleSubmit = async () => {
    // Handle form submission
    // console.log('Form submitted:', formData)
    if (!isValid) {
      setError("Form is not valid. Please fill in all required fields.");
      return;
    }

    const { name, description, type, attributes, attributePoints, targetDate } =
      formData;
    const goalsObject = {
      name,
      description,
      type: type.toLowerCase(),
      attributes,
      attributeRewards: attributes.map((attribute) => ({
        type: attribute.toLowerCase() as AttributeType,
        points: attributePoints[attribute] || 1,
      })),
      profileId: profileId,
      targetDate: targetDate ? new Date(targetDate) : null,
    };

    try {
      const newGoal = await createGoal(goalsObject);
      console.log("newGoal created!...", newGoal);
      setOpen(false);
      resetForm();
      onGoalCreated();
    } catch (error) {
      console.error("Failed to create goal:", error);
      setError("Failed to create goal. Please try again.");
    }
  };

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
          <GoalFormField
            label="Goal Name"
            placeholder="Name of Goal"
            value={formData.name}
            type="text"
            onChange={(e) =>
              setformData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <GoalFormField
            label="Goal Description"
            placeholder="Description of Goal"
            value={formData.description}
            type="text"
            onChange={(e) =>
              setformData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="goalType" className="text-left font-medium">
              Type
            </Label>
            <div className="w-full">
              <SelectGoalType
                setGoalType={(goalType) =>
                  setformData((prev) => ({ ...prev, type: goalType }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-2">
            <Label
              htmlFor="goalAttributes"
              className="text-left font-medium pt-1"
            >
              Attributes
            </Label>
            <div className="w-full">
              <AttributeCheckboxes
                attributePoints={formData.attributePoints}
                selectedAttributes={formData.attributes}
                onChange={(attributes) =>
                  setformData((prev) => ({ ...prev, attributes: attributes }))
                }
                setAttributePoints={(attributePoints) =>
                  setformData((prev) => ({
                    ...prev,
                    attributePoints: attributePoints,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="goalPoints" className="text-left font-medium">
              Attribute Rewards
            </Label>
            <AttributeRewards
              attributes={formData.attributes}
              attributePoints={formData.attributePoints}
              setAttributePoints={(points) =>
                setformData((prev) => ({ ...prev, attributePoints: points }))
              }
            />
            <TargetDateField
              goalType={formData.type}
              targetDate={formData.targetDate}
              setTargetDate={(date) =>
                setformData((prev) => ({ ...prev, targetDate: date }))
              }
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
