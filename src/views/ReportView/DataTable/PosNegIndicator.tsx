"use client";

import { DEPTH_MARGIN } from ".";

export default function PosNegIndicator({ value, disabled }: {
    value: number;
    disabled?: boolean;
}) {
    return (
        <div
            className={disabled ? "" : valueFromSign(value, "bg-green-200", "bg-red-200", "bg-slate-100")
                + " flex justify-center items-center h-full"}
            style={{ width: `${DEPTH_MARGIN}px` }}
        >
            <span>{disabled ? "" : valueFromSign(value, "+", "-", "·")}</span>
        </div>
    )
}

function valueFromSign(n: number, valueIfPos: string, valueIfNeg: string, valueIfZero: string): string {
    return n > 0 ? valueIfPos : n < 0 ? valueIfNeg : valueIfZero;
}
