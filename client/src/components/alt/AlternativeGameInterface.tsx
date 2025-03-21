"use client";

import { useState, useEffect } from "react";
import { getCurrentUserData } from "@/utils/auth";
import type { Profile, Attribute, Goal } from "@/db/schema";
import { useWebSocketContext, WebSocketProvider } from "@/contexts/WebSocketContext";
import { LoadingScreen } from "../LoadingScreen";
import { Header } from "./layout/Header";
import { Navigation } from "./layout/Navigation";
import { Dashboard } from "./views/Dashboard";
import { Goals } from "./views/Goals";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWeatherContext, WeatherProvider } from "@/contexts/WeatherContext";
import { useConnectedUsers } from "@/hooks/useConnectedUsers";

type ViewType = "dashboard" | "goals" | "social" | "achievements";

interface GameState {
  profile: Profile | null;
  attributes: Attribute | null;
  goals: Goal[] | null;
  activeView: ViewType;
}

// Separate GameContent component to prevent unnecessary re-renders
const GameContent = ({ 
  gameState, 
  setGameState,
  onGoalComplete,
  completedGoals
}: { 
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onGoalComplete: (goalId: number) => void;
  completedGoals: Goal[];
}) => {
  const { isConnected } = useWebSocketContext();
  const { weatherError } = useWeatherContext();
  const connectedUsers = useConnectedUsers();

  const handleViewChange = (view: ViewType) => {
    setGameState((prev) => ({ ...prev, activeView: view }));
  };

  if (weatherError) {
    console.error("Weather error:", weatherError);
    return <div>Error loading weather data</div>;
  }

  return (
    <div className="alternative-game-interface min-h-screen bg-gray-900">
      <Header 
        isConnected={isConnected} 
        profile={gameState.profile} 
        connectedUsers={connectedUsers} 
      />
      <Navigation
        activeView={gameState.activeView}
        onViewChange={handleViewChange}
      />

      <main className="game-content container mx-auto py-6">
        <Tabs
          value={gameState.activeView}
          onValueChange={(value) => handleViewChange(value as ViewType)}
        >
          <TabsContent value="dashboard" className="m-0">
            {gameState.attributes && (
              <Dashboard
                attributes={gameState.attributes} 
                completedGoals={completedGoals}
              />
            )}
          </TabsContent>

          <TabsContent value="goals" className="m-0">
            {gameState.profile && (
              <Goals
                goals={gameState.goals}
                profileId={gameState.profile.id}
                onGoalComplete={onGoalComplete}
              />
            )}
          </TabsContent>

          <TabsContent value="social" className="m-0">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Social Hub</h2>
              <p className="text-gray-400">Social features coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="m-0">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Achievements
              </h2>
              <p className="text-gray-400">
                Achievements system coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

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

    // handle level up
    // const newLevel = calculateLevelFromXP(new)
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
  );
};
