"use client";

import { DEPTH_MARGIN } from ".";

export default function CheckboxWrapper({ children }: {
    children?: React.ReactNode;
}) {
    return (
        <div className="flex justify-center items-center h-full border" style={{ width: `${DEPTH_MARGIN * 2}px` }}>
            {children}
        </div>
    )
}
