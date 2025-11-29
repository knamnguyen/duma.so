Title: Project-based Editor and Dashboard Integration
Date: 13-11-25
Complexity: Complex

Overview
This initiative introduces first-class “Projects” to Gifavatar by treating each original upload as a project, identified by its upload path (sourceUploadId). We will: (1) list projects on the home dashboard (“Your projects”) with cover (original upload), title (“Project 1/2/3…” computed by order), and nicely formatted date; (2) migrate the editor to per-project routes at /editor/[projectId]; (3) move the upload + background removal flow into the Create Gifavatar button, wait until background removal completes, then navigate to the new editor route; (4) add an editor subsection “Projects’ generations” to show all GIF generations for that project (animated previews) with Download buttons; and (5) persist last-used style/bg color defaults per project.

Quick Links

- Architecture Decisions
- Data Model (Prisma-style)
- API Surface (tRPC)
- Routes and UI
- Acceptance Criteria
- Implementation Checklist
- Cursor + RIPER-5 Guidance

Status

- ✅ Phase 1: Data model + linking
- ✅ Phase 2: Editor route migration (/editor/[projectId])
- ✅ Phase 3: Create button flow (upload → remove BG → navigate)
- ✅ Phase 4: Home "Your projects" (dynamic)
- ✅ Phase 5: Generations grid in editor + defaults

1. Context and Goals

- Elevate uploads into “Projects,” enabling direct navigation to an editor scoped by an ID and persistent history.
- Keep current bucket structure; use DB relationships to bind assets.
- Ensure delightful UX: background removal is completed in the Create dialog, with progress, before entering the editor.

2. Non-Goals and Constraints

- No rename/edit title UX; titles are computed (“Project N”) by list order.
- No cross-project asset moves or deletions within this iteration.
- Keep existing buckets and per-user foldering unchanged.

3. Architecture Decisions (Final)

1) Project Identity = UserUpload.id (cuid)
   - **DEVIATION**: Changed from path-based to ID-based during implementation
   - Rationale: Cleaner URLs (no encoding needed), direct primary key lookups (faster), cuid is already URL-safe
   - Implications: No encoding/decoding needed; `sourceUploadId` in BackgroundRemoved and UserResult stores `UserUpload.id`
2) Keep Buckets As-Is
   - Rationale: Minimal change; rely on DB linkage for grouping.
3) Persist Editor Defaults on UserUpload
   - Rationale: Defaults (style/bgColor) belong to the project-level entity mapped to the original upload.
4) Client-Orchestrated Upload Flow
   - Rationale: Reuse existing tRPC procedures; all rendering client-side with "use client" directive
   - **DEVIATION**: Removed server-side prefetching; all data fetching happens client-side

4. High-level Data Flow
   User selects image in Create dialog → uploadStart → removeBackground (polling via existing API) → on success: compute projectId = uploadPath; encode projectId; navigate to /editor/[projectId] → editor loads getProject(projectId) → shows bg-removed preview; “Projects’ generations” lists UserResult items linked by sourceUploadId.

5. Security Posture

- All procedures remain protected; userId scoping enforced in list and get queries.
- ProjectId (sourceUploadId) is URL-encoded; server decodes and re-validates that it belongs to current user.

6. Component Details

- CreateGifavatarButton: Orchestrates upload → removeBG with progress; upon finish, navigate to /editor/[projectId].
- Editor (/editor/[projectId]): Loads project (original + latest bgRemoved + results[] + defaults) and renders controls + “Projects’ generations.” Removes in-editor file uploader.
- Home (/): Lists user projects from UserUpload; cover uses original upload public URL; shows computed title and formatted date.

7. Backend Endpoints (tRPC additions)

- editor.getProject
  - input: { projectId: string } // encoded, server decodes to the source path
  - output: { upload, backgroundRemovedLatest, results: UserResult[], defaults: { style?: string; bgColor?: string } }
  - behavior: verify ownership via userId, hydrate public URLs for client convenience.
