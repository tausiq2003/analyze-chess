import React from "react";
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
} from "@/app/logos";
import useDataFlow from "../context/DataFlowContext";
interface SummaryProps {
    accuracy: { white: number; black: number };
    estimatedElo: { white: number; black: number };
    moveClassifications: string[];
}

function Summary({
    accuracy,
    estimatedElo,
    moveClassifications,
}: SummaryProps) {
    const { gameData } = useDataFlow();
    const moveTypes = [
        "brilliant",
        "great",
        "best",
        "excellent",
        "good",
        "book",
        "inaccuracy",
        "mistake",
        "blunder",
    ];
    const whiteCounts: Record<string, number> = {};
    const blackCounts: Record<string, number> = {};
    moveTypes.forEach((type) => {
        whiteCounts[type] = 0;
        blackCounts[type] = 0;
    });
    moveClassifications.forEach((type, idx) => {
        const key = type.toLowerCase();
        if (idx % 2 === 0) {
            whiteCounts[key] = (whiteCounts[key] || 0) + 1;
        } else {
            blackCounts[key] = (blackCounts[key] || 0) + 1;
        }
    });
    return (
        <div className="p-2 sm:p-4">
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="font-semibold bg-white text-black p-1 sm:p-2 rounded-md text-xs sm:text-sm md:text-base">
                    <p className="font-bold" title="white's accuracy">
                        {accuracy.white.toFixed(2)}%
                    </p>
                    <p className="truncate" title="White">
                        {gameData.headers?.white?.name || "White"}
                    </p>{" "}
                    <p title="white's estimated elo">
                        {Math.round(estimatedElo.white)}
                    </p>
                </div>
                <div></div>
                <div className="font-semibold bg-black text-white p-1 sm:p-2 rounded-md text-xs sm:text-sm md:text-base">
                    <p className="font-bold" title="black's accuracy">
                        {accuracy.black.toFixed(2)}%
                    </p>
                    <p className="truncate" title="Black">
                        {gameData.headers?.black?.name || "Black"}
                    </p>{" "}
                    <p title=" black's estimated elo">
                        {Math.round(estimatedElo.black)}
                    </p>
                </div>
                {moveTypes.map((type) => (
                    <React.Fragment key={type}>
                        <p
                            className={`${type}-moves font-medium text-sm sm:text-base md:text-lg`}
                        >
                            {whiteCounts[type]}
                        </p>

                        <div
                            className={`flex items-center justify-center gap-1 sm:gap-2 ${type}-moves text-xs sm:text-sm`}
                        >
                            {type === "brilliant" && <Brilliant />}
                            {type === "great" && <Great />}
                            {type === "best" && <Best />}
                            {type === "excellent" && <Excellent />}
                            {type === "good" && <Good />}
                            {type === "book" && <Book />}
                            {type === "inaccuracy" && <Inaccuracy />}
                            {type === "mistake" && <Mistake />}
                            {type === "blunder" && <Blunder />}

                            <span className="hidden sm:inline">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                        </div>

                        <p
                            className={`${type}-moves font-medium text-sm sm:text-base md:text-lg`}
                        >
                            {blackCounts[type]}
                        </p>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default Summary;
