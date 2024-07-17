"use client";

export default function ActionMenuBodyWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-start items-start gap-2 h-full w-full px-4 py-2">
            {children}
        </div>
    )
}
