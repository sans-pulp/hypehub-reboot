"use client";

import { useState } from "react";
import type { Goal } from "@/db/schema";
import { completeGoal } from "@/db/queries/update";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedGoalCreation } from "./EnhancedGoalCreation";

interface GoalsViewProps {
  goals: Goal[] | null;
  profileId: number;
  onGoalComplete: (goalId: number) => void;
}

export const Goals = ({ goals, profileId, onGoalComplete }: GoalsViewProps) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "daily" | "mission" | "quest"
  >("all");
  const [loading, setLoading] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!goals) return null;

  const filteredGoals = goals.filter((goal) => {
    if (activeFilter === "all") return !goal.isComplete;
    return goal.type === activeFilter && !goal.isComplete;
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
        return "bg-blue-500";
      case "mission":
        return "bg-purple-500";
      case "quest":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

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
            setRefreshTrigger((prev) => prev + 1);
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

      {/* Filters */}
      <Tabs
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}
      >
        <TabsList className="bg-gray-800">
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="mission">Missions</TabsTrigger>
          <TabsTrigger value="quest">Quests</TabsTrigger>
        </TabsList>
      </Tabs>

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
              className="bg-gray-800 rounded-lg p-4 transition-all hover:bg-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{goal.name}</h3>
                    <Badge className={getGoalTypeColor(goal.type)}>
                      {goal.type}
                    </Badge>
                  </div>
                  <p className="text-gray-400">{goal.description}</p>
                  <div className="flex gap-2">
                    {goal.attributes?.map((attr) => (
                      <Badge key={attr} variant="outline">
                        {attr}
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
