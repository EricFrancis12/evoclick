"use client";

export default function TabContainer({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-end h-full mr-[8px]">
            {children}
        </div>
    )
}
