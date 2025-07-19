"use client";

import useDataFlow from "../context/DataFlowContext";
import Label from "./label";
import Board from "./board";
import EvalBar from "./eval-bar";
import { useState } from "react";

export default function BoardContainer() {
    const { gameData, currentPtr, boardFlipped } = useDataFlow();
    const positions = gameData.postitions
        ? Object.values(gameData.postitions).map((arr) => arr[0])
        : [];
    const current = positions[currentPtr] || {};
    const evalScore =
        current.info &&
        current.info[0]?.cp !== undefined &&
        current.info[0]?.cp !== null
            ? (current.info[0].cp / 100).toFixed(1)
            : "0.0";
    const mate =
        current.info &&
        current.info[0]?.mate !== undefined &&
        current.info[0]?.mate !== null
            ? current.info[0].mate
            : null;
    // Fix orientation logic
    const orientation = boardFlipped ? "black" : "white";
    const bN = gameData.headers?.black?.name || "Anonymous";
    const bE = gameData.headers?.black?.elo || "???";
    const wN = gameData.headers?.white?.name || "Anonymous";
    const wE = gameData.headers?.white?.elo || "???";
    const fen =
        current.fen ||
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const [boardWidth, setBoardWidth] = useState(400);
    return (
        <div className="w-full max-w-3xl">
            <div className="flex-1">
                <div style={{ width: boardWidth, margin: "0 auto" }}>
                    <Label
                        name={orientation === "white" ? bN : wN}
                        elo={orientation === "white" ? bE : wE}
                        orientation={
                            orientation === "white" ? "black" : "white"
                        }
                    />
                </div>
                <div className="flex items-center max-md:ml-[1.5rem]">
                    <EvalBar
                        evalScore={evalScore}
                        orientation={orientation}
                        mate={mate}
                    />
                    <Board
                        fen={fen}
                        orientation={orientation}
                        onBoardWidthChange={setBoardWidth}
                    />
                </div>
                <div style={{ width: boardWidth, margin: "0 auto" }}>
                    <Label
                        name={orientation === "white" ? wN : bN}
                        elo={orientation === "white" ? wE : bE}
                        orientation={orientation}
                    />
                </div>
            </div>
        </div>
    );
}
