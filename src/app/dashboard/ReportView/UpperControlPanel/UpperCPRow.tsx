"use client";

export default function UpperCPRow({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-wrap gap-6 w-full">
            {children}
        </div>
    )
}
