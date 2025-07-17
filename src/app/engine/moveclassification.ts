import { Position } from "@/app/types/stockfishAnalysis";

const moveTypes = [
    "Best",
    "Blunder",
    "Book",
    "Brilliant",
    "Excellent",
    "Good",
    "Great",
    "Inaccuracy",
    "Mistake",
];

function getPositionWinPercentage(position: Position): number {
    if (position.info[0]?.cp !== undefined && position.info[0]?.cp !== null) {
        return winPercentageFromCp(position.info[0].cp);
    } else if (position.info[0]?.mate !== undefined && position.info[0]?.mate !== null) {
        return winPercentageFromMate(position.info[0].mate!);
    } else {
        return 50;
    }
}

function winPercentageFromCp(cp: number): number {
    const cpCeiled = Math.max(-1000, Math.min(1000, cp));
    const MULTIPLIER = -0.00368208;
    const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpCeiled)) - 1;
    return 50 + 50 * winChances;
}

function winPercentageFromMate(mate: number): number {
    const mateInf = mate * Infinity;
    return winPercentageFromCp(mateInf);
}

export default function getMovesClassification(
    positions: Position[],
    uciMoves: string[],
    fens: string[]
): string[] {
    const winPercentages = positions.map(getPositionWinPercentage);
    const classifications: string[] = [];
    for (let i = 1; i < positions.length; i++) {
        // opening book detection and forced moves not implemented, just use winDiff logic for now
        const winDiff = winPercentages[i] - winPercentages[i - 1];
        if (winDiff < -20) classifications.push("Blunder");
        else if (winDiff < -10) classifications.push("Mistake");
        else if (winDiff < -5) classifications.push("Inaccuracy");
        else if (winDiff < -2) classifications.push("Good");
        else classifications.push("Excellent");
    }
    classifications.unshift("Book"); // first move is always book/opening
    return classifications;
} 