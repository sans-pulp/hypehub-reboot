# Achievement Rarity System

## Overview
The achievement rarity system provides a clear progression and reward structure for user accomplishments, using familiar RPG-style rarity tiers to indicate achievement significance and difficulty.

## Rarity Tiers

### Common (Steel Gray)
- Basic accomplishments
- Examples:
  - Complete first goal
  - Set up profile
  - Track a streak for 3 days
  - Reach level 5 in any attribute (125 XP)

### Uncommon (Emerald Green)
- Regular progression milestones
- Examples:
  - Complete 10 goals
  - Maintain a 7-day streak
  - Reach level 10 in any attribute (292.5 XP)
  - Complete goals in all weather conditions

### Rare (Electric Blue)
- Significant accomplishments
- Examples:
  - Complete 50 goals
  - Maintain a 30-day streak
  - Reach level 15 in any attribute (687.5 XP)
  - Balance progress across all attributes

### Epic (Royal Purple)
- Exceptional achievements
- Examples:
  - Complete 100 goals
  - Maintain a 100-day streak
  - Reach level 20 in any attribute (1070 XP)
  - Master multiple attributes simultaneously

### Legendary (Gold)
- Ultimate accomplishments
- Examples:
  - Complete 1000 goals
  - Maintain a 365-day streak
  - Reach level 80 in any attribute
  - Achieve mastery in all attributes

## Implementation Details

### Achievement Classification
- Each achievement has predefined rarity
- Rarity based on:
  - Difficulty to obtain
  - Time investment required
  - Skill/dedication needed
  - Impact on character growth

### Visual Elements
- Color-coded borders
- Rarity-specific icons
- Special effects for higher tiers
- Progress indicators
- Unlock celebrations

### Progress Tracking
- Clear progress indicators
- Milestone notifications
- Achievement history
- Rarity statistics

### Reward Integration
- XP bonuses based on rarity
- Attribute bonuses
- Special unlocks
- Achievement points

## Technical Implementation

### Data Structure
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  progress: number;
  completed: boolean;
  completedAt?: Date;
}
```

### Progress Calculation
- Real-time progress tracking
- Milestone checkpoints
- Completion validation
- History tracking

### Display Components
- Achievement card
- Progress bar
- Rarity indicator
- Unlock animation
- History view

## Integration Points

### Attribute System
- Achievement progress affects attributes
- Attribute levels unlock achievements
- Mastery system connection

### Goal System
- Goal completion triggers achievements
- Achievement progress from goals
- Goal streaks tie to achievements

### UI/UX
- Achievement notifications
- Progress updates
- Celebration effects
- Profile display

## Future Considerations
- Dynamic rarity adjustment
- Special event achievements
- Achievement chains
- Meta-achievements
- Community achievements 