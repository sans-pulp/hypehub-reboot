"use client";

import { useState, useEffect } from "react";
import { getCurrentUserData } from "@/utils/auth";
import type { Profile, Attribute, Goal } from "@/db/schema";
import { useWebSocketContext, WebSocketProvider } from "@/contexts/WebSocketContext";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { LevelSystemProvider } from "@/contexts/LevelSystemContext";
import { GameContent, GameState } from "@/components/game/GameContent";
import { LoadingScreen } from "@/components/loading/LoadingScreen";


export const AlternativeGameInterface = () => {
  const [gameState, setGameState] = useState<GameState>({
    profile: null,
    attributes: null,
    goals: null,
    activeView: "dashboard",
  });
  const [loading, setLoading] = useState(true);
  const { send } = useWebSocketContext();
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);

  const fetchUserData = async () => {
    try {
      const { profile, attributes, goals } = await getCurrentUserData();
      setGameState((prev) => ({
        ...prev,
        profile,
        attributes,
        goals,
      }));
      setCompletedGoals(goals?.filter((goal) => goal.isComplete) || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      const minLoadingTime = 2500;
      const loadingStartTime = Date.now();
      const timeElapsed = Date.now() - loadingStartTime;
      if (timeElapsed < minLoadingTime) {
        setTimeout(() => {
          setLoading(false);
        }, minLoadingTime - timeElapsed);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleGoalComplete = (goalId: number) => {
    if (goalId === -1) {
      fetchUserData();
      return;
    }

    const goal = gameState.goals?.find((g) => g.id === goalId);
    if (!goal || !gameState.profile) return;

    send({
      type: "GOAL_COMPLETED",
      payload: {
        goalName: goal.name,
        timestamp: new Date().toISOString(),
        userId: gameState.profile.id,
        goalType: goal.type,
      },
    });

    setCompletedGoals((prev) => [...prev, goal]);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <LevelSystemProvider>
      <WebSocketProvider>
        <WeatherProvider>
          <GameContent 
            gameState={gameState}
            setGameState={setGameState}
            onGoalComplete={handleGoalComplete}
            completedGoals={completedGoals}
          />
        </WeatherProvider>
      </WebSocketProvider>
    </LevelSystemProvider>
  );
};