- editor.listProjects
  - input: { limit?: number, cursor?: string|null }
  - output: { items: Array<{ upload: UserUpload, coverUrl: string }>, nextCursor?: string }
  - behavior: lists latest UserUpload by user, compute coverUrl via bucket util.
- editor.listProjectResults
  - input: { projectId: string }
  - output: { results: UserResult[] } // with public URLs
- editor.updateProjectDefaults (optional for Phase 5)
  - input: { projectId: string, style?: string, bgColor?: string }
  - output: { ok: true }

8. Database Schema (Prisma-style)
   Changes in packages/db/prisma/schema.prisma:

- Extend UserResult with sourceUploadId to link results to a project:
  model UserResult {
  id String @id @default(cuid())
  userId String
  path String
  createdAt DateTime @default(now())
  sourceUploadId String? // NEW - nullable for backward compatibility

  @@index([userId])
  @@index([sourceUploadId]) // NEW
  }
  - **DEVIATION**: Made `sourceUploadId` nullable to allow migration of existing records without data loss

- Extend UserUpload to persist default editor values:
  model UserUpload {
  id String @id @default(cuid())
  userId String
  path String
  mime String
  createdAt DateTime @default(now())
  defaultStyle String? // NEW (e.g., “rise-bottom”)
  defaultBgColor String? // NEW (e.g., “#ffffff”)

  @@index([userId])
  }

9. API Surface (details)

- editor.getProject
  - Decodes projectId → sourceUploadId path
  - Finds UserUpload by path and userId
  - Gets latest BackgroundRemoved by sourceUploadId (and userId)
  - Gets UserResult[] by sourceUploadId (and userId), newest first
  - Returns public URLs for original, bg-removed, and each result
- editor.listProjects
  - Paginates UserUpload by userId desc createdAt; builds coverUrl via getPublicUrl(user-uploads, path)
  - “Project N” title derived by list order client-side
- editor.listProjectResults
  - Pulls UserResult by sourceUploadId with URLs for GIFs
- editor.generateGif (existing)
  - On save, also set sourceUploadId = projectId (upload path) for the created result

10. Routes and UI
    Home (/app/page.tsx)

- Replace static PROJECTS with a query to editor.listProjects.
- Card props:
  - Cover: original upload (user-uploads bucket via URL)
  - Title: “Project N” (N = index + 1)
  - Subtitle: formatted createdAt (e.g., “Edited Nov 13, 2025” or “Created …”)
  - Link: /editor/[projectId] (encoded from upload.path)

Create Gifavatar Button (/src/\_components/create-gifavatar-button.tsx)

- On file selection: call uploadStart; show progress; then call removeBackground; on success: compute projectId = res.path; encode; navigate to /editor/[projectId]; keep dialog open with a loading state until navigation.

Editor (/app/editor/[projectId]/)

- **DEVIATION**: Client-side page with "use client" directive; no server-side prefetching
- EditorClient removes FileUploader; uses provided bg-removed URL and defaults from project for initial controls.
- Add "Projects' generations" grid under controls with animated GIF thumbnails (<img />, not Image, to ensure animation), each with a Download button (download attribute or open in new tab).
- Provide controls to update defaults (style/bgColor) and persist via editor.updateProjectDefaults (optional in Phase 5).

11. Acceptance Criteria

- Home lists actual user projects from DB with correct cover, title numbering, and readable date.
- Create dialog completes BG removal, shows progress, then navigates to /editor/[projectId].
- Editor loads the correct project by ID, immediately displaying the bg-removed preview.
- No file uploader in editor; controls operate on the loaded project.
- “Projects’ generations” shows prior GIFs for the project, thumbnails animate, and each has a working Download button.
- New GIF generations are saved with sourceUploadId set, and they appear in the list on refresh.

12. Implementation Checklist (execute in order)

