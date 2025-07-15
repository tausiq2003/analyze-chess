"use client";

import { useEffect, useState } from "react";
import Label from "./label";
import Board from "./board";
import EvalBar from "./eval-bar";

export default function BoardContainer({
    bN,
    bE,
    wN,
    wE,
    evalScore = "0.0",
    orientation = "white", // Default orientation
}: {
    bN?: string;
    bE?: string;
    wN?: string;
    wE?: string;
    evalScore?: string;
    orientation?: string;
}) {
    const [blackName, setBlackName] = useState<string>("Anonymous");
    const [whiteName, setWhiteName] = useState<string>("Anonymous");
    const [blackElo, setBlackElo] = useState<string>("???");
    const [whiteElo, setWhiteElo] = useState<string>("???");
    const [boardFlipped, setBoardFlipped] = useState<boolean>(false);
    const [boardWidth, setBoardWidth] = useState<number>(400);

    useEffect(() => {
        if (bN?.trim() || bE?.trim() || wN?.trim() || wE?.trim()) {
            setBlackName(bN || "Anonymous");
            setWhiteName(wN || "Anonymous");
            setBlackElo(bE || "???");
            setWhiteElo(wE || "???");
        }
    }, [bN, bE, wN, wE]);

    const flipBoard = () => {
        setBoardFlipped((prev) => !prev);
    };

    // Determine which orientation to use based on flipped state
    const actualOrientation = boardFlipped
        ? orientation === "white"
            ? "black"
            : "white"
        : orientation;

    return (
        <div className="w-full max-w-3xl ">
            {/*TODO: TO BE REMOVED*/}
            {/*}
            <div className="flex justify-end mb-2">
                <button
                    onClick={flipBoard}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    Flip Board
                </button>
            </div>
            */}
            <div className="flex-1">
                <div style={{ width: boardWidth, margin: "0 auto" }}>
                    <Label
                        name={boardFlipped ? whiteName : blackName}
                        elo={boardFlipped ? whiteElo : blackElo}
                        orientation={boardFlipped ? "white" : "black"}
                    />
                </div>
                <div className="flex items-stretch max-md:ml-2.5">
                    <EvalBar
                        evalScore={evalScore}
                        orientation={actualOrientation}
                    />
                    <Board
                        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        orientation={actualOrientation}
                        onBoardWidthChange={setBoardWidth}
                    />
                </div>
                <div style={{ width: boardWidth, margin: "0 auto" }}>
                    <Label
                        name={boardFlipped ? blackName : whiteName}
                        elo={boardFlipped ? blackElo : whiteElo}
                        orientation={boardFlipped ? "black" : "white"}
                    />
                </div>
            </div>
        </div>
    );
}
