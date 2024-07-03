"use client";

export default function Cell({ value, width }: {
    value: string | number;
    width: string;
}) {
    return (
        <div className="px-1" style={{ width }}>
            {value}
        </div>
    )
}
