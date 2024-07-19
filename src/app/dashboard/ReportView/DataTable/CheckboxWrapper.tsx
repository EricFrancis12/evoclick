"use client";

import { DEPTH_MARGIN } from ".";

export default function CheckboxWrapper({ children }: {
    children?: React.ReactNode;
}) {
    return (
        <div
            className={(children ? "border" : "") + " flex justify-center items-center h-full"}
            style={{ width: `${DEPTH_MARGIN * 2}px` }}
        >
            {children}
        </div>
    )
}
