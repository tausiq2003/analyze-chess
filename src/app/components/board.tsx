"use client";
import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

export default function Board({
    fen,
    orientation,
}: {
    fen: string;
    orientation: string;
}) {
    const [boardWidth, setBoardWidth] = useState(400);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Calculate appropriate board size based on viewport
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Use the smaller dimension with some padding to ensure board fits well
                const maxSize = Math.min(containerWidth, viewportHeight);
                
                // Add additional scaling for very small screens
                if (viewportWidth < 480) {
                    setBoardWidth(Math.min(maxSize, containerWidth));
                } else {
                    setBoardWidth(maxSize);
                }
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div ref={containerRef} className="w-full">
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
                />
            </div>
        </div>
    );
}
