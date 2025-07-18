import React from "react";
import { TooltipProps } from "recharts";

interface ChartDataPayload {
    originalEval: number | null;
    mate: number | null;
}

const CustomData: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
}) => {
    if (active && payload && payload.length) {
        const p = payload[0].payload as ChartDataPayload;
        let content: string;

        if (p.mate !== null && p.mate !== undefined) {
            if (p.mate === 0) {
                content = "Checkmate";
            } else {
                content = p.mate > 0 ? `M${p.mate}` : `-M${-p.mate}`;
            }
        } else if (p.originalEval !== null && p.originalEval !== undefined) {
            content = `${(p.originalEval / 100).toFixed(2)}`;
        } else {
            return null;
        }

        return (
            <div className="bg-[#4c4c4c] p-2 rounded text-white text-xs">
                <span>{content}</span>
            </div>
        );
    }
    return null;
};

export default CustomData;
