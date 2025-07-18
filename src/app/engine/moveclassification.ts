import { Position } from "@/app/types/stockfishAnalysis";
import { openings } from "@/app/openings";
import { Chess, Square } from "chess.js";

// Helper: uciSplit for correct Square typing
function uciSplit(uci: string): {
    from: Square;
    to: Square;
    promotion?: string | undefined;
} {
    return {
        from: uci.slice(0, 2) as Square,
        to: uci.slice(2, 4) as Square,
        promotion: uci.slice(4, 5) || undefined,
    };
}

// Helper: Calculate win percentage from centipawn
function winPercentageFromCp(cp: number): number {
    const cpCeiled = Math.max(-1000, Math.min(1000, cp));
    const MULTIPLIER = -0.00368208;
    const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpCeiled)) - 1;
    return 50 + 50 * winChances;
}

// Helper: Calculate win percentage from mate
function winPercentageFromMate(mate: number): number {
    const mateInf = mate * Infinity;
    return winPercentageFromCp(mateInf);
}

// Helper: Get win percentage for a position
function getPositionWinPercentage(position: Position): number {
    if (position.info[0]?.cp !== undefined && position.info[0]?.cp !== null) {
        return winPercentageFromCp(position.info[0].cp);
    } else if (
        position.info[0]?.mate !== undefined &&
        position.info[0]?.mate !== null
    ) {
        return winPercentageFromMate(position.info[0].mate!);
    } else {
        return 50;
    }
}

// Helper: Detect if a move is a piece sacrifice
function getIsPieceSacrifice(fen: string, uci: string): boolean {
    const chess = new Chess(fen);
    const { from, to } = uciSplit(uci);
    const piece = chess.get(from);
    if (
        !piece ||
        piece.type === "p" ||
        piece.type === "k" ||
        piece.type === "q"
    )
        return false;
    const captured = chess.get(to);
    if (captured) return false;
    chess.move({ from, to });
    const after = chess.get(to);
    if (!after || after.type !== piece.type) return true;
    return false;
}

// Helper: Detect if a move is a simple recapture
function isSimplePieceRecapture(
    prevFen: string,
    uciMoves: [string, string],
): boolean {
    const chess = new Chess(prevFen);
    const [uci1, uci2] = uciMoves;
    const { to: to1 } = uciSplit(uci1);
    const { to: to2 } = uciSplit(uci2);
    return to1 === to2 && chess.get(to1) != null;
}

// Helper: Only good move
function getIsTheOnlyGoodMove(
    positionWin: number,
    altWin: number,
    isWhiteMove: boolean,
): boolean {
    const winDiff = (positionWin - altWin) * (isWhiteMove ? 1 : -1);
    return winDiff > 10;
}

// Helper: Changed game outcome
function getHasChangedGameOutcome(
    lastWin: number,
    positionWin: number,
    isWhiteMove: boolean,
): boolean {
    const winDiff = (positionWin - lastWin) * (isWhiteMove ? 1 : -1);
    return (
        winDiff > 10 &&
        ((lastWin < 50 && positionWin > 50) ||
            (lastWin > 50 && positionWin < 50))
    );
}

// Helper: Losing or alternate completely winning
function isLosingOrAlternateCompletelyWinning(
    positionWin: number,
    altWin: number,
    isWhiteMove: boolean,
): boolean {
    const isLosing = isWhiteMove ? positionWin < 50 : positionWin > 50;
    const isAltCompletelyWinning = isWhiteMove ? altWin > 97 : altWin < 3;
    return isLosing || isAltCompletelyWinning;
}

export default function getMovesClassification(
    positions: Position[],
    uciMoves?: string[],
    fens?: string[],
): string[] {
    if (!uciMoves || !fens) {
        return [];
    }
    const winPercentages = positions.map(getPositionWinPercentage);
    const classifications: string[] = [];
    for (let i = 0; i < positions.length; i++) {
        if (i === 0) {
            classifications.push("book");
            continue;
        }
        const currentFen = fens[i].split(" ")[0];
        const opening = openings.find((o) => o.fen === currentFen);
        if (opening) {
            classifications.push("book");
            continue;
        }
        const prevPosition = positions[i - 1];
        const playedMove = uciMoves[i - 1];
        const isWhiteMove = i % 2 === 1;
        const playerPerspectiveWinDiff =
            (winPercentages[i] - winPercentages[i - 1]) *
            (isWhiteMove ? 1 : -1);
        const altLine = prevPosition.info.find(
            (line) => line.line.split(" ")[0] !== playedMove,
        );
        const altWin =
            altLine?.cp !== undefined && altLine?.cp !== null
                ? winPercentageFromCp(altLine.cp)
                : undefined;
        if (
            playerPerspectiveWinDiff >= -2 &&
            getIsPieceSacrifice(prevPosition.fen, playedMove) &&
            altWin !== undefined &&
            !isLosingOrAlternateCompletelyWinning(
                winPercentages[i],
                altWin,
                isWhiteMove,
            )
        ) {
            classifications.push("brilliant");
            continue;
        }
        const fenTwoMovesAgo = i > 1 ? fens[i - 2] : null;
        const uciLastTwoMoves: [string, string] | null =
            i > 1 ? [uciMoves[i - 2], uciMoves[i - 1]] : null;
        if (
            playerPerspectiveWinDiff >= -2 &&
            altWin !== undefined &&
            !(
                fenTwoMovesAgo &&
                uciLastTwoMoves &&
                isSimplePieceRecapture(fenTwoMovesAgo, uciLastTwoMoves)
            ) &&
            !isLosingOrAlternateCompletelyWinning(
                winPercentages[i],
                altWin,
                isWhiteMove,
            ) &&
            (getIsTheOnlyGoodMove(winPercentages[i], altWin, isWhiteMove) ||
                getHasChangedGameOutcome(
                    winPercentages[i - 1],
                    winPercentages[i],
                    isWhiteMove,
                ))
        ) {
            classifications.push("great");
            continue;
        }
        const bestMoveUci = prevPosition.info[0]?.line?.split(" ")[0];
        if (playedMove === bestMoveUci) {
            classifications.push("best");
            continue;
        }
        if (playerPerspectiveWinDiff < -20) {
            classifications.push("blunder");
        } else if (playerPerspectiveWinDiff < -10) {
            classifications.push("mistake");
        } else if (playerPerspectiveWinDiff < -5) {
            classifications.push("inaccuracy");
        } else if (playerPerspectiveWinDiff < -2) {
            classifications.push("good");
        } else {
            classifications.push("excellent");
        }
    }
    return classifications;
}
