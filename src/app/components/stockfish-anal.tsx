"use client";
import { useEffect, useState, useRef } from "react";

export default function StockfishAnalysis({ fen }: { fen: string }) {
    const [evaluation, setEvaluation] = useState<number | null>(null);
    const [bestMove, setBestMove] = useState<string | null>(null);
    const [ponderMove, setPonderMove] = useState<string | null>(null);
    const [classification, setClassification] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const stockfishRef = useRef<Worker | null>(null);

    // Classification thresholds
    const CLASSIFICATION = {
        Best: { min: 50, max: 1000 },
        Brilliant: { min: 250, max: 1000 },
        Good: { min: 20, max: 49 },
        Excellent: { min: 100, max: 249 },
        Mistake: { min: -100, max: -50 },
        Blunder: { min: -1000, max: -101 },
        Inaccuracy: { min: -49, max: -20 },
        Miss: { min: -19, max: -1 },
        Equal: { min: -19, max: 19 },
        Book: { min: 0, max: 0 },
    };

    // Initialize Stockfish
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Clean up previous worker if it exists
        if (stockfishRef.current) {
            stockfishRef.current.terminate();
        }

        try {
            // Create a new worker
            stockfishRef.current = new Worker("/stockfish.js");

            // Set up message handler
            stockfishRef.current.onmessage = (event) => {
                const message = event.data;

                // Check if engine is ready
                if (message === "readyok") {
                    setIsReady(true);
                }

                // Parse evaluation info
                if (message.startsWith("info") && message.includes("score")) {
                    // Extract centipawn (cp) score or mate-in moves
                    const cpMatch = message.match(/score cp (-?\d+)/);
                    const mateMatch = message.match(/score mate (-?\d+)/);

                    if (cpMatch) {
                        const evalScore = parseInt(cpMatch[1]) / 100;
                        setEvaluation(evalScore);
                    } else if (mateMatch) {
                        // For mate scores, use a high value to represent winning/losing
                        const mateIn = parseInt(mateMatch[1]);
                        setEvaluation(mateIn > 0 ? 1000 : -1000);
                    }
                }

                // Parse best move
                if (message.startsWith("bestmove")) {
                    const bestMoveMatch = message.match(/bestmove (\w+)/);
                    const ponderMoveMatch = message.match(/ponder (\w+)/);

                    if (bestMoveMatch) {
                        setBestMove(bestMoveMatch[1]);
                    }

                    if (ponderMoveMatch) {
                        setPonderMove(ponderMoveMatch[1]);
                    }
                }
            };

            // Initialize the engine
            stockfishRef.current.postMessage("uci");
            stockfishRef.current.postMessage("isready");
        } catch (error) {
            console.error("Error initializing Stockfish:", error);
        }

        // Clean up on unmount
        return () => {
            if (stockfishRef.current) {
                stockfishRef.current.terminate();
                stockfishRef.current = null;
            }
        };
    }, []);

    // Start analysis when position changes and engine is ready
    useEffect(() => {
        if (!isReady || !stockfishRef.current || !fen) return;

        // Reset states
        setEvaluation(null);
        setBestMove(null);
        setPonderMove(null);
        setClassification(null);

        // Start analysis
        stockfishRef.current.postMessage("stop"); // Stop any previous analysis
        stockfishRef.current.postMessage(`position fen ${fen}`);
        stockfishRef.current.postMessage("go depth 20");
    }, [fen, isReady]);

    // Determine move classification
    useEffect(() => {
        if (evaluation === null) return;

        let found = false;
        for (const [key, range] of Object.entries(CLASSIFICATION)) {
            if (evaluation >= range.min && evaluation <= range.max) {
                setClassification(key);
                found = true;
                break;
            }
        }

        // If no classification matched, set it to "Equal" for values near zero
        if (!found) {
            if (evaluation > -20 && evaluation < 20) {
                setClassification("Equal");
            } else {
                console.log(
                    "No classification found for evaluation:",
                    evaluation,
                );
                setClassification("Unknown");
            }
        }
    }, [evaluation]);

    return (
        <div className="p-4 border rounded-lg ">
            <h3 className="text-lg font-semibold mb-2">Stockfish Analysis</h3>
            {!isReady ? (
                <p>Initializing engine...</p>
            ) : (
                <>
                    <p className="mb-1">
                        <strong>Evaluation:</strong>{" "}
                        {evaluation !== null
                            ? evaluation >= 1000
                                ? "Mate"
                                : evaluation <= -1000
                                  ? "Mate against"
                                  : evaluation.toFixed(2)
                            : "Calculating..."}
                    </p>
                    <p className="mb-1">
                        <strong>Best Move:</strong> {bestMove || "Analyzing..."}
                    </p>
                    <p className="mb-1">
                        <strong>Ponder Move:</strong>{" "}
                        {ponderMove || "Analyzing..."}
                    </p>
                    <p className="mb-1">
                        <strong>Classification:</strong>{" "}
                        {classification || "Analyzing..."}
                    </p>
                </>
            )}
        </div>
    );
}
