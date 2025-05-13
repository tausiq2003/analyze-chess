"use client";

import useStockfish from "@/app/hooks/useStockfish";

interface StockfishItemProps {
    fen: string;
    depth: string;
    index: number;
}

function StockfishItem({ fen, depth, index }: StockfishItemProps) {
    const { evaluation, bestMove, ponderMove, data } = useStockfish({
        fen,
        depth,
    });
    return (
        <div
            key={index}
            style={{
                border: "1px solid #ccc",
                margin: "1rem",
                padding: "1rem",
            }}
        >
            <h3>Analysis for Position {index + 1}</h3>
            <p>
                <strong>FEN:</strong> {fen}
            </p>
            <p>
                <strong>Evaluations:</strong>{" "}
                {evaluation.length > 0 ? evaluation.join(", ") : "Loading..."}
            </p>
            <p>
                <strong>Best Moves:</strong>{" "}
                {bestMove.length > 0 ? bestMove.join(", ") : "Loading..."}
            </p>
            <p>
                <strong>Ponder Moves:</strong>{" "}
                {ponderMove.length > 0 ? ponderMove.join(", ") : "Loading..."}
            </p>
            <p>
                <strong>Raw Data:</strong>{" "}
                {data.length > 0 ? data.join(" | ") : "Loading..."}
            </p>
        </div>
    );
}

export default function StockfishAnalysis({
    fen,
    depth,
}: {
    fen: string[];
    depth: string;
}) {
    return (
        <div>
            <h2>Using depth: {depth}</h2>
            {fen.map((fenStr, index) => (
                <StockfishItem
                    key={index}
                    fen={fenStr}
                    depth={depth}
                    index={index}
                />
            ))}
        </div>
    );
}
