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
    const [option, setOption] = useState<InputOption>("pgn");
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
    }, [state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOption(e.target.value as InputOption);
    };

    const handleDepthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (["14", "16", "18", "20", "22"].includes(selectedValue)) {
            setDepth(selectedValue as DepthOption);
        }
    };

    return (
        <div className="max-w-full rounded-xl shadow-lg bg-[#404040] p-6 max-lg:mt-20 max-lg:m-auto max-lg:max-w-xl">
            {showAnalysis ? (
                <>
                    <Analysis />
                </>
            ) : (
                <>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">
                        Give your details here:
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <label
                                htmlFor="gameInput"
                                className="block text-xl font-medium mb-3"
                            >
                                Enter your game details:
                            </label>
                            <div className="flex w-full max-h-12">
                                <input
                                    type="text"
                                    id="gameInput"
                                    name="gameInput"
                                    value={input}
                                    onChange={handleInputChange}
                                    className="rounded-s-md bg-gray-600 w-full px-2 text-lg"
                                    placeholder="Game Details (PGN/Game Link)"
                                    required
                                />
                                <select
                                    name="option"
                                    value={option}
                                    onChange={handleOptionChange}
                                    className="inline w-[40%] p-3 bg-gray-800 text-sm"
                                >
                                    <option value="pgn">PGN</option>
                                    <option value="link">Game Link</option>
                                </select>
                            </div>
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
                                className="block w-full p-3 bg-gray-600 text-lg"
                            >
                                <option value="14">Depth 14</option>
                                <option value="16">Depth 16</option>
                                <option value="18">Depth 18</option>
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

                        {state?.success && !showAnalysis && (
                            <div className="text-green-500 text-center">
                                {state.success}
                            </div>
                        )}
                    </form>
                </>
            )}
        </div>
    );
}
