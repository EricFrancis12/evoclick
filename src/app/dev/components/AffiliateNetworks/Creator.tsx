"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import TagsInput from "../../../../components/TagsInput";
import { createNewAffiliateNetworkAction } from "@/lib/actions";
import { TAffiliateNetwork_createRequest } from "@/lib/types";

const initialCreationRequest: TAffiliateNetwork_createRequest = {
    name: "",
    defaultNewOfferString: "",
    tags: [],
};

export default function Creator() {
    const [creationRequest, setCreationRequest] = useState<TAffiliateNetwork_createRequest>(initialCreationRequest);

    const formInputs = [
        {
            name: "name",
            onchange: (e: React.ChangeEvent<HTMLInputElement>) => setCreationRequest(prev => ({ ...prev, name: e.target.value }))
        },
        {
            name: "defaultNewOfferString",
            onchange: (e: React.ChangeEvent<HTMLInputElement>) => setCreationRequest(prev => ({ ...prev, defaultNewOfferString: e.target.value }))
        },
    ];

    async function handleSubmit() {
        try {
            await createNewAffiliateNetworkAction(creationRequest, window.location.pathname);
            toast.success("Created new Affiliate Network");
            setCreationRequest(initialCreationRequest);
        } catch (err) {
            console.error(err);
            toast.error("Error creating new Affiliate Network");
        }
    }

    return (
        <div className="flex flex-col gap-1 mb-4">
            {formInputs.map(({ name, onchange }) => (
                <input
                    key={name}
                    type="text"
                    name={name}
                    placeholder={name}
                    className="border px-2 py-1"
                    onChange={onchange}
                />
            ))}
            <TagsInput
                tags={creationRequest.tags}
                setTags={newTags => setCreationRequest(prev => ({ ...prev, tags: newTags }))}
            />
            <button
                type="submit"
                className="mt-2 bg-blue-400 border rounded"
                onClick={handleSubmit}
            >
                Create New Affiliate Network
            </button>
        </div>
    )
}
