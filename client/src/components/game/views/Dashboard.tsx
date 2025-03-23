"use client";

import type { Attribute, Goal } from "@/db/schema";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useLevelSystemContext } from "@/contexts/LevelSystemContext";
import { CompletedGoalsSlider } from "./CompletedGoalsSlider";

interface DashboardProps {
  attributes: Attribute;
  completedGoals: Goal[];
}

export const Dashboard = ({attributes, completedGoals }: DashboardProps) => {
  const { experience, level, progressToNext, requiredXP } = useLevelSystemContext();
  const attributesList = [
    { name: "Strength", value: attributes.strength, icon: "💪" },
    { name: "Vitality", value: attributes.vitality, icon: "❤️" },
    { name: "Knowledge", value: attributes.knowledge, icon: "📚" },
    { name: "Social", value: attributes.social, icon: "🤝" },
    { name: "Willpower", value: attributes.willpower, icon: "✨" },
  ];

  const getCompletedGoalsByAttribute = (attribute: string) => {
    return completedGoals.filter((goal) => goal.attributeRewards.some((reward) => reward.type === attribute));
  };


  return (
    <div className="dashboard-view p-6">
      {/* Level and XP Section */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Level {level}
          </h2>
          <div className="text-purple-400">XP: {experience}</div>
        </div>
        <div className="mt-2 w-full bg-gray-700 rounded-full h-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="bg-purple-600 h-4 rounded-full transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>You need {requiredXP} XP to level up</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributesList.map((attr) => (
          <div key={attr.name} className="stat-card p-4 bg-gray-800 rounded-lg">
              <CompletedGoalsSlider completedGoals={getCompletedGoalsByAttribute(attr.name.toLowerCase())} icon={attr.icon} name={attr.name} value={attr.value} />
          </div>
        ))}
      </div>

    </div>
  );
};

