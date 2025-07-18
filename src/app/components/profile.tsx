import React from "react";
import GraphChart from "./graph-chart";
import ShowClassification, { MoveData } from "./showclassification";
import useDataFlow from "../context/DataFlowContext";
import { openings } from "../openings";
import Review from "./review";
import { Chess } from "chess.js";
import MoveList from "./movelist";
import MoveLines from "./movelines";
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

function Profile() {
    const { gameData, currentPtr } = useDataFlow();
    let result = "";
    let termination = "";

    const positions = gameData.postitions
        ? Object.values(gameData.postitions).map((arr) => arr[0])
        : [];
    const evalData = positions.map((pos) => ({
  cp: pos.info?.[0]?.cp ?? null,
  mate: pos.info?.[0]?.mate ?? null,
}));
    // set opening name based on the current position, not checking for first n moves
    let openingName = "";
    const currentMove = positions[currentPtr];
    if (currentMove) {
        const fenPart = currentMove.fen?.split(" ")[0];
        const found = openings.find((o) => o.fen === fenPart);
        if (found) {
            openingName = found.name;
        }
    }

    if (currentPtr === gameData.headers?.moves) {
        result = gameData.headers?.result || "Game ended";
        termination = gameData.headers?.termination || "Game ended";
    }
    // Build SAN move list using chess.js
    const chess = new Chess();
    const sanMoves: string[] = [];
    if (gameData.pgn) {
        chess.loadPgn(gameData.pgn);
        sanMoves.push(...chess.history());
    }
    let showClassMove: MoveData[] = [];
    let showClassFen = undefined;
    if (currentPtr > 0 && positions[currentPtr]) {
        const classification = (positions[currentPtr].moveClassification ||
            "best") as ClassificationType;
        const move = sanMoves[currentPtr - 1] || "";
        const bestMove =
            (positions[currentPtr].info &&
                positions[currentPtr].info[0]?.line?.split(" ")[0]) ||
            "";
        showClassMove = [
            {
                move,
                classification,
                bestMove: ["brilliant", "great", "best", "book"].includes(
                    classification,
                )
                    ? undefined
                    : bestMove,
            },
        ];
        showClassFen = positions[currentPtr].fen;
    }
    return (
        <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-6 p-4">
            <GraphChart data={evalData} />
            <ShowClassification moves={showClassMove} fen={showClassFen} />
            <MoveLines />
            {openingName && (
                <div className="text-md font-semibold text-center">
                    Opening: {openingName}
                </div>
            )}
            {result && (
                <div className="text-md font-semibold text-center">
                    <span className="block">Result: {result}</span>
                    Termination: {termination}
                </div>
            )}
            {}
            <MoveList />
            <Review />
        </div>
    );
}

export default Profile;
