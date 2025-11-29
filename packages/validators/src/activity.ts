import { z } from "zod";

export const activityCreateSchema = z.object({
  type: z.enum([
    "workdate",
    "studydate",
    "hangout",
    "sports",
    "event",
    "other",
  ]),
  name: z.string().min(3).max(100), // Activity name
  description: z.string().min(10).max(500),
  tags: z.array(z.string().min(1).max(30)).min(1).max(10), // User-entered tags
  dateTime: z.date().refine((date) => date > new Date(), {
    message: "Activity date must be in the future",
  }),
  location: z.string().min(1).max(200), // Location name or address
});

export const activityListSchema = z.object({
  type: z
    .enum(["workdate", "studydate", "hangout", "sports", "event", "other"])
    .optional(),
  limit: z.number().int().min(1).max(100).default(50).optional(),
});
