import { $Enums } from '@prisma/client';
import { campaignSchema } from './schemas';
import { TCampaign } from './types';

describe('Testing Schemas', () => {
    test('Campaign Schema aligns with type', () => {
        expect(campaignSchema.safeParse({}).success).toEqual(false);

        const boilerplateCampaign: TCampaign = {
            id: 1,
            name: 'My Campaign',
            landingPageRotation: $Enums.LandingPageRotation.RANDOM,
            offerRotation: $Enums.OfferRotation.RANDOM,
            geoName: $Enums.GeoName.UNITED_STATES,
            tags: ['split test', 'new bid strategy'],
            createdAt: new Date(),
            updatedAt: new Date(),
            flowId: 2,
            trafficSourceId: 3
        };
        expect(campaignSchema.safeParse(boilerplateCampaign).success).toEqual(true);
    });
});
