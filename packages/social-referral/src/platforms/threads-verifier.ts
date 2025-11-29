import { ApifyClient } from "apify-client";

import type { SocialVerifier, VerifyKeywordsResult } from "../types";

const DEFAULT_ACTOR_ID = "Yw6anyCFnZlDgxUxe";

type ThreadsVerifierConfig = {
  apiToken?: string;
  actorId?: string;
  client?: ApifyClient;
};

type ApifyRun = {
  defaultDatasetId?: string;
};

type DatasetListItemsResponse = {
  items?: unknown[];
};

type ThreadsDatasetItem = {
  type?: string;
  thread?: Array<{
    like_count?: number;
    text_post_app_info?: {
      direct_reply_count?: number;
      repost_count?: number;
      text_fragments?: {
        fragments?: Array<{ plaintext?: string }>;
      };
    };
  }>;
};

// const THREADS_POST_URL_REGEX = /threads\.com\/@[^\/]+\/post\/([A-Za-z0-9_-]+)/i;
const THREADS_REGEX = /^https?:\/\/(?:www\.)?threads\.com\/?.*/i;

/**
 * Extracts the post ID from a Threads URL
 * @param url - The Threads post URL
 * @returns The post ID
 * @throws Error if URL is invalid
 */

const validateThreadsUrl = (url: string): void => {
  if (!THREADS_REGEX.test(url)) {
    throw new Error("Invalid Threads post URL");
  }
};

const isValidThreadsItem = (item: unknown): item is ThreadsDatasetItem => {
  if (!item || typeof item !== "object") return false;
  const dataset = item as ThreadsDatasetItem;
  if (!Array.isArray(dataset.thread) || dataset.thread.length === 0)
    return false;
  const firstThread = dataset.thread[0];
  if (!firstThread?.text_post_app_info) return false;
  const textFragments = firstThread.text_post_app_info.text_fragments;
  if (!textFragments || typeof textFragments !== "object") return false;
  return Array.isArray(textFragments.fragments);
};

/**
 * Verifies keywords in Threads posts using Apify scraper
 *
 * @example
 * const verifier = new ThreadsVerifier();
 * const result = await verifier.verifyKeywords({
 *   url: "https://www.threads.com/@withkynam/post/DQtLJfnCJPG",
 *   keywords: ["pov", "cafe"]
 * });
 */
export class ThreadsVerifier implements SocialVerifier {
  private client: ApifyClient | null = null;
  private apiToken: string | undefined;
  private actorId: string;
  private providedClient: ApifyClient | undefined;

  constructor(config: ThreadsVerifierConfig = {}) {
    // Store config, but don't validate or create client yet
    this.apiToken = config.apiToken;
    this.actorId = config.actorId ?? DEFAULT_ACTOR_ID;
    this.providedClient = config.client;
  }

  private getClient(): ApifyClient {
    // Lazy initialization: create client only when needed
    if (this.providedClient) {
      return this.providedClient;
    }
    if (this.client) {
      return this.client;
    }
    // Validate token at runtime (when actually used)
    const apiToken = this.apiToken ?? process.env.APIFY_API_TOKEN;
    if (!apiToken) {
      throw new Error("APIFY_API_TOKEN is not configured");
    }
    this.client = new ApifyClient({
      token: apiToken,
    });
    return this.client;
  }

  async verifyKeywords({
    url,
    keywords,
  }: {
    url: string;
    keywords: readonly string[];
  }): Promise<VerifyKeywordsResult> {
    if (keywords.length === 0) {
      throw new Error("At least one keyword is required");
    }

    validateThreadsUrl(url);
    const client = this.getClient();
    const run = await this.callActor(client, {
      input: [
        {
          url,
          method: "GET",
        },
      ],
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
      },
    });
    if (!run.defaultDatasetId) {
      throw new Error("Apify run did not return a dataset ID");
    }

    const dataset = await client.dataset(run.defaultDatasetId).listItems({
      limit: 5,
    });
    const { text, item } = this.resolveThreadsText(dataset);
    const engagement = this.extractEngagement(item);

    const normalizedText = text.toLowerCase();
    const processedKeywords = keywords
      .map((keyword) => ({
        original: keyword,
        normalized: keyword.trim().toLowerCase(),
      }))
      .filter((entry) => entry.normalized.length > 0);

    const missingKeywords: string[] = [];
    const matchedKeywords: string[] = [];

    processedKeywords.forEach((entry) => {
      if (!normalizedText.includes(entry.normalized)) {
        missingKeywords.push(entry.original);
      } else {
        matchedKeywords.push(entry.original);
      }
    });

    return {
      platform: "threads",
      url,
      text,
      containsAll: missingKeywords.length === 0,
      missingKeywords,
      matchedKeywords,
      likes: engagement.likes,
      comments: engagement.comments,
      shares: engagement.shares,
    };
  }

  private async callActor(
    client: ApifyClient,
    input: Record<string, unknown>,
  ): Promise<ApifyRun> {
    const run = await client.actor(this.actorId).call(input);
    return run as ApifyRun;
  }

  private resolveThreadsText(dataset: DatasetListItemsResponse): {
    text: string;
    item: ThreadsDatasetItem;
  } {
    const items = Array.isArray(dataset.items) ? dataset.items : [];
    const validItem = items.find(isValidThreadsItem);
    if (!validItem) {
      throw new Error("Apify dataset did not contain valid Threads post");
    }

    const firstThread = validItem.thread?.[0];
    const fragments =
      firstThread?.text_post_app_info?.text_fragments?.fragments ?? [];
    const textParts = fragments
      .map((fragment) => fragment.plaintext)
      .filter(
        (text): text is string => typeof text === "string" && text.length > 0,
      );

    if (textParts.length === 0) {
      throw new Error("Apify dataset did not contain Threads post text");
    }

    return { text: textParts.join(" "), item: validItem };
  }

  private extractEngagement(item: ThreadsDatasetItem): {
    likes: number;
    comments: number;
    shares: number;
  } {
    const firstThread = item.thread?.[0];
    if (!firstThread) {
      return { likes: 0, comments: 0, shares: 0 };
    }
    return {
      likes:
        typeof firstThread.like_count === "number" ? firstThread.like_count : 0,
      comments:
        typeof firstThread.text_post_app_info?.direct_reply_count === "number"
          ? firstThread.text_post_app_info.direct_reply_count
          : 0,
      shares:
        typeof firstThread.text_post_app_info?.repost_count === "number"
          ? firstThread.text_post_app_info.repost_count
          : 0,
    };
  }
}
