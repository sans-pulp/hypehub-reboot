"use client";

import { useState } from "react";
import type { Goal } from "@/db/schema";
import { completeGoal } from "@/db/queries/update";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedGoalCreation } from "./EnhancedGoalCreation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GoalsViewProps {
  goals: Goal[] | null;
  profileId: number;
  onGoalComplete: (goalId: number) => void;
}

export const Goals = ({ goals, profileId, onGoalComplete }: GoalsViewProps) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "daily" | "mission" | "quest"
  >("all");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<number | null>(null);
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);

  if (!goals) return null;

  // Extract all unique attributes from goals
  const allAttributes = Array.from(
    new Set(
      goals.flatMap(
        (goal) => goal.attributes?.map((attr) => attr.toLowerCase()) || []
      )
    )
  ).sort();

  const filteredGoals = goals.filter((goal) => {
    // Filter by completion status
    if (goal.isComplete) return false;

    // Filter by goal type
    const typeMatches = activeFilter === "all" || goal.type === activeFilter;

    // Filter by selected attributes
    const attributesMatch =
      selectedAttributes.length === 0 ||
      selectedAttributes.some((attr) =>
        goal.attributes?.map((attr) => attr.toLowerCase()).includes(attr)
      );

    return typeMatches && attributesMatch;
  });

  const handleCompleteGoal = async (goalId: number) => {
    try {
      setLoading(true);
      setCompletingGoalId(goalId);
      await completeGoal(goalId, profileId);
      onGoalComplete(goalId);
    } catch (error) {
      console.error("Error completing goal:", error);
    } finally {
      setLoading(false);
      setCompletingGoalId(null);
    }
  };

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-game-goal-daily border-game-goal-daily text-black";
      case "mission":
        return "bg-game-goal-mission border-game-goal-mission text-black";
      case "quest":
        return "bg-game-goal-quest border-game-goal-quest text-black";
      default:
        return "bg-gray-500";
    }
  };

  const getAttributeColor = (attribute: string) => {
    switch (attribute.toLowerCase()) {
      case "strength":
        return "bg-game-attribute-strength border-game-attribute-strength text-white";
      case "vitality":
        return "bg-game-attribute-vitality border-game-attribute-vitality text-black";
      case "knowledge":
        return "bg-game-attribute-knowledge border-game-attribute-knowledge text-black";
      case "willpower":
        return "bg-game-attribute-willpower border-game-attribute-willpower text-white";
      case "social":
        return "bg-game-attribute-social border-game-attribute-social text-black";
      default:
        return "bg-gray-500";
    }
  };

  const getGoalTypeHoverColor = (type: string) => {
    switch (type) {
      case "daily":
        return "hover:bg-game-goal-daily/10";
      case "mission":
        return "hover:bg-game-goal-mission/10";
      case "quest":
        return "hover:bg-game-goal-quest/10";
      default:
        return "";
    }
  };

  const toggleAttribute = (attribute: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attribute)
        ? prev.filter((a) => a !== attribute)
        : [...prev, attribute]
    );
  };
  console.log({
    goals,
  });
  return (
    <div className="goals-view space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Goals</h2>
          <p className="text-gray-400">Track your progress and level up</p>
        </div>
        <EnhancedGoalCreation
          profileId={profileId}
          onGoalCreated={() => {
            // Trigger a refresh via parent component
            onGoalComplete(-1); // Using -1 as a signal to just refresh
          }}
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["daily", "mission", "quest"].map((type) => {
          const typeGoals = goals.filter((g) => g.type === type);
          const completed = typeGoals.filter((g) => g.isComplete).length;
          const total = typeGoals.length;
          const progress = total ? (completed / total) * 100 : 0;

          return (
            <div key={type} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white capitalize">{type} Goals</h3>
                <span className="text-gray-400">
                  {completed}/{total}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-wrap gap-8 items-center">
        {/* Goal Type Dropdown */}
        <div className="flex items-center">
          <span className="text-gray-400 mr-2 text-sm">Goal Type:</span>
          <Select
            value={activeFilter}
            onValueChange={(value) =>
              setActiveFilter(value as typeof activeFilter)
            }
          >
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="mission">Missions</SelectItem>
              <SelectItem value="quest">Quests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attributes Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2 text-sm">Attributes:</span>
            <Dialog
              open={attributeDialogOpen}
              onOpenChange={setAttributeDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 bg-gray-800 text-white h-10 px-4"
                  size="sm"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filter
                  {selectedAttributes.length > 0 && (
                    <Badge
                      className="ml-2 bg-purple-600 text-white"
                      variant="secondary"
                    >
                      {selectedAttributes.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogTitle>Filter by Attributes</DialogTitle>
                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {allAttributes.map((attribute) => (
                      <div
                        key={attribute}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`filter-${attribute}`}
                          checked={selectedAttributes.includes(attribute)}
                          onCheckedChange={() => toggleAttribute(attribute)}
                        />
                        <Label
                          htmlFor={`filter-${attribute}`}
                          className="text-white cursor-pointer capitalize"
                        >
                          {attribute}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedAttributes.length > 0 && (
                  <div className="mt-4 pt-2 border-t border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-gray-400 "
                      onClick={() => setSelectedAttributes([])}
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Selected Attribute Badges - show if there are any */}
          {selectedAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {selectedAttributes.map((attr) => (
                <Badge
                  key={attr}
                  variant="outline"
                  className={`bg-gray-700 text-white cursor-pointer capitalize h-8 px-1 ${getAttributeColor(
                    attr
                  )}`}
                  onClick={() => toggleAttribute(attr)}
                >
                  {/* {attr} */}
                  {/* <XIcon className="h-3 w-3 ml-1" /> */}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400">
              No goals available. Create some new goals!
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`bg-gray-800 rounded-lg p-4 transition-all ${getGoalTypeHoverColor(
                goal.type
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-white font-medium">{goal.name}</h3>
                    <Badge className={`${getGoalTypeColor(goal.type)}  badge`}>
                      {goal.type}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs h-12">
                    {goal.description}
                  </p>
                  <div className="flex gap-2">
                    {goal.attributes?.map((attr) => (
                      <Badge
                        key={attr}
                        variant="outline"
                        className={`${getAttributeColor(attr)} badge`}
                      >
                        {/* {attr} */}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => handleCompleteGoal(goal.id)}
                  disabled={loading && completingGoalId === goal.id}
                >
                  {loading && completingGoalId === goal.id
                    ? "Completing..."
                    : "Complete"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
