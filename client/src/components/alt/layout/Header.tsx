"use client";

import type { Profile } from "@/db/schema";
import { WeatherStatus } from "@/components/weather/WeatherStatus";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface HeaderProps {
  isConnected: boolean;
  profile: Profile | null;
  connectedUsers: number;
}

export const Header = ({ isConnected, profile, connectedUsers }: HeaderProps) => {
  return (
    <header className="bg-gray-900 game-header text-white px-4 py-2">
      <div className="flex items-center m-2 justify-between">
        {/* Left section - Brand and status */}
        <TooltipProvider>
       
          <div className="flex items-center gap-1 text-xs">
            
              <Tooltip>
                  <TooltipTrigger asChild> 
                    <div className="flex items-center gap-2">
                  <h1 className={`text-xl font-bold ${isConnected ? 'text-game-rarity-legendary' : 'text-game-rarity-common'}`}>HypeHub</h1>
                      </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white">
                      {isConnected ? `🟢 Connected: ${connectedUsers} users` : '🔴 Disconnected'}
                  </TooltipContent>
              </Tooltip>
          
          </div>
          </TooltipProvider>

        {/* Right section - Weather and Profile */}
        <div className="flex items-center gap-6">
          <WeatherStatus />
          {profile && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
