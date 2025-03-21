import { getXPForLevel, calculateLevelFromXP, BASE_XP } from '@/utils/gameUtils';
import { Attribute } from '@/db/schema';
import { useEffect, useState } from 'react'
import { addExperiencePoints } from '@/db/queries/update';

export const useLevelSystem = () => {
    // single source of truth for level system
    // State: progress/experience, level, attribute bonuses
    // detect level up
    // also containe celebration logic/management and history tracking?

    // should this be initially set from user profile data
    const [experience, setExperience] = useState(0);
    const [level, setLevel] = useState(1);
    const [isLevelUp, setIsLevelUp] = useState(false);
    const [progressToNext, setProgressToNext] = useState(0);
    const [requiredXP, setRequiredXP] = useState(BASE_XP);

    const updateProgressState = (currentExp: number, currentLevel: number) => {
        const nextLevelXP = getXPForLevel(currentLevel + 1);
        const currentLevelXP = getXPForLevel(currentLevel);
        
        // How much more XP needed for next level
        const xpNeededForNext = nextLevelXP - currentExp;
        
        // Progress calculation
        const totalXPForLevel = nextLevelXP - currentLevelXP;
        const progress = (currentExp / totalXPForLevel) * 100;
        
        console.log("Level system state:", {
            experience: currentExp,
            level: currentLevel,
            neededForNext: xpNeededForNext,
            progress: Math.min(100, progress)
        });
        
        setProgressToNext(Math.max(0, Math.min(100, progress)));
        setRequiredXP(xpNeededForNext);
    };

    const initializeFromAttributes = (attributes: Attribute | null) => {
        if (!attributes) return;
        
        const initialExp = attributes.experience || 0;
        const initialLevel = attributes.level || 1;
        
        setExperience(initialExp);
        setLevel(initialLevel);
        setIsLevelUp(false);
        updateProgressState(initialExp, initialLevel);
    };

    const handleExperienceGain = (amount: number, profileId: number) => {
        if (amount < 0) return; // Don't allow negative XP gains
        
        const newExp = experience + amount;
        const newLevel = calculateLevelFromXP(newExp);
        
        setExperience(newExp);
        
        if (newLevel > level) {
            setLevel(newLevel);
            setIsLevelUp(true);
        }
        
        updateProgressState(newExp, newLevel);
        // update db 
        addExperiencePoints(profileId, amount, newLevel);   
    };

    // Reset level up celebration after delay
    useEffect(() => {
        if (isLevelUp) {
            const timer = setTimeout(() => setIsLevelUp(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isLevelUp]);

    return {
        experience,
        level,
        isLevelUp,
        progressToNext,
        requiredXP,
        initializeFromAttributes,
        handleExperienceGain
    };
};
