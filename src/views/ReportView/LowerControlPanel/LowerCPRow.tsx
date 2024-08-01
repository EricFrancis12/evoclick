"use client";

export default function LowerCPRow({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-wrap gap-2 items-center w-full">
            {children}
        </div>
    )
}
