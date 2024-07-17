"use client";

export default function ToggleButton({ active, onChange, size = 50 }: {
    active: boolean;
    onChange: (newActive: boolean) => void;
    size?: number;
}) {
    return (
        <div
            className="flex p-1 rounded-full border"
            style={{
                justifyContent: active ? "end" : "start",
                height: `${size}px`,
                width: `${size * 2}px`,
                backgroundColor: active ? "rgb(88 167 239)" : "lightgrey",
                transition: "background-color 0.3s ease, justify-content 0.3s ease",
            }}
        >
            <div
                className="h-full w-[50%] bg-white rounded-full border border-black cursor-pointer"
                onClick={() => onChange(!active)}
            />
        </div>
    )
}
