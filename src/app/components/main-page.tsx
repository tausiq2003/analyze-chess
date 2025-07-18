import Link from "next/link";
import Game from "./game";

export default function Main() {
    return (
        <>
            <div className="mt-10 mx-10 overflow-x-hidden">
                <h1 className="text-2xl mb-4 tracking-tight md:text-4xl">
                    Analyze your chess game here....
                </h1>
                <p className="tracking-tighter text-lg md:text-xl text-justify">
                    Analyze your chess game here for free, to get started, enter{" "}
                    <Link
                        href="https://en.wikipedia.org/wiki/Portable_Game_Notation"
                        className="text-blue-400 underline"
                        target="_blank"
                    >
                        PGN(Portable Game Notation)
                    </Link>{" "}
                    or Game Link (currently chess.com and lichess are
                    supported), in the below form and it will take some time to
                    get processed, see your results.
                </p>
                <p className="tracking-tighter text-lg md:text-xl mt-2 text-justify">
                    If you have any issues or if the results are not accurate,
                    please raise a issue on{" "}
                    <Link
                        href="https://github.com/tausiq2003/analyze-chess/issues"
                        className="text-blue-400 underline"
                        target="_blank"
                    >
                        this link
                    </Link>
                    .
                </p>

                <p className="tracking-tighter text-lg md:text-xl mt-2 text-justify">
                    If you are still not sure, how to get it, see this{" "}
                    <Link
                        href="https://www.youtube.com/watch?v=DDkTX70ERSA"
                        className="text-blue-400 underline"
                        target="_blank"
                    >
                        video
                    </Link>
                </p>
                <p className="text-lg md:text-xl mt-2">Good Luck</p>
            </div>
            <div className="mt-10 py-3 lg:flex lg:justify-around lg:gap-2 overflow-x-hidden mx-10 px-10 max-sm:mx-0 max-sm:px-0">
                <Game />
            </div>
        </>
    );
}
