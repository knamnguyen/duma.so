# GIF Generation Parity & Settings Application Plan (17-11-25)

Status: ⏳
Owner: knam + AI
Scope: Ensure editor settings (animation style, stroke, transform, duration) apply to generated GIFs with visual parity to preview.

## Findings (from research)

- Server currently forces `animationStyle` to legacy `"rise-bottom"` so changes appear ignored.
- Add-on effects (`rotate`, `pulse`, etc.) are not used by the server at all.
- Duration feels wrong because both the renderer and `sampleTransform` apply an initial 0.5s still → double still (~1.0s).
- Stroke is applied before zoom on server, making the resulting outline appear thicker than preview (order of operations differs).
- Transform sliders (position, zoom, rotate) are present in the payload and partially applied; need to keep parity with preview.

## Decisions

1. Minimal viable parity for `photoMovement`
   - Map `rise` → `rise-bottom` (existing behavior)
   - Map `pan` → horizontal slide using legacy: choose `rise-left` or `rise-right` deterministically from `positionX` (left if < 0 else right). If `positionX` is 0, default to `rise-right`.
   - All other movements fall back to `rise-bottom` for now (server feature gap).

2. Still-frame logic
   - Keep optional 0.5s still-frame controlled by `enableStillFrame`.
   - Avoid double-still by offsetting animation time passed to `sampleTransform` when manual still frames are rendered.

3. Stroke thickness parity
   - Apply `contain(width,height)`
   - Apply static zoom (resize)
   - Then apply stroke on the zoomed image (so stroke weight is in output pixels).
   - Rotate/position per-frame afterwards.

4. Leave add-on effects server-side as a future enhancement (not required for parity right now).

## Implementation Checklist

1. packages/api/src/router/editor.ts — Accept and log `animationStyle` (already in schema).
2. packages/api/src/router/editor.ts — Implement `photoMovement` mapping:
   - If `photoMovement === "rise"` → `legacyStyle = "rise-bottom"`.
   - If `photoMovement === "pan"` → `legacyStyle = positionX < 0 ? "rise-left" : "rise-right"` (0 defaults to right).
   - Else → `legacyStyle = "rise-bottom"`.
3. packages/api/src/router/editor.ts — Fix still logic:
   - If `enableStillFrame` is true, keep manual still frames for 0.5s.
   - When generating animation frames after the stills, pass `t + MOTION.stillSeconds` to `sampleTransform` to skip its internal still.
   - If `enableStillFrame` is false, render no manual still frames and pass `t` as-is to `sampleTransform`.
4. packages/api/src/router/editor.ts — Reorder stroke application:
   - Do `contain(width,height)`
   - Apply zoom resize
   - Then apply `applyStrokeToJimpImage` if enabled.
5. packages/api/src/router/editor.ts — Confirm rotate/position are applied post-stroke for both still and animated frames (already done, verify).
6. packages/api/src/router/editor.ts — Keep `animationDuration` usage as frame count; ensure perceived start is responsive by removing double-still as above.
7. packages/api/src/utils/jimp-stroke.ts — No functional changes, but confirm it operates in output pixel space; keep as-is.
8. apps/nextjs — No UI changes required; ensure `editor-client.tsx` continues to send `transformConfig`, `strokeConfig`, and `animationStyle`.
9. Build & typecheck:
   - `pnpm -w build`
   - Build affected packages at least: `packages/api`, `packages/ui` if needed.
10. Manual verification (acceptance tests below).

## Acceptance Criteria

- Changing `photoMovement` from Rise to Pan produces a horizontal slide (left or right based on `positionX` sign) in the generated GIF.
- Toggling “Static frame (0.5s) at beginning” results in exactly one 0.5s still period when enabled, and none when disabled.
- Adjusting `animationDuration` changes the on-screen motion duration (ignoring any optional still) with visible effect.
- Stroke thickness in the generated GIF matches the preview more closely across zoom levels (no “thicker than expected” when zoomed).
- Position X/Y, Zoom, and Rotate produce clearly visible changes in the generated GIF matching the preview intent.
- Background color in the generated GIF matches the selected color.

## Out of Scope (future)

- Server-side support for all preview movement variants and add-on effects.
- Exact pixel-perfect parity with Framer Motion easing/curves.

## Test Plan (manual)

1. Use a sample cutout, set bg to white, Rise + default duration, stroke disabled. Generate → baseline.
2. Enable stroke weight 6px, zoom 1.0; Generate → compare stroke thickness vs preview (should be close).
3. Set zoom to 1.8; Generate → stroke thickness should remain visually “6px-like” (no multiplicative thickening).
4. Change photoMovement to Pan, set positionX -10 → GIF slides from left; set positionX +10 → GIF slides from right.
5. Toggle Static frame ON: confirm ~0.5s still before motion; OFF: motion starts immediately.
6. Vary duration from 2s to 8s and confirm proportional motion length.

## Notes

- We purposefully keep server motion styles minimal to deliver reliable setting application quickly; richer motion parity can be added iteratively.
