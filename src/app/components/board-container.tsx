"use client";

import useDataFlow from "../context/DataFlowContext";
import Label from "./label";
import Board from "./board";
import EvalBar from "./eval-bar";
import { useEffect, useState } from "react";

export default function BoardContainer() {
    const { gameData, currentPtr } = useDataFlow();
    const positions = gameData.postitions ? Object.values(gameData.postitions).map(arr => arr[0]) : [];
    const current = positions[currentPtr] || {};
    const evalScore = current.info && current.info[0]?.cp !== undefined && current.info[0]?.cp !== null ? (current.info[0].cp / 100).toFixed(1) : "0.0";
    const orientation = "white";
    const bN = gameData.headers?.black?.name || "Anonymous";
    const bE = gameData.headers?.black?.elo || "???";
    const wN = gameData.headers?.white?.name || "Anonymous";
    const wE = gameData.headers?.white?.elo || "???";
    const fen = current.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const [boardFlipped, setBoardFlipped] = useState(false);
    const [boardWidth, setBoardWidth] = useState(400);
    const actualOrientation = boardFlipped ? (orientation === "white" ? "black" : "white") : orientation;
    return (
        <div className="w-full max-w-3xl ">
            <div className="flex-1">
                <div style={{ width: boardWidth, margin: "0 auto" }}>
                    <Label
                        name={boardFlipped ? wN : bN}
                        elo={boardFlipped ? wE : bE}
                        orientation={boardFlipped ? "white" : "black"}
                    />
                </div>
                <div className="flex items-stretch max-md:ml-2.5">
                    <EvalBar
                        evalScore={evalScore}
                        orientation={actualOrientation}
                    />
                    <Board
                        fen={fen}
                        orientation={actualOrientation}
                        onBoardWidthChange={setBoardWidth}
                    />
                </div>
                <div style={{ width: boardWidth, margin: "0 auto" }}>
                    <Label
                        name={boardFlipped ? bN : wN}
                        elo={boardFlipped ? bE : wE}
                        orientation={boardFlipped ? "black" : "white"}
                    />
                </div>
            </div>
        </div>
    );
}
