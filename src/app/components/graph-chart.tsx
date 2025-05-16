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

const data = [
    { move: 1, eval: 0.15 },
    { move: 2, eval: 0.15 },
    { move: 3, eval: 0.15 },
    { move: 4, eval: 0.34 },
    { move: 5, eval: 0.15 },
    { move: 6, eval: 0.44 },
    { move: 7, eval: 0.44 },
    { move: 8, eval: 0.57 },
    { move: 9, eval: 0.09 },
    { move: 10, eval: 1.88 },
    { move: 11, eval: -0.29 },
    { move: 12, eval: -0.16 },
    { move: 13, eval: -0.16 },
    { move: 14, eval: 0.76 },
    { move: 15, eval: 2.4 },
    { move: 16, eval: 1.18 },
    { move: 17, eval: 1.18 },
    { move: 18, eval: 0.9 },
    { move: 19, eval: 1.51 },
    { move: 20, eval: 0.3 },
    { move: 21, eval: 0.98 },
    { move: 22, eval: 0.51 },
    { move: 23, eval: 0.51 },
    { move: 24, eval: 0.51 },
    { move: 25, eval: 0.53 },
    { move: 26, eval: 0.53 },
    { move: 27, eval: 0.53 },
    { move: 28, eval: 0.34 },
    { move: 29, eval: 0.21 },
    { move: 30, eval: 0.36 },
    { move: 31, eval: 0.37 },
    { move: 32, eval: 1.23 },
    { move: 33, eval: 0.0 },
    { move: 34, eval: 0.0 },
    { move: 35, eval: -0.01 },
    { move: 36, eval: -0.01 },
    { move: 37, eval: -0.32 },
    { move: 38, eval: -0.32 },
    { move: 39, eval: -0.53 },
    { move: 40, eval: -0.53 },
    { move: 41, eval: -3.36 },
    { move: 42, eval: -3.36 },
    { move: 43, eval: -3.59 },
    { move: 44, eval: -4.11 },
    { move: 45, eval: -4.11 },
    { move: 46, eval: -4.11 },
    { move: 47, eval: -3.71 },
    { move: 48, eval: -4.1 },
    { move: 49, eval: -4.1 },
    { move: 50, eval: -4.1 },
    { move: 51, eval: -3.24 },
    { move: 52, eval: -3.21 },
    { move: 53, eval: -3.23 },
    { move: 54, eval: -3.23 },
    { move: 55, eval: -3.23 },
    { move: 56, eval: -3.55 },
    { move: 57, eval: -3.37 },
    { move: 58, eval: -5.28 },
    { move: 59, eval: -5.28 },
    { move: 60, eval: -5.44 },
    { move: 61, eval: -5.37 },
    { move: 62, eval: -7.48 },
    { move: 63, eval: -7.48 },
    { move: 64, eval: -10.0 },
    { move: 65, eval: -10.0 },
];

export default function GraphChart() {
    const shiftedData = data.map((item) => ({
        move: item.move,
        eval: item.eval + 10,
        originalEval: item.eval,
    }));
    console.log(shiftedData);
    return (
        <div className="w-full max-w-4xl h-40 bg-[#4c4c4c] rounded-md overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={shiftedData}
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
