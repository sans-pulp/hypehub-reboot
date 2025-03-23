"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FilterIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAttributeColor } from "./Goals";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GoalFiltersProps {
  activeFilter: "all" | "daily" | "mission" | "quest";
  setActiveFilter: (filter: "all" | "daily" | "mission" | "quest") => void;
  selectedAttributes: string[];
  setSelectedAttributes: Dispatch<SetStateAction<string[]>>;
  allAttributes: string[];
}


export const GoalFilters = ({
    activeFilter,
    setActiveFilter,
    selectedAttributes,
    setSelectedAttributes,
    allAttributes,
  }: GoalFiltersProps) => {
    const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);
    
    const toggleAttribute = (attribute: string) => {
        setSelectedAttributes((prev) =>
          prev.includes(attribute)
            ? prev.filter((a) => a !== attribute)
            : [...prev, attribute]
        );
      };


    return (

        <div className="flex flex-wrap gap-8 items-center">
            {/* Goal Type Dropdown */}
            <div className="flex items-center">
              <span className="text-gray-400 mr-2 text-sm font-pixel">Goal Type:</span>
              <Select
                value={activeFilter}
                onValueChange={(value) =>
                  setActiveFilter(value as typeof activeFilter)
                }
              >
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white font-body text-base">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all" className="font-body">All Goals</SelectItem>
                  <SelectItem value="daily" className="font-body">Daily</SelectItem>
                  <SelectItem value="mission" className="font-body">Missions</SelectItem>
                  <SelectItem value="quest" className="font-body">Quests</SelectItem>
                </SelectContent>
              </Select>
            </div>
    
           {/* Attributes Filter */}
           <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2 text-sm font-pixel">Attributes:</span>
                <Dialog
                  open={attributeDialogOpen}
                  onOpenChange={setAttributeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-700 bg-gray-800 text-white h-10 px-4 font-body text-base"
                      size="sm"
                    >
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Filter
                      {selectedAttributes.length > 0 && (
                        <Badge
                          className="ml-2 bg-purple-600 text-white font-grotesk"
                          variant="secondary"
                        >
                          {selectedAttributes.length}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <DialogTitle className="font-pixel">Filter by Attributes</DialogTitle>
                    <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                      <div className="space-y-2">
                        {allAttributes.map((attribute) => (
                          <div
                            key={attribute}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`filter-${attribute}`}
                              checked={selectedAttributes.includes(attribute)}
                              onCheckedChange={() => toggleAttribute(attribute)}
                            />
                            <Label
                              htmlFor={`filter-${attribute}`}
                              className="text-white cursor-pointer capitalize font-body"
                            >
                              {attribute}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedAttributes.length > 0 && (
                      <div className="mt-4 pt-2 border-t border-gray-700">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-gray-400 font-body"
                          onClick={() => setSelectedAttributes([])}
                        >
                          <XIcon className="h-4 w-4 mr-2" />
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
    
              {/* Selected Attribute Badges - show if there are any */}
              {selectedAttributes.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  {selectedAttributes.map((attr) => (
                    <Badge
                      key={attr}
                      variant="outline"
                      className={`bg-gray-700 text-white cursor-pointer capitalize h-8 px-1 font-grotesk ${getAttributeColor(
                        attr
                      )}`}
                      onClick={() => toggleAttribute(attr)}
                    >
                      {attr}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
    
    );
  };
