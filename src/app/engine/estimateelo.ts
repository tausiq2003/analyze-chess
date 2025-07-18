import { Position } from "@/app/types/stockfishAnalysis";

function ceilsNumber(num: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, num));
}

function getPositionCp(position: Position): number {
    const line = position.info[0];

    if (typeof line.cp === "number") {
        return ceilsNumber(line.cp, -1000, 1000);
    }

    if (typeof line.mate === "number") {
        const mateCp = line.mate !== 0 ? Math.sign(line.mate) * 10000 : 10000;
        return ceilsNumber(mateCp, -1000, 1000);
    }

    throw new Error("Position line must have either a cp or mate value.");
}

function getPlayersAverageCpl(positions: Position[]): {
    whiteCpl: number;
    blackCpl: number;
} {
    let previousCp = getPositionCp(positions[0]);
    let whiteCpl = 0;
    let blackCpl = 0;

    positions.slice(1).forEach((position, index) => {
        const cp = getPositionCp(position);
        if (index % 2 === 0) {
            whiteCpl += cp > previousCp ? 0 : Math.min(previousCp - cp, 1000);
        } else {
            blackCpl += cp < previousCp ? 0 : Math.min(cp - previousCp, 1000);
        }
        previousCp = cp;
    });

    const totalMoves = positions.length - 1;
    const whiteMovesCount = Math.ceil(totalMoves / 2);
    const blackMovesCount = Math.floor(totalMoves / 2);

    return {
        whiteCpl: whiteMovesCount > 0 ? whiteCpl / whiteMovesCount : 0,
        blackCpl: blackMovesCount > 0 ? blackCpl / blackMovesCount : 0,
    };
}

function getEloFromAverageCpl(averageCpl: number) {
    return 3100 * Math.exp(-0.01 * averageCpl);
}
//credits: https://github.com/GuillaumeSD/Chesskit/blob/main/src/lib/engine/helpers/estimateElo.ts

function getAverageCplFromElo(elo: number) {
    return -100 * Math.log(Math.min(elo, 3100) / 3100);
}

function getEloFromRatingAndCpl(
    gameCpl: number,
    rating: number | undefined,
): number {
    const eloFromCpl = getEloFromAverageCpl(gameCpl);
    if (!rating) return eloFromCpl;
    const expectedCpl = getAverageCplFromElo(rating);
    const cplDiff = gameCpl - expectedCpl;
    if (cplDiff === 0) return eloFromCpl;
    if (cplDiff > 0) {
        return rating * Math.exp(-0.005 * cplDiff);
    } else {
        return rating / Math.exp(-0.005 * -cplDiff);
    }
}

export default function computeEstimatedElo(
    positions: Position[],
    whiteElo?: number,
    blackElo?: number,
): { white: number; black: number } | undefined {
    if (positions.length < 2) {
        return undefined;
    }
    const { whiteCpl, blackCpl } = getPlayersAverageCpl(positions);
    const whiteEstimatedElo = getEloFromRatingAndCpl(
        whiteCpl,
        whiteElo ?? blackElo,
    );
    const blackEstimatedElo = getEloFromRatingAndCpl(
        blackCpl,
        blackElo ?? whiteElo,
    );
    return { white: whiteEstimatedElo, black: blackEstimatedElo };
}
