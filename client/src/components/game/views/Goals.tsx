"use client";

import { useState } from "react";
import type { Goal } from "@/db/schema";
import { completeGoal } from "@/db/queries/update";
import { Progress } from "@/components/ui/progress";
import { EnhancedGoalCreation } from "./EnhancedGoalCreation";
import { GoalDialog } from "./GoalDialog";
import { GoalFilters } from "./GoalFilters";

interface GoalsViewProps {
  goals: Goal[] | null;
  profileId: number;
  onGoalComplete: (goalId: number) => void;
}

export const getGoalTypeColor = (type: string) => {
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

export const getAttributeColor = (attribute: string) => {
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

export const getGoalTypeHoverColor = (type: string) => {
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



export const Goals = ({ goals, profileId, onGoalComplete }: GoalsViewProps) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "daily" | "mission" | "quest"
  >("all");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<number | null>(null);

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

      {/* Goal Filters */}
      <GoalFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        allAttributes={allAttributes}
      />


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
            <GoalDialog 
              key={goal.id} 
              goal={goal}
              loading={loading}
              completingGoalId={completingGoalId}
              onComplete={handleCompleteGoal}
            />
          ))
        )}
      </div>
    </div>
  );
};


