"use client";

import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import useClickOutsideToggle from "@/hooks/useClickOutsideToggle";

const Z_INDEX = 4000;

export type TDialogueMenu = {
    top: number;
    left: number;
    open: boolean;
    items: TDialogueMenuItem[];
};

export type TDialogueMenuItem = {
    text: string;
    icon?: IconDefinition;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export type TDialogueMenuContext = {
    dialogueMenu: TDialogueMenu;
    setDialogueMenu: React.Dispatch<React.SetStateAction<TDialogueMenu>>;
}

const DialogueViewContext = React.createContext<TDialogueMenuContext | null>(null);

export function useDialogueMenu() {
    const context = useContext(DialogueViewContext);
    if (!context) {
        throw new Error("useDialogueMenu must be used within a DialogueViewContext provider");
    }
    return context;
}

export function DialogueViewProvider({ children }: {
    children: React.ReactNode;
}) {
    const [dialogueMenu, setDialogueMenu] = useState<TDialogueMenu>({
        top: 0,
        left: 0,
        open: false,
        items: [],
    });

    const { top, left, open, items } = dialogueMenu;

    const ref = useClickOutsideToggle(open, () => setDialogueMenu({ ...dialogueMenu, open: false }));

    function handleClick(e: React.MouseEvent<HTMLDivElement>, item: TDialogueMenuItem) {
        setDialogueMenu(prev => ({ ...prev, open: false }));
        if (item.onClick) item.onClick(e);
    }

    const value = {
        dialogueMenu,
        setDialogueMenu,
    };

    return (
        <DialogueViewContext.Provider value={value}>
            {dialogueMenu.open &&
                <div
                    ref={ref}
                    className="absolute"
                    style={{
                        top,
                        left,
                        height: 0,
                        width: 0,
                        zIndex: Z_INDEX,
                    }}
                >
                    <div className="relative">
                        <div
                            className="absolute bg-slate-100 border border-black rounded-lg overflow-hidden"
                            style={{
                                top: 0,
                                // Opens to the left or right side of the user's cursor,
                                // depending on what half of the screen they're on
                                left: left < window.screen.width / 2 ? 0 : undefined,
                                right: left >= window.screen.width / 2 ? 0 : undefined,
                            }}
                        >
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 w-full px-3 py-1 border cursor-pointer hover:bg-blue-300"
                                    style={{ whiteSpace: "nowrap" }}
                                    onClick={e => handleClick(e, item)}
                                >
                                    {item.icon && <FontAwesomeIcon icon={item.icon} />}
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
            {children}
        </DialogueViewContext.Provider >
    )
}
