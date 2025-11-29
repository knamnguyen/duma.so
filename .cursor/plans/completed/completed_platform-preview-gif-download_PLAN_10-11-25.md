## Platform Preview GIF Download Plan

**Date:** 10-11-25  
**Complexity:** Simple (one-session feature)  
**Status:** ✅ Completed

---

### Overview

Add a “Download GIF preview of your GifAvatar on &lt;platform&gt;” CTA beneath the twelve-platform selector on the social referral dashboard. When pressed, capture the rendered preview card (gradient background + selected platform mock + avatar rise animation) for ~5.5s and export a GIF named for the active platform. Provide toast-based success/error feedback.

### Goals and Success Metrics

- Users can export the animated preview without leaving the dashboard.
- GIF contains card gradient, platform UI, and the full avatar rise cycle (~5.5s).
- Download completes in &lt; 1 minute on modern desktop browsers and yields correct filename.
- Success path fires toast confirmation; errors are surfaced clearly.

### Scope (In/Out)

- **In:** CTA button, capture helper (client-side), lazy-loaded dependencies, GIF encoding via `gif.js`, toast feedback, disabled/loading state, deterministic filenames.
- **Out:** Alternative formats (PNG/WebM), mobile-specific layout updates, server rendering of GIFs, background task queueing, non-dashboard reuse.

### Assumptions and Constraints

- Fully client-side capture; no server assistance.
- Capture duration matches avatar animation constant (5_500 ms).
- `html-to-image` + `gif.js` acceptable additions to Next.js app.
- User manually triggers; no auto-downloads or scheduling.
- Acceptable to rely on CSS animations already present in previews.

### Functional Requirements

1. Button text reflects selected platform (e.g., “Download GIF preview of your GifAvatar on Discord”).
2. Button spans selector card width directly beneath the 12 platform buttons.
3. Button disabled + spinner during capture; re-enabled afterward.
4. Capture includes gradient card background and current preview component DOM.
5. Filename format: `gifavatar-preview-<platform-slug>.gif` (slugified).
6. Success toast on completion (“GIF download ready!”).
7. Error toast if capture fails or dependencies missing.
8. Works for all supported platforms in selector.

### Non-Functional Requirements

- Limit FPS (~12) to keep GIF manageable.
- Lazy-load capture libraries to avoid inflating initial bundle.
- Clean up object URLs after download.
- Handle Safari/Firefox gracefully; catch errors and inform user.

### Acceptance Criteria

1. CTA renders below platform grid, full width, with dynamic label.
2. Loading state shows spinner + disabled button while recording frames.
3. GIF contains full gradient card, platform UI, and avatar animation through one cycle.
4. Filename matches selected platform slug.
5. Success toast displayed on completion; error toast on failure.
6. No console errors in happy path.
7. Works across Gmail, Discord, Patreon, etc.

### Implementation Checklist (all ✅)

1. ✅ Add `gif.js`, `html-to-image`, and `@types/gif.js` to `@sassy/nextjs`.
2. ✅ Create `capturePreviewAsGif` helper that lazy-loads libs, samples frames, produces GIF blob.
3. ✅ Export animation duration constant from `AvatarPreview`.
4. ✅ Attach `ref` to preview `Card` container in `social-referral/page.tsx`.
5. ✅ Track `isCapturing` state and ensure `toast` availability.
6. ✅ Render full-width CTA beneath platform grid.
7. ✅ Implement handler to capture, slugify platform name, download GIF, and clean object URL.
8. ✅ Wire spinner + disabled state while capturing.
9. ✅ Manual testing: verify downloads for at least a couple of supported platforms.

### Risks and Mitigations

- **Large GIF files**: limited FPS, single-cycle duration.
- **Browser capture quirks**: using `html-to-image` to support modern color spaces; fallback toast on failure.
- **User impatience**: spinner + toast explain progress.
- **Memory leaks**: cleanup object URLs after download.

### Integration Notes

- Capture helper resides with platform preview components (`apps/nextjs/src/app/_components/platform-preview`).
- Social referral page imports helper and animation constant.
- No backend changes required; purely client-side.

### Cursor + RIPER-5 Guidance

- RESEARCH → PLAN completed; execution aligned with checklist.
- Import checklist into Cursor Plan mode for reference if revisited.
- Future tweaks (e.g., alternative formats) would need new planning if scope grows.

### Deviations / Lessons Learned

- Swapped from `html2canvas` to `html-to-image` because `html2canvas` lacks `oklch()` support, causing errors.
- Need to ensure future styling uses capture-compatible color functions or robust tools like `html-to-image`.
