Repository Context

- Scanned at: 2025-11-06T00:00:00Z
- Repo HEAD: 8835d1809eaa21e3822ec4ea8536f218ab0da099
- Mode: Full Scan

Product & PRD Context

- Overview: Gifavatr lets users upload a personal photo and generate animated GIF avatars they can use on Google account profiles and platforms like Linktree, Beacons, Pixiv, dev.to, Fandom, MyAnimeList, Medium, Substack, VGen, Discord, and Patreon. Emphasis on built‑in virality: users can generate shareable assets and verify social referrals (via X/Twitter/Threads/Facebook/LinkedIn keyword checks) to encourage organic growth.
- Goals & Success Metrics:
  - Increase completed GIF generations per active user
  - Successful background removals (Replicate) without retries
  - Asset shares/uses across external profiles
  - Verified referral posts (keywords matched) and referral conversions
- Scope:
  - In-scope: Clerk auth, image upload and re‑encode, background removal with Replicate, GIF generation and storage on Supabase, recent-asset listing, social referral keyword verification (X/Twitter/Threads/Facebook/LinkedIn via Apify and other providers).
  - Out-of-scope (now): Stripe billing and Loops marketing flows (present in codebase, not needed by product now).
- Features Catalog (MoSCoW):
  - Must
    - GIF-001: Upload avatar (re-encode/compress)
    - GIF-002: Background removal (Replicate rembg)
    - GIF-003: GIF generation (rise-bottom | rise-left | rise-right)
    - GIF-004: Asset listing (uploads, background-removed, results)
    - AUTH-001: Clerk auth and protected routes
    - STORE-001: Supabase storage with public URLs
  - REF-001: Verify social post keywords (X, Threads, Facebook, LinkedIn via Apify)
  - Must: Store social submissions and surface live referral dashboard data (submitPost, listSubmissions, metrics)
  - Should: Basic UI previews, theme, simple share UX
  - Could: Additional animation styles, quotas/limits
  - Won’t (now): Subscriptions/portal (Stripe)
- User Journeys & Data Flow:

```text
1) Upload
Client -> tRPC editor.uploadStart
  - Data URL (png/jpeg/webp) -> re-encode (Jimp)
  - Supabase storage upload (server key) -> public URL
  - DB: UserUpload { userId, path, mime }

2) Background removal
Client -> tRPC editor.removeBackground(uploadPath)
  - Resolve public URL
  - Replicate: fetch model meta -> create prediction -> poll -> download PNG
  - Supabase storage upload (png) -> public URL
  - DB: BackgroundRemoved { userId, sourceUploadId, path }

3) GIF generation
Client -> tRPC editor.generateGif(bgRemovedPath, style, bgColor)
  - Load cutout -> per-frame Jimp composites using sampleTransform
  - Encode with gif-encoder-2
  - Supabase storage upload (gif) -> public URL
  - DB: UserResult { userId, path }

4) Listing assets
Client -> tRPC editor.listAssets
  - Return last N of uploads, backgroundRemoved, results

5) Referral verification
Client -> tRPC social.verifyKeywords(url, keywords, platform?)
  - Platforms: X (Twitter), Threads, Facebook, LinkedIn (Apify actors) -> dataset -> extract post text -> keyword match
  - Auto-detection: Platform determined from URL if not explicitly provided
```

- Architecture Decisions (highlights):
  - API via tRPC v11 with Clerk auth middleware; supports Next.js and chrome-extension via x-trpc-source + Clerk backend verification
  - PostgreSQL (Supabase) with Prisma 6; node and edge clients generated; zod-prisma-types produces validators
  - Domain services co-located as packages: `@sassy/supabase-bucket`, `@sassy/social-referral` (and `@sassy/stripe` currently unused)
  - Next.js 15 (App Router), React 19, Tailwind v4 with shared presets (`@sassy/tailwind-config`)
  - Monorepo env pattern via `with-env` (dotenv-cli) to load root .env from packages
  - Legacy branding: some files reference "EngageKit"; product name is Gifavatr
  - **Project Identity Pattern**: Projects in the editor system are identified by `UserUpload.id` (cuid), not by upload paths. This provides clean, short URLs (e.g., `/editor/cmhwt13am0004bqe5suyce2lc` instead of long base64-encoded paths), direct database lookups by primary key (faster), and no encoding/decoding complexity needed (cuid is already URL-safe). The `sourceUploadId` field in `BackgroundRemoved` and `UserResult` stores the `UserUpload.id` to link assets to projects.
