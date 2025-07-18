import { Line, Position } from "@/app/types/stockfishAnalysis";
import winPercentageOfLine from "./winpercentage";

class StockfishAnalysis {
    private stockfish = new Worker(`/stockfish.js`);
    //setting this to a map so that we can cache the positions
    private cache = new Map<string, Position>();
    depth: number;

    constructor(depth: number = 14) {
        this.depth = depth;
        const logicalCores = navigator.hardwareConcurrency || 2;
        const threadsToUse = Math.max(
            1,
            Math.min(Math.floor(logicalCores / 1.5), 8),
        );

        this.stockfish.postMessage("uci");
        this.stockfish.postMessage("setoption name multipv value 3");
        this.stockfish.postMessage(
            `setoption name Threads value ${threadsToUse}`,
        );
        this.stockfish.postMessage("isready");
    }

    private async analyzePosition(
        fen: string,
        onProgress?: (position: Position) => void,
    ): Promise<Position> {
        this.stockfish.postMessage(`position fen ${fen}`);
        this.stockfish.postMessage(`go depth ${this.depth}`);

        return new Promise((resolve, reject) => {
            const multipvMap = new Map<number, Line>();
            let bestMove: string | undefined;

            const handleMessage = (event: MessageEvent) => {
                try {
                    const message: string = event.data;
                    const infoRegex = /^info depth \d+ .+/;

                    if (infoRegex.test(message)) {
                        const multipv = message.match(/multipv (\d+)/)?.[1];
                        const cpString = message.match(/score cp (-?\d+)/)?.[1];
                        const mate = message.match(/score mate (-?\d+)/)?.[1];
                        const line = message.match(/\bpv\b (.+)/)?.[1];

                        if (multipv && line && (cpString || mate)) {
                            let cpValue = cpString ? parseInt(cpString, 10) : 0;
                            let mateValue = mate ? parseInt(mate, 10) : null;
                            if (/\sb\s/.test(fen)) {
                                cpValue *= -1;
                                if (mateValue !== null) mateValue *= -1;
                            }
                            multipvMap.set(parseInt(multipv, 10), {
                                multipv: parseInt(multipv, 10),
                                cp: cpValue,
                                mate: mateValue,
                                line,
                            });
                            //sorts the multipvmap by multipv

                            const lines = Array.from(multipvMap.values()).sort(
                                (a, b) => a.multipv - b.multipv,
                            );
                            if (lines.length > 0) {
                                const tempBestMove =
                                    lines[0].line.split(" ")[0];
                                const tempPosition: Position = {
                                    fen,
                                    info: lines,
                                    bestMove: tempBestMove || "",
                                    winPercentage: winPercentageOfLine(
                                        lines[0],
                                    ),
                                };

                                if (onProgress) {
                                    onProgress(tempPosition);
                                }
                            }
                        }
                    }

                    if (message.startsWith("bestmove")) {
                        bestMove = message.split(" ")[1];
                        this.stockfish.removeEventListener(
                            "message",
                            handleMessage,
                        );
                        clearTimeout(timeoutId);
                        //find final lines

                        const finalLines = Array.from(multipvMap.values()).sort(
                            (a, b) => a.multipv - b.multipv,
                        );
                        if (finalLines.length > 0) {
                            const finalBestMove =
                                bestMove || finalLines[0].line.split(" ")[0];
                            const finalPosition: Position = {
                                fen,
                                info: finalLines,
                                bestMove: finalBestMove,
                                winPercentage: winPercentageOfLine(
                                    finalLines[0],
                                ),
                            };
                            resolve(finalPosition);
                        } else {
                            console.warn(
                                `No PV lines found for FEN "${fen}". Assuming game over.`,
                            );

                            const gameOverLine: Line = {
                                multipv: 1,
                                cp: null,
                                mate: 0,
                                line: "(no legal moves)",
                            };

                            const finalPosition: Position = {
                                fen,
                                info: [gameOverLine],
                                bestMove: bestMove, // This will be "(none)"
                                winPercentage:
                                    winPercentageOfLine(gameOverLine), // This will be 0
                            };

                            resolve(finalPosition);
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
            }, 90000);
        });
    }

    public async getPositionDetails(
        fen: string,
        onProgress?: (position: Position) => void,
    ): Promise<Position> {
        if (this.cache.has(fen)) {
            const cachedPosition = this.cache.get(fen)!;
            if (onProgress) {
                onProgress(cachedPosition);
            }
            return cachedPosition;
        }

        try {
            const finalPosition = await this.analyzePosition(fen, onProgress);
            this.cache.set(fen, finalPosition);
            return finalPosition;
        } catch (error) {
            throw new Error(
                `Error analyzing position for FEN "${fen}": ${error}`,
            );
        }
    }
}

export default StockfishAnalysis;
