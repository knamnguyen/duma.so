Title: Platform Previews Expansion (Beacons, Dev.to, Discord, Fandom, Linktree, Medium, MyAnimeList, Patreon, Pixiv, Substack, VGen)\n
Date: 09-11-25\n
Complexity: Complex\n
\n
Overview: Expand the existing Gmail-style avatar preview system to provide lightweight, brand-accurate preview components for 11 additional platforms: Beacons, Dev.to, Discord, Fandom, Linktree, Medium, MyAnimeList, Patreon, Pixiv, Substack, and VGen. Each preview uses the exact same props contract as `GmailThreadPreview` and the shared `AvatarPreview`, emphasizes brand colors/logos, strips nonessential UI, and zooms in on the elements that best communicate each platform’s look. For `localUrl` fallback, use an OpenPeeps-generated data URL; for non-user participants (when present), use the existing `defaultRandomAvatar`.\n
\n
Quick Links: [Context and Goals](#1-context-and-goals) • [Architecture Decisions](#3-architecture-decisions-final) • [Component Details](#7-component-details) • [Phased Delivery Plan](#13-phased-delivery-plan) • [RFCs](#15-rfcs-strict-sequential) • [Cursor + RIPER-5 Guidance](#cursor-plan--riper-5-integration)\n
\n
Status: ✅ COMPLETED (Foundation + 11 platform phases)\n
\n
---\n
\n

## 1. Context and Goals\n

\n

- Provide a gallery of brand-faithful yet minimal platform previews that reuse our avatar pipeline and inputs from Gmail.\n
- Keep components UI-only and self-contained (no network calls). These are for demos, marketing, and the social-referral UX.\n
- Maintain a consistent props API across all previews:\n
  - `userName: string`\n
  - `userEmail: string`\n
  - `bgRemovedUrl?: string`\n
  - `localUrl?: string | null`\n
  - `previewStyle?: "rise-bottom" | "rise-left" | "rise-right"`\n
  - `bgColor?: string`\n
  - `isLoading?: boolean`\n
- Reuse branding assets (logos/colors) as already established in `apps/nextjs/src/app/social-referral/page.tsx`.\n
- Note: For each platform phase, the user will reattach a fresh screenshot to tune details; this plan captures the initial UI outline per platform using current screenshots under `apps/nextjs/src/app/_components/platform-preview/screenshots/`.\n
  \n

## 2. Non-Goals and Constraints\n

\n

- No backend/tRPC/database changes.\n
- No real content fetching from external platforms.\n
- No props beyond the Gmail preview contract.\n
- Keep UI purely illustrative; focus on clarity and recognizability over pixel-perfect clones.\n
  \n

## 3. Architecture Decisions (Final)\n

\n

1. Component co-location under platform-preview\n

- Path: `apps/nextjs/src/app/_components/platform-preview/`\n
- Each platform gets a single file: `[platform-kebab]-preview.tsx`\n
- Rationale: Aligns with existing `gmail-thread-preview.tsx` placement; promotes reuse and discoverability.\n
  \n

2. Shared header + brand utilities\n

- Create minimal, internal helpers (not a package): `PlatformHeader` and `renderPlatformIcon` usage mirroring `social-referral/page.tsx` patterns.\n
- Source brand colors/icons from the same places used by `social-referral` (simple-icons + local SVGs in `~/app/assets/logos`).\n
  \n

3. Avatar pipeline (unchanged API)\n

- Use `AvatarPreview` to render `bgRemovedUrl` or `localUrl` with motion via `previewStyle`.\n
- For `localUrl` fallback, use `useRandomPeepAvatar()` to supply an OpenPeeps data URL.\n
- For non-user participants (when needed), use `defaultRandomAvatar`.\n
  \n

4. Tailwind CSS v4 and accessibility\n

- Tailwind utility classes only, minimal layout wrappers, readable contrast.\n
- Provide `aria-label`/`alt` text on logos and key icons.\n
  \n

5. Visual style: “accentuate, strip, zoom”\n

- Accentuate: brand color header/indicators, title/labels typical to the platform.\n
- Strip: remove clutter (sidebars/footers/ads/toolbars not vital to recognition).\n
- Zoom: scale and spacing tuned to the central interaction (e.g., a link list for Linktree, a chat bubble for Discord, a post card for Dev.to/Medium/Substack).

6. Background presentation (card/galleries)

- Each preview card should sit on a light gradient background that contrasts with the platform palette (Beacons gradient is the reference). Keep gradients subtle and on the lighter side so the preview content remains legible while the brand still shines.
- If the gradient is part of the marketing gallery (as on the social referral page), prefer applying it at the wrapper level so the underlying preview components remain reusable elsewhere. Gmail, Linktree, and Beacons should all receive the gradient treatment in the gallery wrapper.

## 4. Architecture Clarification (Service Separation)\n

\n

- This is strictly UI. No changes to domain packages or services. Complies with service co-location: zero service code added.\n
  \n

## 5. High-level Data Flow (UI-only)\n

\n

````\n
Props → PlatformPreview (header + content) → AvatarPreview (masked image) → Optional brand badge/header\n
```\n
\n
## 6. Security Posture\n
\n
- No external calls, no secrets, no PII storage. Props are UI-only.\n
\n
## 7. Component Details\n
\n
### 7.1 Common building blocks (internal helpers)\n
\n
- PlatformHeader (internal, not exported):\n
  - Inputs: `logo` (ReactComponent|SimpleIcon via renderer), `brandColor: string`, `title: string`, `subtitle?: string`.\n
  - Renders a compact top bar or card header using `brandColor` background with logo at left and title/subtitle.\n
  - Use the same icon render logic/approach as `renderPlatformIcon` in `social-referral/page.tsx` (wrap Simple Icons when needed).\n
\n
- AvatarSlot (internal):\n
  - Wraps `AvatarPreview` with size defaults per platform.\n
  - Supplies OpenPeeps `localUrl` fallback via `useRandomPeepAvatar()` if `localUrl` is empty.\n
\n
### 7.2 Per-platform preview outlines

For each platform below, the preview:
- Reuses the Gmail props API.
- Displays `AvatarPreview` for the user; if a secondary participant is conceptually needed (like Discord), use `defaultRandomAvatar` for the other side.
- Emphasizes brand color and logo in a header/badge.
- References the attached screenshots for spacing and hard-coded sample copy so the UI feels authentic to that service.

1) Linktree (`linktree-preview.tsx`) — screenshot: `linktree.jpg`
- UI: Sage gradient header with centered avatar overlapping the curve, creator name + role, social icon row, and four stacked CTA buttons (`My Portfolio`, `Sign My Petition`, `Visit My Online Store`, `Contact Me`). Use Linktree leaf icon and lighten cards with subtle shadow.
- Hardcode sample tagline "Photographer" and button labels matching screenshot for baseline demo content.

2) Beacons (`beacons-preview.tsx`) — screenshot: `beacons.png`
- UI: Cream background with yellow CTA strips, avatar framed by rounded square border, profile headline, location line, and a carousel-like toggle pill ("Beacons" / "Try for free!"). Include social icon strip and gradient hero card. Brand pink (`#FF6FAE`) for accents.
- Hardcode profile name "Ky - Nam", location "San Francisco (soon)", and CTA copy "Book a call" with subtitle "please dm me first <3" plus the tab pill labels.

3) Pixiv (`pixiv-preview.tsx`) — screenshot: `pixiv.jpeg`
- UI: Wide hero banner with illustration, overlay profile info (followers count, buttons). Focus on dark blue background with bright highlight accents; show badges for commissions availability and sections (Commissions, Portfolio, Characters, etc.).
- Hardcode artist handle "画师JW", follower count, availability ribbon "Available for new projects", and CTA buttons like "Start request" to mirror screenshot.

