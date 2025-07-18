import { Line } from "../types/stockfishAnalysis";

export default function winPercentageOfLine(line: Line): number {
    if (typeof line.cp === "number") {
        return winPercentage(line.cp);
    }

    if (typeof line.mate === "number") {
        return winPercentageFromMate(line.mate);
    }

    throw new Error("Line must have either cp or mate value");
}

function winPercentage(cp: number): number {
    const cappedCp = Math.max(-10000, Math.min(10000, cp));

    // Source: https://lichess.org/page/accuracy
    const k = 0.00368208;
    const winPercentage = 50 + 50 * (2 / (1 + Math.exp(-k * cappedCp)) - 1);
    return winPercentage;
}

function winPercentageFromMate(mateInMoves: number): number {
    return mateInMoves > 0 ? 100 : 0;
}
