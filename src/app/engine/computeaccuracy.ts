import { Position } from "@/app/types/stockfishAnalysis";

function ceilsNumber(num: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, num));
}

function getHarmonicMean(arr: number[]): number {
    if (arr.length === 0) return 0;
    let sum = 0;
    for (const n of arr) {
        if (n === 0) return 0;
        sum += 1 / n;
    }
    return arr.length / sum;
}

function getStandardDeviation(arr: number[]): number {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
}

function getWeightedMean(values: number[], weights: number[]): number {
    if (values.length === 0 || weights.length === 0) return 0;
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] * (weights[i] || 0);
        weightSum += weights[i] || 0;
    }
    return weightSum === 0 ? 0 : sum / weightSum;
}

function getPositionWinPercentage(position: Position): number {
    const line = position.info[0];
    if (!line) {
        throw new Error(
            `Position for FEN "${position.fen}" has no analysis info.`,
        );
    }

    if (typeof line.mate === "number") {
        return winPercentageFromMate(line.mate);
    }
    if (typeof line.cp === "number") {
        return winPercentageFromCp(line.cp);
    }

    // Fails loudly instead of silently returning 50.
    throw new Error(
        `Line for FEN "${position.fen}" must have either cp or mate value.`,
    );
}

function winPercentageFromCp(cp: number): number {
    const cappedCp = ceilsNumber(cp, -15000, 15000);
    const MULTIPLIER = -0.00368208;
    const winChances = 2 / (1 + Math.exp(MULTIPLIER * cappedCp)) - 1;
    return 50 + 50 * winChances;
}

function winPercentageFromMate(mate: number): number {
    // If mate is positive, the current player is winning.
    if (mate > 0) {
        return 100;
    }
    return 0;
}

function getAccuracyWeights(movesWinPercentage: number[]): number[] {
    const windowSize = ceilsNumber(
        Math.ceil(movesWinPercentage.length / 10),
        2,
        8,
    );
    const windows: number[][] = [];
    const halfWindowSize = Math.round(windowSize / 2);
    for (let i = 1; i < movesWinPercentage.length; i++) {
        const startIdx = i - halfWindowSize;
        const endIdx = i + halfWindowSize;
        if (startIdx < 0) {
            windows.push(movesWinPercentage.slice(0, windowSize));
            continue;
        }
        if (endIdx > movesWinPercentage.length) {
            windows.push(movesWinPercentage.slice(-windowSize));
            continue;
        }
        windows.push(movesWinPercentage.slice(startIdx, endIdx));
    }
    const weights = windows.map((window) => {
        const std = getStandardDeviation(window);
        return ceilsNumber(std, 0.5, 12);
    });
    return weights;
}

function getMovesAccuracy(movesWinPercentage: number[]): number[] {
    return movesWinPercentage.slice(1).map((winPercent, index) => {
        const lastWinPercent = movesWinPercentage[index];
        const isWhiteMove = index % 2 === 0;
        const winDiff = isWhiteMove
            ? Math.max(0, lastWinPercent - winPercent)
            : Math.max(0, winPercent - lastWinPercent);
        const rawAccuracy =
            103.1668100711649 * Math.exp(-0.04354415386753951 * winDiff) -
            3.166924740191411;
        return Math.min(100, Math.max(0, rawAccuracy + 1));
    });
}

function getPlayerAccuracy(
    movesAccuracy: number[],
    weights: number[],
    player: "white" | "black",
): number {
    const remainder = player === "white" ? 0 : 1;
    const playerAccuracies = movesAccuracy.filter(
        (_, index) => index % 2 === remainder,
    );
    const playerWeights = weights.filter((_, index) => index % 2 === remainder);
    const weightedMean = getWeightedMean(playerAccuracies, playerWeights);
    const harmonicMean = getHarmonicMean(playerAccuracies);
    return (weightedMean + harmonicMean) / 2;
}

export default function computeAccuracy(positions: Position[]) {
    const positionsWinPercentage = positions.map(getPositionWinPercentage);
    const weights = getAccuracyWeights(positionsWinPercentage);
    const movesAccuracy = getMovesAccuracy(positionsWinPercentage);
    const whiteAccuracy = getPlayerAccuracy(movesAccuracy, weights, "white");
    const blackAccuracy = getPlayerAccuracy(movesAccuracy, weights, "black");
    return {
        white: whiteAccuracy,
        black: blackAccuracy,
    };
}
