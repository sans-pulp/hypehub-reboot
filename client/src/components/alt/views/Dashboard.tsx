"use client";

import type { Attribute, Goal } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useLevelSystemContext } from "@/contexts/LevelSystemContext";

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
                <p>Level {level} - {requiredXP} XP to next level</p>
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


export const CompletedGoalsSlider = ({completedGoals, icon, name, value}: {completedGoals: Goal[], icon: string, name: string, value: number}) => {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false)
  const [open, setOpen] = useState(false)

  const currentGoal = completedGoals[currentGoalIndex]
  const totalGoals = completedGoals.length

  const handleNextGoal = () => {
    setCurrentGoalIndex((prevIndex) => (prevIndex + 1) % totalGoals)
  }

  const handlePrevGoal = () => {
    setCurrentGoalIndex((prevIndex) => (prevIndex - 1 + totalGoals) % totalGoals)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-3 cursor-pointer">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-white font-medium">{name}</h3>
            <div className="text-purple-400 text-lg font-bold">
              {value}
            </div>
          </div>
        </div>
      </DialogTrigger>
      {totalGoals > 0 && currentGoal && (
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Completed Goals</DialogTitle>
            <DialogDescription>{currentGoalIndex + 1} of {totalGoals} completed goals</DialogDescription>
          </DialogHeader>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xs">{currentGoal.name}</CardTitle>
                  <CardDescription className="mt-1 font-mono text-md">{currentGoal.description}</CardDescription>
                </div>
                  <Badge variant="outline" className="text-xs font-mono capitalize">{currentGoal.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="flex gap-2 mb-4 flex-wrap">
                {currentGoal.attributes!.map((attr) => (
                  <Badge key={attr} variant="secondary" className="capitalize font-mono">{attr}</Badge>
                ))}
              </div>

              {showInfo && (
                <div className="mt-4 font-mono space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Target Date:</span>
                    </div>
                    <div className="text-xs">{currentGoal.targetDate ? format(new Date(currentGoal.targetDate), "PPP") : "N/A"}</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Completed At:</span>
                    </div>
                    <div className="text-xs">{currentGoal.completedAt ? format(new Date(currentGoal.completedAt), "PPP") : "N/A"}</div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" /> Rewards
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {currentGoal.attributeRewards.map((reward, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="capitalize">{reward.type}</span>
                          <Badge variant="outline">+{reward.points}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button onClick={() => setShowInfo(!showInfo)} variant="ghost" className="flex items-center justify-center gap-2 w-full">
                  {showInfo ? "Hide Details" : "Show Details"}
                </Button>
                <div className="flex items-center justify-between w-full">
                  <Button onClick={handlePrevGoal} variant="outline" size="icon" disabled={currentGoalIndex === 0 || totalGoals <= 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleNextGoal} variant="outline" size="icon" disabled={currentGoalIndex === totalGoals - 1 || totalGoals <= 1}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
            </CardFooter>
          </Card>
        </DialogContent>
      )}
    </Dialog>
  )
}