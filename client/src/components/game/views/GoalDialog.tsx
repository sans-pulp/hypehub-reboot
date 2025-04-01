"use client";

import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";  
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Goal } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";  
import { Calendar, Clock, Award, Save, X, Text, ScrollText} from "lucide-react";
import { getGoalTypeHoverColor, getGoalTypeColor, getAttributeColor } from "./Goals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GOAL_TYPES } from "@/components/ui/constants";

export const GoalDialog = ({
    goal,
    loading,
    completingGoalId,
    onComplete,
    onEdit,

  }: {
    goal: Goal;
    loading: boolean;
    completingGoalId: number | null;
    onComplete: (goalId: number) => Promise<void>;
    onEdit: (goalId: number, updatedData: Partial<Goal>) => Promise<Goal>;
  }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoal, setEditedGoal] = useState(goal);
    const [error, setError] = useState<string | null>(null);
    
    console.log("goal to edit", goal, editedGoal);
    const handleEdit = () => {
      setError(null);
      setEditedGoal(goal);
      setIsEditing(true);
    };

    const handleSave = async () => {
      try {
        setError(null);
        await onEdit(goal.id, editedGoal);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save goal:", error);
        setError(error instanceof Error ? error.message : "Failed to save goal");
      }
    };

    const handleCancel = () => {
      setError(null);
      setEditedGoal(goal);
      setIsEditing(false);
    };

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
          <DialogTitle className="text-white text-lg font-pixel">{isEditing ? "Edit Goal" : ""}</DialogTitle>
          <DialogHeader className="mb-3 sm:mb-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white text-sm mb-1.5 block">
                    Goal Name
                  </Label>
                  <Input
                    id="name"
                    value={editedGoal.name}
                    onChange={(e) => setEditedGoal({ ...editedGoal, name: e.target.value })}
                    className="hypehub-input"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white text-sm mb-1.5 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editedGoal.description}
                    onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
                    className="hypehub-textarea"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-white text-sm mb-1.5 block">
                    Goal Type
                  </Label>
                  <Select
                    value={editedGoal.type}
                    onValueChange={(value) => setEditedGoal({ ...editedGoal, type: value })}
                  >
                    <SelectTrigger className="hypehub-input font-pixel">
                      <SelectValue placeholder={editedGoal.type} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {GOAL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "daily" && "📋 "}
                          {type === "mission" && "🏰 "}
                          {type === "quest" && "🗺️ "}
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main Details Section */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-pixel text-white">{goal.name}</h2>
                      <Badge className={`${getGoalTypeColor(goal.type)} badge font-grotesk`}>
                        {goal.type}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-200 font-body leading-relaxed">{goal.description}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>
  
          {!isEditing && (
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
          )}
  
          {error && (
            <div className="mt-3 p-2 bg-red-900/30 border border-red-800 rounded-md">
              <p className="text-red-400 text-xs sm:text-sm">{error}</p>
            </div>
          )}
  
          <DialogFooter className="mt-6">
            {isEditing ? (
              <>
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r font-pixel from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                  onClick={handleCancel}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r font-pixel from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r font-pixel from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                  onClick={handleEdit}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Edit Goal
                </Button>
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r font-pixel from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
