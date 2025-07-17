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
        className: "excel-moves",
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
        className: "inaccurate-moves",
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

function ShowClassification({ moves }: Props) {
    return (
        <div className="flex flex-col gap-1">
            {moves.map(({ move, classification, bestMove }) => {
                const fallback = classificationMap["best"];
                const { icon, text, className } = classificationMap[classification] || fallback;
                const firstLine =
                    classification === "book"
                        ? `${move} is book move`
                        : `${move} is ${text} move`;

                return (
                    <div key={move} className="flex flex-col gap-0.5">
                        <div
                            className={`flex items-center gap-2 text-sm ${className}`}
                        >
                            {icon}
                            <span>{firstLine}</span>
                        </div>
                        {[
                            "excellent",
                            "good",
                            "inaccuracy",
                            "mistake",
                            "blunder",
                        ].includes(classification) &&
                            bestMove && (
                                <div className="flex items-center gap-2 text-sm best-moves">
                                    <Best />
                                    <span>{bestMove} is best move</span>
                                </div>
                            )}
                    </div>
                );
            })}
        </div>
    );
}
export default ShowClassification;
