import React from "react";
import { DataFlowProvider } from "../context/DataFlowContext";
import BoardContainer from "./board-container";
import { GameDetails } from "../types/chessData";
import Input from "./input";
function Game() {
    const [gameData, setGameData] = React.useState({} as GameDetails);
    const [currentPtr, setCurrentPtr] = React.useState(0);
    function changeGameData(update: Partial<GameDetails>) {
        setGameData((prev) => ({
            ...prev,
            ...update,
        }));
    }
    function moveNext() {
        if (currentPtr < gameData.headers.moves - 1) {
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
                moveNext,
                movePrev,
            }}
        >
            <BoardContainer />
            <Input />
        </DataFlowProvider>
    );
}
export default Game;
