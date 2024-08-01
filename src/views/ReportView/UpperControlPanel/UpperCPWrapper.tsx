"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faTableList } from "@fortawesome/free-solid-svg-icons";
import ContentToggler from "@/components/ContentToggler";

export default function UpperCPWrapper({ children }: {
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
            <div className="flex-1 flex flex-col justify-center gap-2 sm:gap-3">
                {children}
            </div>
        </ContentToggler>
    )
}
