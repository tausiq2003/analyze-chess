"use client";
import { useActionState, useState, startTransition, useEffect } from "react";
import { GameDetails } from "@/app/types/chessData";
import { DepthOption, InputOption } from "../types/input";
import { validateInputs } from "@/lib/actions";
import Analysis from "./analysis";
import useDataFlow from "../context/DataFlowContext";

export default function Input() {
    const { changeGameData } = useDataFlow();
    const [input, setInput] = useState("");
    // Default option is now "link"
    const [option, setOption] = useState<InputOption>("link");
    const [depth, setDepth] = useState<DepthOption>("14");
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [state, formAction, pending] = useActionState(validateInputs, null);

    const inpDisabled = input.trim() === "";
    const status = inpDisabled ? "bg-gray-400" : "bg-green-400";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true);
        startTransition(() => {
            formAction(new FormData(e.currentTarget));
        });
    };

    useEffect(() => {
        if (state?.success) {
            const gameData = state.processedData as unknown as GameDetails;
            changeGameData({
                headers: {
                    black: gameData.headers.black,
                    white: gameData.headers.white,
                    result: gameData.headers.result,
                    moves: gameData.headers.moves,
                    termination: gameData.headers.termination,
                },
                depth: depth,
                pgn: gameData.pgn,
            });
            setShowAnalysis(true);
        } else {
            setShowAnalysis(false);
        }
        setIsProcessing(false);
    }, [state]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setInput(e.target.value);
    };

    const handleDepthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (["14", "16", "18", "20", "22"].includes(selectedValue)) {
            setDepth(selectedValue as DepthOption);
        }
    };

    return (
        <div className="min-w-[35%] max-w-[35%] rounded-xl shadow-lg bg-[#404040] p-6 max-lg:mt-20 max-lg:m-auto overflow-auto max-lg:min-w-[90%] max-lg:max-w-[90%] ">
            {showAnalysis ? (
                <Analysis />
            ) : (
                <>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
                        Give your details here:
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="option" value={option} />

                        <div className="space-y-4">
                            <label className="block text-xl font-medium mb-2">
                                Enter your game details:
                            </label>

                            <div className="flex rounded-md overflow-hidden border border-gray-500">
                                <button
                                    type="button"
                                    onClick={() => setOption("link")}
                                    className={`w-full p-2 text-lg font-medium transition-colors ${
                                        option === "link"
                                            ? "bg-gray-800 text-white"
                                            : "bg-gray-600 text-gray-300"
                                    }`}
                                >
                                    Link
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOption("pgn")}
                                    className={`w-full p-2 text-lg font-medium transition-colors ${
                                        option === "pgn"
                                            ? "bg-gray-800 text-white"
                                            : "bg-gray-600 text-gray-300"
                                    }`}
                                >
                                    PGN
                                </button>
                            </div>

                            {option === "link" ? (
                                <input
                                    type="text"
                                    id="gameInput"
                                    name="gameInput"
                                    value={input}
                                    onChange={handleInputChange}
                                    className="rounded-md bg-gray-600 w-full p-3 text-lg"
                                    placeholder="Enter Game Link"
                                    required
                                />
                            ) : (
                                <textarea
                                    id="gameInput"
                                    name="gameInput"
                                    value={input}
                                    onChange={handleInputChange}
                                    className="rounded-md bg-gray-600 w-full p-2 text-lg min-h-[120px] resize-y"
                                    placeholder="Enter PGN"
                                    required
                                />
                            )}

                            {state?.errors?.gameInput && (
                                <p className="text-red-500 text-sm">
                                    {state.errors.gameInput[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="depth"
                                className="block text-xl font-medium mb-3"
                            >
                                Analysis Depth
                            </label>
                            <select
                                id="depth"
                                name="depth"
                                value={depth}
                                onChange={handleDepthChange}
                                className="block w-full p-3 bg-gray-600 text-lg rounded-md"
                            >
                                <option value="14">Depth 14</option>
                                <option value="16">Depth 16</option>
                                <option value="18">Depth 18</option>
                                <option value="19">Depth 19</option>
                                <option value="20">Depth 20</option>
                                <option value="22">Depth 22</option>
                            </select>
                            {state?.errors?.depth && (
                                <p className="text-red-500 text-sm">
                                    {state.errors.depth[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`${status} w-full py-3 text-xl text-white rounded-md`}
                                disabled={
                                    inpDisabled || pending || isProcessing
                                }
                            >
                                {pending || isProcessing
                                    ? "Submitting..."
                                    : "Submit"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
