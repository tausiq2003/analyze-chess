import { DepthOption } from "./input";
import { Position } from "./stockfishAnalysis";
export interface GameDetails {
    headers: {
        black: {
            name: string | "Anonymous";
            elo: string | "???";
        };
        white: {
            name: string | "Anonymous";
            elo: string | "???";
        };
        result: string;
        termination: string;
        moves: number;
    };
    depth: DepthOption;
    pgn: string;
    accuracyBlack?: string | null;
    accuracyWhite?: string | null;
    estimatedEloBlack?: string | null;
    estimatedEloWhite?: string | null;
    postitions?: { [key: string]: Position[] };
}
