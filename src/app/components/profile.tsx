import React from "react";
import GraphChart from "./graph-chart";
import ShowClassification, { MoveData } from "./showclassification";
import useDataFlow from "../context/DataFlowContext";
import { openings } from "../openings";
import Review from "./review";
import { Chess } from "chess.js";

function Profile() {
    const { gameData, currentPtr, setCurrentPtr, boardFlipped, setBoardFlipped } = useDataFlow();
    const positions = gameData.postitions ? Object.values(gameData.postitions).map(arr => arr[0]) : [];
    const winPercentages = positions.map(pos => pos.winPercentage);
    // Opening for current move
    let openingName = "";
    const currentMove = positions[currentPtr];
    if (currentMove) {
        const found = openings.find(o => o.fen === currentMove.fen);
        if (found) {
            openingName = found.name;
        }
    }
    // Build SAN move list using chess.js
    const chess = new Chess();
    const sanMoves: string[] = [];
    if (gameData.pgn) {
        chess.loadPgn(gameData.pgn);
        sanMoves.push(...chess.history());
    }
    // MoveList: show pairs in SAN, clickable
    const movePairs = [];
    for (let i = 0; i < sanMoves.length; i += 2) {
        const whiteMove = sanMoves[i] || "";
        const blackMove = sanMoves[i + 1] || "";
        movePairs.push({
            moveNum: Math.floor(i / 2) + 1,
            white: { san: whiteMove, idx: i },
            black: { san: blackMove, idx: i + 1 },
        });
    }
    // ShowClassification for current move (SAN)
    let showClassMove: MoveData[] = [];
    if (currentMove) {
        const classification = (currentMove.moveClassification || "best") as any;
        const move = sanMoves[currentPtr] || "";
        const bestMove = currentMove.info && currentMove.info[0]?.line?.split(" ")[0] || "";
        showClassMove = [{
            move,
            classification,
            bestMove: ["brilliant","great","best","book"].includes(classification) ? undefined : bestMove
        }];
    }
    // MoveLines for current move (up to 3 lines, SAN)
    let moveLines: { san: string; eval: string }[] = [];
    if (currentMove && currentMove.info) {
        for (let i = 0; i < Math.min(3, currentMove.info.length); i++) {
            const line = currentMove.info[i];
            // Convert UCI line to SAN
            let sanLine = "";
            try {
                const chessTmp = new Chess(currentMove.fen);
                const moves = line.line.split(" ");
                const sanMovesArr = [];
                for (const move of moves) {
                    const san = chessTmp.move(move);
                    if (san) sanMovesArr.push(san.san);
                }
                sanLine = sanMovesArr.join(" ");
            } catch {
                sanLine = line.line;
            }
            moveLines.push({
                san: sanLine,
                eval: line.cp !== undefined && line.cp !== null ? (line.cp / 100).toFixed(2) : "0.00"
            });
        }
    }
    // MoveList click handler
    const handleMoveClick = (idx: number) => {
        setCurrentPtr(idx);
    };
    // Flip board handler (used by Review)
    const handleFlip = () => setBoardFlipped(!boardFlipped);
    return (
        <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-6 p-4">
            {openingName && <div className="text-xl font-bold text-center">Opening: {openingName}</div>}
            <GraphChart data={winPercentages} />
            <ShowClassification moves={showClassMove} />
            <div className="flex flex-col gap-3 overflow-x-auto">
                <h1 className="text-white">Move Lines:</h1>
                {moveLines.map((line, index) => (
                    <div key={index} className="p-2 rounded-md bg-[#505050] w-full">
                        <div className="flex flex-wrap items-center gap-2 text-white text-sm">
                            <p className="min-w-[50px] shrink-0">{line.eval}</p>
                            <p className="whitespace-normal">{line.san}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 mt-6 overflow-y-auto h-[400px] rounded-md">
                <h1 className="text-white">Move List:</h1>
                {movePairs.map((pair, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-wrap justify-around gap-4 p-2 rounded-md ${
                            idx % 2 === 0 ? "bg-[#383838]" : "bg-[#505050]"
                        }`}
                    >
                        <p>{pair.moveNum}.</p>
                        <button onClick={() => handleMoveClick(pair.white.idx)}>{pair.white.san}</button>
                        <button onClick={() => handleMoveClick(pair.black.idx)}>{pair.black.san}</button>
                    </div>
                ))}
            </div>
            <Review />
        </div>
    );
}

export default Profile;
