import { AttributeTypes } from "@/db/schema"
import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AttributeCheckboxesProps } from "../types"

export const AttributeCheckboxes = ({ attributePoints, selectedAttributes, onChange,  setAttributePoints }: AttributeCheckboxesProps) => {
    // Convert AttributeTypes object to array for easier mapping
    const attributeOptions = Object.values(AttributeTypes);
    
    const handleToggleAttribute = (attribute: string) => {
      if (selectedAttributes.includes(attribute)) {
        // Remove attribute if already selected
        onChange(selectedAttributes.filter(a => a !== attribute));
        // delete attributePoints[attribute];
        const updatedPoints = { ...attributePoints };
        delete updatedPoints[attribute];
        setAttributePoints(updatedPoints);
      } else {
        // Add attribute if not selected
        onChange([...selectedAttributes, attribute]);
        // add attributePoints[attribute] = 1;
        const updatedPoints = { ...attributePoints };
        updatedPoints[attribute] = 1;
        setAttributePoints(updatedPoints);
      }
    };
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {attributeOptions.map((attribute) => (
          <div key={attribute} className="flex items-center space-x-2">
            <Checkbox
              id={`attribute-${attribute}`}
              checked={selectedAttributes.includes(attribute)}
              onCheckedChange={() => handleToggleAttribute(attribute)}
            />
            <Label 
              htmlFor={`attribute-${attribute}`} 
              className="capitalize text-sm sm:text-base cursor-pointer"
            >
              {attribute.slice(0, 3).toUpperCase()}
            </Label>
          </div>
        ))}
      </div>
    );
  };