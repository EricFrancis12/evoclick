import { Prisma, AffiliateNetwork } from "@prisma/client";
import db from "../lib/db";
import { affiliateNetworkSchema } from "../lib/schemas";
import { EItemName, TAffiliateNetwork } from "../lib/types";
import { makeStorerFuncs } from ".";

const {
    getAllFunc: getAllAffiliateNetworks,
    getByIdFunc: getAffiliateNetworkById,
    createNewFunc: createNewAffiliateNetwork,
    updateByIdFunc: updateAffiliateNetworkById,
    deleteByIdFunc: deleteAffiliateNetworkById,
    deleteManyFunc: deleteManyAffiliateNetworks,
    countFunc: countAffiliateNetworks,
} = makeStorerFuncs<AffiliateNetwork, TAffiliateNetwork, Prisma.AffiliateNetworkUncheckedCreateInput, Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkCountArgs>(
    EItemName.AFFILIATE_NETWORK,
    db.affiliateNetwork,
    makeClientAffiliateNetwork,
    affiliateNetworkSchema
);

export {
    getAllAffiliateNetworks,
    getAffiliateNetworkById,
    createNewAffiliateNetwork,
    updateAffiliateNetworkById,
    deleteAffiliateNetworkById,
    deleteManyAffiliateNetworks,
    countAffiliateNetworks,
};

async function makeClientAffiliateNetwork(dbModel: AffiliateNetwork): Promise<TAffiliateNetwork> {
    return {
        ...dbModel,
        primaryItemName: EItemName.AFFILIATE_NETWORK,
    };
}
