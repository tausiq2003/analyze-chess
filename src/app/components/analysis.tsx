"use client";
import { Chess, validateFen } from "chess.js";
import { useState, useEffect } from "react";
import Board from "./board";
import StockfishAnalysis from "./stockfish-analysis";

export default function Analysis() {
    const [fenList, setFenList] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const pgn = localStorage.getItem("pgn");
    const depth = localStorage.getItem("depth") ?? "14";

    useEffect(() => {
        async function getFenList(pgn: string | null) {
            const result: string[] = [];
            if (!pgn) return result;

            const chess = new Chess();
            chess.loadPgn(pgn, { strict: true });
            const moves = chess.history();
            const chess1 = new Chess();

            for (const move of moves) {
                chess1.move(move);
                const fen = chess1.fen();
                const validation = validateFen(fen);
                if (validation.ok) {
                    result.push(fen);
                }
            }
            result.unshift(
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0",
            );

            setFenList(result);
            localStorage.setItem("fen", result.toString());
        }

        getFenList(pgn);
    }, [pgn]);

    function handlePrev() {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    function handleNext() {
        setCurrentIndex((prev) =>
            prev < fenList.length - 1 ? prev + 1 : prev,
        );
    }

    const fenString =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0," +
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1," +
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 1 2," +
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2," +
        "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3," +
        "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 3," +
        "rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4," +
        "rnbqkb1r/ppp2ppp/3p1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 3 4," +
        "r1bqkb1r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5," +
        "r1bqkb1r/ppp2ppp/2np1n2/4p1N1/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 5," +
        "r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 6," +
        "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B1P3/2N5/PPPP1PPP/R1BQK2R b KQkq - 0 6," +
        "r1bqkb1r/ppp2ppp/5n2/3Pp1N1/2Bn4/2N5/PPPP1PPP/R1BQK2R w KQkq - 1 7," +
        "r1bqkb1r/ppp2ppp/3P1n2/4p1N1/2Bn4/2N5/PPPP1PPP/R1BQK2R b KQkq - 0 7," +
        "r2qkb1r/ppp2ppp/3Pbn2/4p1N1/2Bn4/2N5/PPPP1PPP/R1BQK2R w KQkq - 1 8," +
        "r2qkb1r/ppp2ppp/3Pbn2/4p1N1/2Bn4/2N5/PPPPQPPP/R1B1K2R b KQkq - 2 8," +
        "r2qkb1r/ppp2ppp/3Pbn2/4p1N1/2Bn4/2N5/PPPPnPPP/R1B1K2R w KQkq - 0 9," +
        "r2qkb1r/ppp2ppp/3Pbn2/4p1N1/2Bn4/2N5/PPPPKPPP/R1B4R b kq - 0 9," +
        "r2qkb1r/ppp2ppp/3P1n2/4p1N1/2b5/2N5/PPPPKPPP/R1B4R w kq - 0 10";

    // Split the string by commas and filter out any empty values.
    const fenPositions = fenString.split(",").filter((s) => s.trim() !== "");
    const firstFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0";

    return (
        <>
            {/*<div>
            <Board fen={fenList[currentIndex] || "start"} />
            <div className="flex gap-4 mt-4">
                <button onClick={handlePrev} disabled={currentIndex === 0}>
                    {"<"}
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === fenList.length - 1}
                >
                    {">"}
                </button>
            </div></div>*/}

            {/*<div style={{ padding: "2rem" }}>
                <h1>Chess Game Review: FEN Mapping</h1>
                {fenPositions.map((fen, index) => (
                    <StockfishAnalysis fen={fen} />
                    <div key={index} style={{ marginBottom: "2rem" }}>
                        <h2>Position {index + 1}</h2>
                    </div>
                ))}
            </div>*/}
            <div>
                <StockfishAnalysis fen={firstFen} depth={depth} />
            </div>
        </>
    );
}
