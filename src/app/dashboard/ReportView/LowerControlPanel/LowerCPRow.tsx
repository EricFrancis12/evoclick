"use client";

export default function LowerCPRow({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex gap-6 w-full">
            <div className="flex flex-wrap gap-2 justify-center items-center">
                {children}
            </div>
        </div>
    )
}
