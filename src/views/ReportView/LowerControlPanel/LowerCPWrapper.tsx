"use client";

import { useState } from "react";
import ContentToggler from "@/components/ContentToggler";

export default function LowerCPWrapper({ children }: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <ContentToggler
            active={open}
            setActive={setOpen}
            className="flex gap-3 w-full px-3 py-2 bg-[#ebedef]"
            style={{
                borderTop: "solid lightgrey 3px",
                borderBottom: "solid lightgrey 1px",
            }}
        >
            <div className="flex-1 flex flex-col justify-center gap-2">
                {children}
            </div>
        </ContentToggler>
    )
}
