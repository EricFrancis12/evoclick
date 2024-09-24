"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createNewOfferAction, getAllAffiliateNetworksAction, updateOfferAction } from "@/lib/actions";
import TagsInput from "@/components/TagsInput";
import { Input, Select } from "@/components/base";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import ActionMenuFooter from "../ActionMenuFooter";
import { TActionMenu, TOfferActionMenu } from "../types";
import { EItemName, TAffiliateNetwork } from "@/lib/types";

export default function OfferBody({ actionMenu, setActionMenu }: {
    actionMenu: TOfferActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const [affiliateNetworks, setAffiliateNetworks] = useState<TAffiliateNetwork[]>([]);

    useEffect(() => {
        getAllAffiliateNetworksAction()
            .then(affNetworks => setAffiliateNetworks(affNetworks))
            .catch(() => toast.error("Error fetching Affiliate Networks"));
    }, []);

    async function handleSave() {
        try {
            const { id, name, url, tags, affiliateNetworkId } = actionMenu;
            if (typeof id === "number") {
                await updateOfferAction(id, { name, url, tags, affiliateNetworkId }, window.location.href);
                toast.success("Offer was updated successfully");
            } else if (affiliateNetworkId !== undefined) {
                await createNewOfferAction({
                    name: name ?? "",
                    url: url ?? "",
                    tags: tags ?? [],
                    affiliateNetworkId: affiliateNetworkId,
                }, window.location.href);
                toast.success("Successfully created new Offer");
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
            <Select
                name="Affiliate Network"
                value={actionMenu.affiliateNetworkId}
                onChange={e => setActionMenu({ ...actionMenu, affiliateNetworkId: Number(e.target.value) || undefined })}
            >
                <option value="">
                    None
                </option>
                {affiliateNetworks.map(({ id, name }) => (
                    <option key={id} value={id}>
                        {name}
                    </option>
                ))}
            </Select>
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
