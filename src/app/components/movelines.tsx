import useDataFlow from "../context/DataFlowContext";
import { Chess } from "chess.js";
import { uciToSan } from "../utils/moveconversions";
import { useEffect } from "react";

export default function MoveLines() {
    const { gameData, currentPtr, setArrows } = useDataFlow();
    const positions = gameData.postitions
        ? Object.values(gameData.postitions).map((arr) => arr[0])
        : [];
    const currentMove = positions[currentPtr];
    const moveLines: { san: string; eval: string }[] = [];

    useEffect(() => {
        if (
            !currentMove ||
            !currentMove.info ||
            currentMove.info.length === 0
        ) {
            setArrows([]);
            return;
        }
        const arrows = [];
        for (let i = 0; i < Math.min(3, currentMove.info.length); i++) {
            const line = currentMove.info[i];
            const moves = line.line.split(" ");
            if (moves.length > 0) {
                const from = moves[0].slice(0, 2);
                const to = moves[0].slice(2, 4);
                const color =
                    i === 0 ? "#006400" : i === 1 ? "#00b300" : "#90ee90";
                arrows.push({ from, to, color });
            }
        }
        setArrows(arrows);
    }, [currentMove, setArrows]);

    if (currentMove && currentMove.info && currentMove.info.length > 0) {
        for (let i = 0; i < Math.min(3, currentMove.info.length); i++) {
            const line = currentMove.info[i];
            // Convert UCI line to SAN using uciToSan
            let sanLine = "";
            try {
                const moves = line.line.split(" ");
                let fen = currentMove.fen;
                const sanMovesArr = [];
                for (const move of moves) {
                    let san = move;
                    try {
                        san = uciToSan(fen, move);
                        // Update fen for next move
                        const chessTmp = new Chess(fen);
                        chessTmp.move(san);
                        fen = chessTmp.fen();
                    } catch {
                        // fallback to UCI if conversion fails
                    }
                    sanMovesArr.push(san);
                }
                sanLine = sanMovesArr.join(" ");
            } catch {
                sanLine = line.line;
            }
            let evalDisplay = "0.00";
            if (line.mate !== undefined && line.mate !== null) {
                evalDisplay =
                    line.mate > 0
                        ? "M" + line.mate
                        : "-M" + Math.abs(line.mate);
            } else if (line.cp !== undefined && line.cp !== null) {
                evalDisplay = (line.cp / 100).toFixed(2);
            }
            moveLines.push({
                san: sanLine,
                eval: evalDisplay,
            });
        }
    }
    return (
        <div className="flex flex-col gap-3 overflow-x-auto max-h-[25vh] min-h-[25vh]">
            <h1 className="text-white">Move Lines:</h1>
            {moveLines.length === 0 ? (
                <div className="p-2 rounded-md bg-[#505050] w-full text-white text-sm">
                    No engine lines available for this position.
                </div>
            ) : (
                moveLines.map((line, index) => (
                    <div
                        key={index}
                        className="p-2 rounded-md bg-[#505050] w-full"
                    >
                        <div className="flex flex-wrap items-center gap-2 text-white text-sm">
                            <p
                                className={`min-w-[50px] shrink-0 p-1 font-semibold rounded-md ${
                                    line.eval.startsWith("-") ||
                                    line.eval.startsWith("-M")
                                        ? "bg-black text-white"
                                        : "bg-white text-black"
                                }`}
                            >
                                {line.eval}
                            </p>
                            <p className="whitespace-normal">{line.san}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
