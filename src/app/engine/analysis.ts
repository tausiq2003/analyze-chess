import { CloudEval, Line, Position } from "@/app/types/stockfishAnalysis";
import axios from "axios";
import winPercentageOfLine from "./winpercentage";
class StockfishAnalysis {
    private stockfish = new Worker("stockfish.js");
    depth: number;
    constructor(depth: number = 14) {
        this.depth = depth;
        this.stockfish.postMessage("uci");
        this.stockfish.postMessage("setoption name multipv value 3");
        this.stockfish.postMessage("isready");
    }
    async analyzePosition(
        fen: string,
    ): Promise<{ lines: Line[]; bestMove: string | undefined }> {
        this.stockfish.postMessage(`position fen ${fen}`);
        this.stockfish.postMessage(`go depth ${this.depth}`);

        return new Promise((resolve, reject) => {
            const lines: Line[] = [];
            let bestMove: string | undefined;

            const handleMessage = (event: MessageEvent) => {
                try {
                    const message: string = event.data;

                    // Match analysis info lines
                    const infoRegex = new RegExp(
                        `^info .+ depth ${this.depth} .+`,
                    );
                    if (infoRegex.test(message)) {
                        const multipv = message.match(/multipv (\d+)/)?.[1];
                        const cp = message.match(/score cp (-?\d+)/)?.[1];
                        const mate = message.match(/score mate (-?\d+)/)?.[1];
                        const line = message.match(/\bpv\b (.+)/)?.[1];

                        if (multipv && line) {
                            lines.push({
                                multipv: parseInt(multipv, 10),
                                cp: cp ? parseInt(cp, 10) : null,
                                mate: mate ? parseInt(mate, 10) : null,
                                line,
                            });
                        }
                    } else {
                        const cloudEvalUrl = `https://lichess.org/api/cloud-eval?fen=${fen}&multiPv=3`;
                        const cloudEval: CloudEval =
                            await axios.get(cloudEvalUrl);
                        // to be checked tomorrow
                        lines.push({
                            multipv: 3,
                            cp: cloudEval.pvs[0].cp,
                            mate: cloudEval.pvs[0].cp || null,
                            line: cloudEval.pvs[0].moves,
                        });
                    }

                    // Best move marks end of analysis
                    if (message.startsWith("bestmove")) {
                        bestMove = message.split(" ")[1];
                        this.stockfish.removeEventListener(
                            "message",
                            handleMessage,
                        );
                        clearTimeout(timeoutId); // clear timeout
                        resolve({ lines, bestMove });
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
            }, 5000);
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
