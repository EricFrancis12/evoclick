import { makeCampaignUrl, makeClickUrl, makePostbackUrl } from "../../src/lib/utils";
import { ECookieName, Env } from "../../src/lib/types";
import { returnAtIndexOrThrow, returnFirstOrThrow, testUserAgent } from "../../prisma/seedData";
import seedData from "../../prisma/seedData";
const { campaignSeeds, landingPageSeeds, offerSeeds, trafficSourceSeeds } = seedData;

describe("Testing campaign redirects", () => {
    const { publicId } = returnFirstOrThrow(campaignSeeds, "Campaign seed");
    const { customTokens } = returnFirstOrThrow(trafficSourceSeeds, "Traffic Source seed");

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

    it("redirects to the correct rule route", () => {
        cy.visit(
            makeCampaignUrl("http:", "localhost", "3001", publicId, customTokens),
            {
                headers: {
                    "user-agent": testUserAgent,
                },
            });

        const { url } = returnAtIndexOrThrow(offerSeeds, 1, "Offer seed");
        cy.url().should("eq", url);
    });
});
