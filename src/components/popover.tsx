"use client";

export const POPOVER_BASE_Z_INDEX = 100;

function backdropZIndex(zIndez: number): number {
    return zIndez - 1;
}

export function PopoverLayer({ children, layer = 1, backdrop = true }: {
    children: React.ReactNode;
    layer?: number;
    backdrop?: boolean;
}) {
    const zIndex = layer * POPOVER_BASE_Z_INDEX;

    return (
        <>
            {backdrop &&
                <Backdrop style={{ zIndex: backdropZIndex(zIndex) }} />
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

export function Backdrop({ style }: {
    style: React.CSSProperties;
}) {
    return (
        <div className="absolute top-0 left-0 h-screen w-screen bg-black opacity-50" style={style} />
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