1) Prisma: Add fields to UserResult (sourceUploadId) and UserUpload (defaultStyle, defaultBgColor); generate + migrate.
2) API: Add editor.getProject(projectId), editor.listProjects({limit,cursor}), editor.listProjectResults(projectId), and editor.updateProjectDefaults(projectId, style?, bgColor?). Ensure ownership checks and public URLs.
3) API: Update editor.generateGif to save UserResult.sourceUploadId = projectId (derived from supplied bgRemovedPath’s matching source upload path).
4) Routing: Create /apps/nextjs/src/app/editor/[projectId]/page.tsx and wire server prefetch + Hydrate.
5) UI: Create a URL-safe encoder/decoder for projectId (encode upload path; decode on server); document invariant.
6) Editor UI: Remove FileUploader; consume project data (bg-removed URL, defaults) for preview/controls.
7) Editor UI: Add “Projects’ generations” grid with animated <img> thumbnails and Download buttons.
8) Create Button: Orchestrate uploadStart → removeBackground with progress states; upon success, navigate to /editor/[projectId].
9) Home UI: Replace static PROJECTS with query to listProjects; render cards as specified; link to editor with encoded projectId.
10) Defaults: Load defaults from project; optionally wire updateProjectDefaults when user changes style/bgColor.
11) QA: Verify animated GIFs move in cards; verify user scoping; verify dates are formatted nicely; pagination smoke test.
12) Polish: Empty states, loading skeletons, error toasts; ensure mobile layouts remain intact.

13. Risks and Mitigations

- URL encoding errors for slashes in projectId → Use base64url or encodeURIComponent with a canonical decoder and unit tests.
- Ownership leakage → Always scope queries by userId and validate decoded path belongs to the current user.
- GIF thumbnails not animating → Use <img> tags or Next/Image with unoptimized to preserve animation.

14. Integration Notes

- Aliases: use ~/\* in Next.js app per repository conventions.
- Buckets: unchanged: “user-uploads”, “user-background-removed”, “user-results” (paths already segregated per user).
- Keep React Query integration via useTRPC hooks.

15. Cursor + RIPER-5 Guidance

- Cursor Plan mode: Import the “Implementation Checklist” and execute in order.
- RIPER-5:
  - RESEARCH: done; INNOVATE: converged; PLAN: this file.
  - Next, say “ENTER EXECUTE MODE” to begin implementing exactly as planned.
  - Mid-implementation check-in at ~50% (after step 6 or 7).
  - If scope changes, pause and update this plan before continuing.

What's Functional Now

- ✅ Project-based editor system fully implemented
- ✅ Home dashboard shows dynamic project cards with cover images, "Project N" titles, and formatted dates
- ✅ Create Gifavatar button orchestrates upload → background removal → navigation with progress states
- ✅ Editor route `/editor/[projectId]` loads project data client-side and displays background-removed image immediately
- ✅ "Projects' generations" grid shows all GIF generations for a project with animated thumbnails and Download buttons
- ✅ Editor defaults (style/bgColor) persist per project and restore when reopening
- ✅ All rendering is client-side using "use client" directive
- ✅ Project identity uses `UserUpload.id` (cuid) for clean, short URLs
- ✅ Database schema includes `sourceUploadId` (nullable) in UserResult and `defaultStyle`/`defaultBgColor` in UserUpload
- ✅ Existing editor upload/remove/generate flow and buckets remain stable; social referral stack unaffected

Deviations from Original Plan

1. **Project Identity**: Changed from path-based (with encoding) to ID-based (`UserUpload.id` cuid) - provides cleaner URLs and simpler implementation
2. **sourceUploadId Field**: Made nullable in UserResult to allow smooth migration of existing records
3. **Rendering Approach**: Removed server-side prefetching; all pages use client-side rendering with "use client" directive
4. **Verification Step**: Added data verification after background removal before navigation to ensure data is queryable

Lessons Learned

- Making new fields nullable initially allows smoother database migrations
- Client-side rendering simplifies error handling and debugging
- Using primary keys (cuid) for URLs is cleaner than encoding paths
- Verification step after mutations prevents race conditions with database commits
