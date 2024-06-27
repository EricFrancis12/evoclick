import { campaignSeedData, landingPageSeedData, offerSeedData } from '../../prisma/seedData';

describe('Testing campaign redirects', () => {
    it('redirects to the correct URLs', () => {
        cy.visit(`http://localhost:3001/t?g=${campaignSeedData.publicId}`);
        cy.url().should('eq', landingPageSeedData.url);

        cy.get('a.btn').click()
        cy.url().should('eq', offerSeedData.url);
    });

    it('redirects to the catch-all URL when visiting /t with no "g" value in the query string', () => {
        cy.visit(`http://localhost:3001/t`);
        cy.url().should('eq', Cypress.env('CATCH_ALL_REDIRECT_URL'));
    });

    it('redirects to the catch-all URL when visiting /click with no cookies', () => {
        cy.visit('http://localhost:3001/click');
        cy.url().should('eq', Cypress.env('CATCH_ALL_REDIRECT_URL'));
    });

});
