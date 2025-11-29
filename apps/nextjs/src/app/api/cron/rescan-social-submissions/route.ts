import type { NextRequest } from "next/server";

import { rescanSubmission } from "@sassy/api";
import { db } from "@sassy/db";

export const dynamic = "force-dynamic";

const BATCH_SIZE = 50;

/**
 * Vercel Cron Job handler that rescans all social submissions to update
 * engagement metrics and award credits for engagement growth.
 *
 * This route is meant to be invoked by Vercel's scheduled function once per day
 * (see `vercel.json`).
 *
 * Security: Vercel automatically attaches the header
 *   Authorization: Bearer <CRON_SECRET>
 * when `CRON_SECRET` is configured in the project. We verify that
 * header to prevent public access.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedHeader = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedHeader) {
    console.warn("[rescan-social-submissions] Unauthorized invocation", {
      received: authHeader ? "present" : "missing",
    });
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("[rescan-social-submissions] Cron invocation started");

  try {
    let cursor: string | undefined;
    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    let hasMore = true;

    while (hasMore) {
      // Fetch batch of submissions
      const submissions = await db.socialSubmission.findMany({
        take: BATCH_SIZE,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: "asc" },
        select: { id: true },
      });

      if (submissions.length === 0) {
        hasMore = false;
        break;
      }

      // Process each submission in the batch
      for (const submission of submissions) {
        try {
          const result = await rescanSubmission(submission.id, db);
          if (result.success) {
            succeeded++;
          } else {
            failed++;
            console.error(
              `[rescan-social-submissions] Failed to rescan submission ${submission.id}:`,
              result.error,
            );
          }
          processed++;
        } catch (error) {
          failed++;
          processed++;
          console.error(
            `[rescan-social-submissions] Error rescanning submission ${submission.id}:`,
            error,
          );
        }
      }

      // Update cursor for next batch
      if (submissions.length < BATCH_SIZE) {
        hasMore = false;
      } else {
        cursor = submissions[submissions.length - 1]?.id;
      }

      console.log(
        `[rescan-social-submissions] Processed batch: ${processed} total (${succeeded} succeeded, ${failed} failed)`,
      );
    }

    console.log(
      `[rescan-social-submissions] Rescan completed. Processed: ${processed}, Succeeded: ${succeeded}, Failed: ${failed}`,
    );

    return Response.json({
      success: true,
      processed,
      succeeded,
      failed,
    });
  } catch (error) {
    console.error("[rescan-social-submissions] Error during rescan", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
