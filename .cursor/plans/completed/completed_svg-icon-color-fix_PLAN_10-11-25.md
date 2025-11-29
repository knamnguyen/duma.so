## SVG Icon Color Fix Plan

**Date:** 10-11-25  
**Complexity:** Simple (one-session feature)  
**Status:** ✅ Completed

### Overview

Restore brand SVG colors (e.g., VGen, Facebook) on the social referral page. Currently SVGR’s `icon: true` setting converts all fills to `currentColor`, wiping multi-tone logos. We will split the SVGR configuration so brand assets under `apps/nextjs/src/app/assets/logos/` bypass icon mode, keeping their original fills. Monochrome glyphs elsewhere continue using `icon: true`.

### Goals and Success Metrics

- Multi-color SVG logos in platform selector/share buttons display brand colors.
- Monochrome icon pipeline remains unchanged.
- No broken imports or bundler errors in Next.js/Turbo builds.

### Scope (In/Out)

- **In:** Adjust webpack + Turbo rules in `apps/nextjs/next.config.js` to apply separate SVGR loader options. Validate affected components without code changes.
- **Out:** refactoring SVG assets, changing button styling, altering other components, or migrating icons to raster formats.

### Assumptions and Constraints

- All brand SVGs live under `apps/nextjs/src/app/assets/logos/`.
- Monochrome icons continue to rely on the icon-mode pipeline.
- Turbo config must mirror webpack behavior to avoid dev/prod drift.

### Functional Requirements

1. Configure webpack to use `@svgr/webpack` without `icon` option for logo SVGs.
2. Retain the existing `icon: true` loader for other SVGs (fallback rule).
3. Mirror loader split inside `experimental.turbo.rules`.
4. After rebuild, VGen and Facebook logos render with proper colors.

### Non-Functional Requirements

- Keep configuration minimal and readable.
- Ensure hot reload still works for logo SVG edits.
- Avoid duplicate processing or conflicting loaders.

### Acceptance Criteria

1. VGen tile in Step 1 shows the teal/charcoal icon instead of a monochrome dot.
2. Facebook share button shows blue circle with white “f”.
3. Other icons (Threads, etc.) remain unchanged.
4. `pnpm dev` runs without loader warnings.
5. No snapshot/render errors during tests or build.

### Implementation Checklist

1. ✅ Update webpack rule in `apps/nextjs/next.config.js` to add explicit loader for `assets/logos/**` without `icon: true`.
2. ✅ Add fallback rule (existing) limited to other SVGs with `icon: true`.
3. ✅ Mirror both rules inside `experimental.turbo.rules`.
4. ✅ Re-run dev build to validate logos render correctly; spot-check social-referral page.
5. ✅ Capture notes (if any) for future SVG additions in context or README.

### Risks and Mitigations

- **Risk:** Loader order mismatch causing double processing.  
  **Mitigation:** Use `oneOf`/regex specificity so logo rule takes precedence.
- **Risk:** Turbo config drift leading to dev/prod inconsistencies.  
  **Mitigation:** Update both webpack and turbo sections in the same commit.

### Cursor + RIPER-5 Guidance

- Import checklist into Cursor Plan mode.
- Follow RIPER-5: after PLAN approval, execute configuration updates exactly as specified, then test `pnpm dev`.
- If future SVG categories emerge, revisit loader split before implementing.

### Outcome & Notes

- VGen, Facebook, and other multi-tone logos now render with their original colors; monochrome glyphs remain icon-mode.
- Turbopack rules require an explicit empty `options: {}` object; loader config updated accordingly.
