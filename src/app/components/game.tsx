"use client";
import React from "react";
import { DataFlowProvider } from "../context/DataFlowContext";
import BoardContainer from "./board-container";
import { GameDetails } from "../types/chessData";
import Input from "./input";
import GoogleCaptchaWrapper from "./googlecaptchawrapper";
function Game() {
    const [gameData, setGameData] = React.useState({} as GameDetails);
    const [currentPtr, setCurrentPtr] = React.useState(0);
    const [boardFlipped, setBoardFlipped] = React.useState(false);
    const [arrows, setArrows] = React.useState<
        { from: string; to: string; color: string }[]
    >([]);
    function changeGameData(update: Partial<GameDetails>) {
        setGameData((prev) => ({
            ...prev,
            ...update,
        }));
    }
    function moveNext() {
        if (gameData.headers && currentPtr < (gameData.headers.moves || 0)) {
            setCurrentPtr((ptr) => ptr + 1);
        }
    }
    function movePrev() {
        if (currentPtr > 0) {
            setCurrentPtr((ptr) => ptr - 1);
        }
    }
    return (
        <DataFlowProvider
            value={{
                gameData,
                changeGameData,
                currentPtr,
                setCurrentPtr,
                boardFlipped,
                setBoardFlipped,
                moveNext,
                movePrev,
                arrows,
                setArrows,
            }}
        >
            <BoardContainer />
            <GoogleCaptchaWrapper>
                <Input />
            </GoogleCaptchaWrapper>
        </DataFlowProvider>
    );
}
export default Game;