- API Surface (tRPC):
  - editor (packages/api/src/router/editor.ts):
    - uploadStart, removeBackground, generateGif, listAssets
    - getProject(projectId: string) → { upload, backgroundRemovedLatest, results, defaults } - Loads project by UserUpload.id with all related assets
    - listProjects({ limit?, cursor? }) → { items: Array<{ upload, coverUrl }>, nextCursor? } - Lists user's projects with cover images
    - listProjectResults(projectId: string) → { results: UserResult[] } - Lists all GIF generations for a project
    - updateProjectDefaults(projectId: string, style?, bgColor?) → { ok: true } - Persists editor preferences per project
  - user (packages/api/src/router/user.ts): checkAccess, getDailyCommentCount, create, update, delete, me
- social (packages/api/src/router/social.ts):
  - `submitPost` – stores submission (duplicates blocked globally), triggers background verification via `SocialReferralService`, awards +3 credits when any allowed keyword matches (`gifavatar`, `gifavatar.app`, `gifavatar[dot]app`)
  - `listSubmissions` – latest 50 submissions for current user with engagement counts, credit totals, status, failure reasons
  - `metrics` – aggregates verifying/validated/rejected counts plus net credits per user
  - Returns: `{ platform, url, text, containsAll, missingKeywords, matchedKeywords, likes, comments, shares }`
  - Engagement metrics (likes/comments/shares) fully implemented 2025-11-07; parses actual counts from all four platforms with graceful zero fallbacks
  - URL formats supported:
    - X: `https://x.com/user/status/[ID]` or `https://twitter.com/user/status/[ID]`
    - Threads: `https://www.threads.com/@user/post/[ID]`
    - Facebook: `https://www.facebook.com/share/p/[ID]` (posts), `https://www.facebook.com/share/v/[ID]` (videos), `https://www.facebook.com/reel/[ID]` (reels - added 2025-11-08)
    - LinkedIn: `https://www.linkedin.com/posts/user_post-activity-[ID]`
  - Execution time benchmarks (for UI polling/countdown implementation):
    - X: ~17s average
    - Threads: ~17s average (note: some post IDs may have Apify actor instability)
    - Facebook: ~78s average (significantly longer due to actor processing)
    - LinkedIn: ~10s average
  - stripe (packages/api/src/router/stripe.ts): createCheckout, createCustomerPortal, checkAccess [present, not used now]
- Schemas Snapshot (Prisma: packages/db/prisma/schema.prisma):
  - User { id, firstName?, lastName?, username?, primaryEmailAddress, imageUrl?, clerkUserProperties?, stripeCustomerId?, accessType, stripeUserProperties?, dailyAIcomments, createdAt, updatedAt }
  - UserUpload { id (cuid), userId, path, mime, defaultStyle?, defaultBgColor?, createdAt } - Note: `defaultStyle` and `defaultBgColor` persist last-used editor preferences per project
  - BackgroundRemoved { id (cuid), userId, sourceUploadId, path, createdAt } - Note: `sourceUploadId` stores `UserUpload.id` to link to project
  - UserResult { id (cuid), userId, path, sourceUploadId?, createdAt } - Note: `sourceUploadId` is nullable for backward compatibility with existing records; new records always populate it with `UserUpload.id`
  - SocialSubmission { id, userId, platform, originalUrl, urlNormalized, status, requiredKeywords, matchedKeywords, missingKeywords, engagement metrics, creditAwarded, creditPenalty, rescanCount, verifiedAt, lastAttemptAt, errorMessage, createdAt, updatedAt }

Tech Stack Overview

| Area     | Technology                                                         | Version/Source                             |
| -------- | ------------------------------------------------------------------ | ------------------------------------------ |
| App      | Next.js                                                            | ^15.2.x (apps/nextjs)                      |
| UI       | React                                                              | 19.x                                       |
| Styling  | Tailwind CSS                                                       | ^4.1.8 with shared presets                 |
| API      | tRPC                                                               | v11 (server), SuperJSON                    |
| Auth     | Clerk                                                              | @clerk/nextjs                              |
| DB       | Prisma                                                             | ^6.8.x + PostgreSQL (Supabase)             |
| Storage  | Supabase Storage                                                   | @supabase/supabase-js ^2.45.x              |
| Media    | Jimp, gif-encoder-2, gif.js, html-to-image, motion (framer-motion) | ^0.22.x, ^1.0.x, ^0.2.x, ^1.11.x, ^12.23.x |
| AI       | Replicate                                                          | REST API                                   |
| Referral | Apify Client                                                       | ^2.10.x                                    |
| Tooling  | Turborepo, pnpm, TypeScript                                        | turbo ^2.3.x, pnpm 10.x, TS 5.7.x          |

