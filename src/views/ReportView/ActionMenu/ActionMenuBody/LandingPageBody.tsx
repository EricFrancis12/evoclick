"use client";

import toast from "react-hot-toast";
import { createNewLandingPageAction, updateLandingPageAction } from "@/lib/actions";
import TagsInput from "@/components/TagsInput";
import { Input } from "@/components/base";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import ActionMenuFooter from "../ActionMenuFooter";
import { TActionMenu, TLandingPageActionMenu } from "../types";
import { EItemName } from "@/lib/types";

export default function LandingPageBody({ actionMenu, setActionMenu }: {
    actionMenu: TLandingPageActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    async function handleSave() {
        try {
            const { id, name, url, tags } = actionMenu;
            if (typeof id === "number") {
                await updateLandingPageAction(id, { name, url, tags }, window.location.href);
                toast.success("Landing Page was updated successfully");
            } else {
                await createNewLandingPageAction({
                    name: name ?? "",
                    url: url ?? "",
                    tags: tags ?? [],
                }, window.location.href);
                toast.success("Successfully created new Landing Page");
            }
            setActionMenu(null);
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Input
                name="URL"
                value={actionMenu.url || ""}
                onChange={e => setActionMenu({ ...actionMenu, url: e.target.value })}
            />
            <TagsInput
                title="Tags"
                placeholder="Type to add tags"
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
            <ActionMenuFooter onSave={handleSave} />
        </ActionMenuBodyWrapper>
    )
}
