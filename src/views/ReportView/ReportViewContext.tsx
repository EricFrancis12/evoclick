"use client";

import React, { useState, useContext } from "react";
import { PopoverLayer } from "@/components/popover";
import ActionMenu from "./ActionMenu";
import { TActionMenu } from "./ActionMenu/types";

// TODO: rename this file and all methods within to ActionMenuContext

export type TReportViewContext = {
    actionMenu: TActionMenu | null;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
};

const ReportViewContext = React.createContext<TReportViewContext | null>(null);

export function useReportViewContext() {
    const context = useContext(ReportViewContext);
    if (!context) {
        throw new Error("useReportViewContext must be used within a ReportViewContext provider");
    }
    return context;
}

export function ReportViewProvider({ children }: {
    children: React.ReactNode;
}) {
    const [actionMenu, setActionMenu] = useState<TActionMenu | null>(null);

    const value = {
        actionMenu,
        setActionMenu,
    };

    return (
        <ReportViewContext.Provider value={value}>
            {actionMenu &&
                <PopoverLayer layer={1}>
                    <ActionMenu actionMenu={actionMenu} setActionMenu={setActionMenu} />
                </PopoverLayer>
            }
            {children}
        </ReportViewContext.Provider >
    )
}
