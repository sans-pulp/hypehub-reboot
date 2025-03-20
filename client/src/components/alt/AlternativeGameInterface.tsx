"use client";

import { useState, useEffect } from "react";
import { getCurrentUserData } from "@/utils/auth";
import type { Profile, Attribute, Goal } from "@/db/schema";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { LoadingScreen } from "../LoadingScreen";
import { Header } from "./layout/Header";
import { Navigation } from "./layout/Navigation";
import { Dashboard } from "./views/Dashboard";
import { Goals } from "./views/Goals";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWeatherContext, WeatherProvider } from "@/contexts/WeatherContext";
import { ConnectedUsersCountPayload } from "@hypehub/types";

type ViewType = "dashboard" | "goals" | "social" | "achievements";

interface GameState {
  profile: Profile | null;
  attributes: Attribute | null;
  goals: Goal[] | null;
  activeView: ViewType;
}

export const AlternativeGameInterface = () => {
  // Core state management
  const [gameState, setGameState] = useState<GameState>({
    profile: null,
    attributes: null,
    goals: null,
    activeView: "dashboard",
  });
  const [loading, setLoading] = useState(true);
  
  // WebSocket connection
  const { isConnected, send, latestEvent } = useWebSocketContext();
  const [connectedUsers, setConnectedUsers] = useState<number>(0);

  // Initial data fetch
  const fetchUserData = async () => {
    try {
      const { profile, attributes, goals } = await getCurrentUserData();
      setGameState((prev) => ({
        ...prev,
        profile,
        attributes,
        goals,
      }));
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

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  // WebSocket event handler
  useEffect(() => {
    if (!isConnected || !latestEvent) return;

    switch (latestEvent.type) {
      case "PRESENCE_UPDATE":
        // Handle presence updates
        break;
      case "GOAL_COMPLETED":
        // Refresh goals when one is completed
        fetchUserData();
        break;
      case "LEVEL_UP":
        // Refresh attributes when leveling up
        fetchUserData();
        break;
      case "CONNECTED_USERS_COUNT":
        // Handle the connected users count
        const payload = latestEvent.payload as ConnectedUsersCountPayload
        setConnectedUsers(payload.count)
        break;
      default:
        console.log("Unhandled event:", latestEvent);
    }
  }, [isConnected, latestEvent]);

  const handleViewChange = (view: ViewType) => {
    setGameState((prev) => ({ ...prev, activeView: view }));
  };

  const handleGoalComplete = (goalId: number) => {
    // If goalId is -1, just refresh data without sending a WebSocket event
    if (goalId === -1) {
      fetchUserData();
      return;
    }

    const goal = gameState.goals?.find((g) => g.id === goalId);
    if (!goal) return;

    send({
      type: "GOAL_COMPLETED",
      payload: {
        goalName: goal.name,
        timestamp: new Date().toISOString(),
        userId: gameState.profile!.id,
        goalType: goal.type,
      },
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const GameContent = () => {
    const { 
        weatherData, 
        loading: weatherLoading, 
        weatherError,

    } = useWeatherContext();



    if (weatherError) {
      console.error("Weather error:", weatherError);
      return <div>Error loading weather data</div>;
    }


    return (
      <div className="alternative-game-interface min-h-screen bg-gray-900">
      <Header isConnected={isConnected} profile={gameState.profile} connectedUsers={connectedUsers} />
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
            {gameState.profile && gameState.attributes && (
              <Dashboard
                profile={gameState.profile}
                attributes={gameState.attributes}
              />
            )}
          </TabsContent>

          <TabsContent value="goals" className="m-0">
            {gameState.profile && (
              <Goals
                goals={gameState.goals}
                profileId={gameState.profile.id}
                onGoalComplete={handleGoalComplete}
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
    )
  }

  return (
    <WeatherProvider >
      <GameContent />
    </WeatherProvider>
  );
};
