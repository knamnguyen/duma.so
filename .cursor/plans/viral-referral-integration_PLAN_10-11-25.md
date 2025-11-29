# Viral Referral Integration Plan

- **Date:** 10-11-25
- **Complexity:** Complex
- **Overview:** Elevate the social referral dashboard from mock state to production by persisting user submissions, triggering background social verification via Apify, and surfacing live metrics and history. Phase 1 focuses on synchronous submission intake with fire-and-forget verification and credits, while future phases extend into scheduled rescans and richer analytics.
- **Quick Links:** [Context and Goals](#context-and-goals) • [Architecture Decisions](#architecture-decisions) • [Component Details](#component-details) • [Database Schema](#database-schema) • [API Surface](#api-surface) • [Phased Delivery Plan](#phased-delivery-plan) • [Implementation Checklist](#implementation-checklist) • [Cursor + RIPER-5 Guidance](#cursor--riper-5-guidance)
- **Status:** ✅ Phase 1 Complete • ✅ Phase 2 Complete • ⏳ Phase 3 Planned

---

## Context and Goals

- Persist every social referral submission, including normalized URLs, verification outcomes, and engagement metrics for X, Threads, Facebook, and LinkedIn.
- Automate backend verification immediately after submission without blocking the user flow; award credits on success and capture failures.
- Replace frontend mock data with live tRPC queries that return metrics, history (latest 50), and submission statuses.
- Prepare the system for future scheduled rescans (daily up to three attempts) without implementing the cron job today.
- Maintain full alignment with existing `@sassy/social-referral` verifiers and follow the monorepo’s service co-location and type-safety patterns.

### Business Success Metrics

- 100% of user-submitted URLs stored with deduplicated canonical form (global uniqueness).
- Verification completion within Apify latency bounds, with dashboard reflecting updated status/credits on subsequent page load.
- Credits awarded accurately (+3 on successful initial verification) and clamped to zero on penalties.
- Frontend dashboard loads live data via tRPC with no reliance on mock constants.

## Non-Goals and Constraints

- **Out of Scope:** Building Vercel cron jobs or daily rescan execution, full credit ledger UI, or exposing public APIs beyond tRPC.
- **Constraints:** Must run verifications on Vercel Node runtime (not edge); adhere to existing package boundaries; ensure Apify tokens stay server-side.
- **Future Work Placeholder:** Daily rescan pipeline (up to 3 attempts) with engagement growth bonuses and penalties.

---

## Architecture Decisions

1. **Fire-and-Forget Verification within tRPC**
   - **Rationale:** Avoid user-facing latency while staying within Vercel server capabilities.
   - **Implication:** `social.submitPost` mutation responds immediately after DB insert, then invokes `verifySubmission(submissionId)` without awaiting. Requires defensive logging and retry strategy in future cron.

2. **Single Source of Truth in Prisma**
   - **Rationale:** Simplify analytics by deriving credit totals and metrics from the `SocialSubmission` table.
   - **Implication:** No separate credit ledger initially; metrics queries aggregate directly from submissions.

3. **Global URL Deduplication via Normalization**
   - **Rationale:** Prevent duplicate rewards for the same post across users.
   - **Implication:** `urlNormalized` field with unique index; verification rejects duplicates early with `duplicate` status.

4. **Keyword Enforcement Based on Allowed Set**
   - **Rationale:** Guarantee every verification checks for brand terms while permitting multiple acceptable variants (e.g., `gifavatar`, `gifavatar.app`).
   - **Implication:** Mutation passes an allowed keyword list; verification succeeds when **any** allowed keyword matches. UI need not ask users for explicit keywords.

5. **Extensible Status Lifecycle**
   - **Rationale:** Allow future cron rescans without schema refactor.
   - **Implication:** Status enum includes `verifying`, `validated`, `invalid`, `duplicate`, `validation_failed`; `rescanCount` & `bestEngagementTotal` maintained even if unused immediately.

---

## Architecture Clarification

- **Apps/Next.js:** Hosts the dashboard UI, consumes tRPC queries and mutations, and displays real submission data.
- **Packages/API:** tRPC router orchestrates submission intake, verification, analytics, and history retrieval.
- **Packages/Social-Referral:** Existing verifiers stay unchanged but are reused by the new background workflow.
- **Packages/DB:** Prisma schema adds `SocialSubmission` model and supporting enums; regeneration required.

---

## High-level Data Flow

```
User submits URL
    ↓ (tRPC mutation)
Create SocialSubmission (status=verifying, credits=0)
    ↓
Return payload (verifying)
    ↓ (fire-and-forget)
verifySubmission(submissionId)
    ↓
SocialReferralService.verifyKeywords(url, ["gifavatar.app"])
    ↓
Persist result (status, text, engagement, credits)
    ↓
Front-end queries list + metrics (live data)
```

---

## Security Posture

- Keep Apify token server-side; never expose to client.
- Validate URLs before normalization and reject unsupported hosts to prevent SSRF.
- Ensure tRPC procedures remain `protectedProcedure` so only authenticated users can submit and read data.
- Clamp credit adjustments to avoid negative balances.

---

## Component Details

1. **Prisma Layer (`packages/db`)**
   - New `SocialPlatform` enum and `SocialSubmissionStatus` enum.
   - `SocialSubmission` model with indices on `userId`, `status`, `createdAt`, and unique `urlNormalized`.
2. **tRPC Router (`packages/api/src/router/social.ts`)**
   - `submitPost` mutation: create submission, spawn verification, return DTO.
   - `listSubmissions` query: latest 50 records for current user, ordered desc.
   - `metrics` query: aggregate verifying/validated/rejected counts + total credits.
3. **Verification Worker (co-located utility)**
   - Accepts submission ID, fetches row, invokes `SocialReferralService`, persists updates.
   - Handles duplicate detection (if job invoked twice) and error logging.
4. **Frontend (`apps/nextjs/src/app/social-referral/page.tsx`)**
   - Replace mock analytics and table with hooks using `useTRPC`.
   - Submission handler calls mutation, shows optimistic state, and refetches queries.

### Future Enhancements

- Cron-triggered rescans (Phase 3).
- Credit ledger table for audit trail.
- Notifications or email on verification results.

---

## Backend Endpoints and Workers

- **tRPC Mutations**
  - `social.submitPost` (new)
- **tRPC Queries**
  - `social.listSubmissions` (new, paginated)
  - `social.metrics` (new)
- **Worker Utility**
  - `processSubmission(submissionId)` (internal helper invoked from mutation; stored in `packages/api`)

---

## Infrastructure Deployment

- No new services. Ensure Next.js API routes use Node runtime by default (no `edge` exports for the router).
- Document requirement to deploy with Vercel environment variables (`APIFY_API_TOKEN`, database URLs).

---

## Database Schema

```prisma
enum SocialPlatform {
  X
  THREADS
  FACEBOOK
  LINKEDIN
}

enum SocialSubmissionStatus {
  VERIFYING
  VALIDATED
  INVALID
  DUPLICATE
  VALIDATION_FAILED
}

model SocialSubmission {
  id                  String                  @id @default(cuid())
  userId              String
  platform            SocialPlatform
  originalUrl         String
  urlNormalized       String                  @unique
  status              SocialSubmissionStatus  @default(VERIFYING)
  requiredKeywords    String[]                // stored keywords for auditing (e.g. ["gifavatar.app"])
  missingKeywords     String[]
  matchedKeywords     String[]
  postText            String?
  likes               Int                     @default(0)
  comments            Int                     @default(0)
  shares              Int                     @default(0)
  bestEngagementTotal Int                     @default(0)
  creditAwarded       Int                     @default(0)
  creditPenalty       Int                     @default(0)
  rescanCount         Int                     @default(0)
  verifiedAt          DateTime?
  lastAttemptAt       DateTime?
  errorMessage        String?
  createdAt           DateTime                @default(now())
  updatedAt           DateTime                @updatedAt

  @@index([userId, status])
  @@index([userId, createdAt])
}
```

---

## API Surface

```ts
// Mutation payloads
type SubmitPostInput = {
  platform: "X" | "THREADS" | "FACEBOOK" | "LINKEDIN";
  url: string;
};

type SubmitPostResult = {
  id: string;
  status: "verifying";
  creditsAwarded: number; // 0 at submission time
};

type ListSubmissionsResult = {
  submissions: Array<{
    id: string;
    platform: string;
    status: string;
    originalUrl: string;
    likes: number;
    comments: number;
    shares: number;
    totalEngagement: number;
    creditAwarded: number;
    creditPenalty: number;
    rescanCount: number;
    verifiedAt?: Date;
    lastAttemptAt?: Date;
    createdAt: Date;
    errorMessage?: string;
  }>;
};

type MetricsResult = {
  verifying: number;
  validated: number;
  rejected: number;
  totalCredits: number; // sum of creditAwarded - creditPenalty
};
```

---

## Real-time Event Model

- None for Phase 1. Future enhancement could add Pusher/WebSockets for live updates after verification.

---

## Phased Delivery Plan

### Current Status

- ✅ Phase 1: Submission Persistence & Immediate Verification (Complete)
- ✅ Phase 2: Frontend Integration & Analytics (Complete)
- ⏳ Phase 3: Scheduled Rescan Infrastructure (Future)

### Phase 1 – Submission Persistence & Immediate Verification (✅ Completed)

- **Goal:** Stand up database schema, submission mutation, and verification worker to award credits.
- **Outcome:** Prisma schema now stores `SocialSubmission` records; `social.submitPost` inserts submissions, performs duplicate checks, and triggers verification in the background with credit awarding when allowed keywords are detected.
- **Ready For Next:** Backend persistence and verification workflow stable; frontend consumes new data.

### Phase 2 – Frontend Integration & Metrics (✅ Completed)

- **Goal:** Replace mock data with live tRPC calls, handle submission workflow, and render metrics/history.
- **Outcome:** `/social-referral` dashboard submits posts via tRPC, shows loading states, renders live metrics/history, and triggers refetches on submission.
- **Ready For Next:** UI reflects real-time backend data; Phase 3 can build on stored submissions/rescan counters.

### Phase 3 – Scheduled Rescan Infrastructure (⏳ Planned for Future)

- **Goal:** Implement Vercel cron job + rescan logic awarding engagement bonuses/penalties per spec.
- **What’s Functional Now:** Not started; will build on Phase 1 schema fields.
- **Ready For Next:** Trigger daily verifications, maintain `rescanCount`, and adjust credits.

### Immediate Next Steps

1. Phase 3: design daily rescan cron and implement engagement growth bonuses/penalties.
2. Add credit ledger/audit trail as needed.
3. Consider admin tools or notifications for submission outcomes.

---

## Features List (MoSCoW with IDs)

| ID     | Feature                                             | Priority | Phase | Status |
| ------ | --------------------------------------------------- | -------- | ----- | ------ |
| VR-001 | Persist social submissions with status lifecycle    | Must     | 1     | ⏳     |
| VR-002 | Background Apify verification + credit award        | Must     | 1     | ⏳     |
| VR-003 | Deduplicate submissions globally via normalized URL | Must     | 1     | ⏳     |
| VR-004 | tRPC queries for metrics & history                  | Must     | 2     | ⏳     |
| VR-005 | Frontend wiring to real data                        | Must     | 2     | ⏳     |
| VR-006 | Cron-based daily rescans with bonuses/penalties     | Should   | 3     | ⏳     |
| VR-007 | Credit ledger export/audit                          | Could    | 3+    | ⏳     |
| VR-008 | Real-time notification of verification result       | Could    | 3+    | ⏳     |

---

## RFCs

### RFC-001: Submission Persistence & Verification Worker

- **Summary:** Design and implement database schema, submission mutation, and background verification within tRPC.
- **Dependencies:** None.
- **Stages:**
  1. Extend Prisma schema with enums/model, regenerate client.
  2. Implement duplication guard & helpers in `@sassy/social-referral` consumer.
  3. Create `social.submitPost` mutation with fire-and-forget verification.
  4. Persist verification outcomes, credits, and engagement metrics.
  5. Add metrics aggregation query.
  6. Unit/integration test with sample URLs (mock Apify).
- **Acceptance Criteria:**
  - Duplicate URLs rejected with `duplicate` status.
  - Successful verification stores post text, metrics, and +3 credits.
  - Errors captured with `validation_failed`, penalty clamped to 0.
  - Metrics query returns accurate counts.
- **Implementation Checklist:** See master checklist (steps 1–15).

### RFC-002: Frontend Dashboard Integration

- **Summary:** Replace mock data with live tRPC data and handle submission workflow.
- **Dependencies:** RFC-001.
- **Stages:**
  1. Wire `social.submitPost` mutation from frontend form.
  2. Replace analytics cards with `social.metrics` query + react-query caching.
  3. Replace history table with `social.listSubmissions`.
  4. Show toasts based on mutation result (pending vs. verified).
  5. Add loading/empty/error states.
- **Acceptance Criteria:**
  - Dashboard shows real counts and history for signed-in user.
  - Submitting URL results in immediate `verifying` row; status updates after reload.
  - Frontend handles duplicate / validation errors gracefully.
- **Implementation Checklist:** See master checklist (steps 16–24).

### RFC-003 (Future): Daily Rescan Automation

- **Summary:** Implement cron-triggered rescan workflow awarding engagement bonuses and penalties.
- **Dependencies:** RFC-001.
- **Stages:** To be defined later; include cron job, rescan service, credit adjustments, notifications.
- **Acceptance Criteria:** Engagement growth tracked; credits adjusted per spec.
- **Implementation Checklist:** Deferred.

---

## Rules (Initiative-Specific)

- Ensure all submissions are created via `protectedProcedure`; reject unauthenticated access.
- Normalize URLs before writing to DB (`normalizeUrl` utility) and convert platform string to enum.
- Pass `["gifavatar.app"]` as required keywords for every verification.
- Use Prisma transactions around submission creation + duplication check to avoid race conditions.
- Clamp penalties to never drop `creditAwarded - creditPenalty` below zero.
- Keep verification helper pure and isolated for reuse by future cron jobs.

---

## Verification

### Gap Analysis

- Need test strategy for background verification (mock Apify or dependency injection).
- Logging/monitoring for verification failures currently unspecified—should integrate basic console logging (future: observability).
- Frontend optimistic updates require careful cache invalidation to avoid stale metrics.

### Improvement Recommendations

1. Add structured logging around verification outcomes for easier debugging.
2. Provide admin tooling to replay failed submissions (future).
3. Document Vercel runtime expectations (Node, not Edge) in README.

### Quality Assessment

| Criterion       | Score | Rationale                                                                            |
| --------------- | ----- | ------------------------------------------------------------------------------------ |
| Clarity         | 9/10  | Phases and RFCs delineated; future cron work captured.                               |
| Feasibility     | 8/10  | Fire-and-forget approach manageable; need to ensure runtime doesn’t terminate early. |
| Completeness    | 8/10  | Covers backend + frontend; leaves cron for future but schema prepared.               |
| Maintainability | 9/10  | Strong separation between API, service, and UI; future cron fits existing model.     |

---

## Change Management

- **Classification:** New feature introduction.
- **Impact Analysis:** Touches Prisma schema, tRPC router, Next.js dashboard, and environment variables.
- **Implementation Strategy:** Execute Phase 1 before touching frontend to avoid partial data wiring.
- **Documentation Updates:** Update `.cursor/context/all-context.md` (API, DB sections) after implementation; note new env requirements.
- **Communication Plan:** Announce to stakeholders when live; note credit awards now automatic.
- **Risks:** Apify latency, runtime termination mid-verification; mitigate via logging and manual retry.

---

## Ops Runbook

- **Deployment:** `pnpm db:push` after schema change; redeploy Next.js app to Vercel.
- **Env Vars:** Ensure `APIFY_API_TOKEN`, `DATABASE_URL`, `DIRECT_URL` set in Vercel.
- **On-call:** If submissions stuck in `verifying`, re-run verification manually via script (future tool).
- **Fallback:** Temporarily disable submission mutation if Apify outage occurs.

---

## Acceptance Criteria (Versioned)

- **v1.0 (Phase 1 + 2):**
  - Users submit URLs and see records in history (verifying → validated/failed) upon refresh.
  - Credits updated by +3 on success; duplicates rejected.
  - Dashboard metrics sourced from live data with accurate counts.
- **v1.1 (Future Phase 3):**
  - Daily rescans adjust credits based on engagement growth/penalties.
  - Rescan counts increment up to three days.

---

## Future Work

1. Implement Phase 3 cron-driven rescan logic.
2. Add credit ledger table for auditing.
3. Introduce notifications or emails when submissions succeed/fail.
4. Consider real-time updates via WebSockets or SSE.
5. Add admin panel to review submissions and override credits.

---

## Implementation Checklist

1. **Phase 1 – Contract Foundation**
   1. ✅ Update `packages/social-referral/src/types.ts` to add `likes`, `comments`, `shares` with defaults.
   2. ✅ Extend Zod result schema in `schema-validators.ts` to include all three metrics.
   3. ✅ Create `packages/social-referral/src/utils/normalize-url.ts` utility to strip query params and fragments.
   4. ✅ Export `normalizeUrl` from `packages/social-referral/src/index.ts`.
   5. ✅ Update `social-referral-service.ts` to normalize URLs and populate zeroed engagement fields.
   6. ✅ Update all verifiers (`x-verifier.ts`, `threads-verifier.ts`, `facebook-verifier.ts`, `linkedin-verifier.ts`) to return engagement metrics.
   7. ✅ Update `packages/api/src/router/social.ts` mutation output typing.
   8. ✅ Adjust CLI script output to include engagement fields.
   9. ✅ Run `pnpm --filter @sassy/social-referral typecheck`.
   10. ✅ Run `pnpm --filter @sassy/api typecheck`.

2. **Phase 2 – X & Threads Parsing** 11. ✅ Sample responses collected in `sample-response-format/x.json` and `sample-response-format/threads.json`. 12. ✅ Implement engagement parsing in `x-verifier.ts` (field paths: `likeCount`, `replyCount`, `retweetCount`). 13. ✅ Implement engagement parsing in `threads-verifier.ts` (field paths: `like_count`, `text_post_app_info.direct_reply_count`, `text_post_app_info.repost_count`). 14. ✅ Merge parsed counts into results. 15. ✅ Run CLI tests documenting results (X: 28 likes, 6 comments, 0 shares; Threads: 1 like, 0 comments, 0 shares).

3. **Phase 3 – Facebook Parsing (✅ Completed)** 16. ✅ Sample response collected in `sample-response-format/facebook.json`. 17. ✅ Updated `facebook-verifier.ts` to parse likes/comments/shares (field paths: `likes`, `num_comments`, `num_shares`) with fallbacks. 18. ✅ Verified via CLI sample (21 likes, 6 comments, 1 share).

4. **Phase 4 – LinkedIn Parsing (✅ Completed)** 19. ✅ Sample response collected in `sample-response-format/linkedin.json`. 20. ✅ Updated `linkedin-verifier.ts` to parse likes/comments/shares (field paths: `numLikes`, `numComments`, `numShares`). 21. ✅ Verified via CLI sample (79 likes, 50 comments, 2 shares).

5. **Wrap-Up** 22. ✅ Update documentation describing engagement fields and URL normalization. 23. ✅ Communicate schema change to API consumers (breaking change: URLs normalized). 24. ✅ Capture lessons learned and update plan status markers.

---

## Cursor + RIPER-5 Guidance

- **Cursor Plan Mode:** Import the checklist above; execute sequentially. Mark Phase 1 items first, then Phase 2 when backend confirmed stable.
- **RIPER-5 Workflow:**
  - RESEARCH: Inspect relevant files (Prisma, tRPC, Next page).
  - INNOVATE: Completed – approach chosen (fire-and-forget, no cron).
  - PLAN: This document is the authoritative spec.
  - Next Step: Await `ENTER EXECUTE MODE` before touching code. Provide mid-way check-in after item ~11.
  - REVIEW and UPDATE PROCESS as usual once execution finishes.

**Next for Plan Mode:** Ready for execution—request `ENTER EXECUTE MODE` when you want to start implementing Phase 1.
