'use server';

import { revalidatePath } from 'next/cache';
import { createNewAffiliateNetwork } from './data';
import { IAffiliateNetwork, IAffiliateNetwork_createRequest } from './types';

export async function createNewAffiliateNetworkAction(formData: FormData, pathname?: string): Promise<IAffiliateNetwork> {
    const affNetReqest: IAffiliateNetwork_createRequest = {
        name: getFormDataName(formData, 'name'),
        defaultNewOfferString: getFormDataName(formData, 'defaultNewOfferString'),
        tags: []
    };
    const affiliateNetworkProm = createNewAffiliateNetwork(affNetReqest);

    // Optionally refresh URL after the new link is added
    if (pathname != null) {
        affiliateNetworkProm.then(() => revalidatePath(pathname));
    }

    return affiliateNetworkProm;
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || '';
}
