# Attribute Information Display Guide

## Overview
The attribute information system provides contextual details about character attributes and achievements, focusing on mastery progression and achievement rarity in the gamified interface.

## Key Features
- Attribute mastery level display
- Achievement rarity indicators
- Progress tracking towards next mastery tier
- Recent attribute changes
- Achievement history

## Color System Integration
Uses established color schemes from tailwind.config.ts:
- Attribute colors (strength, knowledge, vitality, social, willpower)
- Rarity tiers for mastery and achievements:
  - Common (1-20): Steel gray
  - Uncommon (21-40): Emerald green
  - Rare (41-60): Electric blue
  - Epic (61-80): Royal purple
  - Legendary (81-100): Gold

## Implementation Phases

### Phase 1: Attribute Display
1. Create base AttributeInfo component
2. Implement mastery level calculations
3. Add progress tracking
4. Display current tier and progress to next

### Phase 2: Achievement Integration
1. Connect to achievement system
2. Add rarity-based achievement display
3. Show achievement history
4. Implement achievement progress tracking

### Phase 3: Visual Feedback
1. Add animations for attribute changes
2. Implement mastery tier transitions
3. Add progress indicators
4. Achievement unlock celebrations

## Component Dependencies
- Radar/Heatmap chart
- Achievement display
- Progress indicators
- User state management

## State Management Requirements
Track:
- Current attribute levels and mastery tiers
- Achievement completion and rarity
- Progress towards next mastery level
- Recent attribute changes

## Usage Guidelines
- Integrate with radar/heatmap display
- Show on achievement unlocks
- Display during level-up events
- Include in profile overview

## Performance Considerations
- Cache mastery calculations
- Optimize achievement queries
- Batch attribute updates
- Efficient progress calculations

## Future Enhancements
- Detailed mastery statistics
- Achievement combinations
- Mastery rewards
- Special achievement categories

## Testing Scenarios
1. Attribute mastery progression
2. Achievement rarity assignment
3. Progress calculations
4. Level-up events
5. Multiple achievement unlocks