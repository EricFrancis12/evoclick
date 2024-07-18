"use client";

export default function RowWrapper({ children, selected, onClick = () => { } }: {
    children: React.ReactNode;
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
            className={(selected === undefined ? "" : ((selected ? "bg-blue-300" : "bg-white hover:bg-blue-200") + " cursor-pointer"))
                + " flex items-center w-full pr-4"}
            onClick={handleClick}
        >
            {children}
        </div>
    )
}
