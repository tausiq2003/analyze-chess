"use client";
import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function Board() {
    const [game, setGame] = useState(new Chess());
    const [boardWidth, setBoardWidth] = useState(630);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setBoardWidth(containerWidth > 630 ? 630 : containerWidth); // Never exceed 630px
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div ref={containerRef} className="w-full max-w-xl max-lg:m-auto">
            <div className="w-full h-full">
                <Chessboard
                    position={game.fen()}
                    arePiecesDraggable={false}
                    boardWidth={boardWidth}
                    customDarkSquareStyle={{
                        backgroundColor: "#739552",
                    }}
                    customLightSquareStyle={{
                        backgroundColor: "#EBECD0",
                    }}
                />
            </div>
        </div>
    );
}
