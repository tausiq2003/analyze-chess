"use client";
import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import {
    BoardOrientation,
    Arrow,
} from "react-chessboard/dist/chessboard/types";
import useDataFlow from "../context/DataFlowContext";

export default function Board({
    fen,
    orientation,
    onBoardWidthChange,
}: {
    fen: string;
    orientation: string;
    onBoardWidthChange?: (width: number) => void;
}) {
    const [boardWidth, setBoardWidth] = useState(400);
    const containerRef = useRef<HTMLDivElement>(null);
    const { arrows } = useDataFlow();
    // Map arrows to [from, to, color] for Chessboard
    const chessboardArrows = arrows.map((a) => [
        a.from,
        a.to,
        a.color,
    ]) as Arrow[];

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const availableWidth = containerWidth - 40;

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                const maxSize = Math.min(availableWidth, viewportHeight * 0.8);
                let newBoardWidth;

                if (viewportWidth < 480) {
                    newBoardWidth = Math.min(maxSize, availableWidth);
                } else {
                    newBoardWidth = maxSize;
                }
                setBoardWidth(newBoardWidth);
                onBoardWidthChange?.(newBoardWidth);
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [onBoardWidthChange]);
    return (
        <div ref={containerRef} className="flex-1">
            <div className="w-full h-full">
                <Chessboard
                    position={fen}
                    arePiecesDraggable={false}
                    boardWidth={boardWidth}
                    customDarkSquareStyle={{
                        backgroundColor: "#739552",
                    }}
                    customLightSquareStyle={{
                        backgroundColor: "#EBECD0",
                    }}
                    boardOrientation={orientation as BoardOrientation}
                    customArrows={chessboardArrows}
                />
            </div>
        </div>
    );
}
