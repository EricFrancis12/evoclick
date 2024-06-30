"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TagsInput from "../TagsInput";
import { updateAffiliateNetworkAction } from "@/lib/actions";
import { TAffiliateNetwork, TAffiliateNetwork_updateRequest } from "@/lib/types";

export default function Editor({ affiliateNetwork, setAffiliateNetwork }: {
    affiliateNetwork: TAffiliateNetwork,
    setAffiliateNetwork: (an: TAffiliateNetwork | null) => any
}) {
    const [updateRequest, setUpdateRequest] = useState<TAffiliateNetwork_updateRequest>({
        name: affiliateNetwork.name,
        defaultNewOfferString: affiliateNetwork.defaultNewOfferString,
        tags: affiliateNetwork.tags
    });

    useEffect(() => setUpdateRequest({
        name: affiliateNetwork.name,
        defaultNewOfferString: affiliateNetwork.defaultNewOfferString,
        tags: affiliateNetwork.tags
    }), [affiliateNetwork.id]);

    async function handleSubmit() {
        try {
            await updateAffiliateNetworkAction(affiliateNetwork.id, updateRequest, window.location.pathname);
            toast.success("Successfully updated Affiliate Network");
            setAffiliateNetwork(null);
        } catch (err) {
            console.error(err);
            toast.error("Error updating Affiliate Network");
        }
    }

    return (
        <div className="flex flex-col gap-1 p-2 border rounded-lg">
            <input
                type="text"
                value={updateRequest.name}
                className="border px-2 py-1"
                onChange={e => setUpdateRequest({ ...updateRequest, name: e.target.value })}
            />
            <input
                type="text"
                value={updateRequest.defaultNewOfferString}
                className="border px-2 py-1"
                onChange={e => setUpdateRequest({ ...updateRequest, defaultNewOfferString: e.target.value })}
            />
            <TagsInput
                tags={updateRequest.tags || []}
                setTags={newTags => setUpdateRequest({ ...updateRequest, tags: newTags })}
            />
            <button
                type="submit"
                className="mt-2 bg-blue-400 border rounded"
                onClick={handleSubmit}
            >
                Update Affiliate Network
            </button>
        </div>
    )
}
