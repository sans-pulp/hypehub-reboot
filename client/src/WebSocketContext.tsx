'use client'
import { createContext, useContext } from "react";
import { useWebSocket } from "./hooks/useWebsocket";

const WebSocketContext = createContext<ReturnType<typeof useWebSocket> | null>(null);

export const WebSocketProvider = ({children} : {children: React.ReactNode}) => {
    const socket = useWebSocket('ws://localhost:8080')
    console.log("WebSocketProvider mounting...");
    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
}