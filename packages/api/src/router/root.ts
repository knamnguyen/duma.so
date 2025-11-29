import { createTRPCRouter } from "../trpc";
import { activityRouter } from "./activity";
import { editorRouter } from "./editor";
import { socialRouter } from "./social";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  user: userRouter,
  editor: editorRouter,
  social: socialRouter,
  activity: activityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