4) Fandom (`fandom-preview.tsx`) — screenshot: `fandom.png`
- UI: Dark mode card with top navigation chips, article feed cell showing question + response, metadata (time, likes, comments). Use teal-pink gradient accent for header strip and the Fandom heart logo.
- Hardcode sample question "How can you obtain the original worldly manekin avatar if I didn't select that as my choice?" and include reply snippet similar to screenshot.

5) MyAnimeList (`myanimelist-preview.tsx`) — screenshot: `myanimelist.png`
- UI: Classic MAL dark theme: avatar left, stats table on right with counts per status, favorites list placeholder. Blue header labels, white grid background.
- Hardcode username `knamnguyen`, stats block (Watching 0, Completed 0, etc.), and header chips (`Anime List`, `Manga List`).

6) Dev.to (`dev-preview.tsx`) — screenshot: `dev.png`
- UI: Dark theme post card with comment thread structure, left gutter icons (likes/bookmarks), comment bubble content referencing quotes. Include DEV search bar header and left rail icons.
- Hardcode commenter handle `knamnguyen`, comment "Not a bad idea to be honest!", and highlight heart reaction count as shown.

7) Medium (`medium-preview.tsx`) — screenshot: `medium.png`
- UI: Black header with avatar, follower counts, tagline, and pill buttons (`Edit profile`). White cards for top posts optional later.
- Hardcode profile name "Written by Ky Nam Nguyen", follower/following counts (3 / 17), and tagline text from screenshot.

