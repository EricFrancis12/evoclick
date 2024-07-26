import { Prisma, Offer } from "@prisma/client";
import db from "../lib/db";
import { offersSchema } from "../lib/schemas";
import { EItemName, TOffer, TOffer_createRequest } from "../lib/types";
import { makeStorerFuncs } from ".";

const {
    getAllFunc: getAllOffers,
    getByIdFunc: getOfferById,
    createNewFunc: createNewOffer,
    updateByIdFunc: updateOfferById,
    deleteByIdFunc: deleteOfferById,
} = makeStorerFuncs<Offer, TOffer, Prisma.OfferUncheckedCreateInput, Prisma.OfferUpdateInput>(
    EItemName.OFFER,
    db.offer,
    makeClientOffer,
    offersSchema
);

export {
    getAllOffers,
    getOfferById,
    createNewOffer,
    updateOfferById,
    deleteOfferById,
};

async function makeClientOffer(dbModel: Offer): Promise<TOffer> {
    return {
        ...dbModel,
        primaryItemName: EItemName.OFFER,
    };
}
