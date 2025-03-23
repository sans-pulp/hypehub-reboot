"use client";

import { useState, useEffect } from "react";
import { createGoal } from "@/app/goals/actions";
import { AttributeType } from "@/db/schema";
import { Plus, Sparkles, Target } from "lucide-react";
import { format, addDays } from "date-fns";
import { GOAL_TYPES, ATTRIBUTE_COLORS, ATTRIBUTE_POINTS_LIMITS } from "@/components/ui/constants";
import type { GoalType, GoalFormData, GoalTemplate, GoalFormProps } from "@/types/goals";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GoalPointsGuide } from './GoalPointsGuide';

// Constants for attributes
const ATTRIBUTE_TYPES: AttributeType[] = ["strength", "vitality", "knowledge", "social", "willpower"];


// Templates for quick goal creation
const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    name: "Workout Session",
    description: "Complete a 30-minute workout",
    type: "Daily" as GoalType,
    attributes: ["strength", "vitality"] as AttributeType[],
    attributePoints: { strength: 2, vitality: 2 } as Record<
      AttributeType,
      number
    >,
  },
  {
    name: "Read a Book",
    description: "Read at least 30 pages of a book",
    type: "Daily" as GoalType,
    attributes: ["knowledge"] as AttributeType[],
    attributePoints: { knowledge: 3 } as Record<AttributeType, number>,
  },
  {
    name: "Social Meetup",
    description: "Meet with friends or attend a social event",
    type: "Mission" as GoalType,
    attributes: ["social"] as AttributeType[],
    attributePoints: { social: 4 } as Record<AttributeType, number>,
  },
  {
    name: "Learn a New Skill",
    description: "Complete a course or tutorial on a new skill",
    type: "Quest" as GoalType,
    attributes: ["knowledge", "willpower"] as AttributeType[],
    attributePoints: { knowledge: 3, willpower: 2 } as Record<
      AttributeType,
      number
    >,
  },
];

const emptyGoalFormData: GoalFormData = {
  name: "",
  description: "",
  type: "Daily",
  attributes: [],
  attributePoints: {},
  targetDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
};

