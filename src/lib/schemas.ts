import { z } from 'zod';

export const affiliateNetworkSchema = z.object({
    id: z.number(),
    name: z.string(),
    defaultNewOfferString: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type TAffiliateNetwork = z.infer<typeof affiliateNetworkSchema>;
