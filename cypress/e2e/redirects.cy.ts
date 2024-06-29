import { campaignSeedData, landingPageSeedData, offerSeedData, trafficSourceData } from '../../prisma/seedData';
import { ECookieName } from '@/lib/types';

describe('Testing campaign redirects', () => {
    let intercepted1 = false;

    it('redirects to the correct URLs', () => {
        cy.visit(`http://localhost:3001/t?g=${campaignSeedData.publicId}`);
        cy.url().should('eq', landingPageSeedData.url);

        cy.visit('http://localhost:3001/click');
        cy.url().should('eq', offerSeedData.url);

        cy.getCookie(ECookieName.CAMPAIGN_PUBLIC_ID).as('pid')
        cy.get('@pid').should('not.be.null');

        cy.intercept("localhost:3001/postback/test")
            .then(() => intercepted1 = true);

        cy.request(`http://localhost:3001/postback?pid=${cy.get('@pid')}`)
            .then(resp => expect(resp.status).to.eq(200));
    });

    it('sent an http request to the test postback URL', () => {
        expect(intercepted1).to.eq(true);
    });

    let intercepted2 = false;
    it('redirects to the correct URLs', () => {
        cy.intercept("localhost:3001/postback/test")
            .then(() => intercepted2 = true);

        cy.request('http://localhost:3001/postback')
            .then(resp => expect(resp.status).to.eq(200));
    });

    it('did NOT send an http request to the test postback URL', () => {
        expect(intercepted2).to.eq(false);
    });

    it('redirects to the catch-all URL when visiting /t with no "g" value in the query string', () => {
        cy.visit('http://localhost:3001/t');
        cy.url().should('eq', Cypress.env('CATCH_ALL_REDIRECT_URL'));
    });

    it('redirects to the catch-all URL when visiting /click with no cookies', () => {
        cy.visit('http://localhost:3001/click');
        cy.url().should('eq', Cypress.env('CATCH_ALL_REDIRECT_URL'));
    });
});