Monorepo Layout

- apps/nextjs: Next.js 15 App Router application (UI + API routes integration)
- `apps/nextjs/src/app/page.tsx`: Dashboard/homepage (root route `/`) with project cards, community previews, and creation flow. Previously at `/dashboard`, now migrated to root.
- `src/app/social-referral/page.tsx`: live Referral Dashboard using tRPC queries/mutations (no mocks). Users submit posts, trigger verification, view metrics/history with loading and empty states, and download GIF previews.
- `apps/nextjs/src/_components/app-header.tsx`: Site-wide navigation header component rendered in root layout (`app/layout.tsx`). Includes logo, navigation links (`/` and `/social-referral`), credit balance, create button, and user menu. Uses Next.js `<Link>` components for client-side navigation.
- `apps/nextjs/src/app/assets/logos/`: SVGR-ready SVG library (Gmail, LinkedIn, Facebook, Beacons, VGen, etc.) imported as React components; webpack/Turbopack load these with SVGR (icon mode disabled) to preserve multi-color fills.
- `apps/nextjs/src/app/_components/avatar-animations.ts`: Animation variant definitions for photo movements and add-on effects using motion library, with default duration constants and looping patterns
- `apps/nextjs/src/app/_components/animation-style-selector.tsx`: Canva-style animation selector component for choosing photo movement and add-on effect styles
- `apps/nextjs/src/app/_components/avatar-preview.tsx`: Avatar preview component with integrated motion animations, supports both legacy previewStyle and new animationStyle props
- packages/
  - @sassy/api: tRPC routers, context, server caller
  - @sassy/db: Prisma schema, generated node/edge clients, zod validators, db exports
  - @sassy/ui: UI components (shadcn-derived), theme, utils
  - @sassy/validators: shared Zod validators
  - @sassy/supabase-bucket: Supabase helpers (server/public clients, upload/getPublicUrl)
  - @sassy/social-referral: Social platform keyword verification (X, Threads, Facebook, LinkedIn via Apify; multi-platform detection with URL regex; engagement metrics extraction for likes, comments, shares)
  - @sassy/stripe: Stripe service and scripts (present, out-of-scope now)
- tooling/: eslint, prettier, tailwind, typescript, sync-template

Package Manager & Scripts

- Root uses pnpm + turbo. Notable scripts: build (turbo run), dev (turbo watch), postinstall (prisma generate + copy query engine to .next/server), db:\* scoped to @sassy/db
- with-env pattern (dotenv-cli) in packages needing env: loads ../../.env before running commands
- bun used for some scripts (e.g., social verification, stripe utilities)

TypeScript & Module Resolution

- Shared TS configs: tooling/typescript/base.json and internal-package.json
- Next alias: `~/*` → `apps/nextjs/src/*`
- Packages use export maps to source (JIT):
  - @sassy/api: "." → src/index.ts
  - @sassy/db: "." → src/index.ts; subpaths for generated/\* and schema-validators
  - @sassy/ui: subpaths `./ui/*`, `./components/*`, `./hooks/*`, `./utils`, `./schema-validators`, `./theme`
- Next `transpilePackages`: `@sassy/api`, `@sassy/db`, `@sassy/ui`, `@sassy/validators`

API & Backend

- tRPC server (`packages/api/src/trpc.ts`):
  - Context: { db, headers, user? }
  - Auth middleware supports Next.js (currentUser) and chrome-extension (Authorization Bearer token via Clerk backend/verifyToken)
  - `publicProcedure` and `protectedProcedure` exported
- Routers (`packages/api/src/router`): editor, user, social, stripe consolidated in root.ts as `appRouter`
- Next client/server integration (`apps/nextjs/src/trpc/*`):
  - react.tsx: TRPCProvider, batch streaming link, SuperJSON, client singleton
  - server.tsx: create server ctx with headers, options proxy, `HydrateClient`, `prefetch`