export const EnhancedGoalCreation = ({
  profileId,
  onGoalCreated,
}: GoalFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<GoalFormData>(emptyGoalFormData);
  const [creationMethod, setCreationMethod] = useState<"manual" | "template">(
    "manual"
  );
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update target date when goal type changes
  useEffect(() => {
    if (formData.type === "Daily") {
      const tomorrow = addDays(new Date(), 1);
      setFormData((prev) => ({
        ...prev,
        targetDate: format(tomorrow, "yyyy-MM-dd"),
      }));
    }
  }, [formData.type]);

  // Form validation
  useEffect(() => {
    const hasValidTargetDate =
      formData.type === "Daily" || formData.targetDate !== "";
    const isFormValid =
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.attributes.length > 0 &&
      hasValidTargetDate;

    setIsValid(isFormValid);
  }, [formData]);


  // Reset form to initial state
  const resetForm = () => {
    setFormData(emptyGoalFormData);
    setCreationMethod("manual");
    setError(null);
    setIsSubmitting(false);
  };

  // Handle form submission and goal creation
  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please fill in all required fields.");
      return;
    }

    const { name, description, type, attributes, attributePoints, targetDate } =
      formData;

    setIsSubmitting(true);

    try {
      const goalsObject = {
        name,
        description,
        type: type.toLowerCase(),
        attributes,
        attributeRewards: attributes.map((attribute) => ({
          type: attribute.toLowerCase() as AttributeType,
          points: attributePoints[attribute] || 1,
        })),
        profileId,
        targetDate: targetDate ? new Date(targetDate) : null,
      };

      await createGoal(goalsObject);
      setOpen(false);
      resetForm();
      onGoalCreated();
    } catch (error) {
      console.error("Failed to create goal:", error);
      setError("Failed to create goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle attribute selection (add/remove)
  const handleAttributeToggle = (attribute: AttributeType) => {
    setFormData((prev) => {
      const isSelected = prev.attributes.includes(attribute);

      if (isSelected) {
        // Remove attribute
        const updatedAttributes = prev.attributes.filter(
          (a) => a !== attribute
        );
        const updatedPoints = { ...prev.attributePoints };
        delete updatedPoints[attribute];

        return {
          ...prev,
          attributes: updatedAttributes,
          attributePoints: updatedPoints,
        };
      } else {
        // Add attribute with default points
        return {
          ...prev,
          attributes: [...prev.attributes, attribute],
          attributePoints: {
            ...prev.attributePoints,
            [attribute]: 1,
          },
        };
      }
    });
  };

  // update attribute points within min/max constraints
  const handlePointsChange = (attribute: AttributeType, points: number) => {
    const limits = ATTRIBUTE_POINTS_LIMITS[formData.type.toLowerCase() as keyof typeof ATTRIBUTE_POINTS_LIMITS];
    
    setFormData((prev) => ({
      ...prev,
      attributePoints: {
        ...prev.attributePoints,
        [attribute]: Math.max(
          limits.min,
          Math.min(limits.max, points)
        ),
      },
    }));
  };

  // Apply selected template to form data
  const applyTemplate = (template: GoalTemplate) => {
    setFormData({
      ...template,
      targetDate: formData.targetDate,
    } as GoalFormData);
    setCreationMethod("manual");
  };

  // Get appropriate CSS color class for attribute badges
  const getAttributeColor = (attribute: string) => {
    switch (attribute.toLowerCase()) {
      case "strength":
        return ATTRIBUTE_COLORS.strength;
      case "vitality":
        return ATTRIBUTE_COLORS.vitality;
      case "knowledge":
        return ATTRIBUTE_COLORS.knowledge;
      case "social":
        return ATTRIBUTE_COLORS.social;
      case "willpower":
        return ATTRIBUTE_COLORS.willpower;
      default:
        return "bg-gray-500";
    }
  };

  const handleGoalTypeChange = (newType: GoalType) => {
    const newLimits = ATTRIBUTE_POINTS_LIMITS[newType.toLowerCase() as keyof typeof ATTRIBUTE_POINTS_LIMITS];
    
    setFormData((prev) => {
      const updatedPoints = { ...prev.attributePoints };
      
      // Adjust all existing attribute points to fit within new limits
      prev.attributes.forEach(attribute => {
        const currentPoints = updatedPoints[attribute] || newLimits.min;
        updatedPoints[attribute] = Math.max(
          newLimits.min,
          Math.min(newLimits.max, currentPoints)
        );
      });

      return {
        ...prev,
        type: newType,
        attributePoints: updatedPoints,
      };
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r font-pixel from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Goal</span>
          <span className="sm:hidden">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-3xl p-4 sm:p-6 bg-gray-900 border-gray-800">
        <DialogHeader className="mb-3 sm:mb-4">
          <DialogTitle className="text-xl sm:text-2xl text-white">
            Create Goal
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm sm:text-base">
            Create a new goal to work towards your personal growth.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={creationMethod}
          onValueChange={(v) => setCreationMethod(v as "manual" | "template")}
          className="mt-3 sm:mt-4"
        >
          <TabsList className="w-full grid grid-cols-2 h-fit mb-4 sm:mb-6">
            <TabsTrigger
              value="manual"
              className="text-xs sm:text-sm md:text-base px-2 py-1.5 sm:py-2 "
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline font-grotesk">Create Manually</span>
              <span className="xs:hidden font-grotesk text-lg">Manual</span>
            </TabsTrigger>
            <TabsTrigger
              value="template"
              className="text-xs sm:text-sm md:text-base px-2 py-1.5 sm:py-2"
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline font-grotesk">Use Template</span>
              <span className="xs:hidden font-grotesk text-lg">Template</span>
            </TabsTrigger>
          </TabsList>

          {/* Manual Creation Tab */}
          <TabsContent value="manual" className="mt-0">
            <div className="grid gap-4 sm:gap-6">
              {/* Name & Description */}
              <div>
                <Label
                  htmlFor="name"
                  className="text-white text-sm mb-1.5 sm:mb-2 block"
                >
                  Goal Name
                </Label>
                <Input
                  id="name"
                  placeholder="What do you want to achieve?"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="hypehub-input sm:text-sm md:text-base"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-white text-sm mb-1.5 sm:mb-2 block"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe your goal in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="hypehub-textarea sm:text-sm md:text-base"
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Goal Type */}
              <div>
                <Label
                  htmlFor="type"
                  className="text-white text-sm mb-1.5 sm:mb-2 block"
                >
                  Goal Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: GoalType) => handleGoalTypeChange(value)}
                >
                  <SelectTrigger className="hypehub-input font-pixel text-xs">
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white text-xs sm:text-base">
                    {GOAL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "Daily" && "📋 "}
                        {type === "Mission" && "🏰 "}
                        {type === "Quest" && "🗺️ "}
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {formData.type === "Daily" &&
                    "Daily goals reset every day and are meant for building habits."}
                  {formData.type === "Mission" &&
                    "Missions are medium-term goals that might take a few days to weeks to complete."}
                  {formData.type === "Quest" &&
                    "Quests are significant achievements that require longer-term commitment."}
                </p>
                {formData.type && <GoalPointsGuide type={formData.type} />}
              </div>

              {/* Target Date */}
              {formData.type !== "Daily" && (
                <div>
                  <Label
                    htmlFor="targetDate"
                    className="text-white text-sm mb-1.5 sm:mb-2 block"
                  >
                    Target Completion Date
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="targetDate"
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetDate: e.target.value,
                        }))
                      }
                      className="hypehub-input [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert font-body text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Attributes */}
              <div>
                <Label className="text-white text-sm mb-1.5 sm:mb-2 block">
                  Attributes to Improve
                </Label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {ATTRIBUTE_TYPES.map((attribute) => (
                    <Button
                      key={attribute}
                      type="button"
                      variant={
                        formData.attributes.includes(attribute)
                          ? "default"
                          : "outline"
                      }
                      className={`justify-center text-lg sm:text-sm md:text-base py-1 sm:py-2 px-2 ${
                        formData.attributes.includes(attribute)
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-800 border-gray-700 text-gray-300"
                      }`}
                      onClick={() => handleAttributeToggle(attribute)}
                    >
                      {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                    </Button>
                  ))}
                </div>

                {formData.attributes.length > 0 && (
                  <div className="space-y-3 sm:space-y-4 bg-gray-800 p-3 sm:p-4 rounded-md">
                    <Label className="text-white text-sm block">
                      Attribute Points
                    </Label>
                    {formData.attributes.map((attribute) => {
                      const limits = ATTRIBUTE_POINTS_LIMITS[formData.type.toLowerCase() as keyof typeof ATTRIBUTE_POINTS_LIMITS];
                      return (
                        <div
                          key={attribute}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Badge
                              className={`${getAttributeColor(
                                attribute
                              )} mr-2 text-lg sm:text-xs`}
                            >
                              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePointsChange(attribute, (formData.attributePoints[attribute] || limits.min) - 1)}
                              disabled={(formData.attributePoints[attribute] || limits.min) <= limits.min}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center">
                              {(formData.attributePoints[attribute] || limits.min) < limits.min ? limits.min : (formData.attributePoints[attribute] || limits.min)}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePointsChange(attribute, (formData.attributePoints[attribute] || limits.min) + 1)}
                              disabled={(formData.attributePoints[attribute] || limits.min) >= limits.max}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Template Tab */}
          <TabsContent value="template" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {GOAL_TEMPLATES.map((template, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <h3 className="text-white font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                    {template.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge
                      className={`${
                        template.type === "Daily"
                          ? "bg-blue-500"
                          : template.type === "Mission"
                          ? "bg-purple-500"
                          : "bg-amber-500"
                      } text-xs`}
                    >
                      {template.type === "Daily" && "📋 "}
                      {template.type === "Mission" && "🏰 "}
                      {template.type === "Quest" && "🗺️ "}
                      {template.type}
                    </Badge>
                    <div className="flex flex-wrap gap-1">
                      {template.attributes.map((attr) => (
                        <Badge
                          key={attr}
                          variant="outline"
                          className="text-[0.65rem] sm:text-xs"
                        >
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Completion Indicator */}
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
            <span className="text-gray-400 text-xs sm:text-sm">
              Completion: {isValid ? "Ready to save" : "Needs more info"}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">
              {isValid ? "100%" : "..."}
            </span>
          </div>
          <Progress value={isValid ? 100 : 0} className="h-1.5 sm:h-2" />
        </div>

        {error && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-900/30 border border-red-800 rounded-md">
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        <DialogFooter className="mt-4 sm:mt-6 flex-col xs:flex-row gap-2">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 text-xs sm:text-sm h-10 font-pixel"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs sm:text-sm h-10 font-pixel"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Save Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
