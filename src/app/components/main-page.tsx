import Link from "next/link";

export default function Main() {
    return (
        <>
            <div className="mt-10 mx-10">
                <h1 className="text-2xl mb-4 tracking-tight md:text-4xl">
                    Analyze your chess game here....
                </h1>
                <p className="tracking-tighter text-lg md:text-xl">
                    Analyze your chess game here for free, to get started, enter{" "}
                    <Link
                        href="https://en.wikipedia.org/wiki/Portable_Game_Notation"
                        className="text-blue-400 underline"
                    >
                        PGN(Portable Game Notation)
                    </Link>{" "}
                    or Game Link (currently chess.com and lichess are
                    supported), in the below form and it will take some time to
                    get processed, see your results.
                </p>
                <p className="tracking-tighter text-lg md:text-xl mt-2">
                    If you are still not sure, how to get it, see this{" "}
                    <Link
                        href="https://www.youtube.com/watch?v=DDkTX70ERSA"
                        className="text-blue-400 underline"
                    >
                        video
                    </Link>
                </p>
                <p className="text-lg md:text-xl mt-2">Good Luck</p>
            </div>
            <div className="mt-10 border border-white mx-10 md:flex gap-2">
                <div></div>
                <div></div>
            </div>
        </>
    );
}
