import type { SocialPlatform } from "../types";

const PLATFORM_PATTERNS = {
  x: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\//i,
  threads: /https?:\/\/(?:www\.)?threads\.com\//i,
  facebook: /https?:\/\/(?:www\.)?facebook\.com\//i,
  linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/(?:posts|feed\/update)\//i,
} as const;

/**
 * Detects the social media platform from a URL
 *
 * @param url - The social media post URL to analyze
 * @returns The detected platform enum
 * @throws When URL doesn't match any supported platform
 * @example
 * detectPlatform("https://x.com/user/status/123") // "x"
 * detectPlatform("https://www.threads.com/@user/post/abc") // "threads"
 */
export const detectPlatform = (url: string): SocialPlatform => {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(url)) {
      return platform as SocialPlatform;
    }
  }
  throw new Error(
    "Unsupported platform: URL does not match any known social media platform",
  );
};
