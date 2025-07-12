export interface Position {
    fen: string;
    info: Line[];
    bestMove: string;
    winPercentage: number;
}
export interface Line {
    multipv: number;
    cp: number | null;
    mate: number | null;
    line: string;
}
export interface CloudEval {
    fen: string;
    knodes: number;
    depth: number;
    pvs: [
        { moves: string; cp: number },
        { moves: string; cp: number },
        { moves: string; cp: number },
    ];
}
