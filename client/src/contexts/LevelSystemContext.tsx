'use client'

import { createContext, useContext, useMemo } from "react";
import { useLevelSystem } from "@/hooks/useLevelSystem";

const LevelSystemContext = createContext<ReturnType<typeof useLevelSystem> | null>(null);

export const LevelSystemProvider = ({children}: {children: React.ReactNode}) => {
    const contextValue = useLevelSystem();

    return (
        <LevelSystemContext.Provider value={contextValue}>
            {children}
        </LevelSystemContext.Provider>
    )
}

export const useLevelSystemContext = () => {
    const context = useContext(LevelSystemContext)
    if (!context) {
        throw new Error('useLevelSystemContext must be used within a LevelSystemProvider')
    }
    return context;
}