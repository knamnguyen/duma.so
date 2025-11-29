import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PrismaClient } from "@sassy/db";
import {
  normalizeUrl,
  socialPlatformSchema,
  SocialReferralService,
  socialUrlSchema,
} from "@sassy/social-referral";

import { protectedProcedure } from "../trpc";

const ALLOWED_KEYWORDS = [
  "gifavatar[dot]app",
  "gifavatar.app",
  "gifavatar",
] as const;

// Service can be instantiated at module level since verifiers use lazy initialization
// Verifiers will validate APIFY_API_TOKEN only when actually used at runtime
const socialReferralService = new SocialReferralService();

type ServicePlatform = z.infer<typeof socialPlatformSchema>;
type PrismaPlatform = "X" | "THREADS" | "FACEBOOK" | "LINKEDIN";
type PrismaStatus =
  | "VERIFYING"
  | "VALIDATED"
  | "INVALID"
  | "DUPLICATE"
  | "VALIDATION_FAILED";

const prismaPlatformByService: Record<ServicePlatform, PrismaPlatform> = {
  x: "X",
  threads: "THREADS",
  facebook: "FACEBOOK",
  linkedin: "LINKEDIN",
};

const servicePlatformByPrisma: Record<PrismaPlatform, ServicePlatform> = {
  X: "x",
  THREADS: "threads",
  FACEBOOK: "facebook",
  LINKEDIN: "linkedin",
};

const rejectedStatuses: PrismaStatus[] = [
  "INVALID",
  "VALIDATION_FAILED",
  "DUPLICATE",
];

const submitPostInputSchema = z.object({
  platform: socialPlatformSchema,
  url: socialUrlSchema,
});

const formatStatus = (status: PrismaStatus): ServiceSubmissionStatus => {
  switch (status) {
    case "VERIFYING":
      return "verifying";
    case "VALIDATED":
      return "validated";
    case "INVALID":
      return "invalid";
    case "DUPLICATE":
      return "duplicate";
    case "VALIDATION_FAILED":
    default:
      return "validation_failed";
  }
};

type ServiceSubmissionStatus =
  | "verifying"
  | "validated"
  | "invalid"
  | "duplicate"
  | "validation_failed";

const mapErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown verification error";

const calculateEngagementTotal = (
  likes: number,
  comments: number,
  shares: number,
): number => likes + comments + shares;

const verifySubmission = async (
  submissionId: string,
  db: PrismaClient,
): Promise<void> => {
  const submission = await db.socialSubmission.findUnique({
    where: { id: submissionId },
  });
  if (!submission) {
    return;
  }

  const platformKey = submission.platform as PrismaPlatform;
  const platform =
    servicePlatformByPrisma[platformKey] ?? servicePlatformByPrisma.X;
  if (!platform) {
    console.error("Unknown platform for submission", submissionId);
    return;
  }

  const now = new Date();

  try {
    const result = await socialReferralService.verifyKeywords({
      platform: platform,
      url: submission.urlNormalized,
      keywords: ALLOWED_KEYWORDS,
    });

    const keywordMatch = hasAllowedKeyword(result.matchedKeywords);
    const engagementTotal = calculateEngagementTotal(
      result.likes,
      result.comments,
      result.shares,
    );
    const creditAwarded = keywordMatch
      ? Math.max(submission.creditAwarded, 5)
      : 0;

    await db.socialSubmission.update({
      where: { id: submissionId },
      data: {
        status: keywordMatch ? "VALIDATED" : "INVALID",
        postText: result.text,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: keywordMatch ? [] : result.missingKeywords,
        likes: result.likes,
        comments: result.comments,
        shares: result.shares,
        bestEngagementTotal: engagementTotal,
        creditAwarded,
        creditPenalty: submission.creditPenalty,
        verifiedAt: keywordMatch ? now : submission.verifiedAt,
        lastAttemptAt: now,
        errorMessage: keywordMatch ? null : "Missing required keywords",
      },
    });
  } catch (error) {
    await db.socialSubmission.update({
      where: { id: submissionId },
      data: {
        status: "VALIDATION_FAILED",
        errorMessage: mapErrorMessage(error),
        lastAttemptAt: now,
        creditPenalty: submission.creditPenalty,
      },
    });
  }
};

const startVerification = (submissionId: string, db: PrismaClient) => {
  void verifySubmission(submissionId, db).catch((error) => {
    console.error("Failed to verify social submission", submissionId, error);
  });
};

const hasAllowedKeyword = (matchedKeywords: string[]): boolean =>
  matchedKeywords.some((keyword) =>
    ALLOWED_KEYWORDS.includes(keyword as (typeof ALLOWED_KEYWORDS)[number]),
  );

/**
 * Rescans a social submission to update engagement metrics and award credits
 * for engagement growth. Awards 10 credits per 10 additional interactions.
 * On failure, deducts the last creditAwarded by moving it to creditPenalty.
 */
