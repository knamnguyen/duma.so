# Social Refer Dashboard Plan

- **Date:** 08-11-25
- **Complexity:** Simple
- **Overview:** Build a dedicated `social-refer` page under the Next.js App Router that delivers a colorful, minimal dashboard (inspired by Beacons) where users can copy captions, share Gif Avatars, submit proof links, and review validation history using mock data and lightweight state.
- **Quick Links:** [Goals and Success Metrics](#goals-and-success-metrics) • [Scope](#scope) • [Functional Requirements](#functional-requirements) • [Acceptance Criteria](#acceptance-criteria) • [Implementation Checklist](#implementation-checklist)
- **Status:** ✅ Completed

## Goals and Success Metrics

- Present referral workflow in a single dashboard flow that feels polished and colorful like Beacons.
- Allow users to copy prefilled captions, submit social links, and view analytics/history from mock data.
- Validate share URLs client-side to guard against unsupported platforms.
- Show toast feedback for copy and submit actions.

### Success Metrics

- Users can select between all listed platforms and see preview swap instantly.
- Copy action provides feedback via toast.
- Submit action validates URL and shows success/error toast after a simulated delay.
- Submission history table renders six mock records with correct badges and engagement info.

## Scope

### In Scope

- New `apps/nextjs/src/app/social-refer/page.tsx` route with all dashboard UI.
- Local mock data for user credits, analytics, and submission history.
- Client-side state for selected platform, caption copy feedback, and pending submission indicator.
- Usage of shadcn components imported from `@ui` package.
- URL validation helper supporting X, LinkedIn, Threads, Facebook.
- Responsive layout using Tailwind CSS v4 utilities.

### Out of Scope

- Persisting submissions to backend or updating database.
- Integrating real API calls or authentication flows.
- Additional platforms beyond requested list.
- Complex global state or context beyond lightweight mock data.

## Assumptions and Constraints

- Tailwind CSS v4 and shadcn UI utilities already configured in monorepo.
- `@ui` package exports Card, Button, Input, Textarea, Table, Badge, Label (and related primitives).
- `lucide-react`, `date-fns`, and `sonner` available as workspace dependencies.
- No routing guard required; page can be accessed directly.

## Functional Requirements

- **Header:** Display title, subtitle, and right-aligned "Welcome, Demo User".
- **Platform Selector:** Grid buttons for 12 platforms with active styling for selected platform.
- **Preview:** Card showing selected platform name, placeholder image, contextual text.
- **Caption:** Scrollable textarea preset with supplied caption; copy button triggers toast.
- **Share Icons:** Render X, LinkedIn, Threads, Facebook icon buttons with hover states.
- **Submission:** Input for share URL, submit button disabled during mock API delay, toast feedback.
- **Analytics:** Cards for verifying, validated, rejected, current credits pulling from mock data.
- **History Table:** Display platform, link (truncated clickable), status badge with rescan counts, credits earned, last scanned date formatted via `date-fns`, and failure reason.
- **Brand Consistency:** Share buttons use the official X, LinkedIn, Threads, and Facebook icons, and the platform selector pairs each platform’s logo with its primary brand color.

## Non-Functional Requirements

- Layout responsive down to mobile via grid stacking and flex adjustments.
- Visual style mimics Beacons aesthetic: light background, rounded cards, accent gradients or soft colors.
- Ensure accessibility basics: buttons readable, icons with aria-labels, focus outlines.
- Code reuse ready for future data integration (mock data separated from UI logic).

## Acceptance Criteria

1. Navigating to `/social-refer` renders the full dashboard without console errors.
2. Selecting platform updates both active button styling and preview content immediately.
3. Copy caption button writes text to clipboard and shows success toast via `sonner`.
4. Submit button blocks invalid URLs and displays error toast; valid URLs show loading state for ~1.5s then success toast.
5. Analytics cards display `1 Verifying`, `2 Validated`, `3 Rejected`, `30 Current Credits` using mock totals.
6. Submission history table lists six entries with correct badge styling per status specification.
7. Rescan counts appear inline (e.g., `Validated 3/3`, `Validation 2/3 failed`).
8. Layout remains usable on screens ≥320px wide (buttons stack, cards wrap) with minimal horizontal scroll.
9. All imports for shadcn components originate from `@ui`.
10. Share buttons display recognizable official icons for X, LinkedIn, Threads, and Facebook using local SVG assets stored under `apps/nextjs/public/logos`.
11. Platform selector buttons render each platform’s logo atop its brand color while meeting accessibility contrast requirements (Simple Icons for most, local SVGs for Beacons/VGen).
12. ESLint/TypeScript builds pass (`pnpm lint` / `pnpm tsc --noEmit` within app).

## Implementation Checklist

1. Generate new route file `apps/nextjs/src/app/social-refer/page.tsx` exporting the dashboard page component.
2. Define platform metadata, analytics snapshot, and submission history mock data near top of file (typed with TypeScript interfaces).
3. Implement minimal helper utilities: `formatStatusBadge`, `truncateUrl`, and `validateShareUrl`.
4. Compose header section with page title, subtitle, and right-aligned welcome text.
5. Build first row grid: platform selector buttons (3-column on desktop, stacked on mobile) and platform preview card with gradient background.
6. Implement caption area: textarea bound to default caption, copy button with `navigator.clipboard.writeText` and toast feedback, share icon buttons using official icons (local SVGs or Simple Icons as appropriate).
7. Create submission form: URL input, submit handler with 1.5s `setTimeout`, toast outcomes, analytics cards summarizing verifying/validated/rejected/credits.
8. Render submission history table using `@ui` table components, formatting dates with `date-fns` and showing badges with icons per status mapping.
9. Apply Tailwind classes to achieve colorful minimal look (soft background, rounded cards, accent border/gradient selections) ensuring responsive breakpoints.
10. Implement platform selector buttons with their official logos and brand colors, ensuring contrast/accessibility; store bespoke assets (LinkedIn, Facebook, Beacons, VGen) in `apps/nextjs/public/logos`.
11. Manually verify interactions (selection, copy, submit) and run `pnpm lint` plus `pnpm --filter apps/nextjs tsc --noEmit` to confirm no type issues.

## Risks and Mitigations

- **Clipboard API unavailability:** Wrap call in try/catch and show error toast if denied.
- **URL validation false positives:** Keep validation simple (hostname check) and communicate future refinement need in comments.
- **Styling drift from Beacons aesthetic:** Use consistent spacing, rounded corners, soft palette, and test across light/dark backgrounds.

## Integration Notes

- No backend dependencies; prepared for future context integration by isolating mock data.
- Ensure required icons from `lucide-react` are imported individually to minimize bundle.
- If toast provider not already configured in layout, ensure existing root includes `<Toaster />` from `sonner`.

## Cursor + RIPER-5 Guidance

- Import the Implementation Checklist into Cursor Plan mode before coding.
- Follow RIPER-5 protocol: stay in RESEARCH while inspecting files, discuss any adjustments in INNOVATE, finalize updates here in PLAN, then wait for explicit `ENTER EXECUTE MODE` before modifying source files.
- If scope expands (e.g., real API integration), pause execution and update this plan rather than improvising in EXECUTE mode.
