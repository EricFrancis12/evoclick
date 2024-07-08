"use client";

export default function RowWrapper({ children, selected, onClick = () => { } }: {
    children: React.ReactNode;
    selected?: boolean;
    onClick?: (bool: boolean) => void;
}) {
    return (
        <div
            className={(selected ? "bg-blue-300" : "bg-white") + " flex items-center w-full px-4"}
            onClick={() => onClick(!selected)}
        >
            {children}
        </div>
    )
}
