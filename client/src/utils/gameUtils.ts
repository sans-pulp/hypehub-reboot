/**
 * Game mechanics utility functions for HypeHub
 */

/**
 * Calculate the XP required for a given level
 * Uses a tiered system:
 * - Early levels (1-5): Linear, low requirements
 * - Mid levels (6-10): Slightly steeper
 * - Higher levels (11+): Traditional RPG curve
 */
export const calculateRequiredXP = (level: number): number => {
    const baseXP = 25;
    
    if (level <= 5) {
        // Early levels: Linear and easy
        return baseXP * level;
    } else if (level <= 10) {
        // Mid levels: Slightly steeper
        return baseXP * level * 1.2;
    } else {
        // Higher levels: Add a fixed amount per level beyond 10. This creates a steady but manageable increase
        const extraPerLevel = 50; // Additional XP per level after 10
        return baseXP * level * 1.2 + (level - 10) * extraPerLevel;
    }
};

/**
 * Calculate the total XP needed from level 1 to reach a given level
 */
export const calculateTotalXPForLevel = (level: number): number => {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += calculateRequiredXP(i);
    }
    return total;
};

/**
 * Calculate what level a user should be based on their total XP
 */
export const calculateLevelFromXP = (totalXP: number): number => {
    let level = 1;
    while (calculateTotalXPForLevel(level + 1) <= totalXP) {
        level++;
    }
    return level;
};

/**
 * Calculate progress towards next level as a percentage
 */
export const calculateLevelProgress = (totalXP: number): number => {
    const currentLevel = calculateLevelFromXP(totalXP);
    const xpForCurrentLevel = calculateTotalXPForLevel(currentLevel);
    const xpForNextLevel = calculateTotalXPForLevel(currentLevel + 1);
    
    const xpInCurrentLevel = totalXP - xpForCurrentLevel;
    const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
    
    return Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100);
}; 