Database & Data Layer

- Prisma schema in `packages/db/prisma/schema.prisma`; generators for node, edge, and zod validators
- Datasource uses `DATABASE_URL` and `DIRECT_URL`; PostgreSQL extensions: uuid-ossp, vector
- `@sassy/db/src/index.ts` re-exports generated client, Prisma, and db helpers

Auth & Payments

- Clerk: `apps/nextjs/src/middleware.ts` protects non-public routes; `ClerkProvider` in layout
- Payments: Stripe package and router exist but are not required for Gifavatr currently

UI & Styling

- Tailwind v4 with shared config (`@sassy/tailwind-config`): `apps/nextjs/tailwind.config.ts` extends content with `../../packages/ui/src/**/*.{ts,tsx}`
- Global CSS (`apps/nextjs/src/app/globals.css`): `@import "tailwindcss"` and `@config '../../tailwind.config.ts'`; defines gif-rise animations and CSS variable theme
- shadcn/ui components in `@sassy/ui`; Theme and Toaster wired in app layout
- Dashboard visual baseline (Nov 2025):
  - Palette blends warm neutrals (#f6f1eb → #e9edf2) with selective Beacons pink accents (#ff6fae) and charcoal typography (#111827/#4a5562).
  - Buttons should use rounded-rectangle corners (no pills); primaries default to #ff6fae, secondary/outline buttons stick to neutral fills with subtle black/10 borders.
  - Surfaces favor light borders (black/5–black/10) and soft drop shadows (rgba(17,24,39,0.08–0.12)) to keep the Notion-like minimal depth.
  - Upload/gallery tiles lean on gentle gradient washes from the palette and uppercase metadata treatments to stay "fashionable inviting."
- Navigation & Layout: Site-wide navigation components (like `AppHeader`) should be rendered in the root layout (`app/layout.tsx`) inside provider wrappers (ClerkProvider, ThemeProvider, TRPCReactProvider) to ensure consistent navigation and access to auth/API context across all pages. Use Next.js `<Link>` components for client-side navigation instead of anchor tags.

Environment Variables

- Monorepo pattern: Packages use `with-env` (dotenv-cli) to load `../../.env`. Turbo `globalEnv` passes common keys.
- Required for current product:
  - Database: `DATABASE_URL`, `DIRECT_URL` (Prisma)
  - Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (client), `CLERK_SECRET_KEY` (server)
  - Supabase: `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (server); `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client)
  - Replicate: `REPLICATE_API_TOKEN`
  - Apify: `APIFY_API_TOKEN`
- Present but not required now: Stripe keys, Loops key

Env injection and build-safety guidance

- Do not read secrets in constructors inside domain packages. Constructors must be side‑effect free.
- Prefer injecting secrets at the API boundary (routers, handlers, or server-only factories), then pass them into domain services/verifiers.
- Validate secrets lazily at first use (for example inside `verifyKeywords()`), not at construction/import time. This prevents Next.js build-time crashes when Vercel evaluates modules without runtime env.
- Builds must not depend on secrets; configure secrets in Vercel (or the runtime environment). Fail fast at runtime if a required secret is missing.

Approach comparison: keys at package level vs keys at API layer

- Keys in package (read via `process.env` in the package):
  - Pros: Fewer parameters to pass; quick to wire up.
  - Cons: Tight coupling to env at import/construct time; brittle builds (Next/Vercel may import modules during build); harder to test and reuse outside the web runtime.
- Keys at API layer (dependency injection):
  - Pros: Keeps domain packages environment-agnostic and testable; explicit dependencies; no build-time secret requirement; easier to swap tokens/actors per request or per environment.
  - Cons: Slightly more boilerplate (constructing with `{ apiToken, actorId }`).

Current implementation

- `@sassy/social-referral` verifiers create the Apify client lazily inside `verifyKeywords()`. They only validate `APIFY_API_TOKEN` at runtime, avoiding build-time secret access. Routers can optionally inject `{ apiToken, actorId }` from the API layer for stricter control and testability.

Linting & Formatting

- ESLint presets under tooling/eslint with `restrictEnvAccess` to encourage using validated `env` imports
- App ESLint composes base + react + nextjs presets
- Prettier with Tailwind plugin and import sorting; tailwind config path references tooling `tailwind/web.ts`

