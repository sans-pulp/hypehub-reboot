"use client";

import type { Profile } from "@/db/schema";

interface HeaderProps {
  isConnected: boolean;
  profile: Profile | null;
}

export const Header = ({ isConnected, profile }: HeaderProps) => {
  return (
    <header className="game-header bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">HypeHub</h1>
          <span className="connection-status px-3 py-1 rounded-full text-sm">
            {isConnected ? (
              <span className="text-green-400">🟢 Connected</span>
            ) : (
              <span className="text-red-400">🔴 Disconnected</span>
            )}
          </span>
        </div>

        {profile && (
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="font-medium">
                {profile.firstName} {profile.lastName}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
