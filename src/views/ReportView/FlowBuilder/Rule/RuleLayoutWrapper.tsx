"use client";

export default function RuleLayoutWrapper({ children, title }: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <div className="flex flex-col gap-4 w-full p-2 bg-slate-200">
            <span>{title}</span>
            <div className="flex justify-between items-center gap-2 w-full p-2">
                {children}
            </div>
        </div>
    )
}
