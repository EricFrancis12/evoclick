import { Prisma, Offer } from "@prisma/client";
import db from "../lib/db";
import { offersSchema } from "../lib/schemas";
import { EItemName, TOffer } from "../lib/types";
import { makeStorerFuncs } from ".";

const {
    getAllFunc: getAllOffers,
    getByIdFunc: getOfferById,
    createNewFunc: createNewOffer,
    updateByIdFunc: updateOfferById,
    deleteByIdFunc: deleteOfferById,
    deleteManyFunc: deleteManyOffers,
    countFunc: countOffers,
} = makeStorerFuncs<Offer, TOffer, Prisma.OfferUncheckedCreateInput, Prisma.OfferUpdateInput, Prisma.OfferCountArgs>(
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
    deleteManyOffers,
    countOffers,
};

async function makeClientOffer(dbModel: Offer): Promise<TOffer> {
    return {
        ...dbModel,
        primaryItemName: EItemName.OFFER,
    };
}
