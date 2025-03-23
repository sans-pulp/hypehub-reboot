/**
 * Game mechanics utility functions for HypeHub
 */

// Base XP constant
export const BASE_XP = 25;

/**
 * Calculate the XP needed to achieve a level
 * For example:
 * - Level 1: 0 XP (you start here)
 * - Level 2: 25 XP
 * - Level 3: 50 XP
 * - Level 4: 75 XP
 * Uses a tiered system:
 * - Early levels (1-5): Linear progression (+25 XP per level)
 * - Mid levels (6-10): Moderate increase (+30-35 XP per level)
 * - Higher levels (11+): Steeper curve (+50-75 XP per level)
 */
export const getXPForLevel = (level: number): number => {
    if (level === 1) return 0;
    
    const targetLevel = level - 1;
    
    if (level <= 5) {
        return BASE_XP * targetLevel;
    } else if (level <= 10) {
        return BASE_XP * targetLevel * 1.3;
    } else {
        const extraPerLevel = 40;
        return BASE_XP * targetLevel * 1.3 + (targetLevel - 10) * extraPerLevel;
    }
};

/**
 * Calculate what level a user has achieved based on their total XP
 */
export const calculateLevelFromXP = (totalXP: number): number => {
    let level = 1;
    while (getXPForLevel(level + 1) <= totalXP) {
        level++;
    }
    return level;
}; 