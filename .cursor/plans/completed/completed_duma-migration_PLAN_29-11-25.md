# Duma App Migration Plan

**Date:** 29-11-25  
**Type:** COMPLEX (Multi-phase migration)  
**Status:** ⏳ Planning

## Overview

Migrate the entire Duma app from the Vite/React Router sample project (`0-sample-duma`) into the Next.js App Router application (`apps/nextjs`), replacing the current gifavatar app. The migration involves converting all features, components, and logic while maintaining Next.js 15 App Router patterns, Tailwind CSS v4, and existing infrastructure (Clerk auth, tRPC).

## Goals

1. **Complete Feature Migration**: All features from sample-duma must work in Next.js
2. **Tech Stack Preservation**: Keep Next.js App Router, Tailwind CSS v4, Clerk, tRPC
3. **Clean Replacement**: Remove gifavatar app code, replace with Duma app
4. **Mock Data Ready**: Maintain mock data structure for future API integration
5. **Component Adaptation**: Convert all components to Next.js patterns (Server/Client components)

## Scope

### Features to Migrate

1. **SwipeFeed** - Tinder-like activity discovery with swipe gestures
2. **ActivityCard** - Detailed activity cards with host info, participants, photos
3. **BottomNav** - 5-tab navigation (Profile, Create, Discover, Activities, Chat)
4. **Profile** - User profile page with stats
5. **HostedActivities** - Activities user is hosting with join request management
6. **MyActivities** - Activities user has joined (approved/pending status)
7. **Chat** - Messaging interface with conversations and message threads
8. **ActivityDetailDrawer** - Detailed activity view drawer
9. **UserProfileDrawer** - User profile drawer component
10. **Mock Data** - All mock data structures (Users, Activities, Conversations, JoinRequests)

### Infrastructure to Preserve

- Next.js 15 App Router structure
- Tailwind CSS v4 configuration
- Clerk authentication setup
- tRPC API infrastructure (can be extended later for real API)
- Package structure (@sassy/ui, @sassy/api, etc.)

### Code to Remove

- All gifavatar-specific components and pages
- Editor routes (`/editor/[projectId]`)
- Social referral page (unless needed)
- Platform preview components
- Avatar creation logic
- GIF rendering components

## Implementation Checklist

### Phase 1: Setup & Cleanup ⏳

1. **Backup Current State**
   - Document current gifavatar app structure
   - Note any dependencies that might be needed

2. **Remove Gifavatar Code**
   - Delete `src/app/page.tsx` (current homepage)
   - Delete `src/app/editor/[projectId]/` directory
   - Delete `src/app/social-referral/` directory (if not needed)
   - Delete `src/app/_components/` gifavatar-specific components:
     - `animation-style-selector.tsx`
     - `avatar-preview.tsx`
     - `create-gifavatar-button.tsx`
     - `gif-canvas-renderer.tsx`
     - `how-it-works-drawer.tsx`
     - `platform-preview/` directory
   - Delete `src/_components/` gifavatar components:
     - `auth-showcase.tsx`
     - `manage-subscription-button.tsx`
     - `subscribe-button.tsx`
     - `subscription-status.tsx`
   - Clean up unused imports in `layout.tsx`

3. **Update Dependencies**
   - Check if all required dependencies from sample-duma are in package.json
   - Add missing dependencies: `date-fns`, `sonner` (if not present)
   - Ensure shadcn/ui components are available via `@sassy/ui`

4. **Verify UI Package**
   - Ensure all shadcn/ui components used in sample-duma exist in `packages/ui`
   - Add missing components if needed (Drawer, ScrollArea, Progress, etc.)

### Phase 2: Mock Data Migration ⏳

5. **Create Mock Data Module**
   - Create `src/lib/mockData.ts` with all data structures:
     - `User` interface
     - `ActivityPost` interface
     - `JoinRequest` interface
     - `Message` interface
     - `Conversation` interface
     - `currentUser` constant
     - `mockUsers` array
     - `mockActivities` array
     - `mockJoinRequests` array
     - `mockConversations` array
   - Ensure all date objects use `new Date()` for proper serialization

