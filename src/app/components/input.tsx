"use client";
import { FormEvent, useActionState, useState } from "react";
import Form from "next/form";
import { DepthOption, InputOption } from "../types";

export default function Input() {
    const [depth, setDepth] = useState<DepthOption>("14");
    const [option, setOption] = useState<InputOption>("pgn");
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [formIsValid, setformIsValid] = useState(false);
    const pgnDisabled = input.trim() === "";
    const status = pgnDisabled ? "bg-gray-400" : "bg-green-400";

    return (
        <div className="max-w-full rounded-xl shadow-lg bg-[#404040] p-6 max-lg:mt-20  max-lg:m-auto max-lg:max-w-xl ">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">
                Give your details here:{" "}
            </h1>
            <div>
                <Form action="" className="space-y-6">
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
                                className="rounded-s-md bg-gray-600 w-full px-2 text-lg focus:outline-none focus:border-2 focus:border-gray-300"
                                name="gameInput"
                                value={input}
                                placeholder="Game Details(PGN/Game Link)"
                                onChange={(e) => setInput(e.target.value)}
                                required
                            />
                            <select
                                name="option"
                                required
                                className="inline w-[40%] border-gray-300 shadow-sm focus:border-gray-500 focus:ring-blue-500 p-3 bg-gray-800 text-sm"
                                value={option}
                                onChange={(e) =>
                                    setOption(e.target.value as InputOption)
                                }
                            >
                                <option value="pgn">PGN</option>
                                <option value="link">Game Link</option>
                            </select>
                            <button
                                title="Validate Input"
                                disabled={pgnDisabled}
                                className={`${status} aspect-square inline w-[20%] rounded-e-md`}
                            >
                                ✔️
                            </button>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="depth"
                            className="block text-xl font-medium mb-3"
                        >
                            Analysis Depth
                        </label>
                        <select
                            name="depth"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-blue-500 p-3 bg-gray-600 mb-5 text-lg"
                            id="depth"
                            value={depth}
                            onChange={(e) =>
                                setDepth(e.target.value as DepthOption)
                            }
                        >
                            <option value="14">Depth 14</option>
                            <option value="16">Depth 16</option>
                            <option value="18">Depth 18</option>
                            <option value="20">Depth 20</option>
                            <option value="22">Depth 22</option>
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={` w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white transform duration-300 focus:scale-105 transition-colors`}
                        >
                            Submit
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
