import { z } from "zod";

import { SOCIAL_PLATFORMS } from "./types";

export const socialPlatformSchema = z.enum(SOCIAL_PLATFORMS);

export const socialUrlSchema = z.string().url();

export const keywordsSchema = z
  .array(z.string().min(1, "Keyword cannot be empty"))
  .min(1, "At least one keyword is required");

export const verifyKeywordsInputSchema = z.object({
  platform: socialPlatformSchema.optional(),
  url: socialUrlSchema,
  keywords: keywordsSchema,
});

export type VerifyKeywordsInputSchema = z.infer<
  typeof verifyKeywordsInputSchema
>;

export const verifyKeywordsResultSchema = z.object({
  platform: socialPlatformSchema,
  url: socialUrlSchema,
  text: z.string(),
  containsAll: z.boolean(),
  missingKeywords: z.array(z.string()),
  matchedKeywords: z.array(z.string()),
  likes: z.number().int().nonnegative(),
  comments: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative(),
});
