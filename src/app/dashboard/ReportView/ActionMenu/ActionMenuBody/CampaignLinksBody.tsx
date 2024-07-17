"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { getOneCampaignAction } from "@/lib/actions";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import { makeCampaignUrl, makeClickUrl } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils/client";
import { TActionMenu, TCampaignLinksActionMenu } from "../types";
import { TCampaign } from "@/lib/types";

export default function CampaignLinksBody({ actionMenu }: {
    actionMenu: TCampaignLinksActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const [campaign, setCampaign] = useState<TCampaign | null>(null);

    const getOneCampaign = getOneCampaignAction.bind(null);

    useEffect(() => {
        getOneCampaign(actionMenu.campaignId)
            .then(_campaign => setCampaign(_campaign))
            .catch(() => toast.error("Error fetching Campaign"));
    }, []);

    return (
        <ActionMenuBodyWrapper>
            {campaign &&
                <div className="flex flex-col gap-4 w-full p-2">
                    <CampaignLinksRows campaign={campaign} />
                </div>
            }
        </ActionMenuBodyWrapper>
    )
}

function CampaignLinksRows({ campaign }: {
    campaign: TCampaign;
}) {
    const { protocol, hostname, port } = window.location;
    const rows = [
        {
            name: "Campaign URL",
            link: makeCampaignUrl(protocol, hostname, port, campaign?.publicId),
        },
        {
            name: "Click URL",
            link: makeClickUrl(protocol, hostname, port),
        },
    ];

    return rows.map(({ name, link }, index) => (
        <div key={index} className="flex items-center w-full">
            <FontAwesomeIcon
                icon={faCopy}
                className="mr-2 cursor-pointer hover:text-green-400"
                onClick={() => copyToClipboard(link)}
            />
            <div className="flex justify-between items-center gap-4 w-full">
                <span>{name}: </span>
                <Link href={link} className="text-end hover:underline">
                    {link}
                    <FontAwesomeIcon icon={faExternalLink} className="ml-2" />
                </Link>
            </div>
        </div>
    ))
}