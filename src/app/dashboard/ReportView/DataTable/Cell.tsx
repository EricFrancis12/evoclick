"use client";

export default function Cell({ value, width, className = "" }: {
    value: string | number;
    width: number;
    className?: string;
}) {
    return (
        <div className={"flex items-center h-full px-1 border " + className} style={{ width: `${width}px` }}>
            {value}
        </div>
    )
}
