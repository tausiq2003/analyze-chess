"use client";
import React from "react";
import { GameDetails } from "../types/chessData";
interface DataFlowContextType {
    gameData: GameDetails;
    currentPtr: number;
    changeGameData: (update: Partial<GameDetails>) => void;
    moveNext: () => void;
    movePrev: () => void;
}
export const DataFlowContext = React.createContext<DataFlowContextType>({
    gameData: {} as GameDetails,
    currentPtr: 0,
    changeGameData: () => {},
    moveNext: () => {},
    movePrev: () => {},
});

export const DataFlowProvider = DataFlowContext.Provider;

export default function useDataFlow() {
    return React.useContext(DataFlowContext);
}
