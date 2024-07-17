"use client";

export function PopoverLayer({ children, layer = 1, dark = true }: {
    children: React.ReactNode;
    layer?: number;
    dark?: boolean;
}) {
    const zIndex = layer * 100;

    return (
        <>
            {dark &&
                <div
                    className="absolute top-0 left-0 h-screen w-screen bg-black opacity-50"
                    style={{ zIndex: zIndex - 1 }}
                />
            }
            <div
                className="absolute top-0 left-0 flex justify-center items-center h-screen w-screen bg-transparent"
                style={{ zIndex }}
            >
                {children}
            </div>
        </>
    )
}

export function PopoverContainer({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-h-[90vh] px-6 py-4 bg-white border overflow-y-scroll">
            {children}
        </div>
    )
}

export function PopoverFooter({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="flex justify-center items-center w-full mt-6 px-2 py-4"
            style={{ borderTop: "solid 1px #cfcfcf" }}
        >
            {children}
        </div>
    )
}
