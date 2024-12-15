"use client";

import React, { useState, useContext } from "react";
import { PopoverLayer } from "@/components/popover";
import ActionMenu from "@/components/ActionMenu";
import { TActionMenu } from "@/components/ActionMenu/types";

type TActionMenuContext = {
    actionMenu: TActionMenu | null;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
};

const ActionMenuContext = React.createContext<TActionMenuContext | null>(null);

export function useActionMenuContext() {
    const context = useContext(ActionMenuContext);
    if (!context) {
        throw new Error("useActionMenuContext must be used within a ActionMenuContext provider");
    }
    return context;
}

export function ActionMenuProvider({ children }: {
    children: React.ReactNode;
}) {
    const [actionMenu, setActionMenu] = useState<TActionMenu | null>(null);

    const value = {
        actionMenu,
        setActionMenu,
    };

    return (
        <ActionMenuContext.Provider value={value}>
            {actionMenu &&
                <PopoverLayer layer={1}>
                    <ActionMenu actionMenu={actionMenu} setActionMenu={setActionMenu} />
                </PopoverLayer>
            }
            {children}
        </ActionMenuContext.Provider>
    )
}
