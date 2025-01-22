import { AffiliateNetwork, Campaign, Click, LandingPage, Offer, Prisma, PrismaClient, SavedFlow, TrafficSource, User } from "@prisma/client";
import { EItemName, Env, TPrimaryItemName } from "./types";
import { inDemoMode, returnFirstOrThrow } from "./utils";
import { toPrismaAffiliateNetwork, toPrismaCampaign, toPrismaClick, toPrismaLandingPage, toPrismaOffer, toPrismaSavedFlow, toPrismaTrafficSource } from "../lib/utils/conv";
import { demoAffiliateNetworks, demoCampaigns, demoClicks, demoLandingPages, demoOffers, demoSavedFlows, demoTrafficSources } from "../app/demo/dashboard/data";
import { CountArg, CreateInput, DeleteManyArg, FindManyArg, IStorer, PrismaModel, UpdateInput } from "../data";

class DemoStorer<M extends PrismaModel, CI extends CreateInput, UI extends UpdateInput, CA extends CountArg> {
    kind: TPrimaryItemName | "Click";

    constructor(kind: TPrimaryItemName | "Click") {
        this.kind = kind;
    }

    getDemoData(): M {
        switch (this.kind) {
            case EItemName.AFFILIATE_NETWORK:
                return toPrismaAffiliateNetwork(returnFirstOrThrow(demoAffiliateNetworks, "Demo Affiliate Network")) as M;
            case EItemName.CAMPAIGN:
                return toPrismaCampaign(returnFirstOrThrow(demoCampaigns, "Demo Campaign")) as M;
            case EItemName.FLOW:
                return toPrismaSavedFlow(returnFirstOrThrow(demoSavedFlows, "Demo Saved Flow")) as M;
            case EItemName.LANDING_PAGE:
                return toPrismaLandingPage(returnFirstOrThrow(demoLandingPages, "Demo Landing Page")) as M;
            case EItemName.OFFER:
                return toPrismaOffer(returnFirstOrThrow(demoOffers, "Demo Offer")) as M;
            case EItemName.TRAFFIC_SOURCE:
                return toPrismaTrafficSource(returnFirstOrThrow(demoTrafficSources, "Demo Traffic Source")) as M;
            case "Click":
                return toPrismaClick(returnFirstOrThrow(demoClicks, "Demo Click")) as M;
        }
    }

    async findMany(_: FindManyArg): Promise<M[]> {
        // TODO: filter by arg
        switch (this.kind) {
            case EItemName.AFFILIATE_NETWORK:
                return demoAffiliateNetworks.map(toPrismaAffiliateNetwork) as M[];
            case EItemName.CAMPAIGN:
                return demoCampaigns.map(toPrismaCampaign) as M[];
            case EItemName.FLOW:
                return demoSavedFlows.map(toPrismaSavedFlow) as M[];
            case EItemName.LANDING_PAGE:
                return demoLandingPages.map(toPrismaLandingPage) as M[];
            case EItemName.OFFER:
                return demoOffers.map(toPrismaOffer) as M[];
            case EItemName.TRAFFIC_SOURCE:
                return demoTrafficSources.map(toPrismaTrafficSource) as M[];
            case "Click":
                return demoClicks.map(toPrismaClick) as M[];
        }
    }

    async findAll(): Promise<M[]> {
        return this.findMany({});
    }

    async findFirst(arg: { where: { id?: number, name?: string } }): Promise<M | null> {
        return (await this.findAll()).find(({ id }) => id === arg.where.id) ?? null;
    }

    async findUnique(arg: { where: { id: number } }): Promise<M | null> {
        return this.findFirst(arg);
    }

    async create(_: { data: CI }): Promise<M> {
        return this.getDemoData();
    }

    async update(_: { where: { id: number }, data: UI }): Promise<M> {
        return this.getDemoData();
    }

    async delete(_: { where: { id: number } }): Promise<M> {
        return this.getDemoData();
    }

    async deleteMany(_: DeleteManyArg): Promise<Prisma.BatchPayload> {
        return { count: 0 };
    }