Conventions & Rules

- Service co-location in domain packages for reuse across API and scripts
- TypeScript-only codebase with explicit types; subpath export maps for JIT
- Tailwind v4 practices: `@import`, `@config`, CSS variables for colors; shared presets
- Tailwind standards:
  - Use `@utility` instead of `@layer utilities` for custom utilities
  - Prefer CSS variables over `theme()` for shared values
  - Use parentheses syntax for arbitrary values with CSS variables (e.g. `bg-(--brand-color)`)
  - Mind hover styles on mobile; Tailwind v4 applies them only on hover-capable devices
- Build & scripts:
  - Use `pnpm` for all package management tasks
  - Use `bun` to execute standalone TypeScript scripts (e.g. `bun run scripts/my-script.ts`)
  - For simple commands, add them directly under `scripts` in `package.json`; for multi-step flows create a dedicated `.ts` under `scripts/` and invoke it via `bun`
  - Packages load root environment variables via `dotenv-cli` and a `"with-env": "dotenv -e ../../.env --"` script; scripts needing env vars must run with `pnpm with-env`
- Naming & typing conventions:
  - Name packages under the `@sassy/` scope and keep all file and directory names in kebab-case
  - Write all new code in TypeScript (`.ts`/`.tsx`) and avoid `any`; prefer explicit types and domain-specific models
  - Define constants with `UPPER_SNAKE_CASE` and `as const` when values should remain read-only
  - Prefer fat arrow functions for callbacks and inline functions; reserve the `function` keyword for declarations where appropriate (e.g. React components)
  - Name Zod schema files `schema-validators.ts` to match existing packages
- Module organization:
  - Avoid creating barrel files in internal directories; only use `index.ts` when exposing a package entry point
  - Design for extensibility (plugin/factory patterns) and centralized object creation
  - Page-specific components: Components used exclusively by a single page should be organized in `app/_components/[page-name]/` subdirectories. For example, `app/_components/dashboard/community-preview-card.tsx` contains components specific to the dashboard/homepage. Shared components used across multiple pages remain in `app/_components/` root or `_components/` at the app root level.
- **Client-Side Rendering Preference**: Default to client components using `"use client"` directive for pages and components unless server-side features are explicitly required. Avoid server-side prefetching; prefer client-side data fetching with React Query/tRPC hooks. Use React `use()` hook for unwrapping Promise props in client components (e.g., `params: Promise<{ id: string }>`). Rationale: Better error handling, simpler debugging, avoids server/client hydration mismatches.
- **Database Schema Evolution**: When adding new required fields to existing tables with data: (1) Make field nullable initially to allow migration without data loss, (2) Apply schema changes via `pnpm db:push`, (3) Backfill data by updating existing records with appropriate values, (4) Optionally make required later if needed after backfill. Example: Added `sourceUploadId` to `UserResult` as nullable to support existing records, then new records always populate it.
- SVG handling: shared logos live in `apps/nextjs/src/app/assets/logos/` and are imported via SVGR (`import Logo from "~/app/assets/logos/foo.svg"`); webpack/Turbopack apply a dedicated loader for these assets (icon mode off) while other SVGs still use `icon: true` for monochrome glyphs.
- Third-party services: store only foreign identifiers (e.g. Clerk ⇄ Stripe) and re-fetch canonical data as needed; use webhooks to maintain relationships rather than mirroring entire records
- Error handling: TRPCError for API; Zod validators generated from Prisma; prefer specific error classes that extend `Error` for domain scenarios

Development Workflow

- Spec-driven development with RIPER-5:
  - Generate feature specifications via `@generate-plan.md`, producing `[feature]_PLAN_[dd-mm-yy].md`
  - Classify features as SIMPLE (single-session, limited scope) or COMPLEX (multi-phase, multi-subsystem) before implementation
  - Follow RIPER-5 phases—Research → Innovate → Plan → Execute → Review—using plans as the single source of truth
  - Maintain status markers (✅/🚧/⏳) and “What’s Functional Now” in plan files; update when scope changes via Change Management

Security Posture

- Clerk middleware enforces auth for protected routes; public matcher enumerates safe paths
- Secrets used server-side only via `with-env`; client receives only NEXT*PUBLIC*\* values
- No sensitive data persisted client-side

Monitoring & Operations

