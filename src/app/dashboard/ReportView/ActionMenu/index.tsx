"use client";

import { EItemName } from "@/lib/types";
import ActionMenuHeader from "./ActionMenuHeader";
import ActionMenuBody from "./ActionMenuBody";
import { TActionMenu } from "./types";

export default function ActionMenu({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    return (
        <div className="flex flex-col items-center min-w-[85vw] sm:min-w-[400px] bg-white">
            <ActionMenuHeader
                title={actionMenu.type}
                onClose={() => setActionMenu(null)}
            />
            <ActionMenuBody actionMenu={actionMenu} setActionMenu={setActionMenu} />
        </div>
    )
}
