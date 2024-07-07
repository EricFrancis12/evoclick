import { useEffect } from "react";
import {
    getAllAffiliateNetworksAction, getAllCampaignsAction, getAllFlowsAction,
    getAllLandingPagesAction, getAllOffersAction, getAllTrafficSourcesAction
} from "@/lib/actions";
import { EItemName, TAffiliateNetwork, TCampaign, TFlow, TLandingPage, TOffer, TTrafficSource } from "@/lib/types";

// Define a mapped type to map EItemName values to corresponding types
type PrimaryDataItemMap = {
    [EItemName.AFFILIATE_NETWORK]: TAffiliateNetwork;
    [EItemName.CAMPAIGN]: TCampaign;
    [EItemName.FLOW]: TFlow;
    [EItemName.LANDING_PAGE]: TLandingPage;
    [EItemName.OFFER]: TOffer;
    [EItemName.TRAFFIC_SOURCE]: TTrafficSource;
};

// Define TPrimaryDataItem to return the appropriate type based on EItemName
type TPrimaryDataItem<T extends EItemName> = T extends keyof PrimaryDataItemMap ? PrimaryDataItemMap[T] : never;

export default function useFetchPrimaryData<T extends EItemName>(
    itemName: T,
    callback: (t: TPrimaryDataItem<T>[]) => any
): void {
    useEffect(() => {
        switch (itemName) {
            case EItemName.AFFILIATE_NETWORK:
                getAllAffiliateNetworksAction().then(data => callback(data as TPrimaryDataItem<T>[]));
                break;
            case EItemName.CAMPAIGN:
                getAllCampaignsAction().then(data => callback(data as TPrimaryDataItem<T>[]));
                break;
            case EItemName.FLOW:
                getAllFlowsAction().then(data => callback(data as TPrimaryDataItem<T>[]));
                break;
            case EItemName.LANDING_PAGE:
                getAllLandingPagesAction().then(data => callback(data as TPrimaryDataItem<T>[]));
                break;
            case EItemName.OFFER:
                getAllOffersAction().then(data => callback(data as TPrimaryDataItem<T>[]));
                break;
            case EItemName.TRAFFIC_SOURCE:
                getAllTrafficSourcesAction().then(data => callback(data as TPrimaryDataItem<T>[]));
                break;
        }
    }, [itemName]);
}
