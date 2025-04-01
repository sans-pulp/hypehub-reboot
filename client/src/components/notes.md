Complete UI-enhancements branch with:
- Level-up celebration UI/feedback
- Any remaining animation polish
- Final UI testing

Create goal-refinements branch for:
- Goal categorization
- Goal status system
- Progress tracking
- Integration improvements

For a level-up celebration, a modal with effects would be more engaging and memorable than a toast notification because:
Impact & Celebration
- Modal takes center stage, commanding attention
- Full-screen effects create a more celebratory moment
- Gives the achievement more weight and importance
- Creates a more "game-like" feel
- Modal creates a "moment of pause" to appreciate achievement
- More similar to RPG/game level-up experiences users are familiar with

Visual Opportunities:
- Can include particle effects/sparkles
- Room for attribute increases animation
- Could show what's unlocked at new level
- Space for congratulatory messages
Could add sound effects (optional/togglable)

- Create LevelUpModal.tsx
- Add css file for particle effects/slide in or float animations

- Create system for level up detection
    - Catches level-ups from any source (goal completion, streaks, achievements, etc.)
    - Triggers modal with celebration effects
    - Could include attribute increases, unlocked abilities, etc.

Level Manager Game Flow: 
```
Goal Completed → handleGoalComplete
                  ↓
              Updates XP → XP/Level Manager detects level up
                          ↓
                      Triggers celebration
                          ↓
                      Updates attributes/rewards
```

Component Responsibilities
- `handleGoalComplete`: Just handles goal completion and XP award
- `XP/Level Manager`: Watches for level changes and triggers celebrations - does level calculations and XP tracking. Single source of truth for progressions
- `Dashboard`: Displays current state (level, XP, attributes)
- `Level-up Modal`: Pure UI component

--> Create LevelSystemProvider to:
The LevelSystemProvider should focus purely on:
Tracking XP/level state
Detecting level-ups
Managing celebrations
Providing progression data to components

Data Flow:
```
Goal Completed → handleGoalComplete
                  ↓
              Updates XP → LevelSystemProvider detects level up
                          ↓
                      Triggers celebration
                          ↓
                      Updates attributes/rewards
```
```
Goal Completion → Database Update
       ↓
Data Refresh → LevelSystemProvider
       ↓
Level Detection → Celebration
       ↓
UI Updates (Dashboard)
```

Integration Points
Dashboard would use it for displays
Goal completion would notify it
Achievement system could hook into it