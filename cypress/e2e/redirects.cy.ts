import { campaignSeedData, landingPageSeedData, offerSeedData } from "../../prisma/seedData";
import { makeCampaignUrl, makeClickUrl, makePostbackUrl } from "../../src/lib/utils";
import { ECookieName, Env } from "../../src/lib/types";

describe("Testing campaign redirects", () => {
    it("redirects to the correct URLs", () => {
        // Campaign URL
        cy.visit(makeCampaignUrl("http:", "localhost", "3001", campaignSeedData.publicId, []));
        cy.url().should("eq", landingPageSeedData.url);

        cy.getCookie(ECookieName.CLICK_PUBLIC_ID, { domain: "localhost" })
            .then(cookie => {
                const pid: string | undefined = cookie?.value;
                expect(pid)
                    .to.not.eq(null)
                    .and.to.not.eq(undefined)
                    .and.to.not.eq("");

                // Click URL
                cy.visit(makeClickUrl("http:", "localhost", "3001"));
                cy.url().should("eq", offerSeedData.url);

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
});
