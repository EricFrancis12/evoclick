"use client";

import AffiliateNetworkBody from "./AffiliateNetworkBody";
import CampaignBody from "./CampaignBody";
import SavedFlowBody from "./SavedFlowBody";
import LandingPageBody from "./LandingPageBody";
import OfferBody from "./OfferBody";
import TrafficSourceBody from "./TrafficSourceBody";
import CampaignLinksBody from "./CampaignLinksBody";
import DeleteItemBody from "./DeleteItemBody";
import { EItemName } from "@/lib/types";
import { TActionMenu } from "../types";
import DeleteClicksBody from "./DeleteClicksBody";

export default function ActionMenuBody({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    switch (actionMenu.type) {
        case EItemName.AFFILIATE_NETWORK:
            return <AffiliateNetworkBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case EItemName.CAMPAIGN:
            return <CampaignBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case EItemName.FLOW:
            return <SavedFlowBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case EItemName.LANDING_PAGE:
            return <LandingPageBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case EItemName.OFFER:
            return <OfferBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case EItemName.TRAFFIC_SOURCE:
            return <TrafficSourceBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case "Campaign Links":
            return <CampaignLinksBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case "Delete Items":
            return <DeleteItemBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        case "Delete Clicks":
            return <DeleteClicksBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        default:
            return "";
    }
}
