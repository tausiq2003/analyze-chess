import useDataFlow from "../context/DataFlowContext";

export default function MoveList() {
    const { gameData, currentPtr } = useDataFlow();
    const positions = gameData.postitions ? Object.values(gameData.postitions).map(arr => arr[0]) : [];
    const moves = positions.map((pos, idx) => ({
        moveNum: idx + 1,
        san: pos.bestMove || "",
        classification: pos.moveClassification || ""
    }));
    return (
        <div className="flex flex-col gap-2 mt-6 overflow-y-auto h-[400px] rounded-md">
            {moves.map((move, index) => (
                <div
                    key={index}
                    className={`flex flex-wrap justify-around gap-4 p-2 rounded-md ${
                        index % 2 === 0 ? "bg-[#383838]" : "bg-[#505050]"
                    }`}
                >
                    <p>{move.moveNum}.</p>
                    <button>{move.san}</button>
                    <span>{move.classification}</span>
                </div>
            ))}
        </div>
    );
}
