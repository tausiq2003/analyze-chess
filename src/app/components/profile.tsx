import React, { useEffect, useState } from "react";
import GraphChart from "./graph-chart";
import ShowClassification, { MoveData } from "./showclassification";
import useDataFlow from "../context/DataFlowContext";
import { openings } from "../openings";
import Review from "./review";
import { Chess } from "chess.js";
import MoveList from "./movelist";
import MoveLines from "./movelines";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";

type ClassificationType =
    | "brilliant"
    | "great"
    | "excellent"
    | "best"
    | "good"
    | "inaccuracy"
    | "mistake"
    | "blunder"
    | "book";

function Profile() {
    const { gameData, currentPtr, movePrev, moveNext } = useDataFlow();
    let result = "";
    let termination = "";

    const positions = gameData.postitions
        ? Object.values(gameData.postitions).map((arr) => arr[0])
        : [];
    const evalData = positions.map((pos) => ({
        cp: pos.info?.[0]?.cp ?? null,
        mate: pos.info?.[0]?.mate ?? null,
    }));
    // set opening name based on the current position, not checking for first n moves
    let openingName = "";
    const currentMove = positions[currentPtr];
    if (currentMove) {
        const fenPart = currentMove.fen?.split(" ")[0];
        const found = openings.find((o) => o.fen === fenPart);
        if (found) {
            openingName = found.name;
        }
    }

    if (currentPtr === gameData.headers?.moves) {
        result = gameData.headers?.result || "Game ended";
        termination = gameData.headers?.termination || "Game ended";
    }
    // Build SAN move list using chess.js
    const chess = new Chess();
    const sanMoves: string[] = [];
    if (gameData.pgn) {
        chess.loadPgn(gameData.pgn);
        sanMoves.push(...chess.history());
    }
    let showClassMove: MoveData[] = [];
    let showClassFen = undefined;
    if (currentPtr > 0 && positions[currentPtr]) {
        const classification = (positions[currentPtr].moveClassification ||
            "best") as ClassificationType;
        const move = sanMoves[currentPtr - 1] || "";
        const bestMove =
            (positions[currentPtr].info &&
                positions[currentPtr].info[0]?.line?.split(" ")[0]) ||
            "";
        showClassMove = [
            {
                move,
                classification,
                bestMove: ["brilliant", "great", "best", "book"].includes(
                    classification,
                )
                    ? undefined
                    : bestMove,
            },
        ];
        showClassFen = positions[currentPtr].fen;
    }
    const [showDetails, setShowDetails] = useState(false);
    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                movePrev();
            } else if (e.key === "ArrowRight") {
                moveNext();
            }
        };
        window.addEventListener("keydown", keydownHandler);
        return () => {
            window.removeEventListener("keydown", keydownHandler);
        };
    }, [movePrev, moveNext]);

    return (
        <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-4 overflow-auto">
            <div className="mx-2 lg:hidden relative">
                <button
                    className="absolute right-0 top-0 rounded-md bg-[#4c4c4c] active:bg-[#333] active:scale-95 transition-transform duration-200 ease-in-out p-1 z-10"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? (
                        <MdOutlineKeyboardArrowUp className="text-white text-xl" />
                    ) : (
                        <MdOutlineKeyboardArrowDown className="text-white text-xl" />
                    )}
                </button>
            </div>
            <Review />
            <ShowClassification moves={showClassMove} fen={showClassFen} />

            <div className="max-h-16 min-h-16">
                {openingName && (
                    <div className="text-md font-semibold text-center">
                        Opening: {openingName}
                    </div>
                )}
                {result && (
                    <div className="text-md font-semibold text-center">
                        <span className="block">Result: {result}</span>
                        Termination: {termination}
                    </div>
                )}
            </div>
            {showDetails && (
                <div>
                    <MoveLines />
                    <MoveList />
                    <GraphChart data={evalData} />
                </div>
            )}
            <div className="max-lg:hidden">
                <MoveLines />
                <MoveList />
                <GraphChart data={evalData} />
            </div>
        </div>
    );
}

export default Profile;
