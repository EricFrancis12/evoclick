"use client";

import toast from "react-hot-toast";
import { createNewAffiliateNetworkAction, updateAffiliateNetworkAction } from "@/lib/actions";
import TagsInput from "@/components/TagsInput";
import { Input } from "@/components/base";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import ActionMenuFooter from "../ActionMenuFooter";
import { TActionMenu, TAffiliateNetworkActionMenu } from "../types";
import { EItemName } from "@/lib/types";

export default function AffiliateNetworkBody({ actionMenu, setActionMenu }: {
    actionMenu: TAffiliateNetworkActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    async function handleSave() {
        try {
            const { id, name, defaultNewOfferString, tags } = actionMenu;
            if (typeof id === "number") {
                await updateAffiliateNetworkAction(id, { name, defaultNewOfferString, tags }, window.location.href);
                toast.success("Affiliate Network was updated successfully");
            } else {
                await createNewAffiliateNetworkAction({
                    primaryItemName: EItemName.AFFILIATE_NETWORK,
                    name: name ?? "",
                    defaultNewOfferString: defaultNewOfferString ?? "",
                    tags: tags ?? [],
                }, window.location.href);
                toast.success("Successfully created new Affiliate Network");
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
                name="Default New Offer String"
                value={actionMenu.defaultNewOfferString || ""}
                onChange={e => setActionMenu({ ...actionMenu, defaultNewOfferString: e.target.value })}
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
