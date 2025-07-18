import clsx from "clsx";

export default function EvalBar({
    evalScore,
    orientation,
    mate,
}: {
    evalScore: string;
    orientation: string;
    mate?: number | null;
}) {
    let percentage = 50;
    let displayScore = evalScore;

    // If mate is present, override displayScore and percentage
    if (mate !== undefined && mate !== null) {
        displayScore = mate > 0 ? `M${mate}` : `-M${-mate}`;
        percentage = mate > 0 ? 100 : 0;
    } else if (evalScore.startsWith("M")) {
        percentage = 100;
    } else if (evalScore.startsWith("-M")) {
        percentage = 0;
    } else {
        const score = parseFloat(evalScore) || 0;
        percentage = Math.max(0, Math.min(100, 50 + score * 5));
    }

    // This determines which color goes where based on orientation
    const whiteOnBottom = orientation === "white";
    return (
        <div className="relative w-8 bg-transparent rounded overflow-hidden mr-2 self-stretch max-md:w-5">
            {/* White section */}
            <div
                className="absolute transition-all bg-white"
                style={
                    whiteOnBottom
                        ? {
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              height: `${percentage}%`,
                          }
                        : {
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${percentage}%`,
                          }
                }
            />

            {/* Black section */}
            <div
                className="absolute transition-all bg-black"
                style={
                    whiteOnBottom
                        ? {
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${100 - percentage}%`,
                          }
                        : {
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              height: `${100 - percentage}%`,
                          }
                }
            />

            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-400" />

            {displayScore.startsWith("M") && (
                <div
                    className={clsx(
                        "absolute left-0 right-0 flex items-center justify-center",
                        whiteOnBottom ? "bottom-1" : "top-1",
                    )}
                >
                    <span className="text-[10px] sm:text-[10px] font-semibold text-black">
                        {displayScore}
                    </span>
                </div>
            )}

            {displayScore.startsWith("-M") && (
                <div
                    className={clsx(
                        "absolute left-0 right-0 flex items-center justify-center",
                        whiteOnBottom ? "top-1" : "bottom-1",
                    )}
                >
                    <span className="text-[8px] md:text-[10px] font-semibold text-white px-2">
                        {displayScore}
                    </span>
                </div>
            )}

            {!displayScore.startsWith("M") &&
                !displayScore.startsWith("-M") &&
                !displayScore.startsWith("-") && (
                    <div
                        className={clsx(
                            "absolute left-0 right-0 flex items-center justify-center",
                            whiteOnBottom ? "bottom-1" : "top-1",
                        )}
                    >
                        <span className="text-[10px] sm:text-[10px] font-semibold text-black">
                            {displayScore}
                        </span>
                    </div>
                )}

            {!displayScore.startsWith("M") &&
                !displayScore.startsWith("-M") &&
                displayScore.startsWith("-") && (
                    <div
                        className={clsx(
                            "absolute left-0 right-0 flex items-center justify-center",
                            whiteOnBottom ? "top-1" : "bottom-1",
                        )}
                    >
                        <span className="text-[8px] md:text-[10px] font-semibold text-white px-2">
                            {displayScore}
                        </span>
                    </div>
                )}
        </div>
    );
}
