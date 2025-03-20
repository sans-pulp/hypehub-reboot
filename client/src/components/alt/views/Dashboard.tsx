"use client";

import type { Attribute } from "@/db/schema";

interface DashboardProps {
  attributes: Attribute;
}

export const Dashboard = ({attributes }: DashboardProps) => {
  const attributesList = [
    { name: "Strength", value: attributes.strength, icon: "💪" },
    { name: "Vitality", value: attributes.vitality, icon: "❤️" },
    { name: "Knowledge", value: attributes.knowledge, icon: "📚" },
    { name: "Social", value: attributes.social, icon: "🤝" },
    { name: "Willpower", value: attributes.willpower, icon: "✨" },
  ];

  return (
    <div className="dashboard-view p-6">
      {/* Level and XP Section */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Level {attributes.level}
          </h2>
          <div className="text-purple-400">XP: {attributes.experience}</div>
        </div>
        <div className="mt-2 w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-purple-600 h-4 rounded-full transition-all"
            style={{ width: `${attributes.experience % 100}%` }}
          />
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributesList.map((attr) => (
          <div key={attr.name} className="stat-card p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{attr.icon}</span>
              <div>
                <h3 className="text-white font-medium">{attr.name}</h3>
                <div className="text-purple-400 text-lg font-bold">
                  {attr.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
