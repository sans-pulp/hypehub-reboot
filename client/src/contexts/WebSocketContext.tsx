'use client'
import { createContext, useContext, useMemo } from "react";
import { useWebSocket } from "../hooks/useWebsocket";

const WebSocketContext = createContext<ReturnType<typeof useWebSocket> | null>(null);
const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080'   

export const WebSocketProvider = ({children} : {children: React.ReactNode}) => {
    const socket = useWebSocket(WS_URL);
    // console.log("WebSocketProvider mounting...", socket);
    const contextValue = useMemo(() => socket, [socket]);

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};