6. **Create Utils Module**
   - Create `src/lib/utils.ts` with `cn()` function (if not exists)
   - Ensure compatibility with Tailwind CSS v4

### Phase 3: Component Migration ⏳

7. **Migrate Core Components**
   - Create `src/components/` directory structure
   - Migrate `ActivityCard.tsx`:
     - Convert to client component (`"use client"`)
     - Update imports to use `@sassy/ui` paths
     - Ensure date-fns formatting works
     - Test scroll area functionality
   - Migrate `SwipeFeed.tsx`:
     - Convert to client component
     - Update imports
     - Ensure swipe animations work
     - Test card stacking and transitions
   - Migrate `BottomNav.tsx`:
     - Convert to client component
     - Update imports
     - Ensure navigation state works
   - Migrate `Profile.tsx`:
     - Convert to client component
     - Update imports
     - Ensure stats display correctly
   - Migrate `HostedActivities.tsx`:
     - Convert to client component
     - Update imports
     - Ensure join request management works
     - Update toast notifications to use Next.js toast
   - Migrate `MyActivities.tsx`:
     - Convert to client component
     - Update imports
     - Ensure status filtering works
   - Migrate `Chat.tsx`:
     - Convert to client component
     - Update imports
     - Ensure conversation list and drawer work
     - Test message rendering
   - Migrate `ActivityDetailDrawer.tsx`:
     - Convert to client component
     - Update imports
     - Ensure drawer functionality works
   - Migrate `UserProfileDrawer.tsx`:
     - Convert to client component
     - Update imports
     - Ensure drawer functionality works

8. **Update Component Imports**
   - Replace all `@/components/ui/` imports with `@sassy/ui/[component-name]`
   - Replace all `@/lib/` imports with `~/lib/`
   - Replace all `@/components/` imports with `~/components/`
   - Replace all `@/assets/` imports with `~/assets/` or Next.js Image component

9. **Handle Assets**
   - Copy logo from sample-duma to `public/logo.png`
   - Update logo imports to use Next.js Image component or `/logo.png`
   - Ensure all image URLs in mock data are valid (using Unsplash URLs)

### Phase 4: Page Structure Migration ⏳

10. **Create Main Layout Structure**
    - Update `src/app/layout.tsx`:
      - Remove gifavatar-specific components
      - Keep ClerkProvider, ThemeProvider, TRPCReactProvider
      - Remove AppHeader (or replace with Duma header)
      - Remove HowItWorksDrawer
      - Add Toaster and Sonner toasts

11. **Create Home Page**
    - Create `src/app/page.tsx`:
      - Convert Index.tsx logic to Next.js page
      - Use client component for tab state management
      - Implement tab switching (home, create, activities, profile, chat)
      - Add header with logo and "Duma" title
      - Render appropriate component based on current tab
      - Include BottomNav component

12. **Update Global Styles**
    - Update `src/app/globals.css`:
      - Keep Tailwind CSS v4 imports
      - Add any custom styles from sample-duma `index.css`
      - Ensure color variables match Duma theme
      - Update CSS variables for Duma branding

13. **Create Not Found Page**
    - Update `src/app/not-found.tsx`:
      - Use NotFound component from sample-duma or create simple 404

### Phase 5: Navigation & State Management ⏳

14. **Implement Tab Navigation**
    - Use React state for tab management (client component)
    - Ensure BottomNav updates correctly
    - Handle tab persistence (optional: use URL params)

15. **Handle Client-Side Routing**
    - Since using tabs, no Next.js routing needed initially
    - Can add routes later if needed (e.g., `/activities/[id]`)

16. **State Management**
    - Use React useState for component state
    - Use React Query for future API integration (already set up)
    - Keep mock data in memory for now

### Phase 6: Styling & Theming ⏳

