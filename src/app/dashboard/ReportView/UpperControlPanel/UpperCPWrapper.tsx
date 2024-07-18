"use client";

export default function UpperCPWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-center gap-6 w-full px-8 py-6 bg-[#ffffff]">
            {children}
        </div>
    )
}
