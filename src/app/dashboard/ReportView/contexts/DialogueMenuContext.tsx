"use client";

import React, { useContext, useState, useRef, useEffect } from "react";
import { traverseParentsForRef } from "@/lib/utils/client";

const zIndex = 4000;

export type TDialogueMenu = {
    top: number;
    left: number;
    open: boolean;
    items: string[];
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
export function DialogueViewProvider({ children, onClick = () => { } }: {
    children: React.ReactNode;
    onClick?: (item: string) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    const [dialogueMenu, setDialogueMenu] = useState<TDialogueMenu>({
        top: 0,
        left: 0,
        open: false,
        items: [],
    });

    const { top, left, open, items } = dialogueMenu;

    useEffect(() => {
        if (open) {
            document.addEventListener("click", handleGlobalClick);
            document.addEventListener("contextmenu", handleGlobalClick);
        } else {
            document.removeEventListener("click", handleGlobalClick);
            document.removeEventListener("contextmenu", handleGlobalClick);
        }

        function handleGlobalClick(e: MouseEvent) {
            const element = e.target as HTMLElement | null;
            if (open && element && !traverseParentsForRef(element, ref)) {
                setDialogueMenu({ ...dialogueMenu, open: false });
            }
        }

        return () => {
            document.removeEventListener("click", handleGlobalClick);
            document.removeEventListener("contextmenu", handleGlobalClick);
        };
    }, [open]);

    function handleClick(item: string) {
        setDialogueMenu(prev => ({ ...prev, open: false }));
        onClick(item);
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
                        zIndex,
                    }}
                >
                    <div className="relative">
                        <div
                            className="absolute bg-blue-400 border border-black"
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
                                    className="flex justify-center items-center w-full p-2 cursor-pointer hover:bg-blue-200"
                                    onClick={() => handleClick(item)}
                                >
                                    {item}
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
