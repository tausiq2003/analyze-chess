import { Line, Position } from "@/app/types/stockfishAnalysis";
import winPercentageOfLine from "./winpercentage";
class StockfishAnalysis {
    private stockfish = new Worker("stockfish.js");
    depth: number;
    constructor(depth: number = 14) {
        this.depth = depth;
        this.stockfish.postMessage("uci");
        this.stockfish.postMessage("setoption name multipv value 3");
        this.stockfish.postMessage("setoption name Threads value 4");
        this.stockfish.postMessage("isready");
    }
    async analyzePosition(
        fen: string,
    ): Promise<{ lines: Line[]; bestMove: string | undefined }> {
        this.stockfish.postMessage(`position fen ${fen}`);
        this.stockfish.postMessage(`go depth ${this.depth}`);

        return new Promise((resolve, reject) => {
            // Use a map to always keep the latest info for each multipv
            const multipvMap = new Map<number, Line>();
            let bestMove: string | undefined;

            const handleMessage = (event: MessageEvent) => {
                try {
                    const message: string = event.data;
                    console.log('Stockfish message:', message); // debug log
                    // Match any info line with multipv
                    const infoRegex = /^info .+ multipv (\d+) .+/;
                    if (infoRegex.test(message)) {
                        const multipv = message.match(/multipv (\d+)/)?.[1];
                        let cp = message.match(/score cp (-?\d+)/)?.[1];
                        const blackRegexMatch = new RegExp(`\bb\b`);
                        if (!cp) {
                            cp = "0";
                        }
                        if (blackRegexMatch.test(fen)) {
                            cp = (parseInt(cp, 10) * -1).toString();
                        }
                        const mate = message.match(/score mate (-?\d+)/)?.[1];
                        const line = message.match(/\bpv\b (.+)/)?.[1];
                        if (multipv && line) {
                            multipvMap.set(parseInt(multipv, 10), {
                                multipv: parseInt(multipv, 10),
                                cp: parseInt(cp, 10),
                                mate: mate ? parseInt(mate, 10) : null,
                                line,
                            });
                        }
                    }
                    if (message.startsWith("bestmove")) {
                        bestMove = message.split(" ")[1];
                        this.stockfish.removeEventListener(
                            "message",
                            handleMessage,
                        );
                        clearTimeout(timeoutId);
                        const lines = Array.from(multipvMap.values()).sort((a, b) => a.multipv - b.multipv);
                        if (lines.length > 0) {
                        resolve({ lines, bestMove });
                        } else {
                            reject(new Error("No analysis data received from Stockfish. (See console for Stockfish output)"));
                        }
                    }
                } catch (err) {
                    this.stockfish.removeEventListener(
                        "message",
                        handleMessage,
                    );
                    clearTimeout(timeoutId);
                    reject(err);
                }
            };

            this.stockfish.addEventListener("message", handleMessage);

            const timeoutId = setTimeout(() => {
                this.stockfish.removeEventListener("message", handleMessage);
                reject(new Error("Stockfish analysis timed out."));
            }, 20000); // 20 seconds
        });
    }
    async getPositionDetails(fen: string): Promise<Position> {
        try {
            const { lines, bestMove: initialBestMove } =
                await this.analyzePosition(fen);
            if (!lines || lines.length === 0) {
                throw new Error("No analysis data received from Stockfish.");
            }
            const bestMove = initialBestMove || lines[0].line.split(" ")[0];
            const winPercentage = winPercentageOfLine(lines[0]);
            const position: Position = {
                fen,
                info: lines,
                bestMove: bestMove || "",
                winPercentage: winPercentage || 0,
            };
            return position;
        } catch (error) {
            throw new Error(`Error analyzing position: ${error}`);
        }
    }
}

export default StockfishAnalysis;
