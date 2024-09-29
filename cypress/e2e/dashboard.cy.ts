import seedData, { returnFirstOrThrow } from "../../prisma/seedData";
import { Env } from "../../src/lib/types";

describe("Testing dashboard functionality", () => {
    it("logs in successfully and traverses dashboard functionality", () => {
        cy.visit("http://localhost:3000");
        cy.url().should("eq", "http://localhost:3000/login");

        cy.get("[data-cy='username-input']").type(Cypress.env(Env.ROOT_USERNAME));
        cy.get("[data-cy='password-input']").type(Cypress.env(Env.ROOT_PASSWORD));
        cy.get("[data-cy='submit-button']").click();

        cy.wait(1000 * 10);

        cy.url().should("eq", "http://localhost:3000/dashboard");

        const { name } = returnFirstOrThrow(seedData.campaignSeeds, "Campaign seed");
        cy.get(`[data-cy='${name}']`).click();
        cy.get("[data-cy='report-button']").click();

        cy.wait(1000 * 10);

        const { customTokens } = returnFirstOrThrow(seedData.trafficSourceSeeds, "Traffic Source seed");
        for (const token of customTokens) {
            cy.get("[data-cy='select-chain-link-index-0']").select(token.queryParam);
            cy.wait(1000);
        }
    });
});
