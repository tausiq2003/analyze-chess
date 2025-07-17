import useDataFlow from "../context/DataFlowContext";

export default function MoveLines() {
    const { gameData } = useDataFlow();
    const positions = gameData.postitions ? Object.values(gameData.postitions).map(arr => arr[0]) : [];
    return (
        <div className="flex flex-col gap-3 overflow-x-auto">
            <h1 className="text-white">Move Lines:</h1>
            {positions.map((pos, index) => (
                <div key={index} className="p-2 rounded-md bg-[#505050] w-full">
                    <div className="flex flex-wrap items-center gap-2 text-white text-sm">
                        <p className="min-w-[50px] shrink-0">{pos.info && pos.info[0]?.cp !== undefined && pos.info[0]?.cp !== null ? (pos.info[0].cp / 100).toFixed(2) : "0.00"}</p>
                        <p className="whitespace-normal">{pos.info && pos.info[0]?.line}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
