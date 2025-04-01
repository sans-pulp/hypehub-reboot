# Character Progression System

## Current Implementation

### Core Attributes
- Five main attributes
  - Strength, Vitality, Knowledge, Social, Willpower
- Basic attribute tracking
  - Points allocation (1-5 per attribute)
  - Storage in Supabase
  - Simple display

### Experience System
- Tiered level progression
  - Early levels (1-5): Linear progression (+25 XP per level)
  - Mid levels (6-10): Moderate increase (+32.5 XP per level)
  - Higher levels (11+): Steeper curve (+65-75 XP per level)
- Current display
  - Basic NES.css styled progress bars
  - Simple level number
  - Current XP amount
- XP Sources
  - Goal completion (primary source)
  - Daily login rewards
    - Base XP for logging in each day
    - Streak bonuses for consecutive days
  - Streak bonuses
    - Multipliers for maintaining daily goals
    - Bonus XP for achievement streaks
    - Special rewards for milestone streaks

## Planned Enhancements

### Advanced Visualization
- Radar chart implementation
  - Dynamic scaling
  - Smooth transitions
  - Color coding per attribute
- Interactive elements
  - Hover for details
  - Click for history
  - Goal impact preview

### Enhanced Progression
- Achievement milestones
  - Individual attribute achievements
  - Balance achievements
  - Specialization paths
- Advanced progress visualization
  - Historical data tracking
  - Trend analysis
  - Compare previous/current

### Visual Feedback
- Retro-styled components
- Dynamic animations
  - Level-up effects
  - Progress transitions
  - Milestone celebrations
- Color-coded feedback

## Technical Implementation

### Current Architecture
- Basic attribute storage in Supabase
- Simple state management
- Basic progress calculations

### Future Improvements
- Advanced achievement system
- Social comparison features
- Detailed progress analytics
- Character class specializations
