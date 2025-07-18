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
import CustomData from "@/app/components/customdata";

interface GraphChartProps {
    data: {
        cp: number | null;
        mate: number | null;
    }[];
}

export default function GraphChart({ data }: GraphChartProps) {
    const chartData = data.map((evalObj, idx) => {
        let evalValue: number;

        if (evalObj.mate !== null && evalObj.mate !== undefined) {
            evalValue = evalObj.mate > 0 ? 20 : 0;
        } else if (typeof evalObj.cp === "number") {
            const scaledCp = evalObj.cp / 100;
            const centeredCp = scaledCp + 10;
            evalValue = Math.max(0, Math.min(20, centeredCp));
        } else {
            evalValue = 10;
        }

        return {
            move: idx + 1,
            eval: evalValue,
            originalEval: evalObj.cp,
            mate: evalObj.mate,
        };
    });

    return (
        <div className="w-full max-w-4xl h-24 bg-[#4c4c4c] rounded-md overflow-hidden">
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
                        content={<CustomData />}
                        cursor={{
                            stroke: "#ffffff",
                            strokeWidth: 1,
                            strokeOpacity: 0.5,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="eval"
                        stroke="none"
                        fill="#fff"
                        fillOpacity={1}
                        isAnimationActive={false}
                    />
                    <ReferenceLine
                        y={10}
                        stroke="#4c4c4c"
                        strokeWidth={1}
                        strokeOpacity={0.4}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
