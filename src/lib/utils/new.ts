import { TActionMenu } from "@/app/dashboard/ReportView/ActionMenu/types";
import { EItemName, ELogicalRelation, ERuleName, TNamedToken, TPath, TRoute, TRule, TToken } from "../types";

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
