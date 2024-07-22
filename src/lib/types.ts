import { AffiliateNetwork, Campaign, Click, SavedFlow, LandingPage, Offer, TrafficSource, User } from "@prisma/client";

type omissions = "id" | "createdAt" | "updatedAt";
type primaryItemName = "primaryItemName";

// Extending User model
export type TUser = User;
export type TUser_createRequest = Omit<TUser, omissions>;
export type TUser_updateRequest = Omit<Partial<TUser>, omissions>;

// Extending Affiliate Network model
export type TAffiliateNetwork = AffiliateNetwork & {
    primaryItemName: EItemName.AFFILIATE_NETWORK;
};
export type TAffiliateNetwork_createRequest = Omit<TAffiliateNetwork, omissions | primaryItemName>;
export type TAffiliateNetwork_updateRequest = Omit<Partial<TAffiliateNetwork>, omissions | primaryItemName>;

// Extending Campaign model
export type TCampaign = Omit<Campaign, "flowMainRoute" | "flowRuleRoutes"> & {
    primaryItemName: EItemName.CAMPAIGN;
    flowMainRoute: TRoute | null;
    flowRuleRoutes: TRoute[] | null;
};
export type TCampaign_createRequest = Omit<TCampaign, omissions | primaryItemName | "publicId">;
export type TCampaign_updateRequest = Omit<Partial<TCampaign>, omissions | primaryItemName>;

// Extending Flow model
export type TSavedFlow = Omit<SavedFlow, "mainRoute" | "ruleRoutes"> & {
    primaryItemName: EItemName.FLOW;
    mainRoute: TRoute;
    ruleRoutes: TRoute[];
};
export type TSavedFlow_createRequest = Omit<TSavedFlow, omissions | primaryItemName>;
export type TSavedFlow_updateRequest = Omit<Partial<TSavedFlow>, omissions | primaryItemName>;

// Extending Landing Page model
export type TLandingPage = LandingPage & {
    primaryItemName: EItemName.LANDING_PAGE;
};
export type TLandingPage_createRequest = Omit<TLandingPage, omissions | primaryItemName>;
export type TLandingPage_updateRequest = Omit<Partial<TLandingPage>, omissions | primaryItemName>;

// Extending Offer model
export type TOffer = Offer & {
    primaryItemName: EItemName.OFFER;
};
export type TOffer_createRequest = Omit<TOffer, omissions | primaryItemName>;
export type TOffer_updateRequest = Omit<Partial<TOffer>, omissions | primaryItemName>;

// Extending Traffic Source model
export type TTrafficSource = Omit<TrafficSource, "externalIdToken" | "costToken" | "customTokens"> & {
    primaryItemName: EItemName.TRAFFIC_SOURCE;
    externalIdToken: TToken;
    costToken: TToken;
    customTokens: TNamedToken[];
};
export type TTrafficSource_createRequest = Omit<TTrafficSource, omissions | primaryItemName>;
export type TTrafficSource_updateRequest = Omit<Partial<TTrafficSource>, omissions | primaryItemName>;

export type TToken = {
    queryParam: string;
    value: string;
};
export type TNamedToken = TToken & {
    name: string;
};

// Extending Click model
export type TClick = Omit<Click, "tokens"> & {
    tokens: TToken[];
};

export type TRoute = {
    isActive: boolean;
    logicalRelation: ELogicalRelation;
    rules: TRule[];
    paths: TPath[];
};

export enum ELogicalRelation {
    AND = "and",
    OR = "or",
};

export type TRule = {
    ruleName: ERuleName;
    data: string[];
    includes: boolean;
};

export type TPath = {
    isActive: boolean;
    weight: number; // Ranges from 0 to 100
    landingPageIds: number[];
    offerIds: number[];
    directLinkingEnabled: boolean;
};

export type IPInfoData = {
    ip: string;
    hostname?: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
};

export enum ERuleName {
    IP = "IP",
    ISP = "ISP",
    USER_AGENT = "User Agent",
    LANGUAGE = "Language",
    COUNTRY = "Country",
    REGION = "Region",
    CITY = "City",
    DEVICE_TYPE = "Device Type",
    DEVICE = "Device",
    SCREEN_RESOLUTION = "Screen Resolution",
    OS = "OS",
    OS_VERSION = "OS Version",
    BROWSER_NAME = "Browser Name",
    BROWSER_VERSION = "Browser Version",
};

export enum EItemName {
    AFFILIATE_NETWORK = "Affiliate Network",
    CAMPAIGN = "Campaign",
    FLOW = "Flow",
    LANDING_PAGE = "Landing Page",
    OFFER = "Offer",
    TRAFFIC_SOURCE = "Traffic Source",
    IP = ERuleName.IP,
    ISP = ERuleName.ISP,
    USER_AGENT = ERuleName.USER_AGENT,
    LANGUAGE = ERuleName.LANGUAGE,
    COUNTRY = ERuleName.COUNTRY,
    REGION = ERuleName.REGION,
    CITY = ERuleName.CITY,
    DEVICE_TYPE = ERuleName.DEVICE_TYPE,
    DEVICE = ERuleName.DEVICE,
    SCREEN_RESOLUTION = ERuleName.SCREEN_RESOLUTION,
    OS = ERuleName.OS,
    OS_VERSION = ERuleName.OS_VERSION,
    BROWSER_NAME = ERuleName.BROWSER_NAME,
    BROWSER_VERSION = ERuleName.BROWSER_VERSION,
};

export type TPrimaryItemName =
    EItemName.AFFILIATE_NETWORK
    | EItemName.CAMPAIGN
    | EItemName.FLOW
    | EItemName.LANDING_PAGE
    | EItemName.OFFER
    | EItemName.TRAFFIC_SOURCE;

export enum EDeviceType {
    DESKTOP = "desktop",
    MOBILE = "mobile",
    TABLET = "tablet",
    UNKNOWN = "unknown",
};

export enum EBrowserName {
    OPERA = "Opera",
    OPERA_MINI = "Opera Mini",
    OPERA_TOUCH = "Opera Touch",
    CHROME = "Chrome",
    HEADLESS_CHROME = "Headless Chrome",
    FIREFOX = "Firefox",
    INTERNET_EXPLORER = "Internet Explorer",
    SAFARI = "Safari",
    EDGE = "Edge",
    VIVALDI = "Vivaldi",
}

export enum ECookieName {
    JWT = "jwt",
    CAMPAIGN_PUBLIC_ID = "campaignPublicID",
    CLICK_PUBLIC_ID = "clickPublicID",
}

export enum Env {
    API_PORT = "API_PORT",
    ROOT_USERNAME = "ROOT_USERNAME",
    ROOT_PASSWORD = "ROOT_PASSWORD",
    REDIS_URL = "REDIS_URL",
    NODE_ENV = "NODE_ENV",
    NEXT_PHASE = "NEXT_PHASE",
    JWT_SECRET = "JWT_SECRET",
    JWT_EXPIRY = "JWT_EXPIRY",
    IP_INFO_TOKEN = "IP_INFO_TOKEN",
};
