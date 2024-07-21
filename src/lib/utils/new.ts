import { TActionMenu, TAffiliateNetworkActionMenu, TCampaignActionMenu, TLandingPageActionMenu, TOfferActionMenu, TSavedFlowActionMenu, TTrafficSourceActionMenu } from "@/app/dashboard/ReportView/ActionMenu/types";
import { EItemName, ELogicalRelation, ERuleName, TAffiliateNetwork, TCampaign, TLandingPage, TNamedToken, TOffer, TPath, TRoute, TRule, TSavedFlow, TToken, TTrafficSource } from "../types";

export function newRoute(): TRoute {
    return {
        isActive: true,
        logicalRelation: ELogicalRelation.AND,
        paths: [],
        rules: [],
    };
}

export function newPath(): TPath {
    return {
        isActive: true,
        weight: 100,
        landingPageIds: [],
        offerIds: [],
        directLinkingEnabled: false,
    };
}

export function newRule(ruleName: ERuleName): TRule {
    return {
        ruleName,
        data: [],
        includes: true,
    };
}

export function newToken(): TToken {
    return {
        queryParam: "",
        value: "",
    };
}

export function newNamedToken(): TNamedToken {
    return {
        ...newToken(),
        name: "",
    };
}

export function newPrimaryItemActionMenu(itemName: EItemName): TActionMenu {
    if (itemName === EItemName.AFFILIATE_NETWORK
        || itemName === EItemName.FLOW
        || itemName === EItemName.LANDING_PAGE
        || itemName === EItemName.OFFER
        || itemName === EItemName.TRAFFIC_SOURCE
    ) {
        return {
            type: itemName,
            itemName,
        } as TActionMenu;
    }
    return {
        type: EItemName.CAMPAIGN,
        itemName: EItemName.CAMPAIGN,
    };
}

export function newAffiliateNetworkActionMenu(affiliateNetwork: TAffiliateNetwork): TAffiliateNetworkActionMenu {
    return {
        ...affiliateNetwork,
        type: EItemName.AFFILIATE_NETWORK,
        itemName: EItemName.AFFILIATE_NETWORK,
    };
}

export function newCampaignActionMenu(campaign: TCampaign): TCampaignActionMenu {
    const { savedFlowId, flowUrl, flowMainRoute, flowRuleRoutes } = campaign;
    return {
        ...campaign,
        type: EItemName.CAMPAIGN,
        itemName: EItemName.CAMPAIGN,
        savedFlowId: savedFlowId ?? undefined,
        flowUrl: flowUrl ?? undefined,
        flowMainRoute: flowMainRoute ?? undefined,
        flowRuleRoutes: flowRuleRoutes ?? undefined,
    };
}

export function newSavedFlowActionMenu(savedFlow: TSavedFlow): TSavedFlowActionMenu {
    const { id, name, mainRoute, ruleRoutes, tags } = savedFlow;
    return {
        type: EItemName.FLOW,
        itemName: EItemName.FLOW,
        id,
        name: name ?? undefined,
        mainRoute: mainRoute ?? undefined,
        ruleRoutes: ruleRoutes ?? undefined,
        tags: tags ?? undefined,
    };
}

export function newLandingPageActionMenu(landingPage: TLandingPage): TLandingPageActionMenu {
    return {
        ...landingPage,
        type: EItemName.LANDING_PAGE,
        itemName: EItemName.LANDING_PAGE,
    };
}

export function newOfferActionMenu(offer: TOffer): TOfferActionMenu {
    return {
        ...offer,
        type: EItemName.OFFER,
        itemName: EItemName.OFFER,
    };
}

export function newTrafficSourceActionMenu(trafficSource: TTrafficSource): TTrafficSourceActionMenu {
    return {
        ...trafficSource,
        type: EItemName.TRAFFIC_SOURCE,
        itemName: EItemName.TRAFFIC_SOURCE,
    };
}