    async count(_?: CA): Promise<number> {
        // TODO: filter by arg
        return (await this.findAll()).length;
    }
}

export class DemoDB {
    affiliateNetwork: IStorer<AffiliateNetwork, Prisma.AffiliateNetworkUncheckedCreateInput, Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkCountArgs>;
    campaign: IStorer<Campaign, Prisma.CampaignUncheckedCreateInput, Prisma.CampaignUpdateInput, Prisma.CampaignCountArgs>;
    savedFlow: IStorer<SavedFlow, Prisma.SavedFlowUncheckedCreateInput, Prisma.SavedFlowUpdateInput, Prisma.SavedFlowCountArgs>;
    landingPage: IStorer<LandingPage, Prisma.LandingPageUncheckedCreateInput, Prisma.LandingPageUpdateInput, Prisma.LandingPageCountArgs>;
    offer: IStorer<Offer, Prisma.OfferUncheckedCreateInput, Prisma.OfferUpdateInput, Prisma.OfferCountArgs>;
    trafficSource: IStorer<TrafficSource, Prisma.TrafficSourceUncheckedCreateInput, Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceCountArgs>;
    click: IStorer<Click, Prisma.ClickUncheckedCreateInput, Prisma.ClickUpdateInput, Prisma.ClickCountArgs>;
    user: IStorer<User, Prisma.UserUncheckedCreateInput, Prisma.UserUncheckedUpdateInput, Prisma.UserCountArgs>;

    constructor() {
        this.affiliateNetwork = new DemoStorer<AffiliateNetwork, Prisma.AffiliateNetworkUncheckedCreateInput, Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkCountArgs>(EItemName.AFFILIATE_NETWORK);
        this.campaign = new DemoStorer<Campaign, Prisma.CampaignUncheckedCreateInput, Prisma.CampaignUpdateInput, Prisma.CampaignCountArgs>(EItemName.CAMPAIGN);
        this.savedFlow = new DemoStorer<SavedFlow, Prisma.SavedFlowUncheckedCreateInput, Prisma.SavedFlowUpdateInput, Prisma.SavedFlowCountArgs>(EItemName.FLOW);
        this.landingPage = new DemoStorer<LandingPage, Prisma.LandingPageUncheckedCreateInput, Prisma.LandingPageUpdateInput, Prisma.LandingPageCountArgs>(EItemName.LANDING_PAGE);
        this.offer = new DemoStorer<Offer, Prisma.OfferUncheckedCreateInput, Prisma.OfferUpdateInput, Prisma.OfferCountArgs>(EItemName.OFFER);
        this.trafficSource = new DemoStorer<TrafficSource, Prisma.TrafficSourceUncheckedCreateInput, Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceCountArgs>(EItemName.TRAFFIC_SOURCE);
        this.click = new DemoStorer<Click, Prisma.ClickUncheckedCreateInput, Prisma.ClickUpdateInput, Prisma.ClickCountArgs>("Click");
        this.user = new DemoStorer<User, Prisma.UserUncheckedCreateInput, Prisma.UserUncheckedUpdateInput, Prisma.UserCountArgs>("Click");
    }
}

const prismaClientSingleton = () => {
    const prisma = new PrismaClient({
        log: [
            {
                emit: "event",
                level: "error",
            },
            {
                emit: "event",
                level: "info",
            },
            {
                emit: "event",
                level: "warn",
            },
        ],
    });

    if (process.env[Env.NODE_ENV] !== "test" // Prevents logs during tests
        && process.env[Env.NEXT_PHASE] !== "phase-production-build" // Prevents logs during next build
    ) {
        prisma.$on("error", e => console.error(e.message));
        prisma.$on("info", e => console.log(e.message));
        prisma.$on("warn", e => console.log(e.message));
    }

    return prisma;
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = inDemoMode()
    ? new DemoDB()
    : (globalThis.prismaGlobal ?? prismaClientSingleton());

export default db;

if (process.env[Env.NODE_ENV] !== "production" && db instanceof PrismaClient) {
    globalThis.prismaGlobal = db;
}
