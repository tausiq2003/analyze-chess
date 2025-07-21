"use client";
import { Chess, validateFen } from "chess.js";
import { useEffect, useState } from "react";
import GraphChart from "./graph-chart";
import Summary from "./summary";
import useDataFlow from "../context/DataFlowContext";
import StockfishAnalysis from "../engine/analysis";
import computeAccuracy from "../engine/computeaccuracy";
import computeEstimatedElo from "../engine/estimateelo";
import getMovesClassification from "../engine/moveclassification";
import { Position } from "../types/stockfishAnalysis";
import Profile from "./profile";

export default function Analysis() {
    const { gameData, changeGameData } = useDataFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [positions, setPositions] = useState<Position[]>([]);
    const [, setWinPercentages] = useState<number[]>([]);
    const [, setMoveClassifications] = useState<string[]>([]);
    const [accuracy, setAccuracy] = useState<{ white: number; black: number }>({
        white: 0,
        black: 0,
    });
    const [estimatedElo, setEstimatedElo] = useState<{
        white: number;
        black: number;
    }>({ white: 0, black: 0 });
    const [showProfile, setShowProfile] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function analyzeGame() {
            setLoading(true);
            setError("");
            setProgress(0);
            try {
                if (!gameData.pgn) {
                    setError("No PGN provided");
                    setLoading(false);
                    return;
                }
                // find the fen list from pgn
                const chess = new Chess();
                chess.loadPgn(gameData.pgn, { strict: true });
                const moves = chess.history();
                const chess1 = new Chess();
                const fens: string[] = [
                    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0",
                ];
                const uciMoves: string[] = [];
                for (const move of moves) {
                    chess1.move(move);
                    const fen = chess1.fen();
                    const validation = validateFen(fen);
                    if (validation.ok) {
                        fens.push(fen);
                        uciMoves.push(
                            chess1.history({ verbose: true }).slice(-1)[0]
                                ?.from +
                                chess1.history({ verbose: true }).slice(-1)[0]
                                    ?.to,
                        );
                    }
                }
                // analyze each FEN
                const stockfish = new StockfishAnalysis(Number(gameData.depth));
                const posArr: Position[] = [];
                for (let i = 0; i < fens.length; i++) {
                    const pos = await stockfish.getPositionDetails(fens[i]);
                    posArr.push(pos);
                    setProgress(Math.ceil(((i + 1) / fens.length) * 100));
                }
                setPositions(posArr);
                const winPerc = posArr.map((pos) => pos.winPercentage);
                setWinPercentages(winPerc);
                const acc = computeAccuracy(posArr);
                setAccuracy(acc);
                // estimated elo
                const estElo = computeEstimatedElo(posArr);
                setEstimatedElo(estElo || { white: 1500, black: 1500 });
                // move classifications
                const moveClass = getMovesClassification(
                    posArr,
                    uciMoves,
                    fens,
                );
                posArr.forEach((pos, idx) => {
                    pos.moveClassification = moveClass[idx];
                });
                setMoveClassifications(moveClass);
                // update context
                const positionsObj: { [key: string]: Position[] } = {};
                posArr.forEach((pos, idx) => {
                    // Set moveClassification for each position in context
                    pos.moveClassification = moveClass[idx];
                    positionsObj[String(idx)] = [pos];
                });
                changeGameData({
                    postitions: positionsObj,
                    accuracyWhite: String(acc.white),
                    accuracyBlack: String(acc.black),
                    estimatedEloWhite: String(estElo?.white || 1500),
                    estimatedEloBlack: String(estElo?.black || 1500),
                });
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Error analyzing game");
                }
            }
            setLoading(false);
        }
        analyzeGame();
    }, [gameData.pgn, gameData.depth]);
    const evalData = positions.map((pos) => ({
        cp: pos.info?.[0]?.cp ?? null,
        mate: pos.info?.[0]?.mate ?? null,
    }));

    if (loading)
        return (
            <div className="text-center mt-10">
                <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-6">
                    <div
                        className="bg-green-400 h-6 rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 text-white">
                    {progress}% Analyzing game...
                </div>
            </div>
        );
    if (error)
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (showProfile) return <Profile />;

    // Prepare move classifications for summary: skip initial position, only real moves
    const moveClassificationsForSummary = positions
        .slice(1)
        .map((pos) => pos.moveClassification)
        .filter((x): x is string => typeof x === "string");

    return (
        <>
            <div>
                <h1 className="text-xl mb-2">Overview:</h1>
                <GraphChart data={evalData} />
                <Summary
                    accuracy={accuracy}
                    estimatedElo={estimatedElo}
                    moveClassifications={moveClassificationsForSummary}
                />
                <button
                    className="bg-green-400 w-full py-3 text-xl text-white rounded-md mt-4"
                    onClick={() => setShowProfile(true)}
                >
                    Review Game
                </button>
            </div>
        </>
    );
}
