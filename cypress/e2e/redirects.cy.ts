import dotenv from "dotenv";
import { campaignSeedData, landingPageSeedData, offerSeedData } from "../../prisma/seedData";
import { ECookieName, Env } from "../../src/lib/types";

dotenv.config();

if (!process.env[Env.API_PORT]) throw new Error("Environment varaible API_PORT not set.");

describe("Testing campaign redirects", () => {
    it("redirects to the correct URLs", () => {
        cy.visit(`http://localhost:${process.env[Env.API_PORT]}/t?g=${campaignSeedData.publicId}`);
        cy.url().should("eq", landingPageSeedData.url);

        let pid: string | undefined;
        cy.getCookie(ECookieName.CLICK_PUBLIC_ID, { domain: "localhost" })
            .then(cookie => {
                pid = cookie?.value;
                expect(pid)
                    .to.not.eq(null)
                    .to.not.eq(undefined)
                    .and.not.eq("");
            });

        cy.visit(`http://localhost:${process.env[Env.API_PORT]}/click`);
        cy.url().should("eq", offerSeedData.url);

        // TODO: Add test for postback URL
    });

    it("redirects to the catch-all URL when visiting /t with no 'g' value in the query string", () => {
        cy.visit(`http://localhost:${process.env[Env.API_PORT]}/t`);
        cy.url().should("eq", Cypress.env("CATCH_ALL_REDIRECT_URL"));
    });

    it("redirects to the catch-all URL when visiting /click with no cookies", () => {
        cy.visit(`http://localhost:${process.env[Env.API_PORT]}/click`);
        cy.url().should("eq", Cypress.env("CATCH_ALL_REDIRECT_URL"));
    });
});
