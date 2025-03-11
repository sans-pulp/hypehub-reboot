"use client";
import { useState, useEffect } from "react";
import { getCurrentUserData } from "@/utils/auth";
import type { Profile, Attribute, Goal } from "@/db/schema";
import { GamifyUser } from "@/components/GamifyUser";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GoalListContainer } from "@/components/GoalList";
import { GoalCreationForm } from "@/components/goal-creation/GoalCreationForm";
import { PresenceIndicator } from "./PresenceIndicator";
import { useWebSocketContext } from "@/WebSocketContext";
import { toast } from "sonner";
import { HypeHubEvent, GoalCompletedPayload } from "@/utils/websocket";
import { LogoutButton } from "@/components/LogoutButton";
export const GameInterface = () => {
  //modals for profile updates - CRUD
  // modal for settings? -- maybe theme, language, music, etc.
  // modal for notifications? -- maybe for when a user completes a goal, or when a user completes a level,
  // what's on this page? - character/profile info, tasks - daily, mission, quests, progress bars, battle theme music
  console.log("GameInterface mounting...");
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userAttributes, setUserAttributes] = useState<Attribute | null>(null);
  const [userGoals, setUserGoals] = useState<Goal[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, send, latestEvent } = useWebSocketContext();

  // Handle incoming WebSocket events
  useEffect(() => {
    if (!isConnected) return;
    if (!latestEvent) return;

    switch (latestEvent.type) {
      case "SYSTEM":
        // console.log("System message:", latestEvent.payload);
        break;
      case "LEVEL_UP":
        // console.log("Level up event received", latestEvent.payload);
        break;
      case "GOAL_COMPLETED":
        // console.log("Goal completed event received", latestEvent.payload);
        toast(<ToastComponent latestEvent={latestEvent} />, {
          className: "!p-4 !bg-transparent",
          position: "bottom-right",
          style: {
            background: "#212529",
            border: "4px solid #fff",
            color: "#fff",
            borderRadius: "0px",
            boxShadow: "none",
            imageRendering: "pixelated",
          },
          // duration: 10000
        });
        break;
      case "ACHIEVEMENT":
        // console.log("Achievement event received", latestEvent.payload);
        break;
      case "CHAT_MESSAGE":
        console.log("Chat message received", latestEvent.payload);
        break;
      case "PRESENCE_UPDATE":
        console.log("Presence update received", latestEvent.payload);
        break;
      default:
        console.warn("Unknown event type:", latestEvent.type);
    }
  }, [isConnected, latestEvent]);

  // Fetch initial user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { profile, attributes, goals } = await getCurrentUserData();
        setUserProfile(profile);
        setUserAttributes(attributes);
        setUserGoals(goals);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        const minLoadingTime = 2000;
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

    fetchUser();
  }, []);

  const refreshGoals = async () => {
    const { goals } = await getCurrentUserData();
    setUserGoals(goals);
  };

  const handleLogoutError = () => {
    toast.error("Error logging out");
  }

  if (loading) {
    return <LoadingScreen />;
  }

  

  return (
    <div className="game-world nes-container min-h-screen w-screen is-dark with-title !m-0">
      <h1 className="title">HypeHub</h1>
      <PresenceIndicator />
      <div className="flex justify-end">
        <LogoutButton errorCallback={handleLogoutError}/>
      </div>


      <GamifyUser
        userProfile={userProfile}
        userAttributes={userAttributes}
        onLevelUp={(newLevel) => {
          send({
            type: "LEVEL_UP",
            payload: {
              level: newLevel,
              userId: userProfile!.id,
              displayName: `${userProfile!.firstName} ${userProfile!.lastName}`,
            },
          });
        }}
      />
      <GoalListContainer
        goals={userGoals || []}
        profileId={userProfile!.id}
        onGoalComplete={(goalId) => {
          const goal = userGoals?.find((goal) => goal.id === goalId);
          if (!goal) {
            console.warn("Goal not found, cannot send goal completion event");
            return;
          }

          send({
            type: "GOAL_COMPLETED",
            payload: {
              goalName: goal!.name,
              timestamp: new Date().toLocaleString(),
              userId: userProfile!.id,
              goalType: goal!.type,
            },
          });
        }}
      />
      <GoalCreationForm
        profileId={userProfile!.id}
        onGoalCreated={refreshGoals}
      />
    </div>
  );
};

const ToastComponent = ({ latestEvent }: { latestEvent: HypeHubEvent }) => {
  if (latestEvent.type !== "GOAL_COMPLETED") return null;
  const payload = latestEvent.payload as GoalCompletedPayload;

  return (
    <div className="pixel-text">
      <div className="flex items-center gap-2">
        <i className="nes-icon trophy is-small"></i>
        <span className="nes-text is-success">Quest Complete!</span>
      </div>
      <div className="nes-text is-warning mt-2">{payload.goalName}</div>
      <div className="nes-text is-primary mt-1">
        {payload.goalType} goal achieved!
      </div>
    </div>
  );
};
