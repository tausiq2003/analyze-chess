import GraphChart from "./graph-chart";
import { GoTriangleLeft } from "react-icons/go";
import { GoTriangleRight } from "react-icons/go";
import { FaTurnDown, FaTurnUp } from "react-icons/fa6";

export default function Review() {
    return (
        <>
            <div>
                <div></div>
                <div className="sticky">
                    <GraphChart />
                </div>
                <div className="flex flex-row w-full gap-6 justify-evenly">
                    <button
                        className="bg-[#4c4c4c] w-full py-3 text-xl text-white rounded-md mt-4 flex flex-row justify-center active:scale-90"
                        title="Flip board"
                    >
                        <span className="flex flex-row flex-nowrap">
                            <FaTurnDown className="scale-x-[-1] -mr-0.5" />
                            <FaTurnUp className="-ml-0.5" />
                        </span>
                    </button>
                    <button
                        className="bg-[#4c4c4c] w-full py-3 text-xl text-white rounded-md mt-4 flex flex-row justify-center active:scale-90"
                        title="Go to previous move"
                    >
                        <GoTriangleLeft className="scale-125 " />
                    </button>
                    <button
                        className="bg-[#4c4c4c] w-full py-3 text-xl text-white rounded-md mt-4 flex flex-row justify-center active:scale-90"
                        title="Go to next move"
                    >
                        <GoTriangleRight className="scale-125" />
                    </button>
                </div>
            </div>
        </>
    );
}
