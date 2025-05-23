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
    evalScore = "-0.3", // Test evaluation score
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
        <div className="w-full max-w-3xl">
            <div className="flex justify-end mb-2">
                <button
                    onClick={flipBoard}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    Flip Board
                </button>
            </div>

            {/* Mobile layout */}
            <div className="flex md:hidden">
                <div
                    className="flex items-stretch mr-2"
                    style={{ height: "90%" }}
                >
                    <EvalBar
                        evalScore={evalScore}
                        orientation={actualOrientation}
                    />
                </div>

                <div className="flex-1 flex flex-col">
                    <Label
                        name={boardFlipped ? whiteName : blackName}
                        elo={boardFlipped ? whiteElo : blackElo}
                        orientation={boardFlipped ? "white" : "black"}
                    />
                    <Board
                        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        orientation={actualOrientation}
                    />
                    <Label
                        name={boardFlipped ? blackName : whiteName}
                        elo={boardFlipped ? blackElo : whiteElo}
                        orientation={boardFlipped ? "black" : "white"}
                    />
                </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:flex md:items-center md:gap-3">
                <div className="flex items-stretch" style={{ height: "500px" }}>
                    <EvalBar
                        evalScore={evalScore}
                        orientation={actualOrientation}
                    />
                </div>

                <div className="flex-1">
                    <Label
                        name={boardFlipped ? whiteName : blackName}
                        elo={boardFlipped ? whiteElo : blackElo}
                        orientation={boardFlipped ? "white" : "black"}
                    />
                    <Board
                        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        orientation={actualOrientation}
                    />
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
