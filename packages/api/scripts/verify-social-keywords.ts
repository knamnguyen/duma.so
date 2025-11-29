import process from "node:process";

import {
  SocialReferralService,
  verifyKeywordsInputSchema,
} from "@sassy/social-referral";

type CliArguments = {
  url?: string;
  keywords?: string;
};

const parseArguments = (): CliArguments => {
  const args = process.argv.slice(2);
  const parsed: CliArguments = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--url") {
      parsed.url = args[i + 1];
      i++;
    } else if (arg === "--keywords") {
      parsed.keywords = args[i + 1];
      i++;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Verify social media post keywords

Usage:
  pnpm --filter @sassy/api social:verify -- --url <URL> --keywords <KEYWORDS>

Supported platforms:
  - X (Twitter): https://x.com/... or https://twitter.com/...
  - Threads: https://www.threads.com/...
  - Facebook: https://www.facebook.com/share/p/... or https://www.facebook.com/share/v/...
  - LinkedIn: https://www.linkedin.com/posts/...

Examples:
  pnpm --filter @sassy/api social:verify -- --url "https://x.com/user/status/123" --keywords "keyword1,keyword2"
  pnpm --filter @sassy/api social:verify -- --url "https://www.threads.com/@user/post/abc" --keywords "pov,cafe"
      `);
      process.exit(0);
    }
  }
  return parsed;
};

const main = async () => {
  const cliArgs = parseArguments();
  const keywords = cliArgs.keywords
    ? cliArgs.keywords.split(",").map((value) => value.trim())
    : [];

  const input = verifyKeywordsInputSchema.parse({
    url: cliArgs.url,
    keywords,
  });

  const service = new SocialReferralService();
  const result = await service.verifyKeywords(input);

  console.log(JSON.stringify(result, null, 2));
  if (!result.containsAll) {
    console.error("Missing keywords:", result.missingKeywords.join(", "));
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error("Failed to verify social media keywords:", error);
  process.exitCode = 1;
});
