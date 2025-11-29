const TWEET_URL_REGEX =
  /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+\/status\/(\d+)/i;

export const extractTweetId = (url: string): string => {
  const match = url.match(TWEET_URL_REGEX);
  if (!match?.[1]) {
    throw new Error("Invalid X (Twitter) status URL");
  }
  return match[1];
};
