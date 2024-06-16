import { z } from 'zod';
import { toZod } from 'tozod';
import { AffiliateNetwork, LandingPage, User } from '@prisma/client';

export const userSchema: toZod<User> = z.object({
    id: z.number(),
    name: z.string(),
    hashedPassword: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const affiliateNetworkSchema: toZod<AffiliateNetwork> = z.object({
    id: z.number(),
    name: z.string(),
    defaultNewOfferString: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const landingPageSchema: toZod<LandingPage> = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date()
});
