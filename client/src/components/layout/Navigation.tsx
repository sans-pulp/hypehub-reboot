"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ViewType = "dashboard" | "goals" | "social" | "achievements";

interface NavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "🏰 Dashboard", value: "dashboard" as ViewType },
    { id: "goals", label: "🎯 Goals", value: "goals" as ViewType },
    { id: "social", label: "👥 Social", value: "social" as ViewType },
    {
      id: "achievements",
      label: "🏆 Achievements",
      value: "achievements" as ViewType,
    },
  ];

  return (
    <div className="w-full bg-gray-900  ">
      <div className="container mx-auto px-4">
        <Tabs
          className="w-fit mx-auto pt-10"
          value={activeView}
          onValueChange={onViewChange as (value: string) => void}
        >
          <TabsList className="w-full justify-center bg-gray-800/50">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.value}
                className="data-[state=active]:bg-purple-600 h-10 px-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
