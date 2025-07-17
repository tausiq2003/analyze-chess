import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

export default function GraphChart({ data }: { data: number[] }) {
    const chartData = data.map((evalScore, idx) => ({
        move: idx + 1,
        eval: Number(evalScore.toFixed(2)) + 10,
        originalEval: Number(evalScore.toFixed(2)),
    }));
    return (
        <div className="w-full max-w-4xl h-40 bg-[#4c4c4c] rounded-md overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    width={500}
                    height={400}
                    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    style={{ cursor: "pointer" }}
                >
                    <XAxis dataKey="move" hide />
                    <YAxis domain={[0, 20]} hide />
                    <Tooltip
                        isAnimationActive={false}
                        cursor={{
                            stroke: "grey",
                            strokeWidth: 2,
                            strokeOpacity: 0.3,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="eval"
                        stroke="none"
                        fill="#ffffff"
                        fillOpacity={1}
                        isAnimationActive={false}
                    />
                    <ReferenceLine
                        y={10}
                        stroke="grey"
                        strokeWidth={1}
                        strokeOpacity={0.4}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
