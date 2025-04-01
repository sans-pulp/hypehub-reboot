"use client";

import { useState, useEffect } from "react";
import { getCurrentUserData } from "@/utils/auth";
import type { Goal } from "@/db/schema";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { LevelSystemProvider } from "@/contexts/LevelSystemContext";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { GameContent, GameState } from "./GameContent";

export const AlternativeGameInterface = () => {
  const [gameState, setGameState] = useState<GameState>({
    profile: null,
    attributes: null,
    goals: null,
    activeView: "dashboard",
  });
  const [loading, setLoading] = useState(true);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);

  const fetchUserData = async () => {
    try {
      const { profile, attributes, goals } = await getCurrentUserData();
      setGameState((prev: GameState) => ({
        ...prev,
        profile,
        attributes,
        goals,
      }));
      setCompletedGoals(goals?.filter((goal: Goal) => goal.isComplete) || []);
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

  const handleGoalComplete = () => {
    fetchUserData();
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
            refreshGoals={fetchUserData}
          />
        </WeatherProvider>
      </WebSocketProvider>
    </LevelSystemProvider>
  );
};
