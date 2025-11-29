# Avatar Transform Controls - Plan

**Date:** 15-11-25  
**Complexity:** Simple  
**Status:** ⏳ PLANNED

## Overview

Add 6 new transform controls to the editor interface allowing users to customize avatar position, zoom, rotation, still frame, and GIF output size. All settings provide real-time preview updates and are applied during GIF generation. This extends the existing `AvatarConfig` pattern to support advanced positioning and scaling features.

**Quick Links:**

- [Goals and Success Metrics](#goals-and-success-metrics)
- [Scope](#scope)
- [Functional Requirements](#functional-requirements)
- [Implementation Checklist](#implementation-checklist)
- [Acceptance Criteria](#acceptance-criteria)

---

## Goals and Success Metrics

### Goals

1. Enable fine-grained control over avatar positioning within frame (X/Y percentage-based)
2. Allow zoom adjustment (0.1x to 10x) with proper cropping
3. Provide rotation control (-180° to +180°) applied before animations
4. Add optional still frame (0.5s fixed) at beginning of GIF
5. Allow custom GIF output dimensions (50px to 500px, square)

### Success Metrics

- All 6 controls visible and functional in Controls Card
- Real-time preview updates as sliders change
- Generated GIFs match preview exactly
- No performance degradation in preview or generation
- All existing functionality preserved

---

## Scope

### In Scope

- ✅ Position X/Y sliders (-50% to +50%, percentage-based, relative to center)
- ✅ Zoom slider (0.1x to 10x, crops/clips when out of bounds)
- ✅ Rotate slider (-180° to +180°, static offset before animation)
- ✅ Still frame toggle (checkbox, 0.5s fixed duration)
- ✅ GIF size slider (50px to 500px, square, default 200px)
- ✅ Real-time preview updates
- ✅ Backend GIF generation respects all settings
- ✅ Type definitions and state management

### Out of Scope

- ❌ Non-square GIF dimensions
- ❌ Configurable still frame duration (fixed at 0.5s)
- ❌ Persistence of transform settings to project defaults
- ❌ Additional validation beyond specified ranges
- ❌ Undo/redo for transform changes

---

## Assumptions and Constraints

### Assumptions

- Users understand percentage-based positioning (0% = center)
- Zoom values outside frame bounds are acceptable (crop/clip behavior)
- Still frame duration fixed at 0.5s is sufficient
- Real-time preview performance is acceptable for all transform combinations

### Constraints

- Must maintain compatibility with existing animation styles
- Transform calculations must match between preview and generation
- Backend must handle all transform combinations correctly
- No breaking changes to existing API contracts

---

## Functional Requirements

### Frontend Controls

1. **Position X Slider**
   - Range: -50% to +50%
   - Step: 1%
   - Default: 0% (center)
   - Display: Current value as percentage
   - Updates preview in real-time

2. **Position Y Slider**
   - Range: -50% to +50%
   - Step: 1%
   - Default: 0% (center)
   - Display: Current value as percentage
   - Updates preview in real-time

3. **Zoom Slider**
   - Range: 0.1x to 10x
   - Step: 0.1x
   - Default: 1.0x
   - Display: Current value as multiplier (e.g., "2.5x")
   - Updates preview in real-time
   - Images scale and clip when out of bounds

4. **Rotate Slider**
   - Range: -180° to +180°
   - Step: 1°
   - Default: 0°
   - Display: Current value as degrees
   - Updates preview in real-time
   - Applied as static offset before animation

5. **Still Frame Toggle**
   - Type: Checkbox
   - Default: Enabled (checked)
   - Label: "Add default still frame (0.5s) at beginning"
   - When enabled: Adds 0.5s (5 frames at 10fps) of static frame before animation

6. **GIF Size Slider**
   - Range: 50px to 500px
   - Step: 10px
   - Default: 200px
   - Display: Current value in pixels (e.g., "200px")
   - Updates preview in real-time
   - Output is square (width = height)

### Backend Generation

1. Accept all transform parameters in API request
2. Apply static transforms (zoom, rotate) to base image once
3. Calculate position offsets from percentage values
4. Generate still frames if enabled (0.5s worth at configured fps)
5. Apply position offsets per frame during animation
6. Output GIF at specified dimensions (square)
7. Maintain animation behavior with transforms applied

### Data Flow

- `editor-client.tsx` → manages `transformConfig` state
- `platform-selector-preview.tsx` → passes `transformConfig` in `avatarConfig`
- `AvatarPreview` → applies transforms via CSS transform property
- `generateGif` API → receives `transformConfig` and applies to GIF generation

---

## Non-Functional Requirements

### Performance

- Preview updates must be smooth (no lag during slider interaction)
- GIF generation must complete within reasonable time (no timeout)
- No memory leaks from real-time updates

### Usability

- Slider values clearly displayed next to controls
- Intuitive percentage-based positioning
- Checkbox label clearly states duration (0.5s)

### Compatibility

- Must work with all existing animation styles
- Must work with all existing platform previews
- No breaking changes to existing API

### Code Quality

- TypeScript types for all new properties
- Consistent with existing code patterns
- Proper error handling in backend

---

## Acceptance Criteria

1. ✅ All 6 controls visible in Controls Card in `editor-client.tsx`
2. ✅ Slider values display correctly (percentage, multiplier, degrees, pixels)
3. ✅ Still frame checkbox labeled with "0.5s" mention
4. ✅ Preview updates in real-time as any slider changes
5. ✅ Transforms apply correctly in preview (position, zoom, rotate)
6. ✅ Backend receives transform config in API request
7. ✅ Generated GIF matches preview (same transforms applied)
8. ✅ Still frames appear at beginning when enabled
9. ✅ Custom GIF dimensions work (50px to 500px)
10. ✅ Existing functionality (animations, bgColor) still works
11. ✅ No TypeScript errors or console errors
12. ✅ All edge cases handled (max zoom, rotation, sizes)

---

## Implementation Checklist

1. ✅ **Add shadcn/ui slider and checkbox components**
   - Run `cd packages/ui && pnpm ui-add slider checkbox`
   - Verify components created in `packages/ui/src/ui/`

2. ✅ **Extend AvatarConfig type with TransformConfig**
   - Create `TransformConfig` type in `apps/nextjs/src/app/_components/avatar-preview.tsx`
   - Add `transformConfig?: TransformConfig` to `AvatarConfig` type
   - Add `DEFAULT_TRANSFORM_CONFIG` constant with default values

3. ✅ **Update AvatarPreview component to apply transforms**
   - Calculate transform values from config (percentage to pixels, zoom, rotate)
   - Build CSS transform string (translate, scale, rotate)
   - Apply `transform` style to image containers (both animated and non-animated paths)

4. ✅ **Add transform state in editor-client**
   - Import `TransformConfig` type
   - Add `transformConfig` state with default values (positionX: 0, positionY: 0, zoom: 1, rotate: 0, enableStillFrame: true, gifSize: 200)
   - Initialize state in component

5. ✅ **Add UI controls to Controls Card**
   - Import Slider, Checkbox, Label components from `@sassy/ui/`
   - Add Position X slider with label and value display
   - Add Position Y slider with label and value display
   - Add Zoom slider with label and value display
   - Add Rotate slider with label and value display
   - Add Still Frame checkbox with label mentioning "0.5s"
   - Add GIF Size slider with label and value display
   - Style consistently with existing controls

6. ✅ **Pass transformConfig to PlatformSelectorPreview**
   - Add `transformConfig` prop to `PlatformSelectorPreview` component props
   - Update `PlatformSelectorPreviewProps` type
   - Pass `transformConfig` from `editor-client.tsx` to component

7. ✅ **Update platform-selector-preview to include transformConfig**
   - Include `transformConfig` in `avatarConfig` useMemo
   - Add `transformConfig` to dependency array
   - Verify config flows to `AvatarPreview` component

8. ✅ **Update generateGif API input schema**
   - Extend Zod input schema in `packages/api/src/router/editor.ts`
   - Add `transformConfig` object with all properties (positionX, positionY, zoom, rotate, enableStillFrame, gifSize)
   - Set validation ranges and default values

9. ✅ **Update backend generateGif logic - Extract config**
   - Extract `transformConfig` from input with defaults
   - Destructure all properties for use in generation

10. ✅ **Update backend generateGif logic - Custom dimensions**
    - Use `gifSize` for width and height (square)
    - Replace `MOTION.width` and `MOTION.height` with custom values

11. ✅ **Update backend generateGif logic - Pre-transform base image**
    - Apply zoom to base image if not 1.0 (resize)
    - Apply static rotation to base image if not 0° (rotate)
    - Perform before animation loop

12. ✅ **Update backend generateGif logic - Position offsets**
    - Calculate offsetX and offsetY from percentage values
    - Add offsets to position calculations per frame

13. ✅ **Update backend generateGif logic - Still frames**
    - Calculate still frame count (fps \* 0.5s) if enabled
    - Generate still frames before animation loop
    - Use base image with static transforms only (no animation)

14. ✅ **Update handleGenerate to pass transformConfig**
    - Add `transformConfig` to `generateGif.mutateAsync` call in `editor-client.tsx`

15. ✅ **Test real-time preview updates**
    - Verify all sliders update preview instantly
    - Test transform combinations (position + zoom + rotate)
    - Verify animations still work with transforms

16. ✅ **Test GIF generation**
    - Generate GIFs with various transform settings
    - Verify still frames appear when enabled
    - Verify custom dimensions work
    - Compare preview vs generated GIF

---

## Risks and Mitigations

### Risk: Transform calculations mismatch between preview and generation

**Mitigation:** Use same calculation logic (percentage to pixels conversion) in both frontend and backend. Test with edge cases.

### Risk: Performance degradation with real-time preview updates

**Mitigation:** Use React state efficiently, avoid unnecessary re-renders. Profile if needed.

### Risk: Backend timeout with complex transform combinations

**Mitigation:** Pre-transform base image (don't transform per frame). Test with maximum values.

### Risk: Preview doesn't match generated GIF

**Mitigation:** Ensure CSS transforms match backend image transformations. Test transform order (translate → scale → rotate).

---

## Integration Notes

### Dependencies

- Requires shadcn/ui slider and checkbox components (to be added)
- Uses existing Framer Motion for animations
- Uses existing Jimp for backend image manipulation
- Uses existing GIFEncoder for GIF generation

### Environment

- No new environment variables required
- No database schema changes required

### Data Model

- No database changes needed (transform config not persisted)
- API input schema extended (non-breaking addition)

### Files to Modify

1. `packages/ui/src/ui/slider.tsx` (NEW - add via shadcn)
2. `packages/ui/src/ui/checkbox.tsx` (NEW - add via shadcn)
3. `apps/nextjs/src/app/_components/avatar-preview.tsx` (extend types, apply transforms)
4. `apps/nextjs/src/app/editor/[projectId]/_components/editor-client.tsx` (state, controls, API call)
5. `apps/nextjs/src/app/editor/[projectId]/_components/platform-selector-preview.tsx` (pass config)
6. `packages/api/src/router/editor.ts` (extend schema, update generation logic)

---

## Cursor + RIPER-5 Guidance

### Cursor Plan Mode

- Import "Implementation Checklist" directly as TODO list
- Execute steps sequentially (1-16)
- Mark complete as each step is finished
- Use checklist to track progress

### RIPER-5 Mode

- ✅ **RESEARCH**: Completed - analyzed existing architecture, data flow, and components
- ✅ **INNOVATE**: Completed - explored implementation approaches and trade-offs
- ✅ **PLAN**: Current - this document is the implementation plan
- ⏳ **EXECUTE**: Ready to begin - implement exactly as specified in checklist
- ⏳ **REVIEW**: After execution - validate implementation matches plan, flag deviations

### Execution Process

1. Enter EXECUTE mode: User says "ENTER EXECUTE MODE"
2. Implement checklist items 1-16 in order
3. Test as you go (steps 15-16 are explicit testing)
4. After completion, enter REVIEW mode to validate against plan
5. If deviations found, document in Change Management section

### Mid-Implementation Check-in

- At ~50% completion (after step 8), provide status update
- Ask user to confirm continuing with current approach

---

**Next Step:** Enter EXECUTE mode to begin implementation: "ENTER EXECUTE MODE"
