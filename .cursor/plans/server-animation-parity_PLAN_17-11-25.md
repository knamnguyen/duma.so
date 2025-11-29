# Server Animation Parity Plan (17-11-25)

Status: ⏳
Owner: knam + AI
Goal: Make generated GIFs respect the animation style selected in the editor (beyond legacy), with visible parity for position/rotation/scale/opacity based styles. Keep performance acceptable.

## Current State (from research)

- Client supports many `photoMovement` styles via Framer Motion variants.
- Server renderer only understands a legacy set (`"rise-bottom" | "rise-left" | "rise-right"`) via `sampleTransform`, and ignores `addOnEffect`.
- tRPC input already accepts `animationStyle` but maps everything to legacy styles.

## Scope (Phase 1)

Implement server-side sampling for commonly used styles that can be expressed with position/rotation/scale/opacity:

- rise (already) → y motion + light wiggle/rotate
- pan → x motion (left/right) to center
- drift → slow sinusoidal x/y + small rotate
- baseline → subtle up-down
- stomp → bounce-esque y easing
- pop → scale in-out
- fade → opacity 0→1 ramp

Out of scope for Phase 1 (fallback to rise):

- blur/neon/scrapbook/tectonic/tumble/succession (need blur/convolution or complex paths)
- addOnEffect (rotate/flicker/pulse/wiggle) — can be a follow-up

## Design

Introduce a new server sampler that returns extended transform values per time t:

```
type ExtendedTransform = {
  x: number;
  y: number;
  rotate: number;
  scale?: number;    // default 1
  opacity?: number;  // 0..1, default 1
  blur?: number;     // px, default 0 (Phase 2)
}
```

- Add `samplePhotoMovement(photoMovement: string, t: number, duration: number, dims: {width:number;height:number}): ExtendedTransform` in `packages/api/src/motion-spec.ts` alongside (not replacing) the legacy `sampleTransform`.
- Generation loop will use this new sampler when `animationStyle.photoMovement` is provided; otherwise fall back to legacy mapping.

Per-frame application in `generateGif`:

1. Start from `baseCutout` (already contained, zoomed, and stroked).
2. Clone to `cut` per frame.
3. If `scale && scale !== 1`, resize `cut` by scale.
4. If `rotate !== 0`, rotate `cut`.
5. If `blur` (Phase 2), apply `cut.blur(blur)`.
6. If `opacity` is set, apply `cut.opacity(opacity)`.
7. Composite at `((width - cutW)/2 + offsetX + tr.x, (height - cutH)/2 + offsetY + tr.y)`.

Notes:

- Maintain existing still-frame logic and time-offset to avoid double-still.
- Keep stroke application order: contain → zoom → stroke → per-frame transforms.

## Implementation Checklist

1. packages/api/src/motion-spec.ts
   - Add `ExtendedTransform` type.
   - Implement `samplePhotoMovement` for Phase 1 styles using easing/math (reuse existing constants: fps, wiggle, rotateDeg as needed).
   - Provide reasonable defaults for styles that primarily influence scale/opacity.

2. packages/api/src/router/editor.ts
   - Log `input.animationStyle` for visibility.
   - Select sampler:
     - If `animationStyle?.photoMovement` is one of Phase 1 styles → use `samplePhotoMovement`.
     - Else → fallback to existing legacy mapping.
   - Update per-frame loop to apply `scale` and `opacity` if present.
   - Preserve rotate/x/y offsets and still-frame time offset.

3. Performance
   - Avoid mutating `baseCutout`; always `clone()` per frame as today.
   - Keep fps at 10; revisit only if performance regressions occur.

4. Type safety
   - Keep changes internal to `packages/api`; no client types leak.
   - Ensure no implicit any by annotating sampler return type.

5. Observability
   - Add debug logs (conditionally) for first few frames: selected style, first tr values.

6. Build & typecheck
   - `pnpm --filter @sassy/api typecheck`

7. Manual verification (see Acceptance Criteria).

## Acceptance Criteria

- Selecting Pan in editor yields a clear horizontal slide in the generated GIF.
- Drift shows gentle sinusoidal x/y motion in the generated GIF.
- Baseline shows a subtle up/down motion.
- Stomp shows a bounce-like y easing.
- Pop shows a visible scale pulse; scale reacts even when rotation/position are neutral.
- Fade ramps opacity from 0 to 1 within the first third of the animation.
- Rise continues to behave as before.
- Still-frame toggle yields exactly one 0.5s still when enabled; none when disabled.
- Background color, stroke order, position/zoom/rotate and duration continue to work as before.

## Follow-ups (Phase 2 / later)

- Implement blur-based styles (e.g., blur) using `cut.blur()` with per-frame amount.
- Add-on effects parity (secondary animation layer).
- Expand motion library to cover all client variants with closer easing parity.
