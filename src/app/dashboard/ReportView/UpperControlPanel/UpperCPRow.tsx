"use client";

export default function UpperCPRow({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-wrap gap-1 sm:gap-3 w-full">
            {children}
        </div>
    )
}
