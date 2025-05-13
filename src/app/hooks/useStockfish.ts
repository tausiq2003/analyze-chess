import { useEffect, useRef, useState } from "react";

export default function useStockfish({
    fen,
    depth,
}: {
    fen: string;
    depth: string;
}) {
    const workerRef = useRef<Worker | null>(null);
    const [evaluation, setEvaluation] = useState<number[]>([]);
    const [bestMove, setBestMove] = useState<string[]>([]);
    const [ponderMove, setPonderMove] = useState<string[]>([]);
    const [data, setData] = useState<string[]>([]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const worker = new Worker("/stockfish.js");
            workerRef.current = worker;
            const messages: string[] = [];
            worker.onmessage = async (event: MessageEvent) => {
                const message = event.data;
                console.log("-------test-------\n" + message);
                messages.push(message);
            };
        }
        return { evaluation, bestMove, ponderMove, data };
    }, [fen, depth]);
}
