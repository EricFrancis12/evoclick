"use client";

export default function CheckboxWrapper({ children }: {
    children?: React.ReactNode;
}) {
    return (
        <div className="h-full w-[22px] px-4">
            {children}
        </div>
    )
}
