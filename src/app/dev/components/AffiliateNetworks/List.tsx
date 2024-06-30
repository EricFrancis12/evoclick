"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { deleteAffiliateNetworkAction } from "../../../../lib/actions";
import { TAffiliateNetwork } from "@/lib/types";
import Editor from "./Editor";

export default function List({ affiliateNetworks }: {
    affiliateNetworks: TAffiliateNetwork[];
}) {
    const [selectedAffiliateNetwork, setSelectedAffiliateNetwork] = useState<TAffiliateNetwork | null>(null);

    async function handleTrashClick(id: number) {
        try {
            await deleteAffiliateNetworkAction(id, window.location.pathname);
            toast.success("Affiliate Network successfully deleted");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting Affiliate Network");
        }
    }

    return (
        <>
            <div className="mb-4 p-2 border">
                {affiliateNetworks.map(affiliateNetwork => (
                    <div key={affiliateNetwork.id} className="flex items-center gap-2 text-md">
                        <FontAwesomeIcon
                            icon={faPencil}
                            className="cursor-pointer hover:text-green-400"
                            onClick={() => setSelectedAffiliateNetwork(affiliateNetwork)}
                        />
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="cursor-pointer hover:text-red-400"
                            onClick={() => handleTrashClick(affiliateNetwork.id)}
                        />
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => console.log(affiliateNetwork)}
                        >
                            Name: {affiliateNetwork.name}
                        </span>
                    </div>
                ))}
            </div>
            {selectedAffiliateNetwork &&
                <Editor affiliateNetwork={selectedAffiliateNetwork} setAffiliateNetwork={setSelectedAffiliateNetwork} />
            }
        </>
    )
}
