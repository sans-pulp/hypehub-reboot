"use client";
import { useState, useEffect } from "react";
import { Goal } from "@/db/schema";
import { completeGoal } from "@/db/queries/update";

type GoalListContainerProps = {
  goals: Goal[];
  profileId: number;
  onGoalComplete: (goalId: number) => void;
};

/**
 * GoalListContainer - Main component that displays all user goals organized by type
 *
 * Props:
 * - goals: Array of Goal objects from the database
 * - profileId: The current user's profile ID for database operations
 * - onGoalComplete: Callback function to notify parent when a goal is completed
 */
export const GoalListContainer = ({
  goals,
  profileId,
  onGoalComplete,
}: GoalListContainerProps) => {
  // State for tracking loading status during API calls
  const [loading, setLoading] = useState(false);
  // State for controlling the visibility of the completion effect
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  // State for tracking which goal is currently being completed
  const [completedGoalId, setCompletedGoalId] = useState<number | null>(null);

  // Filter goals by type and completion status
  const dailyGoals = goals.filter(
    (goal) => goal.type === "daily" && !goal.isComplete
  );
  const missionGoals = goals.filter(
    (goal) => goal.type === "mission" && !goal.isComplete
  );
  const questGoals = goals.filter(
    (goal) => goal.type === "quest" && !goal.isComplete
  );

  /**
   * Handles the completion of a goal
   * 1. Sets loading state
   * 2. Calls the database to mark the goal as complete
   * 3. Shows the completion effect
   * 4. Notifies the parent component
   */
  const handleCompleteGoal = async (goalId: number) => {
    try {
      setLoading(true);
      await completeGoal(goalId, profileId);
      setCompletedGoalId(goalId);
      setShowCompletionEffect(true);
      onGoalComplete(goalId);
    } catch (error) {
      console.error("Error completing goal:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect to automatically hide the completion effect after 2 seconds
   */
  useEffect(() => {
    if (showCompletionEffect) {
      const timer = setTimeout(() => {
        setShowCompletionEffect(false);
        setCompletedGoalId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCompletionEffect]);

  return (
    <div className="goal-list nes-container h-3/5 is-dark with-title mt-4">
      <h2 className="title is-primary mb-4 text-xl">Your Goals</h2>

      <GoalCategory
        goals={dailyGoals}
        title="Daily Goals"
        loading={loading}
        completedGoalId={completedGoalId}
        onComplete={handleCompleteGoal}
      />

      <GoalCategory
        goals={missionGoals}
        title="Missions"
        loading={loading}
        completedGoalId={completedGoalId}
        onComplete={handleCompleteGoal}
      />

      <GoalCategory
        goals={questGoals}
        title="Quests"
        loading={loading}
        completedGoalId={completedGoalId}
        onComplete={handleCompleteGoal}
      />

      {goals.length === 0 && (
        <p className="nes-text is-disabled text-center py-4">
          No goals available. Create some new goals!
        </p>
      )}

      {showCompletionEffect && <GoalCompletionEffect />}
    </div>
  );
};

/**
 * GoalCategory - Component for rendering a specific category of goals
 *
 * Props:
 * - goals: Array of Goal objects for this category
 * - title: The display title for this category
 * - loading: Whether any goal is currently being saved
 * - completedGoalId: ID of the goal currently being completed (if any)
 * - onComplete: Function to call when a goal is completed
 */
type GoalCategoryProps = {
  goals: Goal[];
  title: string;
  loading: boolean;
  completedGoalId: number | null;
  onComplete: (goalId: number) => void;
};

const GoalCategory = ({
  goals,
  title,
  loading,
  completedGoalId,
  onComplete,
}: GoalCategoryProps) => {
  if (goals.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="nes-text is-primary mb-2">{title}</h3>
      <ul className="nes-list is-disc">
        {goals.map((goal) => (
          <li key={goal.id} className="mb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="nes-text">{goal.name}</p>
                <small className="text-gray-400">{goal.description}</small>
              </div>
              <button
                className={`nes-btn is-success ${
                  loading && completedGoalId === goal.id ? "is-disabled" : ""
                }`}
                onClick={() => onComplete(goal.id)}
                disabled={loading && completedGoalId === goal.id}
              >
                {loading && completedGoalId === goal.id
                  ? "Saving..."
                  : "Complete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * GoalCompletionEffect - Visual effect shown when a goal is completed
 *
 * Displays a trophy icon and success message in a modal overlay
 */
const GoalCompletionEffect = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue bg-opacity-50 z-50">
      <div className="text-center">
        <i className="nes-icon is-large trophy"></i>
        <p className="nes-text is-success text-xl mt-4">Goal Complete!</p>
      </div>
    </div>
  );
};
