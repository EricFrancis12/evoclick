import { campaignSeedData, trafficSourceSeedData } from "../../prisma/seedData";
import { Env } from "../../src/lib/types";

describe("Testing dashboard functionality", () => {
    it("logs in successfully and traverses dashboard functionality", () => {
        cy.visit("http://localhost:3000");
        cy.url().should("eq", "http://localhost:3000/login");

        cy.get("[data-cy='username-input']").type(Cypress.env(Env.ROOT_USERNAME));
        cy.get("[data-cy='password-input']").type(Cypress.env(Env.ROOT_PASSWORD));
        cy.get("[data-cy='submit-button']").click();

        cy.wait(1000 * 20);

        cy.url().should("eq", "http://localhost:3000/dashboard");

        cy.get(`[data-cy='${campaignSeedData.name}']`).click();
        cy.get("[data-cy='report-button']").click();

        cy.wait(1000 * 20);

        for (const token of trafficSourceSeedData.customTokens) {
            cy.get("[data-cy='select-chain-link-index-0']").select(token.queryParam);
            cy.wait(1000);
        }
    });
});
