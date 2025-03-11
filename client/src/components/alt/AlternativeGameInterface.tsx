"use client";

import { useState, useEffect } from "react";
import { getCurrentUserData } from "@/utils/auth";
import type { Profile, Attribute, Goal } from "@/db/schema";
import { useWebSocketContext } from "@/WebSocketContext";
import { LoadingScreen } from "../LoadingScreen";
import { Header } from "./layout/Header";
import { Navigation } from "./layout/Navigation";
import { Dashboard } from "./views/Dashboard";
import { Goals } from "./views/Goals";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
      setLoading(false);
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
      default:
        console.log("Unhandled event:", latestEvent);
    }
  }, [isConnected, latestEvent]);

  const handleViewChange = (view: ViewType) => {
    setGameState((prev) => ({ ...prev, activeView: view }));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="alternative-game-interface min-h-screen bg-gray-900">
      <Header isConnected={isConnected} profile={gameState.profile} />
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
                onGoalComplete={(goalId) => {
                  send({
                    type: "GOAL_COMPLETED",
                    payload: {
                      goalId,
                      userId: gameState.profile!.id,
                      timestamp: new Date().toISOString(),
                    },
                  });
                }}
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
