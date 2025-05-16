"use client";
import { Chess, validateFen } from "chess.js";
import { useState, useEffect } from "react";
import Board from "./board";
import StockfishAnalysis from "./stockfish-analysis";
import GraphChart from "./graph-chart";
import {
    Best,
    Blunder,
    Book,
    Brilliant,
    Excellent,
    Good,
    Great,
    Inaccuracy,
    Mistake,
} from "../logos";
import Review from "./review";
import StockfishAnalysis1 from "./stockfish-anal";

export default function Analysis() {
    const [fenList, setFenList] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const pgn = localStorage.getItem("pgn");
    const depth = localStorage.getItem("depth") ?? "14";
    const [showAnalysis, setShowAnalysis] = useState<boolean>(true);

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
            {showAnalysis ? (
                <div>
                    <h1 className="text-xl">Overview:</h1>
                    <GraphChart />
                    <div className="bg-[#4c4c4c] rounded-lg px-2 py-4 mt-4">
                        <h1>Accuracy of Players: </h1>
                        <p className="font-semibold">
                            Tausiq Samantaray: <span>69.420%</span>
                        </p>
                        <p className="font-semibold">
                            DeezNuggets: <span>69.420%</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-3  gap-4 mt-4 text-center">
                        <div className="labels font-semibold">
                            Tausiq Samantaray
                        </div>
                        <div></div>
                        <div className="labels font-semibold">DeezNuggets</div>
                        <p className="brilliant-moves">0 </p>
                        <div className="brilliant-moves flex flex-row labelled-data gap-2">
                            <Brilliant />
                            Brilliant
                        </div>
                        <p className="brilliant-moves">0 </p>
                        <p className="great-moves">0 </p>
                        <div className="great-moves flex flex-row labelled-data gap-2">
                            <Great />
                            Great
                        </div>
                        <p className="great-moves">1 </p>
                        <p className="best-moves">8 </p>
                        <div className="book-moves flex flex-row labelled-data gap-2">
                            <Best />
                            Best
                        </div>
                        <p className="best-moves">16 </p>
                        <p className="excel-moves">10 </p>
                        <div className="excel-moves flex flex-row labelled-data gap-2">
                            <Excellent />
                            Excellent
                        </div>
                        <p className="excel-moves">7 </p>
                        <p className="good-moves">7 </p>
                        <div className="good-moves flex flex-row labelled-data gap-2">
                            <Good />
                            Good
                        </div>
                        <p className="good-moves">3 </p>
                        <p className="book-moves">3 </p>
                        <div className="book-moves flex flex-row labelled-data gap-2">
                            <Book />
                            Book
                        </div>
                        <p className="book-moves">2 </p>
                        <p className="inaccurate-moves">2 </p>
                        <div className="inaccurate-moves flex flex-row labelled-data gap-2">
                            <Inaccuracy />
                            Inaccuracy
                        </div>
                        <p className="inaccurate-moves">4 </p>
                        <p className="mistake-moves">3 </p>
                        <div className="mistake-moves flex flex-row labelled-data gap-2">
                            <Mistake />
                            Mistake
                        </div>
                        <p className="mistake-moves">1 </p>
                        <p className="blunder-moves">1 </p>
                        <div className="blunder-moves flex flex-row labelled-data gap-2">
                            <Blunder />
                            Blunder
                        </div>
                        <p className="blunder-moves">0 </p>
                    </div>
                    <button
                        className="bg-green-400 w-full py-3 text-xl text-white rounded-md mt-4"
                        onClick={() => setShowAnalysis(false)}
                    >
                        Go to review
                    </button>
                </div>
            ) : (
                <StockfishAnalysis1 fen={firstFen} />
            )}
        </>
    );
}
