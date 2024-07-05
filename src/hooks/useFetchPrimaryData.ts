"use client";

import { useEffect } from "react";
import {
    getAllAffiliateNetworksAction, getAllCampaignsAction, getAllFlowsAction,
    getAllLandingPagesAction, getAllOffersAction, getAllTrafficSourcesAction
} from "@/lib/actions";
import { EItemName, TAffiliateNetwork, TCampaign, TFlow, TLandingPage, TOffer, TTrafficSource } from "@/lib/types";

type TPrimaryDataItem = TAffiliateNetwork | TCampaign | TFlow | TLandingPage | TOffer | TTrafficSource;

export default function useFetchPrimaryData(itemName: EItemName, callback: <T extends TPrimaryDataItem>(t: T[]) => any): void {
    useEffect(() => {
        switch (itemName) {
            case EItemName.AFFILIATE_NETWORK:
                getAllAffiliateNetworksAction().then(data => callback<TAffiliateNetwork>(data));
                break;
            case EItemName.CAMPAIGN:
                getAllCampaignsAction().then(data => callback<TCampaign>(data));
                break;
            case EItemName.FLOW:
                getAllFlowsAction().then(data => callback<TFlow>(data));
                break;
            case EItemName.LANDING_PAGE:
                getAllLandingPagesAction().then(data => callback<TLandingPage>(data));
                break;
            case EItemName.OFFER:
                getAllOffersAction().then(data => callback<TOffer>(data));
                break;
            case EItemName.TRAFFIC_SOURCE:
                getAllTrafficSourcesAction().then(data => callback<TTrafficSource>(data));
                break;
        }
    }, [itemName]);
}
