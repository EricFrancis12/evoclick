"use client";

import { DEPTH_MARGIN } from ".";

export default function PosNegIndicator({ value, disabled }: {
    value: number;
    disabled?: boolean;
}) {
    return (
        <div
            className={"flex justify-center items-center h-full "
                + (disabled ? "" : (value > 0 ? "bg-green-200" : value < 0 ? "bg-red-200" : "bg-slate-100"))}
            style={{ width: `${DEPTH_MARGIN}px` }}
        >
            <span>{disabled ? "" : (value > 0 ? "+" : value < 0 ? "-" : "·")}</span>
        </div>
    )
}
