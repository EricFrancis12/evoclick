"use client";

import { ROW_HEIGHT } from ".";

export default function RowWrapper({ children, value = 0, selected, onClick = () => { } }: {
    children: React.ReactNode;
    value?: number;
    // Having a selected value of undefined disables the hover, background color change, and onClick functionalities.
    // The title row should use undefined because we do not want the title row to have this funcionality,
    // and all other rows should use a boolean.
    selected?: boolean;
    onClick?: (bool: boolean) => void;
}) {
    function handleClick() {
        if (selected === undefined) return;
        onClick(!selected);
    }

    return (
        <div
            className={(selected === undefined
                ? ""
                : ((selected ? "bg-blue-300" : valueToBg(value) + " hover:bg-blue-200") + " cursor-pointer"))
                + " flex items-center w-full pr-4"}
            style={{ height: ROW_HEIGHT }}
            onClick={handleClick}
        >
            {children}
        </div>
    )
}

function valueToBg(value: number): string {
    if (value > 0) return "bg-green-100";
    if (value < 0) return "bg-red-100";
    return "bg-white";
}
