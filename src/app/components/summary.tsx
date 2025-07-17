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

interface SummaryProps {
    accuracy: { white: number; black: number };
    estimatedElo: { white: number; black: number };
    moveClassifications: string[];
}

function Summary({ accuracy, estimatedElo, moveClassifications }: SummaryProps) {
    // very important: count move types for each player
    const moveTypes = [
        "Brilliant",
        "Great",
        "Best",
        "Excellent",
        "Good",
        "Book",
        "Inaccuracy",
        "Mistake",
        "Blunder",
    ];
    const whiteCounts: Record<string, number> = {};
    const blackCounts: Record<string, number> = {};
    moveTypes.forEach((type) => {
        whiteCounts[type] = 0;
        blackCounts[type] = 0;
    });
    moveClassifications.forEach((type, idx) => {
        if (idx % 2 === 0) {
            whiteCounts[type] = (whiteCounts[type] || 0) + 1;
        } else {
            blackCounts[type] = (blackCounts[type] || 0) + 1;
        }
    });
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Overview:</h1>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="font-semibold">White</div>
                <div></div>
                <div className="font-semibold">Black</div>
                {moveTypes.map((type) => (
                    <React.Fragment key={type}>
                        <p className={`${type.toLowerCase()}-moves`}>{whiteCounts[type]}</p>
                        <div className={`flex items-center justify-center gap-2 ${type.toLowerCase()}-moves`}>
                            {type === "Brilliant" && <Brilliant />} 
                            {type === "Great" && <Great />} 
                            {type === "Best" && <Best />} 
                            {type === "Excellent" && <Excellent />} 
                            {type === "Good" && <Good />} 
                            {type === "Book" && <Book />} 
                            {type === "Inaccuracy" && <Inaccuracy />} 
                            {type === "Mistake" && <Mistake />} 
                            {type === "Blunder" && <Blunder />} 
                            {type}
                </div>
                        <p className={`${type.toLowerCase()}-moves`}>{blackCounts[type]}</p>
                    </React.Fragment>
                ))}
                </div>
            <div className="bg-[#4c4c4c] rounded-lg px-2 py-4 mt-4">
                <h1>Accuracy of Players: </h1>
                <p className="font-semibold">
                    White: <span>{accuracy.white.toFixed(2)}%</span>
                </p>
                <p className="font-semibold">
                    Black: <span>{accuracy.black.toFixed(2)}%</span>
                </p>
                <h1>Estimated Elo:</h1>
                <p className="font-semibold">
                    White: <span>{estimatedElo.white}</span>
                </p>
                <p className="font-semibold">
                    Black: <span>{estimatedElo.black}</span>
                </p>
            </div>
        </div>
    );
}

export default Summary;