17. **Update Tailwind Config**
    - Ensure Tailwind CSS v4 config supports all classes used
    - Verify color variables match Duma theme
    - Test dark mode if applicable

18. **Update Theme Variables**
    - Update CSS variables in `globals.css`:
      - Match Duma color scheme from sample-duma
      - Ensure primary, secondary, accent colors match
      - Update border, background, foreground colors

19. **Test Responsive Design**
    - Ensure mobile-first design works
    - Test BottomNav on mobile
    - Test card layouts on different screen sizes
    - Ensure drawer components work on mobile

### Phase 7: Integration & Testing ⏳

20. **Test All Features**
    - Test SwipeFeed: swipe left/right, card transitions
    - Test ActivityCard: scroll, participant avatars, user profile drawer
    - Test BottomNav: tab switching, active states
    - Test Profile: stats display, interests
    - Test HostedActivities: join requests, approve/decline
    - Test MyActivities: approved/pending filtering
    - Test Chat: conversation list, message drawer, send message
    - Test Drawers: ActivityDetailDrawer, UserProfileDrawer

21. **Fix Import Issues**
    - Resolve any remaining import path issues
    - Ensure all components can be imported correctly
    - Fix any TypeScript errors

22. **Fix Runtime Errors**
    - Test all interactions
    - Fix any console errors
    - Ensure date formatting works correctly
    - Ensure image loading works

23. **Performance Optimization**
    - Ensure images use Next.js Image component where possible
    - Optimize component re-renders
    - Test loading states

### Phase 8: Cleanup & Documentation ⏳

24. **Remove Unused Code**
    - Remove any remaining gifavatar references
    - Clean up unused imports
    - Remove unused dependencies if safe

25. **Update Metadata**
    - Update `layout.tsx` metadata:
      - Change title to "Duma"
      - Update description
      - Update OpenGraph images
      - Update favicon if needed

26. **Documentation**
    - Update README.md with Duma app information
    - Document component structure
    - Document mock data structure for future API integration

## Technical Considerations

### Component Conversion Patterns

**Client Components:**

- All interactive components need `"use client"`
- Components with useState, useEffect, event handlers
- Components using browser APIs

**Server Components:**

- Layout can remain server component
- Static content pages can be server components

**Import Paths:**

- `@sassy/ui/[component]` for UI components
- `~/lib/` for utilities and mock data
- `~/components/` for custom components
- `~/app/` for app-specific code

### Date Handling

- Use `date-fns` for date formatting
- Ensure dates in mock data are proper Date objects
- Handle timezone considerations

### Image Handling

- Use Next.js `Image` component for logo
- Keep Unsplash URLs in mock data (external images)
- Consider optimizing images later

### State Management

- Use React state for UI state
- Use React Query for future API calls
- Keep mock data in memory for now

## Dependencies to Verify

- `date-fns` - Date formatting
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives (via @sassy/ui)
- `tailwindcss-animate` - Animations
- `class-variance-authority` - Component variants
- `clsx` & `tailwind-merge` - Class utilities

## Acceptance Criteria

✅ All features from sample-duma work in Next.js app  
✅ No gifavatar code remains  
✅ All components render correctly  
✅ Navigation works (tabs switch correctly)  
✅ All drawers open and close correctly  
✅ Mock data displays correctly  
✅ No console errors  
✅ Responsive design works  
✅ Tailwind CSS v4 styling works  
✅ Clerk auth infrastructure preserved (ready for future integration)  
✅ tRPC infrastructure preserved (ready for future API integration)

## Future Enhancements (Out of Scope)

- Replace mock data with real API calls via tRPC
- Add real-time chat functionality
- Add activity creation form
- Add user authentication flows
- Add activity filtering and search
- Add location-based features
- Add push notifications
- Add activity recommendations

## Notes

- Keep Clerk and tRPC infrastructure even though not used initially
- Mock data structure should match future API structure
- Components should be ready for API integration (use hooks/context)
- Consider adding loading states for future API calls
- Consider adding error boundaries for better error handling
