
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";  
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Goal } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";  
import { Calendar, Clock, Award } from "lucide-react";
import { getGoalTypeHoverColor, getGoalTypeColor, getAttributeColor } from "./Goals";

export const GoalDialog = ({
    goal,
    loading,
    completingGoalId,
    onComplete
  }: {
    goal: Goal;
    loading: boolean;
    completingGoalId: number | null;
    onComplete: (goalId: number) => Promise<void>;
  }) => {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            key={goal.id}
            className={`bg-gray-800 rounded-lg p-4 transition-all ${getGoalTypeHoverColor(
              goal.type
            )}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Use pixel font for goal name */}
                  <h3 className="text-white font-pixel">{goal.name}</h3>
                  <Badge className={`${getGoalTypeColor(goal.type)} badge font-grotesk`}>
                    {goal.type}
                  </Badge>
                </div>
                {/* Use body font (Exo 2) for description */}
                <p className="text-gray-400 text-base h-12 font-body">
                  {goal.description}
                </p>
                <div className="flex gap-2">
                  {goal.attributes?.map((attr) => (
                    <Badge
                      key={attr}
                      variant="outline"
                      className={`${getAttributeColor(attr)} badge font-grotesk`}
                    >
                      {/* {attr} */}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-3xl p-4 sm:p-6 bg-gray-900 border-gray-800">
          <DialogHeader className="mb-3 sm:mb-4">
            {/* Use pixel font for main title */}
            <DialogTitle className="sm:text-xl text-white flex items-center gap-3 font-pixel">
              {goal.name}
              <Badge className={`${getGoalTypeColor(goal.type)} badge font-grotesk`}>
                {goal.type}
              </Badge>
            </DialogTitle>
            {/* Use body font for description */}
            <DialogDescription className="text-gray-400 text-sm sm:text-base font-body">
              {goal.description}
            </DialogDescription>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Timeline Section */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white mb-3 font-pixel">Timeline</h3>
              <div className="grid grid-cols-2 gap-4 text-lg font-body font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>Created: {format(new Date(goal.createdAt), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-lg font-body">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>Target: {goal.targetDate ? format(new Date(goal.targetDate), 'PPP') : 'No deadline'}</span>
                </div>
              </div>
            </div>
  
            {/* Rewards Section */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white mb-3 font-pixel">Rewards</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {goal.attributes?.map((attr) => (
                  <div key={attr} 
                    className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                  >
                    <span className="capitalize text-gray-200 font-body">{attr}</span>
                    <Badge variant="secondary" className={`bg-game-attribute-${attr.toLowerCase()} border-game-attribute-${attr.toLowerCase()} text-white uppercase font-grotesk`}>
                      +1 XP
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <DialogFooter className="mt-6">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 
                hover:from-purple-700 hover:to-indigo-700 font-pixel"
              onClick={async () => {
                await onComplete(goal.id);
                setOpen(false);
              }}
              disabled={loading && completingGoalId === goal.id}
            >
              {loading && completingGoalId === goal.id ? (
                <span className="animate-pulse">Completing Goal...</span>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  Complete Goal
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
