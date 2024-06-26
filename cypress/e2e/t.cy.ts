import {
    affiliateNetworkSeedData, campaignSeedData, flowSeedData,
    landingPageSeedData, offerSeedData, trafficSourceData
} from '../../prisma/seedData';

describe('Testing /t route', () => {
    it('redirects to the correct URL', () => {
        cy.request(`http://localhost:3001/t?g=${campaignSeedData.publicId}`).as('req');

        cy.get('@req').should(response => {
            expect(response)
                .to.have.property('allRequestResponses')
                .that.has.lengthOf.at.least(2)
                .that.satisfies((arr: unknown[]) => arr.some((a: unknown) => typeof a === 'object' && a != null && 'Request URL' in a && typeof a['Request URL'] === 'string' && a['Request URL'].includes('https://bing.com/?source=My_First_Landing_Page')))

            // expect(response.body).to.have.length(500)
            // expect(response).to.have.property('headers')
            // expect(response).to.have.property('duration')
        })
    });
});
