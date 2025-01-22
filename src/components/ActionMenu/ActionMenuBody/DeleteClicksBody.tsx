"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import Button from "@/components/Button";
import { deleteManyClicksAction, revalidatePathAction } from "@/lib/actions";
import { TActionMenu, TDeleteClicksActionMenu } from "../types";
import { DeleteManyArg } from "@/data";

export default function DeleteClicksBody({ actionMenu, setActionMenu }: {
    actionMenu: TDeleteClicksActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const { clickIds, deleteAll } = actionMenu;

    const [deleting, setDeleting] = useState<boolean>(false);

    async function handleDelete() {
        if (deleting) return;
        setDeleting(true);

        const arg: DeleteManyArg | undefined = deleteAll
            ? undefined
            : {
                where: {
                    id: {
                        in: clickIds,
                    },
                },
            };

        const { count } = await deleteManyClicksAction(arg);

        setDeleting(false);
        revalidatePathAction(window.location.href);

        if (count > 0) toast.success(`Deleted ${count} click(s)`);

        // Close the action menu only if ALL clicks were deleted
        if (count === clickIds.length) setActionMenu(null);
    }

    return (
        <ActionMenuBodyWrapper>
            <div className="flex flex-col gap-4 w-full p-2">
                <span>{`Are you sure you want to delete ${deleteAll ? "all clicks?" : `${clickIds.length} clicks?`}`}</span>
                <Button
                    text="Yes"
                    icon={deleting ? faSpinner : faTrash}
                    disabled={deleting}
                    onClick={handleDelete}
                />
            </div>
        </ActionMenuBodyWrapper>
    )
}
