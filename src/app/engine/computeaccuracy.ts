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

import { Position } from "@/app/types/stockfishAnalysis";

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
    const cpCeiled = ceilsNumber(cp, -1000, 1000);
    const MULTIPLIER = -0.00368208;
    const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpCeiled)) - 1;
    return 50 + 50 * winChances;
}

function winPercentageFromMate(mate: number): number {
    const mateInf = mate * Infinity;
    return winPercentageFromCp(mateInf);
}

function getAccuracyWeights(movesWinPercentage: number[]): number[] {
    const windowSize = ceilsNumber(Math.ceil(movesWinPercentage.length / 10), 2, 8);
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

function getPlayerAccuracy(movesAccuracy: number[], weights: number[], player: "white" | "black"): number {
    const remainder = player === "white" ? 0 : 1;
    const playerAccuracies = movesAccuracy.filter((_, index) => index % 2 === remainder);
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
