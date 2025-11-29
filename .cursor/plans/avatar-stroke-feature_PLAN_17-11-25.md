# Avatar Stroke Feature Plan

**Date:** 17-11-25  
**Complexity:** Simple (one-session implementation)  
**Status:** ⏳ PLANNED

## Overview

Add a stroke/outline feature that allows users to add a customizable outline around the object in their background-removed avatar image. The stroke will be visible in both the real-time preview and the final generated GIF. Users can control stroke weight (0-50px) and stroke color via UI controls placed below the background color picker in the editor.

## Quick Links

- [Goals and Success Metrics](#goals-and-success-metrics)
- [Scope](#scope)
- [Functional Requirements](#functional-requirements)
- [Implementation Checklist](#implementation-checklist)
- [Acceptance Criteria](#acceptance-criteria)

## Goals and Success Metrics

**Primary Goal:** Enable users to add a visual outline/stroke around their avatar object to improve visibility and aesthetic appeal, especially when the avatar is placed on backgrounds with similar colors.

**Success Metrics:**

- Stroke feature is accessible and intuitive (UI controls visible and functional)
- Real-time preview accurately reflects stroke appearance
- Generated GIFs include the stroke as configured
- Stroke settings persist per project (optional enhancement)

## Scope

### In-Scope

- UI controls for stroke weight (slider: 0-50px) and stroke color (color picker)
- Client-side canvas processing for real-time preview stroke rendering
- Server-side Jimp processing to add stroke during GIF frame generation
- Stroke configuration state management in editor
- Integration with existing `AvatarPreview` component for preview display
- Integration with `generateGif` tRPC endpoint for final output

### Out-of-Scope

- Stroke style variations (dashed, dotted, etc.) - only solid stroke
- Multiple stroke layers
- Stroke animation effects
- Stroke persistence to project defaults (can be added later)

## Assumptions and Constraints

**Assumptions:**

- `bgRemovedUrl` images are PNG format with transparent backgrounds
- Jimp library supports edge detection and stroke drawing (may need custom implementation)
- Canvas API is available in browser for preview rendering
- Stroke should follow the alpha channel edge of the object

**Constraints:**

- Must work with existing animation system (stroke should be static, not animated)
- Must not significantly impact GIF generation performance
- Stroke rendering must be accurate to the object outline (not rectangular border)

## Functional Requirements

1. **UI Controls:**
   - Stroke weight slider: 0-50px range, step 1px, default 0 (disabled)
   - Stroke color picker: Full color picker (reuse `ColorPicker` component), default #000000
   - Controls placed below background color picker in editor controls panel
   - Controls only visible/enabled when `bgRemovedUrl` exists

2. **Preview Rendering:**
   - Real-time stroke rendering in `AvatarPreview` component
   - Stroke follows object outline (alpha channel edge detection)
   - Stroke appears correctly with all transform operations (zoom, rotate, position)
   - Stroke color and weight update immediately when controls change

3. **GIF Generation:**
   - Stroke applied to each frame during GIF generation
   - Stroke respects all transform configurations (position, zoom, rotate)
   - Stroke appears in both still frames and animated frames
   - Stroke processing does not significantly slow down generation

4. **State Management:**
   - Stroke config stored in component state: `{ enabled: boolean, weight: number, color: string }`
   - Stroke config passed to `AvatarPreview` via `AvatarConfig`
   - Stroke config passed to `generateGif` mutation

## Non-Functional Requirements

- **Performance:** Preview stroke rendering should not cause noticeable lag (<100ms)
- **Accuracy:** Stroke should accurately follow object edges, not create artifacts
- **Compatibility:** Works with all existing animation styles and transform configurations
- **User Experience:** Controls should be intuitive and match existing UI patterns

## Acceptance Criteria

1. ✅ Stroke weight slider appears below background color picker when `bgRemovedUrl` exists
2. ✅ Stroke color picker appears next to weight slider
3. ✅ Adjusting stroke weight (0-50px) updates preview in real-time
4. ✅ Changing stroke color updates preview in real-time
5. ✅ Stroke follows object outline accurately (not rectangular border)
6. ✅ Stroke appears correctly with zoom, rotate, and position transforms
7. ✅ Generated GIF includes stroke matching preview appearance
8. ✅ Stroke weight of 0 disables stroke (no visual effect)
9. ✅ Stroke works with all animation styles (rise, pan, fade, etc.)
10. ✅ Stroke appears in both still frames and animated frames of GIF

## Implementation Checklist

1. **Add stroke configuration state to `editor-client.tsx`:**
   - Add `strokeConfig` state: `{ enabled: boolean, weight: number, color: string }`
   - Initialize: `{ enabled: false, weight: 0, color: "#000000" }`
   - Add handlers: `handleStrokeWeightChange`, `handleStrokeColorChange`

2. **Create stroke UI controls component:**
   - Create `StrokeControls` component (or add to existing controls section)
   - Add stroke weight slider (0-50px, step 1)
   - Add stroke color picker (reuse `ColorPicker` component)
   - Place below background color picker in editor controls
   - Conditionally render only when `bgRemovedUrl` exists

3. **Update `AvatarConfig` type:**
   - Add `strokeConfig?: { enabled: boolean, weight: number, color: string }` to `AvatarConfig` type in `avatar-preview.tsx`
   - Update `TransformConfig` type if needed (or keep separate)

4. **Implement client-side stroke rendering for preview:**
   - Create utility function `applyStrokeToImage` using Canvas API
   - Function takes image URL, stroke config, returns canvas or data URL
   - Use edge detection on alpha channel to find object outline
   - Draw stroke by expanding non-transparent pixels outward
   - Integrate into `AvatarPreview` component to render stroked image

5. **Update `AvatarPreview` component:**
   - Accept `strokeConfig` from `config` prop
   - When `strokeConfig.enabled && strokeConfig.weight > 0`, apply stroke to image
   - Use canvas to render stroked version before displaying
   - Ensure stroke works with all transform operations

6. **Update `generateGif` tRPC endpoint input schema:**
   - Add `strokeConfig` to input schema in `packages/api/src/router/editor.ts`
   - Schema: `z.object({ enabled: z.boolean(), weight: z.number().min(0).max(50), color: z.string() }).optional()`

7. **Implement server-side stroke processing with Jimp:**
   - Create utility function `applyStrokeToJimpImage` in editor router
   - Function takes Jimp image, stroke config, returns new Jimp image with stroke
   - Use Jimp to detect alpha channel edges
   - Draw stroke by creating expanded version with stroke color, then composite original on top
   - Apply stroke to `baseCutout` before frame generation

8. **Update GIF generation logic:**
   - Apply stroke to `baseCutout` after loading and before transforms
   - Ensure stroke is applied before zoom, rotate, and position transforms
   - Stroke should appear in both still frames and animated frames

9. **Pass stroke config to preview components:**
   - Update `avatarConfig` in `editor-client.tsx` to include `strokeConfig`
   - Pass `strokeConfig` to `PlatformSelectorPreview` component
   - Ensure `AvatarPreview` receives stroke config in all preview contexts

10. **Test stroke with all scenarios:**
    - Test with different stroke weights (0, 5, 10, 50px)
    - Test with different stroke colors
    - Test with different zoom levels
    - Test with rotation
    - Test with position offsets
    - Test with all animation styles
    - Verify GIF output matches preview

11. **Handle edge cases:**
    - Stroke weight 0 should disable stroke (no processing)
    - Very thin strokes (1-2px) should still be visible
    - Stroke should not create artifacts on object edges
    - Stroke should work with images that have complex outlines

## Risks and Mitigations

**Risk 1: Performance impact of canvas processing in preview**

- _Mitigation:_ Use requestAnimationFrame for debouncing, cache stroked image when config unchanged

**Risk 2: Jimp stroke implementation complexity**

- _Mitigation:_ Research Jimp edge detection capabilities, consider using image processing library if needed, or implement custom algorithm

**Risk 3: Stroke accuracy on complex outlines**

- _Mitigation:_ Test with various image types, use proper edge detection algorithm (Sobel or similar)

**Risk 4: Stroke artifacts or visual glitches**

- _Mitigation:_ Thorough testing, consider anti-aliasing for smooth stroke edges

## Integration Notes

**Dependencies:**

- Existing: `ColorPicker` component (reuse for stroke color)
- Existing: `Slider` component (reuse for stroke weight)
- Existing: Jimp library (for server-side processing)
- New: Canvas API (browser-native, no new dependency)

**Environment:**

- No new environment variables needed
- No database schema changes needed
- No new tRPC router needed (extend existing `generateGif`)

**Data Model:**

- No database changes required (stroke config is session-only for now)
- Future: Could add `defaultStrokeWeight` and `defaultStrokeColor` to `UserUpload` table

**Files to Modify:**

- `apps/nextjs/src/app/editor/[projectId]/_components/editor-client.tsx` - State and UI controls
- `apps/nextjs/src/app/_components/avatar-preview.tsx` - Preview rendering
- `apps/nextjs/src/app/editor/[projectId]/_components/platform-selector-preview.tsx` - Pass stroke config
- `packages/api/src/router/editor.ts` - GIF generation logic
- `apps/nextjs/src/app/_components/color-picker.tsx` - (Reuse, no changes)

**New Files:**

- Optional: `apps/nextjs/src/app/_components/stroke-controls.tsx` - If creating separate component
- Optional: `apps/nextjs/src/utils/image-stroke.ts` - Client-side stroke utility
- Optional: `packages/api/src/utils/jimp-stroke.ts` - Server-side stroke utility

## Cursor + RIPER-5 Guidance

### Cursor Plan Mode

1. Import the "Implementation Checklist" section above into Cursor Plan mode
2. Execute steps sequentially, checking off each item as completed
3. Test after steps 4, 7, and 10 (milestone checkpoints)
4. Update this plan file with any deviations or learnings

### RIPER-5 Mode

- **RESEARCH:** ✅ Complete - Understood codebase structure, image processing flow, UI patterns
- **INNOVATE:** Consider stroke implementation approaches (canvas vs CSS filters, Jimp edge detection methods)
- **PLAN:** ✅ This document - Review and approve before execution
- **EXECUTE:** Implement exactly as specified in checklist
- **REVIEW:** Validate all acceptance criteria, flag any deviations
- **UPDATE PROCESS:** If scope changes or issues arise, update this plan and document decisions

### Next Steps

1. Review and approve this plan
2. Enter EXECUTE mode: "ENTER EXECUTE MODE"
3. Follow implementation checklist sequentially
4. Test at milestone checkpoints (after preview, after server-side, final integration)

---

**Plan Status:** Ready for execution upon approval
