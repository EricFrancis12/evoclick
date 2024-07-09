import { Suspense } from "react";
import Creator from "./Creator";
import List from "./List";
import { getAllAffiliateNetworks } from "@/data";

export default async function AffiliateNetworks() {
    try {
        const affiliateNetworks = await getAllAffiliateNetworks();

        return (
            <>
                <Creator />
                <List affiliateNetworks={affiliateNetworks} />
                <Suspense fallback={"Loading Fallback..."}>
                    <Waiter />
                </Suspense>
            </>
        )
    } catch (err) {
        return (
            <div className="p-2 border">Error fetching Affiliate Networks...</div>
        )
    }
}

async function Waiter() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return (
        <Suspense fallback={"Loading Fallback..."}>
            <MyComponent />
        </Suspense>

    )
}

async function MyComponent() {
    return (
        <div>
            MyComponent
        </div>
    )
}
