import { EItemName, TAffiliateNetwork, TCampaign, TLandingPage, TNamedToken, TOffer, TPrimaryItemName, TRoute, TSavedFlow, TToken, TTrafficSource } from "@/lib/types";
import { $Enums } from "@prisma/client";

export type TActionMenu =
    TAffiliateNetworkActionMenu
    | TCampaignActionMenu
    | TSavedFlowActionMenu
    | TLandingPageActionMenu
    | TOfferActionMenu
    | TTrafficSourceActionMenu
    | TCampaignLinksActionMenu
    | TDeleteItemsActionMenu;

export type TAffiliateNetworkActionMenu = {
    type: EItemName.AFFILIATE_NETWORK;
    itemName: EItemName.AFFILIATE_NETWORK;
    id?: number;
    name?: string;
    defaultNewOfferString?: string;
    tags?: string[];
};

export type TCampaignActionMenu = {
    type: EItemName.CAMPAIGN;
    itemName: EItemName.CAMPAIGN;
    id?: number;
    name?: string;
    landingPageRotationType?: $Enums.RotationType;
    offerRotationType?: $Enums.RotationType;
    geoName?: $Enums.GeoName;
    tags?: string[];
    trafficSourceId?: number;
    flowType?: $Enums.FlowType;
    savedFlowId?: number;
    flowUrl?: string;
    flowMainRoute?: TRoute;
    flowRuleRoutes?: TRoute[];
};

export type TSavedFlowActionMenu = {
    type: EItemName.FLOW;
    itemName: EItemName.FLOW;
    id?: number;
    name?: string;
    mainRoute?: TRoute;
    ruleRoutes?: TRoute[];
    tags?: string[];
};

export type TLandingPageActionMenu = {
    type: EItemName.LANDING_PAGE;
    itemName: EItemName.LANDING_PAGE;
    id?: number;
    name?: string;
    url?: string;
    tags?: string[];
};

export type TOfferActionMenu = {
    type: EItemName.OFFER;
    itemName: EItemName.OFFER;
    id?: number;
    name?: string;
    url?: string;
    payout?: number;
    tags?: string[];
    affiliateNetworkId?: number;
};

export type TTrafficSourceActionMenu = {
    type: EItemName.TRAFFIC_SOURCE;
    itemName: EItemName.TRAFFIC_SOURCE;
    id?: number;
    name?: string;
    externalIdToken?: TToken;
    costToken?: TToken;
    customTokens?: TNamedToken[];
    postbackUrl?: string | null;
    tags?: string[];
};

export type TCampaignLinksActionMenu = {
    type: "campaign links";
    campaignId: number;
};

export type TDeleteItemsActionMenu = {
    type: "delete item",
    primaryItemName: TPrimaryItemName;
    ids: number[];
};
