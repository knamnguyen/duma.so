import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { activityCreateSchema, activityListSchema } from "@sassy/validators";

import { protectedProcedure, publicProcedure } from "../trpc";
import { fetchUnsplashImages } from "../utils/unsplash";

export const activityRouter = {
  /**
   * Create a new activity
   * Fetches images from Unsplash based on activity name + tags
   */
  create: protectedProcedure
    .input(activityCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      try {
        // Combine keywords for Unsplash search
        const keywords = `${input.name} ${input.tags.join(" ")}`;

        // Fetch images from Unsplash (should return 15 photos)
        const imageUrls = await fetchUnsplashImages(keywords);

        // Extract coverPhoto (first URL) and imageUrls (rest for gallery/Previous Sessions)
        // Frontend expects activityPhotos array - we'll map imageUrls to activityPhotos in Phase 3
        const coverPhoto =
          imageUrls[0] ??
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800";
        const remainingImages = imageUrls.slice(1);

        // Ensure we have at least a few photos for the gallery (Previous Sessions section)
        // If Unsplash didn't return enough, log a warning
        if (remainingImages.length < 2) {
          console.warn(
            `Only ${remainingImages.length} photos returned for activity gallery. Expected at least 2-3.`,
          );
        }

        // Map input type to Prisma enum (lowercase to uppercase)
        const activityType = input.type.toUpperCase() as
          | "WORKDATE"
          | "STUDYDATE"
          | "HANGOUT"
          | "SPORTS"
          | "EVENT"
          | "OTHER";

        // Create activity
        const activity = await ctx.db.activity.create({
          data: {
            hostId: ctx.user.id,
            type: activityType,
            name: input.name,
            description: input.description,
            tags: input.tags,
            dateTime: input.dateTime,
            location: input.location,
            coverPhoto,
            imageUrls: remainingImages,
          },
          include: {
            host: true,
          },
        });

        return activity;
      } catch (error) {
        console.error("Error creating activity:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create activity",
          cause: error,
        });
      }
    }),

  /**
   * List activities for SwipeFeed
   * Returns future activities ordered by date
   * Public - anyone can view activities
   */
  list: publicProcedure
    .input(activityListSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const now = new Date();
        const limit = input?.limit ?? 50;

        const activities = await ctx.db.activity.findMany({
          where: {
            dateTime: {
              gte: now,
            },
            ...(input?.type && {
              type: input.type.toUpperCase() as
                | "WORKDATE"
                | "STUDYDATE"
                | "HANGOUT"
                | "SPORTS"
                | "EVENT"
                | "OTHER",
            }),
          },
          orderBy: [
            {
              createdAt: "desc", // Newest created first
            },
            {
              dateTime: "asc", // Then by date/time for same creation time
            },
          ],
          take: limit,
          include: {
            host: true,
          },
        });

        return activities;
      } catch (error) {
        console.error("Error listing activities:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list activities",
          cause: error,
        });
      }
    }),

  /**
   * Get activity by ID (for future use)
   */
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const activity = await ctx.db.activity.findUnique({
          where: {
            id: input.id,
          },
          include: {
            host: true,
            participants: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!activity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Activity not found",
          });
        }

        return activity;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error fetching activity by ID:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch activity",
          cause: error,
        });
      }
    }),
} satisfies TRPCRouterRecord;