- Vercel Analytics and Speed Insights enabled only in production
- Prisma Next.js monorepo plugin used at build to ensure Prisma works with deployments

References & Key Files

- Root: pnpm-workspace.yaml, turbo.json, package.json
- App: `apps/nextjs/next.config.js`, `src/app/layout.tsx`, `src/app/globals.css`, `src/env.ts`, `src/middleware.ts`, `src/trpc/*`
- API: `packages/api/src/trpc.ts`, `packages/api/src/router/*`, `packages/api/src/index.ts`
- DB: `packages/db/prisma/schema.prisma`, `packages/db/src/index.ts`, `packages/db/generated/*`
- Storage: `packages/supabase-bucket/src/index.ts`
- Referral: `packages/social-referral/src/social-referral-service.ts`, `platforms/x-verifier.ts`, `platforms/threads-verifier.ts`, `utils/detect-platform.ts`, `schema-validators.ts`
- Tooling: `tooling/eslint/*`, `tooling/prettier/index.js`, `tooling/tailwind/*`, `tooling/typescript/*`
- Product reference: `.cursor/context/example-complex-prd.md` (structure/depth reference)

Open Questions

- Monitor Apify actor stability across platforms; Facebook processing time (~78s) significantly longer than other platforms (~10-17s)
- Consider implementing UI progress indicators or countdown timers based on platform-specific execution benchmarks
- Timeline for cleaning legacy "EngageKit" branding in assets/metadata?

Appendices

A) tRPC Procedures by Router

- editor
  - uploadStart(input: { dataUrl: string; mime: "image/png"|"image/jpeg"|"image/webp" }) → { path, url }
  - removeBackground(input: { uploadPath: string }) → { path, url }
  - generateGif(input: { bgRemovedPath: string; style: "rise-bottom"|"rise-left"|"rise-right"; bgColor: string }) → { path, url }
  - listAssets() → { uploads, backgroundRemoved, results }
- user
  - checkAccess() → AccessType | undefined
  - getDailyCommentCount() → number
  - create(input: UserCreateInputSchema) → User
  - update(input: { id: string; data: UserUpdateInputSchema }) → User
  - delete(input: { id: string }) → User
  - me() → User | null
- social
  - verifyKeywords(input: { platform?: "x"|"threads"|"facebook"|"linkedin"; url: string; keywords: string[] }) → { platform, url, text, containsAll, matchedKeywords, missingKeywords }
    (Note: platform auto-detected from URL if not provided)
- stripe (present; not required now)
  - createCheckout(input: purchaseType) → checkoutUrl
  - createCustomerPortal(input: { returnUrl? }) → { url }
  - checkAccess() → { hasAccess, accessType }

B) Package Scripts (selected)

- Root package.json: build (turbo), dev (turbo watch), postinstall (prisma generate + copy engine), lint/format/typecheck
- apps/nextjs: dev/build/start with `with-env`, typecheck, lint, format
- packages/api: typecheck, lint, social:verify (bun + with-env; unified script for X, Threads, Facebook, LinkedIn)
- packages/db: db:generate/push/migrate/studio/zod with `with-env`
- packages/stripe: stripe:prices / stripe:portal (bun + with-env)
- packages/social-referral: with-env present

C) Prisma Models (key fields)

- User(id, username?, primaryEmailAddress, accessType, dailyAIcomments, createdAt, updatedAt)
- UserUpload(id, userId, path, mime, createdAt)
- BackgroundRemoved(id, userId, sourceUploadId, path, createdAt)
- UserResult(id, userId, path, createdAt)
- SocialSubmission(id, userId, platform, originalUrl, urlNormalized, status, requiredKeywords, matchedKeywords, missingKeywords, engagement metrics, creditAwarded, creditPenalty, rescanCount, verifiedAt, lastAttemptAt, errorMessage, createdAt, updatedAt)

D) TS Paths & Exports

- apps/nextjs tsconfig: `~/*` → `src/*`
- Export maps: `@sassy/api` (index.ts); `@sassy/db` (index.ts, generated/\*, schema-validators); `@sassy/ui` (subpaths); `@sassy/validators` (index.ts)
- Notice that we are all using Just In Time exports directly from the files, try to limit exporting from a barrel index.ts file at the root package because it doesn't give un context of the name of the file where the definition happend. You need to check package.json because JIT exports are defined in there
