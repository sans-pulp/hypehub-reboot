import { AttributeType } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATTRIBUTE_COLORS, MIN_ATTRIBUTE_POINTS, MAX_ATTRIBUTE_POINTS } from "@/components/goal-creation/constants";

interface AttributeRewardsProps {
  attributes: AttributeType[];
  attributePoints: Record<AttributeType, number>;
  setAttributePoints: (points: Record<AttributeType, number>) => void;
}

export const AttributeRewards = ({ 
  attributes, 
  attributePoints, 
  setAttributePoints 
}: AttributeRewardsProps) => {
  return (
    <>
      {attributes.map(attr => (
        <div key={attr} className="flex items-center mb-3">
          <Badge 
            className={`w-40 mr-4 ${ATTRIBUTE_COLORS[attr as keyof typeof ATTRIBUTE_COLORS]} flex justify-center text-sm capitalize`}
          >
            {attr}
          </Badge>
          <div className="flex items-center">
            <Button
              onClick={() => {
                const newValue = Math.max(
                  MIN_ATTRIBUTE_POINTS, 
                  (attributePoints[attr] || MIN_ATTRIBUTE_POINTS) - 1
                );
                setAttributePoints({ ...attributePoints, [attr]: newValue });
              }}
              className="px-2 py-1 border rounded-l"
            >
              -
            </Button>
            <span className="px-3 py-1 border-t border-b">
              {attributePoints[attr] || 1}
            </span>
            <Button
              onClick={() => {
                const newValue = Math.min(
                  MAX_ATTRIBUTE_POINTS, 
                  (attributePoints[attr] || MIN_ATTRIBUTE_POINTS) + 1
                );
                setAttributePoints({ ...attributePoints, [attr]: newValue });
              }}
              className="px-2 py-1 border rounded-r"
            >
              +
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};