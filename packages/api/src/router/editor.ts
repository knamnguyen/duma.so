import type { TRPCRouterRecord } from "@trpc/server";
import GIFEncoder from "gif-encoder-2";
import Jimp from "jimp";
import fetch from "node-fetch";
import { z } from "zod";

import { getPublicUrl, uploadPublic } from "@sassy/supabase-bucket";

import type { GifStyle } from "../motion-spec";
import { MOTION, samplePhotoMovement, sampleTransform } from "../motion-spec";
import { protectedProcedure, publicProcedure } from "../trpc";
import { applyStrokeToJimpImage } from "../utils/jimp-stroke";

const BUCKETS = {
  uploads: "user-uploads",
  bgRemoved: "user-background-removed",
  results: "user-results",
} as const;

const dataUrlSchema = z.string().startsWith("data:");

export const editorRouter = {
  uploadStart: protectedProcedure
    .input(
      z.object({
        dataUrl: dataUrlSchema,
        mime: z.enum(["image/png", "image/jpeg", "image/webp"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;

      // Check and deduct credits atomically
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { creditConsumed: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Calculate available credits
      const creditSums = await ctx.db.socialSubmission.aggregate({
        where: { userId },
        _sum: { creditAwarded: true, creditPenalty: true },
      });
      const creditsAwarded =
        (creditSums._sum.creditAwarded ?? 0) -
        (creditSums._sum.creditPenalty ?? 0);
      const availableCredits = creditsAwarded - (user.creditConsumed ?? 0);

      if (availableCredits < 1) {
        throw new Error(
          "Insufficient credits. Each new project costs 1 credit. You can still generate unlimited gif avatars in your existing projects.",
        );
      }

      const base64 = input.dataUrl.split(",")[1] ?? "";
      const original = Buffer.from(base64, "base64");

      // Re-encode to keep under bucket limits (compress & bound dimensions)
      //no need for now so comment out
      let outBuf = original;

      const ext =
        input.mime === "image/png" || input.mime === "image/webp"
          ? "png"
          : "jpg";
      const path = `${userId}/original/${crypto.randomUUID()}.${ext}`;
      const { url } = await uploadPublic({
        bucket: BUCKETS.uploads,
        path,
        data: outBuf,
        contentType: ext === "png" ? "image/png" : "image/jpeg",
      });

      // Create upload and increment creditConsumed atomically
      const upload = await ctx.db.$transaction(async (tx) => {
        const createdUpload = await tx.userUpload.create({
          data: { userId, path, mime: input.mime },
        });
        await tx.user.update({
          where: { id: userId },
          data: { creditConsumed: { increment: 1 } },
        });
        return createdUpload;
      });

      return { path, url, id: upload.id };
    }),

  removeBackground: protectedProcedure
    .input(z.object({ uploadPath: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;

      // Find the upload record to get its id (for sourceUploadId)
      const upload = await ctx.db.userUpload.findFirst({
        where: { userId, path: input.uploadPath },
      });
      if (!upload) {
        throw new Error("Upload not found");
      }

      const srcUrl = getPublicUrl({
        bucket: BUCKETS.uploads,
        path: input.uploadPath,
      });
      // Fetch model metadata to get the default version id (required by Replicate API)
      const modelMetaResp = await fetch(
        "https://api.replicate.com/v1/models/lucataco/remove-bg",
        {
          headers: {
            Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          },
        },
      );
      if (!modelMetaResp.ok) {
        const txt = await modelMetaResp.text();
        throw new Error(`replicate model meta failed: ${txt}`);
      }
      const modelMeta = (await modelMetaResp.json()) as any;
      let versionId: string | undefined =
        modelMeta?.latest_version?.id || modelMeta?.default_version?.id;
      // Fallback: list versions and take the first
      if (!versionId) {
        const versionsResp = await fetch(
          "https://api.replicate.com/v1/models/lucataco/remove-bg/versions",
          {
            headers: {
              Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            },
          },
        );
        if (!versionsResp.ok) {
          const txt = await versionsResp.text();
          throw new Error(`replicate versions failed: ${txt}`);
        }
        const versions = (await versionsResp.json()) as any;
        versionId = versions?.results?.[0]?.id;
      }
      if (!versionId) throw new Error("replicate version id not resolved");

      // Create prediction using the default version id
      const createResp = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          },
          body: JSON.stringify({
            version: versionId,
            input: { image: srcUrl },
          }),
        },
      );
      if (!createResp.ok) {
        const txt = await createResp.text();
        throw new Error(`replicate create failed: ${txt}`);
      }
      const created = (await createResp.json()) as any;
      const id = created?.id as string | undefined;
      if (!id) throw new Error("replicate id missing");

      let outPng: Buffer | null = null;
      for (let i = 0; i < 40; i++) {
        const poll = await fetch(
          `https://api.replicate.com/v1/predictions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            },
          },
        );
        const body = (await poll.json()) as any;
        const status = body?.status as string;
        if (status === "succeeded") {
          const out = Array.isArray(body.output) ? body.output[0] : body.output;
          if (typeof out === "string" && out.startsWith("http")) {
            const outR = await fetch(out);
            outPng = Buffer.from(await outR.arrayBuffer());
          }
          break;
        }
        if (status === "failed" || status === "canceled") {
          throw new Error(`replicate status: ${status}`);
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!outPng) throw new Error("rembg output not found");
      const outPath = `${userId}/bg-removed/${crypto.randomUUID()}.png`;
      const { url } = await uploadPublic({
        bucket: BUCKETS.bgRemoved,
        path: outPath,
        data: outPng,
        contentType: "image/png",
      });
      await ctx.db.backgroundRemoved.create({
        data: { userId, sourceUploadId: upload.id, path: outPath },
      });
      return { path: outPath, url };
    }),

  // NOTE: We are prioritizing client-side DOM capture method (capturePreviewAsGif)
  // over server-side generation for better visual parity with preview.
  // This server-side method is kept for reference/fallback but is currently unused.
  generateGif: protectedProcedure
    .input(
      z.object({
        bgRemovedPath: z.string(),
        animationStyle: z
          .object({
            photoMovement: z
              .enum([
                "rise",
                "pan",
                "fade",
                "pop",
                "wipe",
                "blur",
                "succession",
                "breathe",
                "baseline",
                "drift",
                "tectonic",
                "tumble",
                "neon",
                "scrapbook",
                "stomp",
              ])
              .nullable(),
            addOnEffect: z
              .enum(["rotate", "flicker", "pulse", "wiggle"])
              .nullable(),
          })
          .optional()
          .default({
            photoMovement: "rise",
            addOnEffect: null,
          }),
        bgColor: z.string().default("#ffffff"),
        transformConfig: z
          .object({
            positionX: z.number().min(-50).max(50).default(0),
            positionY: z.number().min(-50).max(50).default(0),
            zoom: z.number().min(0.1).max(10).default(1),
            rotate: z.number().min(-180).max(180).default(0),
            enableStillFrame: z.boolean().default(true),
            gifSize: z.number().min(50).max(500).default(200),
            animationDuration: z.number().min(0.5).max(10).default(5.5),
          })
          .optional()
          .default({
            positionX: 0,
            positionY: 0,
            zoom: 1,
            rotate: 0,
            enableStillFrame: true,
            gifSize: 200,
            animationDuration: 5.5,
          }),
        strokeConfig: z
          .object({
            enabled: z.boolean(),
            weight: z.number().min(0).max(50),
            color: z.string(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const cutoutUrl = getPublicUrl({
        bucket: BUCKETS.bgRemoved,
        path: input.bgRemovedPath,
      });
      const cutoutResp = await fetch(cutoutUrl);
      const cutoutBuf = Buffer.from(await cutoutResp.arrayBuffer());

      // Extract transform config from input
      const transformConfig = input.transformConfig ?? {
        positionX: 0,
        positionY: 0,
        zoom: 1,
        rotate: 0,
        enableStillFrame: true,
        gifSize: 200,
        animationDuration: 5.5,
      };
      // Debug: Log transform config to verify values are received
      console.log(
        "[generateGif] transformConfig:",
        JSON.stringify(transformConfig, null, 2),
      );
      console.log(
        "[generateGif] animationStyle:",
        JSON.stringify(input.animationStyle ?? null),
      );
      const {
        positionX,
        positionY,
        zoom,
        rotate,
        enableStillFrame,
        gifSize,
        animationDuration,
      } = transformConfig;

      // Use custom dimensions (square)
      const width = gifSize;
      const height = gifSize;
      const { fps } = MOTION;
      // Use custom animation duration instead of MOTION.durationSeconds
      const durationSeconds = animationDuration;

      // Calculate still frames count if enabled
      const stillFrames = enableStillFrame ? Math.round(fps * 0.5) : 0; // 0.5 seconds
      const animationFrames = Math.round(fps * durationSeconds);
      const totalFrames = animationFrames + stillFrames;

      const encoder = new GIFEncoder(width, height);
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(Math.round(1000 / fps));
      encoder.setQuality(10);

      // Prepare cutout image once
      let baseCutout = await Jimp.read(cutoutBuf);
      // Fit within frame size preserving aspect ratio (matching CSS object-contain behavior)
      // This ensures the image fits within the frame like the preview does
      baseCutout.contain(width, height);

      // Pre-transform base image: Apply static zoom
      // Scale from the contained size, maintaining aspect ratio
      if (zoom !== 1) {
        const currentWidth = baseCutout.bitmap.width;
        const currentHeight = baseCutout.bitmap.height;
        const newWidth = Math.round(currentWidth * zoom);
        const newHeight = Math.round(currentHeight * zoom);
        // Use Jimp.AUTO to maintain aspect ratio (redundant but safe)
        baseCutout.resize(newWidth, newHeight);
      }

      // Apply stroke if configured (after zoom, so stroke weight is in output pixel space)
      if (input.strokeConfig?.enabled && input.strokeConfig.weight > 0) {
        baseCutout = await applyStrokeToJimpImage(
          baseCutout,
          input.strokeConfig,
        );
      }

      // Calculate position offsets from percentage
      const offsetX = (positionX / 100) * (width / 2);
      const offsetY = (positionY / 100) * (height / 2);

      // Convert animationStyle for server rendering
      let legacyStyle: GifStyle = "rise-bottom"; // default fallback
      const photoMovement = input.animationStyle?.photoMovement;
      if (photoMovement === "rise") {
        legacyStyle = "rise-bottom";
      } else if (photoMovement === "pan") {
        // Pan maps to horizontal slide: left if positionX < 0, right otherwise
        legacyStyle = positionX < 0 ? "rise-left" : "rise-right";
      }
      // Extended styles supported by the new sampler
      const supportedExtended = new Set([
        "rise",
        "pan",
        "drift",
        "baseline",
        "stomp",
        "pop",
        "fade",
      ]);
      const useExtended =
        photoMovement && supportedExtended.has(photoMovement as string);

      // Generate still frames if enabled (no animation, just static transforms)
      for (let i = 0; i < stillFrames; i++) {
        const frame = await new Jimp(
          width,
          height,
          Jimp.cssColorToHex(input.bgColor),
        );
        const cut = baseCutout.clone();
        // Apply static rotation to still frames
        if (rotate !== 0) {
          cut.rotate(rotate);
        }
        const cutW = cut.bitmap.width;
        const cutH = cut.bitmap.height;
        const x = Math.round((width - cutW) / 2 + offsetX);
        const y = Math.round((height - cutH) / 2 + offsetY);
        frame.composite(cut, x, y);
        // Jimp stores RGBA in bitmap.data
        encoder.addFrame(new Uint8ClampedArray(frame.bitmap.data));
      }

      // Generate animation frames
      // If we rendered manual still frames, offset time to skip sampleTransform's internal still
      // This prevents double-still (manual 0.5s + sampleTransform's internal 0.5s)
      const timeOffset = enableStillFrame ? MOTION.stillSeconds : 0;
      for (let i = 0; i < animationFrames; i++) {
        const t = i / fps + timeOffset;
        // Choose sampler
        const trLegacy = sampleTransform(legacyStyle, t, durationSeconds);
        const trExt = useExtended
          ? samplePhotoMovement(photoMovement as string, t, durationSeconds)
          : null;
        // Resolve transform values
        const trX =
          trExt?.x !== undefined
            ? // For pan, honor direction based on positionX sign
              photoMovement === "pan"
              ? positionX < 0
                ? -Math.abs(trExt.x)
                : Math.abs(trExt.x)
              : trExt.x
            : trLegacy.x;
        const trY = trExt?.y !== undefined ? trExt.y : trLegacy.y;
        const trRotate =
          trExt?.rotate !== undefined ? trExt.rotate : trLegacy.rotate;
        const trScale = trExt?.scale ?? 1;
        const trOpacity = trExt?.opacity ?? 1;
        const frame = await new Jimp(
          width,
          height,
          Jimp.cssColorToHex(input.bgColor),
        );
        // Clone and apply rotation (static rotation + animation rotation combined)
        const cut = baseCutout.clone();
        // Apply scale first if present
        if (trScale && trScale !== 1) {
          const cw = cut.bitmap.width;
          const ch = cut.bitmap.height;
          cut.resize(
            Math.max(1, Math.round(cw * trScale)),
            Math.max(1, Math.round(ch * trScale)),
          );
        }
        const totalRotate = rotate + trRotate; // Combine static and animation rotation
        if (totalRotate !== 0) {
          cut.rotate(totalRotate);
        }
        // Apply opacity if provided
        if (trOpacity !== 1) {
          cut.opacity(Math.max(0, Math.min(1, trOpacity)));
        }
        const cutW = cut.bitmap.width;
        const cutH = cut.bitmap.height;
        // Apply position offsets along with animation transforms
        const x = Math.round((width - cutW) / 2 + trX + offsetX);
        const y = Math.round((height - cutH) / 2 + trY + offsetY);
        frame.composite(cut, x, y);
        // Jimp stores RGBA in bitmap.data
        encoder.addFrame(new Uint8ClampedArray(frame.bitmap.data));
      }
      encoder.finish();
      const gifBuffer = Buffer.from(encoder.out.getData());

      const outPath = `${userId}/results/${crypto.randomUUID()}.gif`;
      const { url } = await uploadPublic({
        bucket: BUCKETS.results,
        path: outPath,
        data: gifBuffer,
        contentType: "image/gif",
      });

      // Find the bgRemoved record to get sourceUploadId (project identifier)
      const bgRemoved = await ctx.db.backgroundRemoved.findFirst({
        where: { userId, path: input.bgRemovedPath },
      });
      if (!bgRemoved) {
        throw new Error("Background removed image not found");
      }
      const sourceUploadId = bgRemoved.sourceUploadId;

      await ctx.db.userResult.create({
        data: { userId, path: outPath, sourceUploadId },
      });
      return { path: outPath, url };
    }),

  // Save client-captured GIF (from DOM capture) to userResults
  saveCapturedGif: protectedProcedure
    .input(
      z.object({
        dataUrl: z.string().startsWith("data:image/gif"),
        projectId: z.string(), // uploadId
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;

      // Convert dataUrl to buffer
      const base64 = input.dataUrl.split(",")[1] ?? "";
      const gifBuffer = Buffer.from(base64, "base64");

      // Upload to Supabase bucket
      const outPath = `${userId}/results/${crypto.randomUUID()}.gif`;
      const { url } = await uploadPublic({
        bucket: BUCKETS.results,
        path: outPath,
        data: gifBuffer,
        contentType: "image/gif",
      });

      // Find the upload to get sourceUploadId (project identifier)
      const upload = await ctx.db.userUpload.findFirst({
        where: { userId, id: input.projectId },
      });
      if (!upload) {
        throw new Error("Project not found or access denied");
      }
      const sourceUploadId = upload.id;

      // Create userResult record
      const result = await ctx.db.userResult.create({
        data: { userId, path: outPath, sourceUploadId },
      });

      return { path: outPath, url, id: result.id };
    }),

  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const uploadId = input.projectId;

      // Verify ownership by finding upload by id
      const upload = await ctx.db.userUpload.findFirst({
        where: { userId, id: uploadId },
      });
      if (!upload) {
        throw new Error("Project not found or access denied");
      }

      // Get latest background removed for this project
      const backgroundRemovedLatest = await ctx.db.backgroundRemoved.findFirst({
        where: {
          sourceUploadId: upload.id,
        },
        orderBy: { createdAt: "desc" },
      });

      // Get all results for this project
      const results = await ctx.db.userResult.findMany({
        where: {
          sourceUploadId: upload.id,
        },
        orderBy: { createdAt: "desc" },
      });

      // Build public URLs
      const uploadUrl = getPublicUrl({
        bucket: BUCKETS.uploads,
        path: upload.path,
      });
      const bgRemovedUrl = backgroundRemovedLatest
        ? getPublicUrl({
            bucket: BUCKETS.bgRemoved,
            path: backgroundRemovedLatest.path,
          })
        : null;
      const resultUrls = results.map((r) =>
        getPublicUrl({
          bucket: BUCKETS.results,
          path: r.path,
        }),
      );

      return {
        upload: {
          ...upload,
          url: uploadUrl,
        },
        backgroundRemovedLatest: backgroundRemovedLatest
          ? {
              ...backgroundRemovedLatest,
              url: bgRemovedUrl!,
            }
          : null,
        results: results.map((r, i) => ({
          ...r,
          url: resultUrls[i]!,
        })),
      };
    }),

  listProjects: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const uploads = await ctx.db.userUpload.findMany({
        where: {
          userId,
          ...(input.cursor
            ? {
                createdAt: {
                  lt: new Date(input.cursor),
                },
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
      });

      const hasMore = uploads.length > input.limit;
      const items = (hasMore ? uploads.slice(0, -1) : uploads).map(
        (upload) => ({
          upload,
          coverUrl: getPublicUrl({
            bucket: BUCKETS.uploads,
            path: upload.path,
          }),
        }),
      );

      return {
        items,
        nextCursor: hasMore
          ? uploads[uploads.length - 1]!.createdAt.toISOString()
          : undefined,
      };
    }),

  listProjectResults: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const uploadId = input.projectId;
      // Verify ownership
      const upload = await ctx.db.userUpload.findFirst({
        where: { userId, id: uploadId },
      });
      if (!upload) {
        throw new Error("Project not found or access denied");
      }

      const results = await ctx.db.userResult.findMany({
        where: { userId, sourceUploadId: upload.id },
        orderBy: { createdAt: "desc" },
      });

      return {
        results: results.map((r) => ({
          ...r,
          url: getPublicUrl({
            bucket: BUCKETS.results,
            path: r.path,
          }),
        })),
      };
    }),

  listAssets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;
    const [uploads, bg, results] = await Promise.all([
      ctx.db.userUpload.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      ctx.db.backgroundRemoved.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      ctx.db.userResult.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);
    return { uploads, backgroundRemoved: bg, results };
  }),

  listAllUserResults: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;
    const results = await ctx.db.userResult.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return {
      results: results.map((r) => ({
        ...r,
        url: getPublicUrl({
          bucket: BUCKETS.results,
          path: r.path,
        }),
      })),
    };
  }),

  listCommunityResults: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.userResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return {
      results: results.map((r) => ({
        id: r.id,
        url: getPublicUrl({
          bucket: BUCKETS.results,
          path: r.path,
        }),
        createdAt: r.createdAt,
      })),
    };
  }),
} satisfies TRPCRouterRecord;
