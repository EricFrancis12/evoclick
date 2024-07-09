"use client";

export default function RowWrapper({ children, selected, onClick = () => { } }: {
    children: React.ReactNode;
    selected?: boolean;
    onClick?: (bool: boolean) => void;
}) {
    return (
        <div
            className={(selected ? "bg-blue-300" : "bg-white hover:bg-blue-200")
                + " flex items-center w-full px-4 cursor-pointer"}
            onClick={() => onClick(!selected)}
        >
            {children}
        </div>
    )
}
