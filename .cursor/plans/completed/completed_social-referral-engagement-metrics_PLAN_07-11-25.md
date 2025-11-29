## Social Referral Engagement Metrics

- **Date**: 2025-11-07
- **Complexity**: Complex
- **Status**: ✅ Phase 1 Complete • ✅ Phase 2 Complete • ✅ Phase 3 Complete • ✅ Phase 4 Complete

### Quick Links

- [Context and Goals](#context-and-goals)
- [Architecture Decisions](#architecture-decisions)
- [Phased Delivery Plan](#phased-delivery-plan)
- [RFCs](#rfcs)
- [Implementation Checklist](#implementation-checklist)
- [Cursor + RIPER-5 Guidance](#cursor--riper-5-guidance)

---

### Context and Goals

#### Business Context

The social referral verifier already handles keyword verification for X, Threads, Facebook, and LinkedIn via Apify actors. Campaign operations now require returning engagement metadata—specifically like, comment, and share/repost counts—for auditing referral quality and quantifying reach. Additionally, normalized URLs (without query parameters) are needed for duplicate detection.

#### Goals

1. Parse and surface `likes`, `comments`, and `shares` (or reposts) for every supported platform without adding extra API calls.
2. Normalize input URLs by stripping query parameters and fragments to facilitate duplicate detection.
3. Extend the shared response shape and CLI/test harness to include these metrics and normalized URLs.
4. Preserve existing keyword-matching behavior and error handling.

#### Success Metrics

- Engagement counts (likes, comments, shares) returned for all four platforms via tRPC and CLI.
- URLs returned without query parameters or fragments for duplicate detection.
- Keyword verification latency remains within 750 ms (p95).
- CLI output includes `likes`, `comments`, and `shares`, validated against real sample data.
- No failures reported for missing fields in Apify payloads (graceful fallbacks to zero).

---

### Non-Goals and Constraints

#### Non-Goals

- Persisting engagement metrics to the database.
- Adding engagement types beyond likes, comments, and shares.
- Building dashboards or analytics around the counts.
- Handling historical aggregation or trending.
- Advanced URL normalization (preserving path structure, just removing query/fragment).

#### Constraints

- Must continue using existing Apify actor responses (no extra requests).
- Must respect Tailwind v4 and monorepo coding standards.
- Services remain within `@sassy/social-referral`; consumers unchanged except for response shape updates.
- Maintain backward compatibility with optional `platform` parameter.

---

### Architecture Decisions

1. **Extend Verification Result Contract**
   - **Rationale:** Engagement data (likes, comments, shares) must be available to CLI and API consumers.
   - **Implication:** Update `VerifyKeywordsResult` (and related schemas) to include `likes`, `comments`, and `shares` with defaults.

2. **URL Normalization**
   - **Rationale:** Duplicate detection requires consistent URL format without query parameters.
   - **Implication:** Service normalizes input URLs by stripping query params (`?...`) and fragments (`#...`) before verification.

3. **Platform-Specific Parser Adapters**
   - **Rationale:** Apify datasets expose engagement metrics differently per platform.
   - **Implication:** Each verifier implements `extractEngagement()` returning normalized counts (likes, comments, shares); shared utility for coalescing undefined to zero.

4. **Fallback Handling**
   - **Rationale:** Some posts may hide counts or return null.
   - **Implication:** When data is absent, return zeros and optionally log for observability.

5. **Sample Response Format Documentation**
   - **Rationale:** Actual Apify responses guide parsing implementation.
   - **Implication:** Sample responses stored in `packages/social-referral/sample-response-format/` for reference during Phase 2-4 implementation.

---

### Architecture Clarification

#### Service Separation

- `@sassy/social-referral`: houses verifiers, types, schema definitions, and orchestrating service.
- `@sassy/api`: consumes service via tRPC mutation; must propagate new fields in mutation result.
- CLI (`packages/api/scripts/verify-social-keywords.ts`): prints engagement data.

#### Data Contract Evolution

```
VerifyKeywordsResult
├─ platform: SocialPlatform
├─ url: string (normalized, without query params/fragments)
├─ text: string
├─ containsAll: boolean
├─ missingKeywords: string[]
├─ matchedKeywords: string[]
├─ likes: number
├─ comments: number
└─ shares: number
```

---

### High-Level Data Flow

```
URL + keywords
    ↓
normalizeUrl(url)  // strip query params & fragments
    ↓
detectPlatform(normalizedUrl)
    ↓
SocialReferralService.verifyKeywords()
    ↓
Verifier.fetchDataset()  // existing Apify call
    ↓
Verifier.extractText() + extractEngagement()
    ↓
keywordMatch(text, keywords)
    ↓
Result { ..., url: normalizedUrl, likes, comments, shares }
```

---

### Security Posture

- Continue sanitizing user input (trim/normalize keywords, validate URLs).
- Do not log raw engagement counts with tokens.
- Ensure no additional secrets introduced.

---

### Component Details

1. **Types & Schema (`packages/social-referral/src/types.ts`, `schema-validators.ts`)**
   - Extend `VerifyKeywordsResult` and Zod schemas to include `likes`, `comments`, and `shares` with defaults.

2. **URL Normalization Utility (`src/utils/normalize-url.ts`)**
   - Implement `normalizeUrl()` to strip query parameters and fragments from URLs.

3. **Verifiers (`src/platforms/*-verifier.ts`)**
   - Parse likes/comments/shares from dataset items; each platform has unique paths (documented below).
   - Return engagement counts in result (initially zeros in Phase 1, actual values in Phase 2-4).

4. **Service (`src/social-referral-service.ts`)**
   - Normalize input URL before passing to verifiers.
   - Merge engagement counts into final response; ensure defaults to zero when data missing.
   - Return normalized URL in result.

5. **CLI (`packages/api/scripts/verify-social-keywords.ts`)**
   - Print `likes`, `comments`, and `shares` fields alongside keyword results.

6. **tRPC Mutation (`packages/api/src/router/social.ts`)**
   - Return new engagement fields in mutation output types.

7. **Sample Response Formats (`sample-response-format/*.json`)**
   - **X** (`x.json`): `likeCount`, `replyCount`, `retweetCount`
   - **Threads** (`threads.json`): `like_count`, `text_post_app_info.direct_reply_count`, `text_post_app_info.repost_count`
   - **Facebook** (`facebook.json`): `likes`, `num_comments`, `num_shares`
   - **LinkedIn** (`linkedin.json`): `numLikes`, `numComments`, `numShares`

---

### Backend Endpoints and Workers

- Update `social.verifyKeywords` tRPC mutation output to include engagement fields.

### Infrastructure Deployment

- No infrastructure changes.

### Database Schema

- No changes required.

### API Surface

```
Output Schema:
{
  platform: SocialPlatform;
  url: string; // normalized (without query params/fragments)
  text: string;
  containsAll: boolean;
  missingKeywords: string[];
  matchedKeywords: string[];
  likes: number;
  comments: number;
  shares: number;
}
```

---

### Phased Delivery Plan

#### Current Status

- ✅ Phase 1: Shared contract groundwork (COMPLETED).
- ✅ Phase 2: X + Threads engagement parsing (COMPLETED).
- ✅ Phase 3: Facebook engagement parsing (COMPLETED).
- ✅ Phase 4: LinkedIn engagement parsing (COMPLETED).

#### What's Functional Now (After Phase 4 - ALL COMPLETE)

- ✅ Type system extended with `likes`, `comments`, `shares` fields
- ✅ URL normalization implemented and working (strips query params/fragments)
- ✅ Service layer normalizes URLs before verification
- ✅ All verifiers return engagement fields
- ✅ CLI outputs all 3 engagement metrics
- ✅ Zod schema validation for result contract
- ✅ End-to-end tests passed with all four platforms (X, Threads, Facebook, LinkedIn)
- ✅ **X engagement parsing working** (likeCount, replyCount, retweetCount)
- ✅ **Threads engagement parsing working** (like_count, direct_reply_count, repost_count)
- ✅ **Facebook engagement parsing working** (likes, num_comments, num_shares)
- ✅ **LinkedIn engagement parsing working** (numLikes, numComments, numShares)
- ✅ Graceful fallback to zero when engagement data missing across all platforms
- ✅ **All four platforms fully operational with engagement metrics**

#### Phase 1 – Shared Contract Foundation (✅ COMPLETED)

- Extend schemas, types, and service contract to support engagement fields (likes, comments, shares) with safe defaults.
- Implement URL normalization utility to strip query parameters and fragments.
- Update service to normalize URLs before verification and return normalized URLs in results.
- Files: `types.ts`, `schema-validators.ts`, `utils/normalize-url.ts`, `social-referral-service.ts`, all verifiers, `packages/api/src/router/social.ts`, `packages/api/scripts/verify-social-keywords.ts`, `packages/social-referral/src/index.ts`.
- Outcome: Unified response shape with engagement fields defaulting to zero and normalized URLs across API/CLI.

#### Phase 2 – X & Threads Parsing (✅ COMPLETED)

- Parse engagement counts (likes, comments, shares) from existing datasets for X and Threads, validate outputs via CLI.
- Reference sample responses: `sample-response-format/x.json`, `sample-response-format/threads.json`.
- Field paths: X (`likeCount`, `replyCount`, `retweetCount`), Threads (`like_count`, `text_post_app_info.direct_reply_count`, `text_post_app_info.repost_count`).
- Files: `x-verifier.ts`, `threads-verifier.ts`.
- Outcome: Accurate counts for X and Threads.

#### Phase 3 – Facebook Parsing (✅ COMPLETED)

- Parse likes/comments/shares from Facebook dataset structures (post/video variations).
- Reference sample response: `sample-response-format/facebook.json`.
- Field paths: `likes`, `num_comments`, `num_shares`.
- File: `facebook-verifier.ts`.
- Outcome: Accurate counts for Facebook or zero fallbacks.

#### Phase 4 – LinkedIn Parsing (✅ COMPLETED)

- Parse LinkedIn dataset for likes/comments/shares fields.
- Reference sample response: `sample-response-format/linkedin.json`.
- Field paths: `numLikes`, `numComments`, `numShares`.
- File: `linkedin-verifier.ts`.
- Outcome: Accurate counts for LinkedIn.

---

### Immediate Next Steps

1. ✅ Sample dataset responses collected in `sample-response-format/` directory.
2. Validate `@sassy/api` consumers for new fields (likes, comments, shares, normalized URLs).
3. Communicate schema changes to downstream teams.

---

### Features List (MoSCoW)

| ID      | Feature                                         | Priority | Status | Phase |
| ------- | ----------------------------------------------- | -------- | ------ | ----- |
| ENG-001 | Extend verification result contract (3 metrics) | Must     | ⏳     | 1     |
| ENG-002 | URL normalization for duplicate detection       | Must     | ⏳     | 1     |
| ENG-003 | X engagement parsing (likes/comments/shares)    | Must     | ⏳     | 2     |
| ENG-004 | Threads engagement parsing                      | Must     | ⏳     | 2     |
| ENG-005 | Facebook engagement parsing                     | Must     | ⏳     | 3     |
| ENG-006 | LinkedIn engagement parsing                     | Must     | ⏳     | 4     |
| ENG-007 | CLI engagement reporting (3 metrics)            | Should   | ⏳     | 1     |
| ENG-008 | Optional logging for missing counts             | Could    | ⏳     | 2–4   |

---

### RFCs

#### RFC-101: Engagement Contract Foundation

- **Summary:** Introduce likes/comments/shares into shared schemas and service; add URL normalization.
- **Dependencies:** None.
- **Stages:**
  1. Update TypeScript types to include `likes`, `comments`, `shares`.
  2. Extend Zod result schema with defaults for all three metrics.
  3. Create `normalizeUrl()` utility to strip query params and fragments.
  4. Modify `SocialReferralService` to normalize URLs and include engagement fields (default zero).
  5. Update all verifiers to return engagement fields (initially zero).
  6. Update CLI printing and tRPC output types.
  7. Run type checks.
- **Acceptance Criteria:**
  - Type checks succeed.
  - CLI output includes `likes`, `comments`, and `shares` (initially zero).
  - URLs returned without query parameters or fragments.
  - No runtime errors from consumers.

#### RFC-102: X + Threads Engagement Extraction

- **Summary:** Parse and return real counts (likes/comments/shares) for X/Threads.
- **Dependencies:** RFC-101.
- **Sample Data:** `sample-response-format/x.json`, `sample-response-format/threads.json`.
- **Field Paths:**
  - X: `likeCount`, `replyCount`, `retweetCount`
  - Threads: `like_count`, `text_post_app_info.direct_reply_count`, `text_post_app_info.repost_count`
- **Stages:**
  1. Inspect sample dataset payloads.
  2. Implement parsing helpers in each verifier for all three metrics.
  3. Merge parsed counts into result.
  4. Validate via CLI tests.
  5. Optionally log missing counts.
- **Acceptance Criteria:**
  - CLI outputs non-zero counts for known posts.
  - All three metrics (likes, comments, shares) populated.
  - Keyword matching unaffected.
  - Fallback to zero when counts absent.

#### RFC-103: Facebook Engagement Extraction

- **Summary:** Parse counts (likes/comments/shares) for Facebook posts/videos.
- **Dependencies:** RFC-101 (and ideally RFC-102).
- **Sample Data:** `sample-response-format/facebook.json`.
- **Field Paths:** `likes`, `num_comments`, `num_shares`
- **Stages:**
  1. Inspect dataset structure (post vs video).
  2. Implement parsing with null coalescing for all three metrics.
  3. Validate via CLI sample.
- **Acceptance Criteria:**
  - Facebook outputs accurate counts or zero fallbacks.
  - All three metrics populated.
  - Service returns structured result.

#### RFC-104: LinkedIn Engagement Extraction

- **Summary:** Parse counts (likes/comments/shares) for LinkedIn posts.
- **Dependencies:** RFC-101.
- **Sample Data:** `sample-response-format/linkedin.json`.
- **Field Paths:** `numLikes`, `numComments`, `numShares`
- **Stages:**
  1. Inspect dataset.
  2. Implement parser with nested handling for all three metrics.
  3. Validate via CLI sample.
- **Acceptance Criteria:**
  - LinkedIn outputs accurate counts or zero fallbacks.
  - All three metrics populated.
  - No regressions.

---

### Rules (Initiative-Specific)

- Keep one export per file where practical.
- Use arrow functions for helpers.
- Handle missing engagement fields gracefully (default zeros for all three metrics).
- Normalize URLs consistently (strip query params and fragments).
- Avoid new dependencies; use existing Apify output.
- Reference sample response formats in `sample-response-format/` for field path validation.

---

### Verification

#### Gap Analysis

- ✅ Actual dataset field names documented per platform (see Component Details #7).
- Ensure downstream consumers ready for response changes (3 new fields + normalized URLs).
- Confirm CLI formatting remains readable with additional metrics.

#### Improvement Recommendations

1. ✅ JSON fixtures captured in `sample-response-format/` directory.
2. Consider runtime validation for actor schema changes.
3. Add telemetry to detect frequent zero counts.
4. Document URL normalization behavior for edge cases (already normalized URLs, malformed URLs).

#### Quality Assessment

| Criterion       | Score | Rationale                                                             |
| --------------- | ----- | --------------------------------------------------------------------- |
| Clarity         | 9/10  | Clear phases; dataset examples documented.                            |
| Feasibility     | 9/10  | Reuses existing infrastructure; URL normalization straightforward.    |
| Completeness    | 9/10  | All three metrics covered; sample data provided; CLI testing planned. |
| Maintainability | 9/10  | Parsing localized by platform; URL normalization centralized.         |

---

### Change Management

- **Classification:** Scope + technical change.
- **Impact:** Affects service responses, CLI output, and API typing (3 new fields + URL normalization).
- **Strategy:** Execute phases sequentially; coordinate with consumers.
- **Documentation:** Update README/tRPC docs with new fields (likes, comments, shares) and URL normalization behavior.
- **Communication:** Notify API consumers about response changes (breaking change: URLs now normalized).
- **Risks:** Dataset schema changes or consumer mismatches; URL normalization may affect existing duplicate detection logic; mitigate with logging, communication, and sample data validation.

---

### Ops Runbook

- Deploy per phase; run `pnpm --filter @sassy/social-referral typecheck` and `pnpm --filter @sassy/api typecheck`.
- Run CLI verification with sample URLs.
- Troubleshooting: inspect dataset items if counts zero; update parsers accordingly.

---

### Acceptance Criteria (Versioned)

- **Version 1.0:** Schema/types updated with 3 metrics; URL normalization implemented; CLI shows zeroed fields; type checks pass.
- **Version 2.0:** X/Threads return actual counts for all 3 metrics; CLI validations documented.
- **Version 3.0:** Facebook returns counts for all 3 metrics or zero fallback.
- **Version 4.0:** LinkedIn returns counts for all 3 metrics; end-to-end verification complete.

---

### Future Work

1. ✅ Share/repost counts included in Phase 1-4 implementation.
2. Persist metrics for analytics (database schema changes).
3. Monitor for dataset schema drift (runtime validation).
4. Add automated tests mocking Apify payloads.
5. Expand URL normalization to handle additional edge cases (internationalized URLs, custom shorteners).

---

### Implementation Checklist

1. **Phase 1 – Contract Foundation**
   1. Update `packages/social-referral/src/types.ts` to add `likes`, `comments`, `shares` with defaults.
   2. Extend Zod result schema in `schema-validators.ts` to include all three metrics.
   3. Create `packages/social-referral/src/utils/normalize-url.ts` utility to strip query params and fragments.
   4. Export `normalizeUrl` from `packages/social-referral/src/index.ts`.
   5. Update `social-referral-service.ts` to normalize URLs and populate zeroed engagement fields.
   6. Update all verifiers (`x-verifier.ts`, `threads-verifier.ts`, `facebook-verifier.ts`, `linkedin-verifier.ts`) to return `likes: 0, comments: 0, shares: 0`.
   7. Update `packages/api/src/router/social.ts` mutation output typing.
   8. Adjust CLI script output to include engagement fields.
   9. Run `pnpm --filter @sassy/social-referral typecheck`.
   10. Run `pnpm --filter @sassy/api typecheck`.

2. **Phase 2 – X & Threads Parsing** 11. ✅ Sample responses collected in `sample-response-format/x.json` and `sample-response-format/threads.json`. 12. ✅ Implement engagement parsing in `x-verifier.ts` (field paths: `likeCount`, `replyCount`, `retweetCount`). 13. ✅ Implement engagement parsing in `threads-verifier.ts` (field paths: `like_count`, `text_post_app_info.direct_reply_count`, `text_post_app_info.repost_count`). 14. ✅ Merge parsed counts into results. 15. ✅ Run CLI tests documenting results (X: 28 likes, 6 comments, 0 shares; Threads: 1 like, 0 comments, 0 shares).

3. **Phase 3 – Facebook Parsing (✅ COMPLETED)** 16. ✅ Sample response collected in `sample-response-format/facebook.json`. 17. ✅ Updated `facebook-verifier.ts` to parse likes/comments/shares (field paths: `likes`, `num_comments`, `num_shares`) with fallbacks. 18. ✅ Verified via CLI sample (21 likes, 6 comments, 1 share).

4. **Phase 4 – LinkedIn Parsing (✅ COMPLETED)** 19. ✅ Sample response collected in `sample-response-format/linkedin.json`. 20. ✅ Updated `linkedin-verifier.ts` to parse likes/comments/shares (field paths: `numLikes`, `numComments`, `numShares`). 21. ✅ Verified via CLI sample (79 likes, 50 comments, 2 shares).

5. **Wrap-Up** 22. Update documentation describing engagement fields and URL normalization. 23. Communicate schema change to API consumers (breaking change: URLs normalized). 24. Capture lessons learned and update plan status markers.

---

### Cursor + RIPER-5 Guidance

- **Cursor Plan Mode:** Import the checklist above; execute sequentially by phase, updating status markers upon completion.
- **RIPER-5 Workflow:**
  - RESEARCH: Review existing verifiers and Apify data structures.
  - INNOVATE: Approach fixed (reuse existing responses).
  - PLAN: Use this document as authoritative spec.
  - EXECUTE: Request "ENTER EXECUTE MODE" before implementing; provide mid-implementation check-in after roughly item 10.
  - REVIEW: Confirm each checklist item completed; flag deviations.
  - UPDATE PROCESS: If new conventions arise (e.g., shared parsing utility), update rules/context accordingly.

---

**Next Action:** Import the “Implementation Checklist” into Cursor Plan mode before starting execution.