8) Substack (`substack-preview.tsx`) — screenshot: `substack.png`
- UI: Clean white card with avatar, title, subtitle, email subscribe form, and CTA buttons. Use orange accent for subscribe button.
- Hardcode newsletter title "Ky-Nam - the BS Tribe (Build Stuffs)", emoji, and email placeholder `knamnguyen.work@gmail.com`.

9) VGen (`vgen-preview.tsx`) — screenshot: `vgen.jpeg`
- UI: Dark neon interface with hero banner, availability chip, commissions list card with price button. Use bright lime accent for availability + CTA.
- Hardcode artist handle `nocnoc`, rating 5.0, order button "Start request", and status "Available for new projects".

10) Discord (`discord-preview.tsx`) — screenshot: `discord.png`
- UI: Server message list with channel header, unread banner, message bubbles including avatars and timestamps. Use blurple header indicator.
- Hardcode messages from screenshot participants (Gracey, Novac, Derek Savage) with exact timestamps and message copy.

11) Patreon (`patreon-preview.tsx`) — screenshot: `patreon.jpeg`
- UI: Dark hero banner with creator name, membership stats (116 paid members, $435.8/month), CTA buttons (Join for free, See membership options) with white/gray styling.
- Hardcode creator alias `callimohu` and the membership metrics shown.

## 8. Backend Endpoints and Workers\n
\n
- None (UI only).\n
\n
## 9. Infrastructure Deployment\n
\n
- None (included within Next.js app components).\n
\n
## 10. Database Schema (Prisma-style)\n
\n
- None.\n
\n
## 11. API Surface (tRPC/REST)\n
\n
- None.\n
\n
## 12. Real-time Event Model\n
\n
- None.\n
\n
## 13. Phased Delivery Plan\n
\n
Current Status:
- ✅ Gmail preview exists
- ✅ Phase 0: Foundation (shared header + helpers)
- ✅ Phase 1: Linktree (preview wired into social-referral)
- ✅ Phase 2: Beacons (preview + gallery integration)
- ✅ Phase 3: Pixiv preview implemented with compact card + social-referral wiring
- ✅ Phase 4: Fandom preview implemented with compact card + social-referral wiring
- ✅ Phase 5: MyAnimeList preview implemented with horizontal layout + social-referral wiring
- ✅ Phase 6: Dev.to preview implemented with light-themed card and emoji nav
- ✅ Phase 7: Medium preview implemented with white profile dashboard layout
- ✅ Phase 8: Substack preview renders newsletter card with subscribe CTA
- ✅ Phase 9: VGen preview delivers neon commission layout with availability chip
- ✅ Phase 10: Discord preview matches server log with unread banner + thread
- ✅ Phase 11: Patreon preview mirrors membership hero card + CTA set

