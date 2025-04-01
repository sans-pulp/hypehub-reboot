"use client";

import { useEffect } from "react";
import type { Profile, Attribute, Goal } from "@/db/schema";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Dashboard } from "@/components/game/views/Dashboard";
import { Goals } from "@/components/game/views/Goals";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWeatherContext } from "@/contexts/WeatherContext";
import { useLevelSystemContext } from "@/contexts/LevelSystemContext";
import { useConnectedUsers } from "@/hooks/useConnectedUsers";

type ViewType = "dashboard" | "goals" | "social" | "achievements";

export interface GameState {
  profile: Profile | null;
  attributes: Attribute | null;
  goals: Goal[] | null;
  activeView: ViewType;
}

interface GameContentProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onGoalComplete: () => void;
  completedGoals: Goal[];
  refreshGoals: () => void;
}

export const GameContent = ({ 
  gameState, 
  setGameState,
  onGoalComplete,
  completedGoals,
  refreshGoals
}: GameContentProps) => {
  const { isConnected } = useWebSocketContext();
  const { weatherError } = useWeatherContext();
  const { initializeFromAttributes } = useLevelSystemContext();
  const connectedUsers = useConnectedUsers();
  const { send } = useWebSocketContext();
  
  useEffect(() => {
    if (gameState.attributes) {
      initializeFromAttributes(gameState.attributes);
    }
  }, [gameState.attributes, initializeFromAttributes]);
  
  const handleViewChange = (view: ViewType) => {
    setGameState((prev) => ({ ...prev, activeView: view }));
  };

  const handleGoalComplete = (goal: Goal) => {
    if (!gameState.profile) return;
    
    send({
      type: "GOAL_COMPLETED",
      payload: {
        goalName: goal.name,
        timestamp: new Date().toISOString(),
        userId: gameState.profile.id,
        goalType: goal.type,
      },
    });

    onGoalComplete();
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
                onGoalComplete={handleGoalComplete}
                refreshGoals={refreshGoals}
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