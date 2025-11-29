export const SOCIAL_PLATFORMS = [
  "x",
  "threads",
  "facebook",
  "linkedin",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface VerifyKeywordsInput {
  platform?: SocialPlatform;
  url: string;
  keywords: readonly string[];
}

export interface VerifyKeywordsResult {
  platform: SocialPlatform;
  url: string;
  text: string;
  containsAll: boolean;
  missingKeywords: string[];
  matchedKeywords: string[];
  likes: number;
  comments: number;
  shares: number;
}

export interface SocialVerifier {
  verifyKeywords(
    args: Omit<VerifyKeywordsInput, "platform">,
  ): Promise<VerifyKeywordsResult>;
}
