import { Chess, Square } from "chess.js";

export function uciToSan(fen: string, uci: string): string {
    try {
        const chess = new Chess(fen);
        const { from, to, promotion } = uciSplit(uci);
        const move = chess.move({ from, to, promotion });
        return move ? move.san : uci;
    } catch {
        return uci;
    }
}

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
export function sanToUci(san: string): string {
    const chess = new Chess();
    const move = chess.move(san);
    const uci = move.from + move.to + (move.promotion || "");
    return uci;
}
