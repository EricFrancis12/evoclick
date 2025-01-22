import { AffiliateNetwork, Campaign, Click, LandingPage, Offer, SavedFlow, TrafficSource } from "@prisma/client";
import { TAffiliateNetwork, TCampaign, TClick, TLandingPage, TOffer, TSavedFlow, TTrafficSource } from "../types";

export function toPrismaAffiliateNetwork(an: TAffiliateNetwork): AffiliateNetwork {
    return {
        id: an.id,
        name: an.name,
        defaultNewOfferString: an.defaultNewOfferString,
        tags: an.tags,
        createdAt: an.createdAt,
        updatedAt: an.updatedAt,
    };
}

export function toPrismaCampaign(c: TCampaign): Campaign {
    return {
        id: c.id,
        publicId: c.publicId,
        name: c.name,
        landingPageRotationType: c.landingPageRotationType,
        offerRotationType: c.offerRotationType,
        geoName: c.geoName,
        tags: c.tags,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        trafficSourceId: c.trafficSourceId,
        flowType: c.flowType,
        flowMainRoute: JSON.stringify(c.flowMainRoute),
        flowRuleRoutes: JSON.stringify(c.flowRuleRoutes),
        flowUrl: c.flowUrl,
        savedFlowId: c.savedFlowId,
    };
}

export function toPrismaSavedFlow(sf: TSavedFlow): SavedFlow {
    return {
        id: sf.id,
        name: sf.name,
        mainRoute: JSON.stringify(sf.mainRoute),
        ruleRoutes: JSON.stringify(sf.ruleRoutes),
        tags: sf.tags,
        createdAt: sf.createdAt,
        updatedAt: sf.updatedAt,
    };
}

export function toPrismaLandingPage(lp: TLandingPage): LandingPage {
    return {
        id: lp.id,
        name: lp.name,
        url: lp.url,
        tags: lp.tags,
        createdAt: lp.createdAt,
        updatedAt: lp.updatedAt,
    };
}

export function toPrismaOffer(o: TOffer): Offer {
    return {
        id: o.id,
        name: o.name,
        url: o.url,
        tags: o.tags,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        affiliateNetworkId: o.affiliateNetworkId,
    };
}

export function toPrismaTrafficSource(ts: TTrafficSource): TrafficSource {
    return {
        id: ts.id,
        name: ts.name,
        externalIdToken: JSON.stringify(ts.externalIdToken),
        costToken: JSON.stringify(ts.costToken),
        customTokens: JSON.stringify(ts.customTokens),
        postbackUrl: ts.postbackUrl,
        tags: ts.tags,
        createdAt: ts.createdAt,
        updatedAt: ts.updatedAt,
    };
}

export function toPrismaClick(cl: TClick): Click {
    return {
        id: cl.id,
        publicId: cl.publicId,
        externalId: cl.externalId,
        cost: cl.cost,
        revenue: cl.revenue,
        viewTime: cl.viewTime,
        clickTime: cl.clickTime,
        convTime: cl.convTime,
        viewOutputUrl: cl.viewOutputUrl,
        clickOutputUrl: cl.clickOutputUrl,
        tokens: JSON.stringify(cl.tokens),
        ip: cl.ip,
        isp: cl.isp,
        userAgent: cl.userAgent,
        language: cl.language,
        country: cl.country,
        region: cl.region,
        city: cl.city,
        deviceType: cl.deviceType,
        device: cl.device,
        screenResolution: cl.screenResolution,
        os: cl.os,
        osVersion: cl.osVersion,
        browserName: cl.browserName,
        browserVersion: cl.browserVersion,
        createdAt: cl.createdAt,
        updatedAt: cl.updatedAt,
        affiliateNetworkId: cl.affiliateNetworkId,
        campaignId: cl.campaignId,
        savedFlowId: cl.savedFlowId,
        landingPageId: cl.landingPageId,
        offerId: cl.offerId,
        trafficSourceId: cl.trafficSourceId,
    };
}

