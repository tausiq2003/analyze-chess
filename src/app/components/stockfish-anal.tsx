"use client";
import { useEffect, useState } from "react";

// Load Stockfish
const STOCKFISH =
    typeof window !== "undefined"
        ? new Worker("/stockfish.js", { type: "classic" })
        : null;

// Move Classification Thresholds
const CLASSIFICATION = {
    Best: { min: 50, max: 1000 }, // Best Move
    Brilliant: { min: 250, max: 1000 }, // Brilliant Move
    Good: { min: 20, max: 49 }, // Good Move
    Excellent: { min: 100, max: 249 }, // Excellent Move
    Mistake: { min: -100, max: -50 }, // Mistake
    Blunder: { min: -1000, max: -101 }, // Blunder
    Inaccuracy: { min: -49, max: -20 }, // Inaccuracy
    Miss: { min: -19, max: -1 }, // Miss
    Book: { min: 0, max: 0 }, // Opening Book Move
};

export default function StockfishAnalysis1({ fen }: { fen: string }) {
    const [evaluation, setEvaluation] = useState<number | null>(null);
    const [bestMove, setBestMove] = useState<string | null>(null);
    const [ponderMove, setPonderMove] = useState<string | null>(null);
    const [classification, setClassification] = useState<string | null>(null);

    useEffect(() => {
        if (!STOCKFISH) return;

        STOCKFISH.postMessage("uci"); // Initialize Stockfish
        STOCKFISH.postMessage(`position fen ${fen}`); // Set Position
        STOCKFISH.postMessage("go depth 20"); // Set depth for deep analysis

        STOCKFISH.onmessage = (event: MessageEvent) => {
            const message = event.data;

            if (message.startsWith("info depth")) {
                // Extract centipawn (cp) score or mate-in moves
                const evalMatch = message.match(/score (cp|mate) (-?\d+)/);
                if (evalMatch) {
                    let evalScore =
                        evalMatch[2] === "mate"
                            ? 1000
                            : parseInt(evalMatch[2]) / 100;
                    setEvaluation(evalScore);
                }
            }

            if (message.startsWith("bestmove")) {
                const bestMoveMatch = message.match(/bestmove (\w{4})/);
                const ponderMoveMatch = message.match(/ponder (\w{4})/);
                if (bestMoveMatch) setBestMove(bestMoveMatch[1]);
                if (ponderMoveMatch) setPonderMove(ponderMoveMatch[1]);
            }
        };
    }, [fen]);

    // Determine move classification
    useEffect(() => {
        if (evaluation !== null) {
            for (const [key, range] of Object.entries(CLASSIFICATION)) {
                if (evaluation >= range.min && evaluation <= range.max) {
                    setClassification(key);
                    break;
                }
            }
        }
    }, [evaluation]);

    return (
        <div>
            <h3>Stockfish Analysis</h3>
            <p>
                <strong>Evaluation:</strong>{" "}
                {evaluation !== null ? evaluation.toFixed(2) : "Calculating..."}
            </p>
            <p>
                <strong>Best Move:</strong> {bestMove || "Analyzing..."}
            </p>
            <p>
                <strong>Ponder Move:</strong> {ponderMove || "Analyzing..."}
            </p>
            <p>
                <strong>Classification:</strong>{" "}
                {classification || "Analyzing..."}
            </p>
        </div>
    );
}
