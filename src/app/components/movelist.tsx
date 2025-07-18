import useDataFlow from "../context/DataFlowContext";
import { Chess } from "chess.js";

export default function MoveList() {
    const { gameData, currentPtr, setCurrentPtr } = useDataFlow();
    const chess = new Chess();
    const sanMoves: string[] = [];
    if (gameData.pgn) {
        chess.loadPgn(gameData.pgn);
        sanMoves.push(...chess.history());
    }
    // Build move pairs: 1. e4 e5, 2. Nf3 Nc6,...
    const movePairs = [];
    for (let i = 0; i < sanMoves.length; i += 2) {
        const whiteMove = sanMoves[i] || "";
        const blackMove = sanMoves[i + 1] || "";
        movePairs.push({
            moveNum: Math.floor(i / 2) + 1,
            white: { san: whiteMove, idx: i + 1 }, // there was a bug so set it to i+1
            black: { san: blackMove, idx: i + 2 },
        });
    }
    return (
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
                    <button
                        className={
                            currentPtr === pair.white.idx
                                ? "font-bold underline"
                                : ""
                        }
                        onClick={() => setCurrentPtr(pair.white.idx)}
                        disabled={!pair.white.san}
                    >
                        {pair.white.san}
                    </button>
                    <button
                        className={
                            currentPtr === pair.black.idx
                                ? "font-bold underline"
                                : ""
                        }
                        onClick={() => setCurrentPtr(pair.black.idx)}
                        disabled={!pair.black.san}
                    >
                        {pair.black.san}
                    </button>
                </div>
            ))}
        </div>
    );
}
