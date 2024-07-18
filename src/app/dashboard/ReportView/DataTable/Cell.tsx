"use client";

export default function Cell({ value, width, className = "" }: {
    value: string | number;
    width: string;
    className?: string;
}) {
    return (
        <div className={"px-1 border " + className} style={{ width }}>
            {value}
        </div>
    )
}