export const rescanSubmission = async (
  submissionId: string,
  db: PrismaClient,
): Promise<{ success: boolean; error?: string }> => {
  const submission = await db.socialSubmission.findUnique({
    where: { id: submissionId },
  });
  if (!submission) {
    return { success: false, error: "Submission not found" };
  }

  const platformKey = submission.platform as PrismaPlatform;
  const platform =
    servicePlatformByPrisma[platformKey] ?? servicePlatformByPrisma.X;
  if (!platform) {
    console.error("Unknown platform for submission", submissionId);
    return { success: false, error: "Unknown platform" };
  }

  const now = new Date();
  const previousCreditAwarded = submission.creditAwarded;
  const previousBestEngagement = submission.bestEngagementTotal;

  try {
    const result = await socialReferralService.verifyKeywords({
      platform: platform,
      url: submission.urlNormalized,
      keywords: ALLOWED_KEYWORDS,
    });

    const keywordMatch = hasAllowedKeyword(result.matchedKeywords);
    const newEngagementTotal = calculateEngagementTotal(
      result.likes,
      result.comments,
      result.shares,
    );

    // Calculate engagement growth
    const engagementDelta = newEngagementTotal - previousBestEngagement;
    // Award 10 credits per 10 additional interactions (only for growth)
    const newCredits =
      engagementDelta > 0 ? Math.floor(engagementDelta / 10) * 10 : 0;
    const updatedCreditAwarded = previousCreditAwarded + newCredits;
    const updatedBestEngagement = Math.max(
      previousBestEngagement,
      newEngagementTotal,
    );

    await db.socialSubmission.update({
      where: { id: submissionId },
      data: {
        status: keywordMatch ? "VALIDATED" : submission.status,
        postText: result.text,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: keywordMatch ? [] : result.missingKeywords,
        likes: result.likes,
        comments: result.comments,
        shares: result.shares,
        bestEngagementTotal: updatedBestEngagement,
        creditAwarded: updatedCreditAwarded,
        creditPenalty: submission.creditPenalty,
        verifiedAt: keywordMatch
          ? (submission.verifiedAt ?? now)
          : submission.verifiedAt,
        lastAttemptAt: now,
        errorMessage: keywordMatch ? null : submission.errorMessage,
        rescanCount: submission.rescanCount + 1,
      },
    });

    return { success: true };
  } catch (error) {
    // On failure: move creditAwarded to creditPenalty (deducts from user total)
    // Preserve bestEngagementTotal since we don't have new data
    await db.socialSubmission.update({
      where: { id: submissionId },
      data: {
        status: "VALIDATION_FAILED",
        errorMessage: mapErrorMessage(error),
        lastAttemptAt: now,
        creditPenalty: submission.creditPenalty + previousCreditAwarded,
        creditAwarded: 0,
        bestEngagementTotal: previousBestEngagement, // Preserve previous best
        rescanCount: submission.rescanCount + 1,
      },
    });

    return {
      success: false,
      error: mapErrorMessage(error),
    };
  }
};

export const socialRouter = {
  submitPost: protectedProcedure
    .input(submitPostInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const normalizedUrl = normalizeUrl(input.url);

      const duplicate = await ctx.db.socialSubmission.findUnique({
        where: { urlNormalized: normalizedUrl },
        select: { id: true },
      });
      if (duplicate) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This post has already been submitted.",
        });
      }

      const submission = await ctx.db.socialSubmission.create({
        data: {
          userId,
          platform: prismaPlatformByService[input.platform],
          originalUrl: input.url,
          urlNormalized: normalizedUrl,
          requiredKeywords: [...ALLOWED_KEYWORDS],
          missingKeywords: [],
          matchedKeywords: [],
          lastAttemptAt: new Date(),
        },
      });

      startVerification(submission.id, ctx.db);

      return {
        id: submission.id,
        status: "verifying" as const,
        creditsAwarded: 0,
      };
    }),

  listSubmissions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const submissions = await ctx.db.socialSubmission.findMany({
      where: { userId },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    return submissions.map((submission) => {
      const totalEngagement = calculateEngagementTotal(
        submission.likes,
        submission.comments,
        submission.shares,
      );
      const platformKey = submission.platform as PrismaPlatform;
      const platform = servicePlatformByPrisma[platformKey];

      return {
        id: submission.id,
        platform,
        status: formatStatus(submission.status as PrismaStatus),
        originalUrl: submission.originalUrl,
        urlNormalized: submission.urlNormalized,
        likes: submission.likes,
        comments: submission.comments,
        shares: submission.shares,
        totalEngagement,
        creditAwarded: submission.creditAwarded,
        creditPenalty: submission.creditPenalty,
        rescanCount: submission.rescanCount,
        matchedKeywords: submission.matchedKeywords,
        missingKeywords: submission.missingKeywords,
        postText: submission.postText,
        verifiedAt: submission.verifiedAt,
        lastAttemptAt: submission.lastAttemptAt,
        createdAt: submission.createdAt,
        errorMessage: submission.errorMessage,
      };
    });
  }),

  metrics: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const [verifying, validated, rejected, creditSums, user] =
      await ctx.db.$transaction([
        ctx.db.socialSubmission.count({
          where: { userId, status: "VERIFYING" },
        }),
        ctx.db.socialSubmission.count({
          where: { userId, status: "VALIDATED" },
        }),
        ctx.db.socialSubmission.count({
          where: { userId, status: { in: rejectedStatuses } },
        }),
        ctx.db.socialSubmission.aggregate({
          where: { userId },
          _sum: { creditAwarded: true, creditPenalty: true },
        }),
        ctx.db.user.findUnique({
          where: { id: userId },
          select: { creditConsumed: true },
        }),
      ]);

    const creditsAwarded =
      (creditSums._sum.creditAwarded ?? 0) -
      (creditSums._sum.creditPenalty ?? 0);
    const creditConsumed = user?.creditConsumed ?? 0;
    const totalCredits = creditsAwarded - creditConsumed;

    return {
      verifying,
      validated,
      rejected,
      totalCredits: Math.max(totalCredits, 0),
    };
  }),
} satisfies TRPCRouterRecord;
