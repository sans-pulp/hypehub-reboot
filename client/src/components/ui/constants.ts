
export const GOAL_TYPES = ['Daily', 'Mission', 'Quest'] as const;

export const ATTRIBUTE_COLORS = {
  strength: 'bg-game-attribute-strength',
  vitality: 'bg-game-attribute-vitality',
  knowledge: 'bg-game-attribute-knowledge',
  social: 'bg-game-attribute-social',
  willpower: 'bg-game-attribute-willpower',
} as const;

export const ATTRIBUTE_POINTS_LIMITS = {
  daily: {
    min: 1,
    max: 5,
  },
  mission: {
    min: 5,
    max: 15,
  },
  quest: {
    min: 15,
    max: 50,
  },
} as const;
