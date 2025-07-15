"use server";
import { z } from "zod";
import { Chess } from "chess.js";
import { GameDetails } from "@/app/types/chessData";

const inpSchema = z.object({
    gameInput: z.string().min(1, "Game details cannot be empty"),
    option: z.enum(["pgn", "link"]),
    depth: z.enum(["14", "16", "18", "20", "22"]),
});

export async function validateInputs(_: unknown, formData: FormData) {
    const formObj = Object.fromEntries(formData.entries());
    const result = inpSchema.safeParse(formObj);

    if (!result.success) {
        const formFieldError = result.error.flatten().fieldErrors;
        return {
            errors: {
                depth: formFieldError?.depth,
                gameInput: formFieldError?.gameInput,
                option: formFieldError?.option,
            },
        };
    }

    try {
        let processedData;
        if (formObj.option === "pgn") {
            processedData = await parsePGN(formObj.gameInput as string);
        } else if (formObj.option === "link") {
            processedData = await getPGNDataFromLink(
                formObj.gameInput as string,
            );
        }

        if (
            processedData &&
            typeof processedData === "object" &&
            "error" in processedData
        ) {
            return {
                errors: {
                    gameInput: [processedData?.error],
                },
            };
        }

        console.log(processedData);

        return {
            success:
                "Data sent successfully, now wait for a minute or two as it's getting processed.",
            processedData,
        };
    } catch (error) {
        console.error(error);
        return {
            errors: {
                gameInput: ["An unexpected error occurred"],
            },
        };
    }
}

async function parsePGN(pgn: string) {
    try {
        const chessGame = new Chess();
        chessGame.loadPgn(pgn);
        const blackName = chessGame.header()["Black"] || "Anonymous";
        const whiteName = chessGame.header()["White"] || "Anonymous";
        const blackElo = chessGame.header()["BlackElo"] || "???";
        const whiteElo = chessGame.header()["WhiteElo"] || "???";
        const result = chessGame.header()["Result"];
        const termination = chessGame.header()["Termination"];
        if (!result || !termination) {
            const chess2 = new Chess(chessGame.fen());
            if (chess2.isGameOver()) {
                if (chess2.isDraw()) {
                    chessGame.header()["Result"] = "1/2-1/2";
                    chessGame.header()["Termination"] = "Draw";
                } else if (chess2.isStalemate()) {
                    chessGame.header()["Result"] = "1/2-1/2";
                    chessGame.header()["Termination"] = "Stalemate";
                } else if (chess2.isCheckmate()) {
                    if (chessGame.turn() === "w") {
                        chessGame.header()["Result"] = "0-1";
                        chessGame.header()["Termination"] = "Black won";
                    } else {
                        chessGame.header()["Result"] = "1-0";
                        chessGame.header()["Termination"] = "White won";
                    }
                } else {
                    chessGame.header()["Result"] = "*";
                    chessGame.header()["Termination"] = "Unknown";
                }
            } else {
                if (chessGame.turn() === "w") {
                    chessGame.header()["Result"] = "0-1";
                    chessGame.header()["Termination"] = "Black won";
                } else {
                    chessGame.header()["Result"] = "1-0";
                    chessGame.header()["Termination"] = "White won";
                }
            }
        }
        const nonResult = chessGame.header()["Result"];
        const nonTermination = chessGame.header()["Termination"];
        const gameData: GameDetails = {
            headers: {
                black: {
                    name: blackName,
                    elo: blackElo,
                },
                white: {
                    name: whiteName,
                    elo: whiteElo,
                },
                result: result || nonResult,
                termination: termination || nonTermination,
            },
            pgn: JSON.stringify(chessGame.pgn()).trim(),
        };
        console.log(gameData);

        return JSON.stringify(gameData).trim();
    } catch (err) {
        console.error((err as Error).message);
        return {
            error: "This PGN is not valid. Please check the console.",
        };
    }
}

async function parseLinks(link: string) {
    const cleanLink = link.trim();
    if (!cleanLink || typeof link !== "string") {
        return {
            error: "Please enter a valid link",
        };
    }

    try {
        const processedLink = cleanLink.startsWith("http")
            ? cleanLink
            : `https://${cleanLink}`;
        const url = new URL(processedLink);
        const host = url.host.replace("www.", "");
        const pathParts = url.pathname.split("/").filter(Boolean);

        if (host === "chess.com") {
            if (pathParts[0] === "game") {
                return {
                    gameType: "chessCom",
                    gameFormat: pathParts[1],
                    gameId: pathParts[pathParts.length - 1],
                };
            }
            return { error: "Invalid Chess.com game ID format" };
        }

        if (host === "lichess.org") {
            if (pathParts.length === 1 || pathParts.length === 2) {
                return {
                    gameType: "lichess",
                    gameId: pathParts[0],
                };
            }
            return { error: "Invalid Lichess game ID format" };
        }

        return { error: "Unsupported chess platform" };
    } catch (e) {
        console.error(e);
        return {
            error: "Invalid game link, please check the console",
        };
    }
}

async function getPGNDataFromLink(input: string) {
    const res = await parseLinks(input);
    if (res?.error) {
        return res;
    }

    // giving api for everyone to use, if chess-com-pgn.vercel.app gets rekt, please let me know, i will deploy my own so that you can use it, i have
    const { gameType, gameFormat, gameId } = res;
    try {
        const targetUrl =
            gameType === "lichess"
                ? `https://lichess.org/game/export/${gameId}?clocks=false`
                : `https://chess-com-pgn.vercel.app/api/${
                      ["daily", "live"].includes(gameFormat || "")
                          ? gameFormat
                          : "live"
                  }/game/${gameId}`;

        const response = await fetch(targetUrl);
        if (!response.ok) {
            return {
                error: `Invalid Game Link (${response.status})`,
            };
        }

        const data = await response.text();
        const pgnFromLink = await parsePGN(data as string);
        if (typeof pgnFromLink === "object" && "error" in pgnFromLink) {
            return {
                error: "No PGN found, try again, or open an issue in github",
            };
        }
        return pgnFromLink;
    } catch (error) {
        console.error(error);
        return {
            error: "An internal error occurred, check the console",
        };
    }
}
