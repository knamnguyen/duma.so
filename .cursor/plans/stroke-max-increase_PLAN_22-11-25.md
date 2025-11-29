# Stroke Maximum Increase Plan

**Date:** 22-11-25  
**Complexity:** Simple (one-session implementation)  
**Status:** ⏳ PLANNED

## Overview

Increase the maximum stroke weight limit from 20px to 50px to allow users to create bolder, more prominent outlines around their avatar objects. This change requires updating the UI slider maximum and the API validation schema.

## Quick Links

- [Goals and Success Metrics](#goals-and-success-metrics)
- [Scope](#scope)
- [Functional Requirements](#functional-requirements)
- [Implementation Checklist](#implementation-checklist)
- [Acceptance Criteria](#acceptance-criteria)

## Goals and Success Metrics

**Primary Goal:** Enable users to create larger stroke weights (up to 50px) for more dramatic visual effects and better visibility on various backgrounds.

**Success Metrics:**

- Users can set stroke weight up to 50px via the UI slider
- API accepts and processes stroke weights up to 50px
- No performance degradation with larger stroke values
- Existing projects with strokes ≤20px continue to work correctly

## Scope

### In-Scope

- Update UI slider maximum from 20px to 50px
- Update API validation schema maximum from 20px to 50px
- Update plan documentation to reflect new maximum

### Out-of-Scope

- Changing stroke rendering algorithm (already supports any weight)
- Adding stroke style variations
- Performance optimizations (not needed for this change)

## Assumptions and Constraints

**Assumptions:**

- Existing stroke processing logic (`applyStrokeToImage` and `applyStrokeToJimpImage`) already supports any weight value
- No performance issues expected with 50px strokes
- Users may want even larger strokes in the future (can be increased further if needed)

**Constraints:**

- Must maintain backward compatibility (existing projects with ≤20px strokes should work)
- Must update both client and server validation to prevent inconsistencies

## Functional Requirements

1. **UI Slider:**
   - Maximum value changed from 20px to 50px
   - Step size remains 1px
   - Minimum remains 0px

2. **API Validation:**
   - Maximum validation changed from 20px to 50px
   - Minimum validation remains 0px
   - Error messages should reflect new maximum if validation fails

3. **Documentation:**
   - Update original stroke feature plan to reflect new maximum
   - Update any acceptance criteria that reference 20px

## Non-Functional Requirements

- **Backward Compatibility:** Existing stroke configurations must continue to work
- **Performance:** No performance impact expected (stroke processing already handles variable weights)
- **User Experience:** Slider should remain responsive and intuitive at higher values

## Acceptance Criteria

1. ✅ Stroke weight slider allows values from 0px to 50px
2. ✅ API accepts stroke weight values up to 50px without errors
3. ✅ API rejects stroke weight values above 50px with appropriate error
4. ✅ Preview renders correctly with stroke weights up to 50px
5. ✅ Generated GIFs include strokes up to 50px correctly
6. ✅ Existing projects with strokes ≤20px continue to work
7. ✅ Plan documentation updated to reflect 50px maximum

## Implementation Checklist

1. **Update UI slider maximum in `editor-client.tsx`:**
   - File: `apps/nextjs/src/app/editor/[projectId]/_components/editor-client.tsx`
   - Line 323: Change `max={20}` to `max={50}`

2. **Update API validation schema in `editor.ts`:**
   - File: `packages/api/src/router/editor.ts`
   - Line 268: Change `.max(20)` to `.max(50)`

3. **Update original stroke feature plan documentation:**
   - File: `.cursor/plans/avatar-stroke-feature_PLAN_17-11-25.md`
   - Update all references to "20px" maximum to "50px":
     - Line 9: "0-20px" → "0-50px"
     - Line 33: "0-20px" → "0-50px"
     - Line 63: "0-20px range" → "0-50px range"
     - Line 96: "0-20px" → "0-50px"
     - Line 114: "0-20px" → "0-50px"
     - Line 138: `.max(20)` → `.max(50)`
     - Line 158: "20px" → "50px" in test case

## Risks and Mitigations

**Risk 1: Very large strokes may look excessive**

- _Mitigation:_ 50px is a reasonable maximum that provides flexibility without being excessive. Can be adjusted based on user feedback.

**Risk 2: Performance impact with larger strokes**

- _Mitigation:_ Existing stroke processing algorithms are efficient and should handle 50px without issues. Monitor performance if concerns arise.

**Risk 3: Inconsistency between client and server validation**

- _Mitigation:_ Update both validations in the same implementation to ensure consistency.

## Integration Notes

**Dependencies:**

- No new dependencies required
- Existing stroke processing functions already support variable weights

**Environment:**

- No environment variable changes needed
- No database schema changes needed

**Data Model:**

- No database changes required (stroke config is session-only)

**Files to Modify:**

- `apps/nextjs/src/app/editor/[projectId]/_components/editor-client.tsx` - UI slider maximum
- `packages/api/src/router/editor.ts` - API validation maximum
- `.cursor/plans/avatar-stroke-feature_PLAN_17-11-25.md` - Documentation update

**No New Files Required**

## Cursor + RIPER-5 Guidance

### Cursor Plan Mode

1. Import the "Implementation Checklist" section above into Cursor Plan mode
2. Execute steps sequentially, checking off each item as completed
3. Test after step 2 (verify API accepts/rejects correct values)
4. Test after step 1 (verify UI slider works correctly)

### RIPER-5 Mode

- **RESEARCH:** ✅ Complete - Identified two locations requiring updates (UI slider and API validation)
- **INNOVATE:** ✅ Complete - Decided on 50px as reasonable maximum (can be adjusted)
- **PLAN:** ✅ This document - Review and approve before execution
- **EXECUTE:** Implement exactly as specified in checklist
- **REVIEW:** Validate all acceptance criteria, flag any deviations

### Next Steps

1. Review and approve this plan
2. Enter EXECUTE mode: "ENTER EXECUTE MODE"
3. Follow implementation checklist sequentially
4. Test UI slider and API validation after implementation

---

**Plan Status:** Ready for execution upon approval
