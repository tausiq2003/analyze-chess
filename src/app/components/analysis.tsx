"use client";
import { Chess, validateFen } from "chess.js";
import { useEffect, useState } from "react";
import Board from "./board";
import GraphChart from "./graph-chart";
import Summary from "./summary";
import Review from "./review";
import useDataFlow from "../context/DataFlowContext";
import StockfishAnalysis from "../engine/analysis";
import computeAccuracy from "../engine/computeaccuracy";
import computeEstimatedElo from "../engine/estimateelo";
import getMovesClassification from "../engine/moveclassification";
import { GameDetails } from "../types/chessData";
import { Position } from "../types/stockfishAnalysis";
import Profile from "./profile";

export default function Analysis() {
    const { gameData, changeGameData, currentPtr, moveNext, movePrev } = useDataFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [positions, setPositions] = useState<Position[]>([]);
    const [winPercentages, setWinPercentages] = useState<number[]>([]);
    const [moveClassifications, setMoveClassifications] = useState<string[]>([]);
    const [accuracy, setAccuracy] = useState<{ white: number; black: number }>({ white: 0, black: 0 });
    const [estimatedElo, setEstimatedElo] = useState<{ white: number; black: number }>({ white: 0, black: 0 });
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        async function analyzeGame() {
            setLoading(true);
            setError("");
            try {
                if (!gameData.pgn) {
                    setError("No PGN provided");
                    setLoading(false);
                    return;
                }
            const chess = new Chess();
                chess.loadPgn(gameData.pgn, { strict: true });
            const moves = chess.history();
            const chess1 = new Chess();
                const fens: string[] = [];
                const uciMoves: string[] = [];
            for (const move of moves) {
                chess1.move(move);
                const fen = chess1.fen();
                const validation = validateFen(fen);
                if (validation.ok) {
                        fens.push(fen);
                        uciMoves.push(chess1.history({ verbose: true }).slice(-1)[0]?.from + chess1.history({ verbose: true }).slice(-1)[0]?.to);
                    }
                }
                fens.unshift("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0");
                // analyze each FEN
                const stockfish = new StockfishAnalysis(Number(gameData.depth));
                const posArr: Position[] = [];
                for (const fen of fens) {
                    const pos = await stockfish.getPositionDetails(fen);
                    posArr.push(pos);
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
                const moveClass = getMovesClassification(posArr, uciMoves, fens);
                posArr.forEach((pos, idx) => {
                    pos.moveClassification = moveClass[idx];
                });
                setMoveClassifications(moveClass);
                // update context
                const positionsObj: { [key: string]: Position[] } = {};
                posArr.forEach((pos, idx) => {
                    positionsObj[String(idx)] = [pos];
                });
                changeGameData({ postitions: positionsObj, accuracyWhite: String(acc.white), accuracyBlack: String(acc.black), estimatedEloWhite: String(estElo?.white || 1500), estimatedEloBlack: String(estElo?.black || 1500) });
            } catch (e: any) {
                setError(e.message || "Error analyzing game");
            }
            setLoading(false);
        }
        analyzeGame();
    }, [gameData.pgn, gameData.depth]);

    if (loading) return <div className="text-center mt-10">Analyzing game...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (showProfile) return <Profile />;
    return (
        <>
                <div>
                    <h1 className="text-xl">Overview:</h1>
                <GraphChart data={winPercentages} />
                <Summary accuracy={accuracy} estimatedElo={estimatedElo} moveClassifications={moveClassifications} />
                <button className="bg-green-400 w-full py-3 text-xl text-white rounded-md mt-4" onClick={() => setShowProfile(true)}>
                    Go to profile
                    </button>
                </div>
        </>
    );
}
