"use client";

export default function LowerCPWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="flex flex-col justify-center gap-6 w-full px-8 py-6 bg-[#ebedef]"
            style={{
                borderTop: "solid lightgrey 3px",
                borderBottom: "solid lightgrey 1px",
            }}
        >
            {children}
        </div>
    )
}
