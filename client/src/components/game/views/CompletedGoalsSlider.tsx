"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Goal } from "@/db/schema";
import { useState } from "react";
import { Calendar, Clock, Award } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
              <h3 className="text-white font-pixel">{name}</h3>
              <div className="text-purple-400 text-lg font-pixel">
                {value}
              </div>
            </div>
          </div>
        </DialogTrigger>
        {totalGoals > 0 && currentGoal && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-pixel">Completed Goals</DialogTitle>
              <DialogDescription className="font-body">{currentGoalIndex + 1} of {totalGoals} completed goals</DialogDescription>
            </DialogHeader>
            <Card className="border-0 shadow-none">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xs font-pixel">{currentGoal.name}</CardTitle>
                    <CardDescription className="mt-1 text-md font-body">{currentGoal.description}</CardDescription>
                  </div>
                    <Badge variant="outline" className={`text-xs font-grotesk bg-game-goal-${currentGoal.type.toLowerCase()} border-game-goal-${currentGoal.type.toLowerCase()} uppercase`}>
                      {currentGoal.type}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {currentGoal.attributes!.map((attr) => (
                    <Badge 
                      key={attr} 
                      variant="secondary" 
                      className={`font-grotesk bg-game-attribute-${attr.toLowerCase()} border-game-attribute-${attr.toLowerCase()} text-white uppercase`}
                    >
                      {attr}
                    </Badge>
                  ))}
                </div>
  
                {showInfo && (
                  <div className="mt-4 space-y-4 text-base">
                    <div className="grid grid-cols-2 gap-2 font-body">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Target Date:</span>
                      </div>
                      <div className="text-base">{currentGoal.targetDate ? format(new Date(currentGoal.targetDate), "PPP") : "N/A"}</div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Completed At:</span>
                      </div>
                      <div className="text-base">{currentGoal.completedAt ? format(new Date(currentGoal.completedAt), "PPP") : "N/A"}</div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-pixel text-xs mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" /> Rewards
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {currentGoal.attributeRewards.map((reward, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span className="capitalize font-body">{reward.type}</span>
                            <Badge 
                              variant="outline" 
                              className={`font-grotesk bg-game-attribute-${reward.type.toLowerCase()} border-game-attribute-${reward.type.toLowerCase()} text-white uppercase`}
                            >
                              +{reward.points}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                  <Button onClick={() => setShowInfo(!showInfo)} variant="ghost" className="flex items-center justify-center gap-2 w-full font-pixel text-xs">
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
