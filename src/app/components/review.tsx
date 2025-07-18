"use client";
import useDataFlow from "../context/DataFlowContext";
import { GoTriangleLeft } from "react-icons/go";
import { GoTriangleRight } from "react-icons/go";
import { FaTurnDown, FaTurnUp } from "react-icons/fa6";

export default function Review() {
    const {
        currentPtr,
        moveNext,
        movePrev,
        gameData,
        setBoardFlipped,
        boardFlipped,
    } = useDataFlow();
    const positions = gameData.postitions
        ? Object.values(gameData.postitions).map((arr) => arr[0])
        : [];
    return (
        <div className="flex flex-row w-full gap-6 justify-evenly">
            <button
                className="bg-[#4c4c4c] w-full py-3 text-xl text-white rounded-md mt-4 flex flex-row justify-center active:scale-90"
                title="Flip board"
                onClick={() => setBoardFlipped(!boardFlipped)}
            >
                <span className="flex flex-row flex-nowrap">
                    <FaTurnDown className="scale-x-[-1] -mr-0.5" />
                    <FaTurnUp className="-ml-0.5" />
                </span>
            </button>
            <button
                className="bg-[#4c4c4c] w-full py-3 text-xl text-white rounded-md mt-4 flex flex-row justify-center active:scale-90"
                title="Go to previous move"
                onClick={movePrev}
                disabled={currentPtr === 0}
            >
                <GoTriangleLeft className="scale-125 " />
            </button>
            <button
                className="bg-[#4c4c4c] w-full py-3 text-xl text-white rounded-md mt-4 flex flex-row justify-center active:scale-90"
                title="Go to next move"
                onClick={moveNext}
                disabled={currentPtr === positions.length - 1}
            >
                <GoTriangleRight className="scale-125" />
            </button>
        </div>
    );
}