### Phase 0: Foundation (Shared utilities)
- Overview: Add `PlatformHeader` helper, establish brand/icon imports, and OpenPeeps fallback wiring.
- Implementation Summary:
  - Build `PlatformHeader` internal helper used by all previews.
  - Add a local `brand` util (constant map or inline per file) referencing the same assets used by `social-referral`.
  - Wire `useRandomPeepAvatar()` fallback where `localUrl` is missing.
  - Establish gradient background presets so every preview renders on a subtle, lighter contrast backdrop aligned with its brand colors using the
    <Card
            className={cn(
              "relative overflow-hidden border-0 shadow-md",
              isGmailSelected ? "bg-white" : "",
            )}
            style={{
              background: `linear-gradient(135deg, ${ensureHashPrefix(
                currentPlatformDetail.brandColor,
              )}1a, ${ensureHashPrefix(currentPlatformDetail.brandColor)}cc)`,
              color: previewContrast,
            }}
          >
- Files/Modules:
  - `apps/nextjs/src/app/_components/platform-preview/` (new helpers within each preview file; no shared package)
  - Reuse: `~/app/assets/logos/*`, `simple-icons`, `AvatarPreview`, `defaultRandomAvatar`, `useRandomPeepAvatar()`
- What’s Functional Now:
  - `useResolvedAvatar` helper delivers OpenPeeps fallbacks and is consumed by Gmail + platform previews; Linktree component establishes the per-platform header pattern to replicate.
  - Beacons preview is wired into social referral with gradient background managed by the dashboard preview wrapper.
  - Pixiv preview now ships with localized Japanese profile content, intensified Pixiv blues, and avatar-stamped artwork chips while staying within the condensed card form factor.
  - Fandom preview renders the dark feed card with yellow-glow logo badge, compact interaction row, and inline reply ticker aligned to the reference screenshot.
  - MyAnimeList preview presents a horizontal card with the avatar/favorites row above condensed traffic-light stats, wired into the social referral selector.
  - Dev.to preview delivers the light-themed card with emoji nav, stacked reactions, and shortened copy wired into the gallery; Medium preview renders the white profile dashboard with a single “For you” article to keep the layout compact.


Each platform phase below will include: a header in brand color with logo, the platform-specific content block, and the avatar presentation.\n
\n
### Phase 1: Linktree
- Files: `linktree-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Avatar top, link list (2–3), brand logo + green header.
- Acceptance:
  - Uses exact Gmail-like props.
  - `AvatarPreview` renders user; OpenPeeps fallback on empty `localUrl`.
  - Logos/colors match `social-referral` sources.
  - Preview is imported and rendered in the social-referral gallery next to Gmail, reusing the brand metadata map.
  - Screenshot will be reattached to finalize spacing.

### Phase 2: Beacons
- Files: `beacons-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Pink brand header, rounded link tiles, Beacons SVG logo.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 09-11-25 — gradient background handled by social-referral preview wrapper.

### Phase 3: Pixiv
- Files: `pixiv-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Blue hero header, compact artist card, mini artwork thumbnails with avatar badge.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 09-11-25 — localized copy, intensified Pixiv blues, and avatar-stamped artwork tiles now mirror the plan specs within condensed layout.

### Phase 4: Fandom
- Files: `fandom-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Dark Fandom feed card with highlight chips, reply ticker, and brand glow.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 09-11-25 — condensed feed layout with yellow accent behind logo and active tab styling matches captured screenshot cues.

