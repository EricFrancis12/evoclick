import { makeCampaignUrl, makeClickUrl, makePostbackUrl, returnAtIndexOrThrow, returnFirstOrThrow } from "../../src/lib/utils";
import { ECookieName, Env } from "../../src/lib/types";
import seedData, { ECustomTokenParam, testUserAgent, testZoneId } from "../../prisma/seedData"
const { campaignSeeds, landingPageSeeds, offerSeeds } = seedData;

describe("Testing campaign redirects", () => {
    const { publicId } = returnFirstOrThrow(campaignSeeds, "Campaign seed");

    it("redirects to the correct URLs", () => {
        // Campaign URL
        cy.visit(makeCampaignUrl("http:", "localhost", "3001", publicId, []));

        const { url } = returnFirstOrThrow(landingPageSeeds, "Landing Page seed");
        cy.url().should("eq", url);

        cy.getCookie(ECookieName.CLICK_PUBLIC_ID, { domain: "localhost" })
            .then(cookie => {
                const pid: string | undefined = cookie?.value;
                expect(pid)
                    .to.not.eq(null)
                    .and.to.not.eq(undefined)
                    .and.to.not.eq("");

                // Click URL
                cy.visit(makeClickUrl("http:", "localhost", "3001"));

                const { url } = returnFirstOrThrow(offerSeeds, "Offer seed");
                cy.url().should("eq", url);

                //Postback URL
                cy.request(makePostbackUrl("http:", "localhost", "3001", pid || ""))
                    .then(response => {
                        const testResult = response.headers["cypress-redirect-test-result"];
                        expect(testResult).to.eq("pass");
                    });
            });
    });

    it("redirects to the catch-all URL when visiting /t with no 'g' value in the query string", () => {
        cy.visit(makeCampaignUrl("http:", "localhost", "3001", "", []));
        cy.url().should("eq", Cypress.env(Env.CATCH_ALL_REDIRECT_URL));
    });

    it("redirects to the catch-all URL when visiting /click with no cookies", () => {
        cy.visit(makeClickUrl("http:", "localhost", "3001"));
        cy.url().should("eq", Cypress.env(Env.CATCH_ALL_REDIRECT_URL));
    });

    it("redirects to the correct rule route per user agent header", () => {
        cy.visit(
            makeCampaignUrl("http:", "localhost", "3001", publicId, []),
            {
                headers: {
                    "User-Agent": testUserAgent,
                },
            },
        );

        const { url } = returnAtIndexOrThrow(offerSeeds, 1, "Offer seed");
        cy.url().should("eq", url);
    });

    it("redirects to the correct rule route per custom traffic source token", () => {
        const tokens = [
            {
                queryParam: ECustomTokenParam.ZONE_ID,
                value: testZoneId,
            },
            {
                queryParam: ECustomTokenParam.BANNER_ID,
                value: "",
            },
        ];

        cy.visit(makeCampaignUrl("http:", "localhost", "3001", publicId, tokens));

        const { url } = returnAtIndexOrThrow(offerSeeds, 2, "Offer seed");
        cy.url().should("eq", url);
    });
});
