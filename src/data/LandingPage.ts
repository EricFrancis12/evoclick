import { Prisma, LandingPage } from "@prisma/client";
import db from "../lib/db";
import { landingPageSchema } from "../lib/schemas";
import { EItemName, TLandingPage } from "../lib/types";
import { makeStorerFuncs } from ".";

const {
    getAllFunc: getAllLandingPages,
    getByIdFunc: getLandingPageById,
    createNewFunc: createNewLandingPage,
    updateByIdFunc: updateLandingPageById,
    deleteByIdFunc: deleteLandingPageById,
    deleteManyFunc: deleteManyLandingPages,
    countFunc: countLandingPages,
} = makeStorerFuncs<LandingPage, TLandingPage, Prisma.LandingPageUncheckedCreateInput, Prisma.LandingPageUpdateInput, Prisma.LandingPageCountArgs>(
    EItemName.LANDING_PAGE,
    db.landingPage,
    makeClientLandingPage,
    landingPageSchema
);

export {
    getAllLandingPages,
    getLandingPageById,
    createNewLandingPage,
    updateLandingPageById,
    deleteLandingPageById,
    deleteManyLandingPages,
    countLandingPages,
};

async function makeClientLandingPage(dbModel: LandingPage): Promise<TLandingPage> {
    return {
        ...dbModel,
        primaryItemName: EItemName.LANDING_PAGE,
    };
}