### Phase 5: MyAnimeList
- Files: `myanimelist-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Blue gradient header, horizontal card with avatar + favorites row, traffic-light status tiles.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 09-11-25 — condensed MAL layout with bright typography, favorites + nav in the first row, and colored status indicators in the second row.

### Phase 6: Dev.to
- Files: `dev-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: High-contrast post card with tags.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 10-11-25 — light-themed card with compact emoji nav, stacked reaction icons, and compact copy.

### Phase 7: Medium
- Files: `medium-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Clean post card with title + excerpt.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 10-11-25 — white dashboard profile card with single-article feed and compact CTA buttons.

### Phase 8: Substack
- Files: `substack-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Newsletter issue card with orange accent.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Implementation Notes:
  - Build a standalone `SubstackPreview` component that mirrors the layout conventions from existing previews (e.g., `MediumPreview`), keeping the props contract identical to Gmail.
  - Use a single card wrapper with a subtle border and drop shadow, brand accent stripe/button in Substack orange (`#${siSubstack.hex}`).
  - Include avatar block (via `AvatarPreview` + `useResolvedAvatar` fallback), publication title `Ky-Nam - the BS Tribe (Build Stuffs)`, subtitle tagline, email subscribe field placeholder `knamnguyen.work@gmail.com`, and CTA buttons (“Subscribe”, “View archive”).
  - Ensure accessible labels on buttons/form controls and maintain Tailwind utility structure consistent with other previews.

### Phase 9: VGen
- Files: `vgen-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Commission card with status chip, teal brand.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Implementation Notes:
  - Create a `VGenPreview` component with a vibrant dark gradient container, neon teal accent (`#39E0B5`), and layered cards reflecting the attached screenshot.
  - Present avatar via `AvatarPreview` along the hero banner, include creator handle `nocnoc`, 5.0 rating, availability pill “Available for new projects”, and “Start request” CTA button.
  - Add commission list section (e.g., “Animated Emotes”, “Chibi Portraits”) with pricing badges, maintaining readable contrast and consistent spacing with existing previews.
  - Reuse `useResolvedAvatar` fallback and keep optional secondary cards self-contained without extracting shared helpers.

### Phase 10: Discord
- Files: `discord-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Message row with left avatar column; compact channel header.
- Acceptance:
  - Two-party layout supported with `defaultRandomAvatar` for the non-user.
  - Same base criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 10-11-25 — blurple channel header, unread banner, and message thread now match the uploaded screenshot with `defaultRandomAvatar` handling non-user participants.

### Phase 11: Patreon
- Files: `patreon-preview.tsx`, gallery integration in `apps/nextjs/src/app/social-referral/page.tsx`
- Key UI: Creator card with join button; orange brand.
- Acceptance: Same criteria as Phase 1 (including social-referral wiring).
- Status: ✅ Completed 10-11-25 — dark hero banner with gift CTA, membership metrics, and twin buttons mirror the Patreon reference while keeping Gmail props parity.

Immediate Next Steps:\n
- All platform preview phases are complete; maintain screenshots and copy as new references arrive.\n
\n
## 14. Features List (MoSCoW)\n
\n
- Must: 11 preview components with shared props API; header/logo/brand color; `AvatarPreview` usage; OpenPeeps fallback; `defaultRandomAvatar` for non-user participants.\n
- Should: Minimal helpers (`PlatformHeader`, local brand icon renderer usage), accessible labels/alt text.\n
- Could: Optional subtle animations on link/button hover; optional badge overlays (like Gmail) where tasteful.\n
- Won’t: Fetch live data; introduce new packages; change AvatarPreview API.\n
\n
## 15. RFCs (STRICT sequential)\n
\n
### RFC-001: Shared Header + Brand Rendering\n
Summary: Create a consistent, minimal header block that shows platform logo and title with brand color background. Reuse the `renderPlatformIcon` approach from `social-referral` (Simple Icons vs SVG components) and import logos from `
````
