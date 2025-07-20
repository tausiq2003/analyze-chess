import {
    Best,
    Blunder,
    Book,
    Brilliant,
    Excellent,
    Good,
    Great,
    Inaccuracy,
    Mistake,
} from "@/app/logos";
import { uciToSan } from "../utils/moveconversions";

type ClassificationType =
    | "brilliant"
    | "great"
    | "excellent"
    | "best"
    | "good"
    | "inaccuracy"
    | "mistake"
    | "blunder"
    | "book";

interface MoveData {
    move: string;
    classification: ClassificationType;
    bestMove?: string; // provide best move explicitly when needed
}

interface Props {
    moves: MoveData[];
    fen?: string;
}

const classificationMap = {
    brilliant: {
        icon: <Brilliant />,
        text: "brilliant",
        className: "brilliant-moves",
    },
    great: {
        icon: <Great />,
        text: "great",
        className: "great-moves",
    },
    excellent: {
        icon: <Excellent />,
        text: "excellent",
        className: "excellent-moves",
    },
    best: {
        icon: <Best />,
        text: "best",
        className: "best-moves",
    },
    good: {
        icon: <Good />,
        text: "good",
        className: "good-moves",
    },
    inaccuracy: {
        icon: <Inaccuracy />,
        text: "inaccuracy",
        className: "inaccuracy-moves",
    },
    mistake: {
        icon: <Mistake />,
        text: "mistake",
        className: "mistake-moves",
    },
    blunder: {
        icon: <Blunder />,
        text: "blunder",
        className: "blunder-moves",
    },
    book: {
        icon: <Book />,
        text: "book",
        className: "book-moves",
    },
} as const;

export type { MoveData };

function ShowClassification({ moves, fen }: Props) {
    return (
        <div className="flex flex-col gap-1 max-h-10 min-h-10">
            {moves.map(({ move, classification, bestMove }, idx) => {
                const fallback = classificationMap["best"];
                const { icon, text, className } =
                    classificationMap[classification] || fallback;

                // for book, best, great, brilliant it doesn't show the best move
                if (
                    ["book", "best", "great", "brilliant"].includes(
                        classification,
                    )
                ) {
                    return (
                        <div
                            key={move + idx}
                            className={`flex items-center gap-2 text-sm ${className}`}
                        >
                            {icon}
                            <span>{`${move} is ${text} move`}</span>
                        </div>
                    );
                }
                let bestSan = bestMove;
                if (bestMove && fen) {
                    bestSan = uciToSan(fen, bestMove);
                }
                // compare move and bestSan as SAN, and ensure move index is offset by +1 if needed
                const showBestLine = bestSan && move !== bestSan;
                return (
                    <div key={move + idx} className="flex flex-col gap-0.5">
                        <div
                            className={`flex items-center gap-2 text-sm ${className}`}
                        >
                            {icon}
                            <span>{`${move} is ${text} move`}</span>
                        </div>
                        {showBestLine && (
                            <div className="flex items-center gap-2 text-sm best-moves">
                                {classificationMap["best"].icon}
                                <span>{`${bestSan} is best move`}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
export default ShowClassification;
