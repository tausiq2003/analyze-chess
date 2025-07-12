import { Line } from "../types/stockfishAnalysis";

export default function winPercentageOfLine(line: Line): number {
    if (line.cp) {
        return winPercentage(line.cp);
    }
    if (line.mate) {
        return winPercentage(line.mate * Infinity);
    }
    throw new Error("Line must have either cp or mate value");
}
function winPercentage(cp: number): number {
    //source: https://lichess.org/page/accuracy
    // Win% = 50 + 50 * (2 / (1 + exp(-0.00368208 * centipawns)) - 1)

    const k = 0.00368208;
    const winPercentage = 50 + 50 * (2 / (1 + Math.exp(-k * cp)) - 1);
    return winPercentage;
}
