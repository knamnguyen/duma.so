# Activity Creation & SwipeFeed Integration - Migration Plan

**Date**: 29-11-25  
**Complexity**: COMPLEX  
**Status**: ⏳ PLANNED

## Quick Links

- [Overview](#overview)
- [Architecture Decisions](#architecture-decisions)
- [Database Schema](#database-schema)
- [API Surface](#api-surface)
- [Phased Delivery Plan](#phased-delivery-plan)
- [RFC-001: Database Migration](#rfc-001-database-migration)
- [RFC-002: Activity API Endpoints](#rfc-002-activity-api-endpoints)
- [RFC-003: Frontend Integration](#rfc-003-frontend-integration)

---

## Overview

Migrate the Duma backend from legacy "Gif Avatar" project to support Activity Creation and SwipeFeed display. This is a foundational migration that enables users to create activities that appear in the swipe feed, establishing the core data flow for the social activity discovery app.

**Scope**:

- ✅ User signup already works (Clerk + Supabase URL configured)
- ✅ Create Activity functionality (host provides: name, description, tags, date/time, location)
- ✅ Unsplash API integration for activity images (based on name + tags)
- ✅ Activities appear in SwipeFeed (real activities first, then mock data fallback)
- ❌ Join/Registration flows (future phase)
- ❌ Share links (future phase)
- ❌ User profile customization (keep basic - Clerk name only)
- ❌ Supabase bucket image uploads (future phase)

**Success Criteria**:

- Authenticated user can create an activity via UI (name, description, tags, date/time, location)
- Unsplash API fetches images during creation based on activity name + tags
- Created activity appears in SwipeFeed for all users
- SwipeFeed shows real activities first, then mock activities (if no real activities exist)
- Activity data persists in database

---

## Context and Goals

### Current State

- **Frontend**: `apps/nextjs` has complete Duma UI with mock data (`src/lib/mockData.ts`)
- **Backend**: `packages/api` and `packages/db` contain legacy Gif Avatar models (`UserUpload`, `SocialSubmission`, etc.)
- **Auth**: Clerk integration working, user creation via webhook
- **Database**: Supabase PostgreSQL connected, Prisma configured

### Target State

- Database schema supports Activity model with proper relations
- tRPC endpoints for creating and listing activities
- SwipeFeed component fetches real activities from API
- Create Activity flow saves to database and refreshes feed

### Goals

1. **Data Layer**: Migrate schema to support Activity domain
2. **API Layer**: Expose Activity CRUD operations via tRPC
3. **Integration**: Connect SwipeFeed to real backend data
4. **User Experience**: Enable activity creation flow end-to-end

---

## Non-Goals and Constraints

### Out of Scope (This Phase)

- ❌ User join/registration flows (approve/reject participants)
- ❌ Activity sharing via links
- ❌ Image uploads (Supabase bucket setup deferred)
- ❌ Activity editing/deletion
- ❌ Activity filtering/search
- ❌ Real-time updates (polling acceptable for MVP)
- ❌ Chat functionality
- ❌ User profile updates beyond basic Clerk sync

### Constraints

- **No Supabase Bucket**: Use Unsplash API to fetch images dynamically during activity creation
- **Basic User Model**: Keep User model minimal - only Clerk sync fields (name, email, imageUrl). No custom profile fields yet.
- **Simplified Activity**: User provides only: name, description, tags, dateTime, location. Rest (maxParticipants, host details, etc.) use mock/defaults.
- **Mobile-First**: UI already optimized, maintain existing component structure
- **Legacy Cleanup**: Don't delete legacy models yet (keep for reference, mark as deprecated)
- **Clerk as Auth Source**: User data comes from Clerk, DB stores minimal local fields

---

## Architecture Decisions

### AD-001: Activity Model Design

**Decision**: Use single `Activity` model with status enum, separate `Participant` model for future join flows.

**Rationale**:

- Clean separation of concerns (Activity vs Participation)
- Participant model ready for future join/approval flows
- Status enum allows future states (OPEN, FULL, CANCELLED)

**Implications**:

- Need junction table for many-to-many relationship
- Queries require joins for participant counts
- Status management logic needed

### AD-002: Image Handling Strategy

**Decision**: Use Unsplash API to fetch images server-side during activity creation. Store image URLs in database.

**Rationale**:

- Provides high-quality, relevant images without user uploads
- Images match activity content (based on name + tags)
- No infrastructure setup needed (just API key)
- Easy to replace with Supabase bucket later

**Implications**:

- Need Unsplash API integration in activity creation endpoint
- Handle API failures gracefully (fallback to default image)
- Store multiple image URLs (cover + gallery) for future use
- Keywords = activity name + tags combined (flexible search)

### AD-003: User Profile Extension

**Decision**: Keep User model basic - only Clerk sync fields (name, email, imageUrl). No custom profile fields for MVP.

**Rationale**:

- Simplifies MVP - no custom forms needed
- Clerk provides name, which is sufficient for trial
- Can add profile fields later when needed
- Mock data can generate random profile details for display

**Implications**:

- User model stays minimal
- Frontend can use Clerk user data directly
- Mock data generation for display purposes (age, profession, etc.)

### AD-004: Activity Listing Strategy

**Decision**: Return real activities first, then append mock activities. Mix ensures feed always has content.

**Rationale**:

- First user sees content immediately (mock fallback)
- Real activities prioritized (appear first)
- Smooth user experience even with zero real activities

**Implications**:

- Query real activities from DB
- Append mock activities from `mockData.ts`
- Real activities ordered by dateTime ASC
- Mock activities appended after real ones

---

## Architecture Clarification

### Service Separation

- **Domain Logic**: Activity creation/validation logic belongs in `packages/api/src/router/activity.ts` (tRPC router)
- **Data Access**: Prisma queries in router procedures (no separate service layer for MVP)
- **Validation**: Zod schemas in `packages/validators` for shared validation

### Component Responsibilities

- **SwipeFeed**: Fetches activities via tRPC, displays cards, handles swipe gestures
- **Create Activity Form**: (Future component) Collects input, calls create mutation, refreshes feed
- **ActivityCard**: Displays activity data (already exists, just needs real data)

---

## High-level Data Flow

```
User Creates Activity:
1. User fills form (title, type, date, location, etc.)
2. Frontend calls tRPC mutation: activity.create
3. tRPC router validates input (Zod)
4. Prisma creates Activity record with hostId = ctx.user.id
5. Returns created activity
6. Frontend refreshes SwipeFeed query

SwipeFeed Displays Activities:
1. SwipeFeed mounts, calls tRPC query: activity.list
2. tRPC router queries Activity table (filter by date >= now, order by date)
3. Returns array of activities with host user data
4. SwipeFeed displays cards from real data
```

---

## Security Posture

### Authentication

- All Activity endpoints require `protectedProcedure` (Clerk auth)
- `hostId` automatically set from `ctx.user.id` (no user input)
- Users can only create activities, not modify others' activities (for now)

### Authorization

- Activity creation: Any authenticated user
- Activity listing: Any authenticated user (public feed)
- Future: Host can edit/delete own activities (not in this phase)

### Data Validation

- Zod schemas for all inputs
- Date/time validation (must be future)
- Max participants validation (2-10 range)
- String length limits (title, description)

---

## Component Details

### Backend: Activity Router (`packages/api/src/router/activity.ts`)

**Responsibilities**:

- Create activity (mutation)
- List activities for SwipeFeed (query)
- Get single activity details (query, for future use)

**Key Flows**:

1. **Create**: Validate input → Create Activity → Return created record
2. **List**: Query Activities with host relation → Filter by date → Return array

**Future Enhancements**:

- Update activity
- Delete activity
- Filter by type/location
- Pagination

### Frontend: SwipeFeed Integration

**Responsibilities**:

- Fetch activities via tRPC query
- Display ActivityCard components with real data
- Handle loading/error states

**Key Changes**:

- Replace `mockActivities` import with tRPC query
- Map API response to component props
- Handle empty state (no activities)

---

## Backend Endpoints and Workers

### tRPC Procedures

**Router**: `activity` (new router in `packages/api/src/router/activity.ts`)

**Procedures**:

1. **`create`** (mutation, protected)
   - Input: ActivityCreateInput (Zod schema)
   - Output: Activity with host relation
   - Creates Activity record with `hostId = ctx.user.id`

2. **`list`** (query, protected)
   - Input: Optional filters (date range, type)
   - Output: Array of Activity with host User data
   - Filters: `dateTime >= now()`, ordered by `dateTime ASC`

3. **`byId`** (query, protected) - Future use
   - Input: `{ id: string }`
   - Output: Single Activity with host and participants

---

## Infrastructure Deployment

### Database Migrations

- Prisma migration for new schema
- Run `pnpm db:push` or `prisma migrate dev` after schema changes
- No infrastructure changes needed (Supabase already configured)

### Environment Variables

- **New**: `UNSPLASH_ACCESS_KEY` - Unsplash API access key (required for Phase 2, see setup instructions below)
- Existing: `DATABASE_URL`, `DIRECT_URL`, Clerk keys

### Unsplash API Key Setup

**Step-by-Step Instructions**:

1. **Create Unsplash Developer Account**:
   - Go to https://unsplash.com/developers
   - Sign up or log in with your Unsplash account
   - Navigate to "Your Apps" → "New Application"

2. **Create New Application**:
   - Fill in application name (e.g., "Duma Activity Images")
   - Accept terms of service
   - Click "Create application"

3. **Get Access Key**:
   - After creating app, you'll see "Keys" section
   - Copy the "Access Key" (starts with something like `abc123...`)
   - **Note**: For demo/trial, you can use the demo/development key (50 requests/hour)

4. **Add to Environment**:
   - Add to root `.env` file: `UNSPLASH_ACCESS_KEY=your_access_key_here`
   - **Required**: Add to `apps/nextjs/src/env.ts` server schema:
     ```typescript
     server: {
       // ... existing vars ...
       UNSPLASH_ACCESS_KEY: z.string().min(1, "Unsplash API key is required"),
     },
     ```
   - **Do NOT hardcode** - use environment variable for security and flexibility

5. **Test API**:
   ```bash
   curl "https://api.unsplash.com/search/photos?query=coffee&per_page=5" \
     -H "Authorization: Client-ID YOUR_ACCESS_KEY"
   ```
   Should return JSON with image URLs.

**Rate Limits**:

- Demo/Development: 50 requests/hour
- Production: Requires upgrade (contact Unsplash for higher limits)

---

## Database Schema (Prisma)

### New Models

```prisma
enum ActivityType {
  WORKDATE
  STUDYDATE
  HANGOUT
  SPORTS
  EVENT
  OTHER
}

enum ActivityStatus {
  OPEN
  FULL
  CANCELLED
  COMPLETED
}

model Activity {
  id              String        @id @default(cuid())
  hostId          String
  type            ActivityType
  name            String        // User-provided activity name
  description     String        // User-provided description
  tags            String[]      // User-entered tags (array of strings)
  dateTime        DateTime      // User-provided date/time
  location        String        // User-provided location (name or address)

  // Auto-generated/mocked fields
  coverPhoto      String        // Unsplash image URL (fetched during creation)
  imageUrls       String[]      // Array of Unsplash image URLs (for gallery)
  maxParticipants Int           @default(4) // Mocked/default
  status          ActivityStatus @default(OPEN)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  host            User          @relation("HostedActivities", fields: [hostId], references: [id], onDelete: Cascade)
  participants    Participant[]

  @@index([hostId])
  @@index([dateTime])
  @@index([status, dateTime])
}

model Participant {
  id          String   @id @default(cuid())
  userId      String
  activityId  String
  status      ParticipantStatus @default(PENDING)
  joinedAt    DateTime @default(now())

  user        User     @relation("Participations", fields: [userId], references: [id], onDelete: Cascade)
  activity    Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)

  @@unique([userId, activityId])
  @@index([userId])
  @@index([activityId])
}

enum ParticipantStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### User Model (No Changes - Keep Basic)

```prisma
model User {
  id                   String     @id
  firstName            String?
  lastName             String?
  username             String?    @unique
  primaryEmailAddress  String    @unique
  imageUrl             String?
  clerkUserProperties  Json?
  stripeCustomerId     String?    @unique
  accessType           AccessType @default(FREE)
  stripeUserProperties Json?
  dailyAIcomments      Int        @default(0)
  creditConsumed       Int        @default(-2)
  createdAt            DateTime   @default(now())
  updatedAt            DateTime   @updatedAt

  // Relations
  hostedActivities Activity[]     @relation("HostedActivities")
  participations   Participant[]   @relation("Participations")
}
```

**Note**: User model stays basic - no custom profile fields. Clerk provides name/email/imageUrl which is sufficient for MVP.

### Legacy Models (Deprecated, Keep for Reference)

**Status**: ✅ Marked with `/// @deprecated` comments in schema

- `UserUpload` - ✅ Deprecated (Legacy Gif Avatar - used by editor router)
- `BackgroundRemoved` - ✅ Deprecated (Legacy Gif Avatar - used by editor router)
- `UserResult` - ✅ Deprecated (Legacy Gif Avatar - used by editor router)
- `SocialSubmission` - ✅ Deprecated (Legacy Social Referral - used by social router)
- `SocialPlatform` enum - ✅ Deprecated (Legacy Social Referral)
- `SocialSubmissionStatus` enum - ✅ Deprecated (Legacy Social Referral)

**User Model Legacy Fields**:

- `dailyAIcomments` - ✅ Deprecated (Legacy Gif Avatar - used by editor router)
- `creditConsumed` - ✅ Deprecated (Legacy Gif Avatar - used by editor and social routers)

**Decision**: Keep legacy models/fields functional but marked as deprecated. Both products (Gif Avatar + Duma) run in parallel. Future cleanup can remove these when Gif Avatar is fully deprecated.

---

## API Surface (tRPC)

### Router: `activity`

**Export in `packages/api/src/router/root.ts`**:

```typescript
export const appRouter = createTRPCRouter({
  // ... existing routers ...
  activity: activityRouter,
});
```

### Procedure Signatures

```typescript
// Create Activity
activity.create: protectedProcedure
  .input(activityCreateSchema)
  .mutation(async ({ ctx, input }) => Activity)

// List Activities (for SwipeFeed)
activity.list: protectedProcedure
  .input(activityListSchema.optional())
  .query(async ({ ctx, input }) => Activity[])

// Get Activity by ID (future)
activity.byId: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => Activity | null)
```

### Zod Schemas (in `packages/validators`)

```typescript
export const activityCreateSchema = z.object({
  type: z.enum([
    "workdate",
    "studydate",
    "hangout",
    "sports",
    "event",
    "other",
  ]),
  name: z.string().min(3).max(100), // Activity name
  description: z.string().min(10).max(500),
  tags: z.array(z.string().min(1).max(30)).min(1).max(10), // User-entered tags
  dateTime: z.date().refine((date) => date > new Date(), {
    message: "Activity date must be in the future",
  }),
  location: z.string().min(1).max(200), // Location name or address
});

export const activityListSchema = z.object({
  type: z
    .enum(["workdate", "studydate", "hangout", "sports", "event", "other"])
    .optional(),
  limit: z.number().int().min(1).max(100).default(50).optional(),
});
```

### Unsplash Integration Helper

**Create**: `packages/api/src/utils/unsplash.ts`

```typescript
/**
 * Fetches images from Unsplash API based on keywords
 * @param keywords - Combined activity name + tags
 * @returns Array of image URLs (cover photo + gallery)
 */
export async function fetchUnsplashImages(keywords: string): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || "YOUR_HARDCODED_KEY";

  // Make search flexible - use first few words if keywords too long
  const searchQuery = keywords.split(" ").slice(0, 5).join(" ");

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      results: Array<{
        urls: {
          regular: string;
          small: string;
        };
      }>;
    };

    if (!data.results || data.results.length === 0) {
      // Fallback to default placeholder
      return [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      ];
    }

    // Return array of image URLs (regular size for cover, small for gallery)
    return data.results.map((photo) => photo.urls.regular);
  } catch (error) {
    console.error("Unsplash API error:", error);
    // Fallback to default placeholder
    return [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    ];
  }
}
```

---

## Real-time Event Model

**Not applicable for this phase** - Using standard tRPC queries with React Query refetching.

Future: Consider tRPC subscriptions for real-time activity updates.

---

## Phased Delivery Plan

### Current Status

- ✅ **Phase 1**: Database Migration - COMPLETE
- ✅ **Phase 2**: Activity API Endpoints - COMPLETE
- ⏳ **Phase 3**: Frontend Integration - PLANNED

### Phase 1: Database Migration ✅/🚧/⏳

**Overview**: Update Prisma schema with simplified Activity model (name, description, tags, dateTime, location).

**Implementation Summary**:

- Add Activity model with user-provided fields + Unsplash image URLs
- Add Participant model (for future use)
- Add relations to User model (no custom fields added)
- Create Prisma migration
- Generate Prisma client

**Files/Modules Touched**:

- `packages/db/prisma/schema.prisma` (primary file to modify)
- `packages/db/generated/` (auto-generated after migration)

**Current Schema State**:

- User model exists (lines 27-42) - basic Clerk sync fields only
- Legacy models exist: UserUpload, BackgroundRemoved, UserResult, SocialSubmission (to be deprecated, not deleted)
- AccessType enum exists (lines 44-49)
- SocialPlatform and SocialSubmissionStatus enums exist (lines 86-99)

**What's Functional Now**:

- ✅ Database schema updated with Activity and Participant models
- ✅ ActivityType, ActivityStatus, ParticipantStatus enums added
- ✅ User model updated with relations (hostedActivities, participations)
- ✅ Prisma client generated with new types
- ✅ Database migration pushed successfully
- ✅ All types available for Phase 2 implementation

**Ready For Next**: Phase 2 (API endpoints with Unsplash integration)

### Phase 2: Activity API Endpoints ✅ COMPLETE

**Overview**: Create tRPC router with Unsplash integration for image fetching.

**Implementation Summary**:

- Create Unsplash helper utility (`packages/api/src/utils/unsplash.ts`)
- Create `activityRouter` with create/list procedures
- Integrate Unsplash API call in create mutation (fetch images based on name + tags)
- Add Zod schemas to `packages/validators`
- Wire router into root router
- Test endpoints via tRPC client

**Files/Modules Touched**:

- `packages/api/src/utils/unsplash.ts` (new) ✅
- `packages/api/src/router/activity.ts` (new) ✅
- `packages/api/src/router/root.ts` ✅
- `packages/validators/src/activity.ts` (new) ✅
- `packages/validators/src/index.ts` ✅
- `apps/nextjs/src/env.ts` ✅ (added UNSPLASH_ACCESS_KEY validation)
- `apps/nextjs/src/app/test-activity/page.tsx` (new) ✅ (test page for manual testing)

**What's Functional Now**:

- ✅ Unsplash utility function (`fetchUnsplashImages`) created with error handling and fallback
  - Fetches 15 photos from Unsplash API (1 cover + 14 gallery photos for "Previous Sessions")
  - Handles API failures gracefully with fallback placeholder
  - Uses first 5 words of keywords for flexible search
- ✅ Activity Zod schemas (`activityCreateSchema`, `activityListSchema`) created and exported
  - Validates activity creation input (type, name, description, tags, dateTime, location)
  - Validates future date requirement
  - Validates tag array (1-10 tags, each 1-30 chars)
- ✅ Activity router with three procedures:
  - `create` - Creates activity with Unsplash image fetching, validates future date, stores coverPhoto + imageUrls array
  - `list` - Lists future activities ordered by date ASC, includes host relation, supports optional type filter
  - `byId` - Gets single activity with host and participants (for future use)
- ✅ Router wired into root router (`activity: activityRouter`)
- ✅ All code compiles successfully (validators package verified, activity router verified)
- ✅ Environment variable (`UNSPLASH_ACCESS_KEY`) added to `env.ts` validation (optional, utility has fallback)
- ✅ Test page created at `/test-activity` for manual endpoint testing
- ✅ Successfully tested: Activity creation works, multiple photos fetched (14+ gallery photos), list endpoint returns activities

**Implementation Notes**:

- Unsplash photo count: Increased from 10 to 15 photos to ensure enough gallery photos (mock data shows 2-3 photos per activity, but we fetch more for variety)
- Environment variable: Made `UNSPLASH_ACCESS_KEY` optional in env.ts since utility has fallback - allows app to start even if key not set
- Photo storage: First photo → `coverPhoto`, remaining photos → `imageUrls` array (will be mapped to `activityPhotos` in Phase 3)

**Ready For Next**: Phase 3 (Frontend integration)

### Phase 3: Frontend Integration ✅ COMPLETE

**Overview**: Connect SwipeFeed to real API with mock data fallback, create activity creation form.

**Implementation Summary**:

- Update SwipeFeed to use tRPC query for real activities
- Append mock activities after real ones (for first user scenario)
- Create Activity creation form/modal (name, description, tags, date/time, location)
- Wire create mutation to form submission
- Handle loading/error states
- Show mixed feed (real first, mock bottom)

**Files/Modules Touched**:

- `apps/nextjs/src/components/SwipeFeed.tsx`
- `apps/nextjs/src/components/CreateActivityForm.tsx` (new)
- `apps/nextjs/src/app/page.tsx` (if needed for create button)

**Component Verification** (COMPLETE):

- ✅ Dialog component: `@sassy/ui/dialog` - Verified exists
- ✅ Select component: `@sassy/ui/select` - **Added via `pnpm ui-add select`**
- ✅ Form components: `@sassy/ui/form` - Verified exists with react-hook-form + Zod
- ✅ Input/Textarea: `@sassy/ui/input`, `@sassy/ui/textarea` - Verified exist
- ✅ Toast/Sonner: `@sassy/ui/sonner` - Verified exists and configured in layout
- ✅ Button: `@sassy/ui/button` - Verified exists

**Plan Refinements** (COMPLETE):

- ✅ Detailed type adapter function for API → ActivityPost mapping
- ✅ Form field implementations with FormField wrappers
- ✅ Tags input handling (comma-separated → array conversion)
- ✅ DateTime input handling (datetime-local → Date conversion)
- ✅ Dialog modal integration pattern
- ✅ Toast success/error handling
- ✅ Query invalidation pattern

**What's Functional Now**:

- ✅ SwipeFeed component fetches real activities from API via tRPC query
- ✅ Real activities appear first in feed, mock activities appended after
- ✅ Loading state overlay shows while fetching (doesn't block mock activities)
- ✅ Error handling: logs errors but continues with mock activities (never empty state)
- ✅ CreateActivityForm component created with all form fields:
  - Activity type (Select dropdown)
  - Name (Input)
  - Description (Textarea)
  - Tags (comma-separated Input → array conversion)
  - Date/Time (datetime-local Input → Date conversion)
  - Location (Input)
- ✅ Form validation using Zod schema (`activityCreateSchema`)
- ✅ Form submission calls tRPC create mutation
- ✅ Success toast + query invalidation + form reset + modal close on success
- ✅ Error toast on mutation failure
- ✅ Loading states: submit button disabled and shows "Creating..." during mutation
- ✅ Create Activity button added to header in main page
- ✅ Modal integration: Dialog wrapper with proper open/close state management
- ✅ Type adapter function: Maps API response (`RouterOutputs['activity']['list'][number]`) to `ActivityPost` interface

**Implementation Notes**:

- Type adapter uses `RouterOutputs` from `@sassy/api` for type safety
- Participants count defaults to 0 (not included in list query for performance)
- Tags input converts comma-separated string to array on change
- DateTime input converts datetime-local string to Date object
- Form uses react-hook-form with Zod resolver for validation
- Query invalidation refreshes SwipeFeed after activity creation

**Ready For Next**: Testing and refinement

---

## Features List (MoSCoW)

| ID    | Feature                             | Priority | Phase   |
| ----- | ----------------------------------- | -------- | ------- |
| F-001 | Create Activity API endpoint        | MUST     | Phase 2 |
| F-002 | List Activities API endpoint        | MUST     | Phase 2 |
| F-003 | Activity database schema            | MUST     | Phase 1 |
| F-004 | SwipeFeed displays real activities  | MUST     | Phase 3 |
| F-005 | Activity creation form UI           | MUST     | Phase 3 |
| F-006 | Unsplash API integration for images | MUST     | Phase 2 |
| F-007 | Mock data fallback in SwipeFeed     | MUST     | Phase 3 |
| F-008 | Activity filtering by type          | COULD    | Phase 2 |
| F-009 | Activity pagination                 | COULD    | Phase 2 |
| F-010 | Activity editing                    | WON'T    | Future  |
| F-011 | Activity deletion                   | WON'T    | Future  |
| F-012 | User profile customization          | WON'T    | Future  |

---

## RFCs

### RFC-001: Database Migration

**Title**: Migrate Database Schema for Activity Domain  
**Summary**: Add simplified Activity model (name, description, tags, dateTime, location) and Participant model. User model stays basic.  
**Dependencies**: None (foundational)

#### Stages

**Stage 1: Schema Design**

1. Review simplified requirements (name, description, tags, dateTime, location)
2. Design Activity model with user-provided fields + Unsplash image URLs
3. Design Participant model for future join flows
4. Keep User model basic (no custom fields)

**Stage 2: Prisma Schema Update**

1. Add `ActivityType` enum (WORKDATE, STUDYDATE, HANGOUT, SPORTS, EVENT, OTHER)
2. Add `ActivityStatus` enum (OPEN, FULL, CANCELLED, COMPLETED)
3. Add `ParticipantStatus` enum (PENDING, APPROVED, REJECTED)
4. Add `Activity` model with fields: name, description, tags (String[]), dateTime, location, coverPhoto, imageUrls (String[])
5. Add `Participant` model
6. Add relations to User model (hostedActivities, participations) - NO custom fields
7. Add indexes for performance

**Stage 3: Migration Execution**

1. Run `pnpm db:push` to push schema changes
2. Verify migration success
3. Generate Prisma client: `pnpm db:generate`
4. Verify generated types in `packages/db/generated/`

**Stage 4: Validation**

1. Check Prisma Studio: `pnpm db:studio`
2. Verify models appear correctly
3. Test creating Activity record manually (if needed)

#### Acceptance Criteria

- ✅ Activity model exists with: name, description, tags (String[]), dateTime, location, coverPhoto, imageUrls
- ✅ Participant model exists with proper relations
- ✅ User model has relations but NO custom profile fields added
- ✅ Prisma client generated successfully
- ✅ No migration errors
- ✅ Schema supports simplified activity creation flow

#### API Contracts / Data Models

See [Database Schema](#database-schema) section above.

#### What's Functional Now

- ✅ Database schema ready for Activity domain
- ✅ Prisma client includes Activity and Participant types
- ✅ All enums (ActivityType, ActivityStatus, ParticipantStatus) available
- ✅ User model relations configured
- ✅ Database migration completed successfully
- ✅ Zod validators generated for Activity and Participant

#### Ready For

- Phase 2: Creating tRPC endpoints that use Activity model

#### Implementation Checklist

**Pre-Flight Checks**:

1. Verify current working directory is project root: `/Users/knamnguyen/Documents/0-Programming/duma`
2. Verify `.env` file exists in root with `DATABASE_URL` and `DIRECT_URL` set
3. Verify database connection: Run `pnpm db:studio` briefly to confirm connection works

**Exact Schema Code to Add**:

Place enums after `AccessType` enum (around line 49):

```prisma
enum ActivityType {
  WORKDATE
  STUDYDATE
  HANGOUT
  SPORTS
  EVENT
  OTHER
}

enum ActivityStatus {
  OPEN
  FULL
  CANCELLED
  COMPLETED
}

enum ParticipantStatus {
  PENDING
  APPROVED
  REJECTED
}
```

Place Activity model after `SocialSubmission` model (around line 127):

```prisma
model Activity {
  id              String        @id @default(cuid())
  hostId          String
  type            ActivityType
  name            String
  description     String
  tags            String[]
  dateTime        DateTime
  location        String
  coverPhoto      String
  imageUrls       String[]
  maxParticipants Int           @default(4)
  status          ActivityStatus @default(OPEN)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  host            User          @relation("HostedActivities", fields: [hostId], references: [id], onDelete: Cascade)
  participants   Participant[]

  @@index([hostId])
  @@index([dateTime])
  @@index([status, dateTime])
}
```

Place Participant model after Activity model:

```prisma
model Participant {
  id          String           @id @default(cuid())
  userId      String
  activityId  String
  status      ParticipantStatus @default(PENDING)
  joinedAt    DateTime         @default(now())

  user        User             @relation("Participations", fields: [userId], references: [id], onDelete: Cascade)
  activity    Activity         @relation(fields: [activityId], references: [id], onDelete: Cascade)

  @@unique([userId, activityId])
  @@index([userId])
  @@index([activityId])
}
```

Update User model (add these lines inside the User model block, after existing fields but before closing brace):

```prisma
  // Relations (add these inside User model)
  hostedActivities Activity[]     @relation("HostedActivities")
  participations   Participant[]   @relation("Participations")
```

**Schema Modification**:

4. Open `packages/db/prisma/schema.prisma` in editor
5. **Add enums AFTER AccessType enum (after line 49, before User model)**:
   - Add `ActivityType` enum with values: WORKDATE, STUDYDATE, HANGOUT, SPORTS, EVENT, OTHER
   - Add `ActivityStatus` enum with values: OPEN, FULL, CANCELLED, COMPLETED
   - Add `ParticipantStatus` enum with values: PENDING, APPROVED, REJECTED
6. **Add Activity model AFTER SocialSubmission model (after line 127, before end of file)**:
   - Fields: `id String @id @default(cuid())`
   - Fields: `hostId String` (will reference User.id)
   - Fields: `type ActivityType`
   - Fields: `name String` (user-provided activity name)
   - Fields: `description String` (user-provided description)
   - Fields: `tags String[]` (user-entered tags array)
   - Fields: `dateTime DateTime` (user-provided date/time)
   - Fields: `location String` (user-provided location name/address)
   - Fields: `coverPhoto String` (Unsplash image URL - first image from API)
   - Fields: `imageUrls String[]` (Unsplash image URLs array - for gallery)
   - Fields: `maxParticipants Int @default(4)` (mocked/default value)
   - Fields: `status ActivityStatus @default(OPEN)`
   - Fields: `createdAt DateTime @default(now())`
   - Fields: `updatedAt DateTime @updatedAt`
   - Relation: `host User @relation("HostedActivities", fields: [hostId], references: [id], onDelete: Cascade)`
   - Relation: `participants Participant[]`
   - Indexes: `@@index([hostId])`, `@@index([dateTime])`, `@@index([status, dateTime])`
7. **Add Participant model AFTER Activity model**:
   - Fields: `id String @id @default(cuid())`
   - Fields: `userId String` (references User.id)
   - Fields: `activityId String` (references Activity.id)
   - Fields: `status ParticipantStatus @default(PENDING)`
   - Fields: `joinedAt DateTime @default(now())`
   - Relation: `user User @relation("Participations", fields: [userId], references: [id], onDelete: Cascade)`
   - Relation: `activity Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)`
   - Unique constraint: `@@unique([userId, activityId])` (prevent duplicate participations)
   - Indexes: `@@index([userId])`, `@@index([activityId])`
8. **Update User model (lines 27-42)** - ADD relations ONLY, NO new fields:
   - Add relation: `hostedActivities Activity[] @relation("HostedActivities")`
   - Add relation: `participations Participant[] @relation("Participations")`
   - **CRITICAL**: Do NOT add any new fields to User model (keep firstName, lastName, username, primaryEmailAddress, imageUrl, etc. as-is)

**Migration Execution**:

9. Save `schema.prisma` file
10. Run `pnpm db:push` from root directory (this pushes schema to database without creating migration files)
11. **Verify migration output**: Check terminal for:
    - "Database schema pushed successfully" or similar success message
    - No error messages about missing relations or invalid types
    - If errors occur, review schema syntax and fix before proceeding
12. Run `pnpm db:generate` from root directory (generates Prisma client with new types)
13. **Verify generation output**: Check terminal for:
    - "Generated Prisma Client" success message
    - No TypeScript errors in generated files
    - Generated files appear in `packages/db/generated/node/` and `packages/db/generated/edge/`

**Validation**:

14. Run `pnpm typecheck` from root to verify no TypeScript compilation errors
15. Open Prisma Studio: Run `pnpm db:studio` from root
16. **Verify in Prisma Studio**:
    - Activity model appears in left sidebar
    - Participant model appears in left sidebar
    - User model shows new relations (hostedActivities, participations)
    - Click on Activity model - verify all fields are present (name, description, tags, dateTime, location, coverPhoto, imageUrls, etc.)
    - Click on Participant model - verify fields and relations are correct
17. **Optional manual test**: In Prisma Studio, try creating a test Activity record:
    - Select Activity model
    - Click "Add record"
    - Fill required fields (hostId must be valid User.id from existing User record)
    - Verify save succeeds
    - Delete test record after verification
18. Close Prisma Studio (Ctrl+C in terminal)

**Post-Migration Verification**:

19. Check that `packages/db/generated/zod-prisma-validators/` contains Activity and Participant validators (if zod generator is configured)
20. Verify no breaking changes to existing code (run `pnpm typecheck` across all packages)
21. Document any schema decisions or notes for Phase 2

**Success Criteria**:

- ✅ All three enums added (ActivityType, ActivityStatus, ParticipantStatus)
- ✅ Activity model created with all required fields and relations
- ✅ Participant model created with proper relations and constraints
- ✅ User model updated with relations only (no new fields)
- ✅ Migration pushed successfully to database
- ✅ Prisma client generated with new types
- ✅ No TypeScript errors
- ✅ Models visible in Prisma Studio

---

### RFC-002: Activity API Endpoints

**Title**: Create tRPC Router for Activity Operations with Unsplash Integration  
**Summary**: Implement create and list endpoints with Unsplash API integration for image fetching.  
**Dependencies**: RFC-001 (Database Migration)

#### Stages

**Stage 1: Unsplash Utility Creation**

1. Create `packages/api/src/utils/unsplash.ts`
2. Implement `fetchUnsplashImages()` function
3. Handle API errors with fallback placeholder
4. Make search flexible (use first 5 words of keywords)

**Stage 2: Zod Schema Creation**

1. Create `activityCreateSchema` in `packages/validators` (name, description, tags, dateTime, location)
2. Create `activityListSchema` in `packages/validators`
3. Export schemas from `packages/validators/src/index.ts`

**Stage 3: Activity Router Implementation**

1. Create `packages/api/src/router/activity.ts`
2. Import Unsplash utility and necessary dependencies (tRPC, Prisma, Zod)
3. Implement `create` mutation: validate input → fetch Unsplash images → create Activity
4. Implement `list` query with filtering
5. Add proper error handling

**Stage 3: Router Integration**

1. Import activityRouter in `packages/api/src/router/root.ts`
2. Add to appRouter: `activity: activityRouter`
3. Verify TypeScript compilation

**Stage 4: Testing**

1. Test create endpoint via tRPC client (or manual API call)
2. Test list endpoint returns activities
3. Verify error handling for invalid inputs

#### Acceptance Criteria

- ✅ Unsplash utility function fetches images based on keywords
- ✅ Unsplash utility handles API failures gracefully (fallback placeholder)
- ✅ `activity.create` mutation accepts valid input (name, description, tags, dateTime, location)
- ✅ `activity.create` calls Unsplash API with combined name + tags
- ✅ `activity.create` stores coverPhoto and imageUrls from Unsplash response
- ✅ `activity.create` sets `hostId` from authenticated user
- ✅ `activity.create` validates date is in future
- ✅ `activity.list` query returns activities ordered by date
- ✅ `activity.list` filters out past activities (dateTime >= now)
- ✅ Router exported in root router
- ✅ TypeScript types generated correctly

#### API Contracts

**Create Mutation**:

```typescript
input: {
  type: 'workdate' | 'studydate' | 'hangout' | 'sports' | 'event' | 'other'
  name: string (3-100 chars) // Activity name
  description: string (10-500 chars)
  tags: string[] (1-10 tags, each 1-30 chars) // User-entered tags
  dateTime: Date (must be future)
  location: string (1-200 chars) // Location name or address
}
output: Activity (with host User relation, coverPhoto and imageUrls from Unsplash)
```

**Unsplash Integration**:

- Keywords = `${name} ${tags.join(' ')}` (combined)
- Search uses first 5 words for flexibility
- Returns array of image URLs (regular size)
- First URL = coverPhoto, rest = imageUrls array

**List Query**:

```typescript
input?: {
  type?: ActivityType
  limit?: number (1-100, default 50)
}
output: Activity[] (with host User relation)
```

#### What's Functional Now

- ✅ Backend API ready for activity creation and listing
- ✅ Frontend can call these endpoints via tRPC
- ✅ Unsplash integration fetches 15 photos (1 cover + 14 gallery)
- ✅ All endpoints tested and working via test page (`/test-activity`)
- ✅ Multiple photos stored correctly in database (`coverPhoto` + `imageUrls` array)

#### Ready For

- Phase 3: Frontend integration

#### Implementation Checklist

**Pre-Flight Checks**:

1. **Add Unsplash API key to environment** (required before starting):
   - Follow setup instructions in [Unsplash API Key Setup](#unsplash-api-key-setup) section below
   - Add `UNSPLASH_ACCESS_KEY` to root `.env` file
   - Add `UNSPLASH_ACCESS_KEY` to `apps/nextjs/src/env.ts` server schema (add to `server` object)
   - Verify environment variable is accessible: `process.env.UNSPLASH_ACCESS_KEY`

**Implementation Steps**:

2. Create `packages/api/src/utils/unsplash.ts`
3. Import `fetch` (or use node-fetch if needed)
4. Create `fetchUnsplashImages(keywords: string)` async function
5. Get `UNSPLASH_ACCESS_KEY` from `process.env.UNSPLASH_ACCESS_KEY` (throw error if missing)
6. Build search query: take first 5 words of keywords: `keywords.split(' ').slice(0, 5).join(' ')`
7. Make fetch request to Unsplash API: `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10`
8. Add Authorization header: `Client-ID ${accessKey}`
9. Parse response JSON and extract image URLs from `results[].urls.regular`
10. Handle errors: return fallback placeholder URL array if API fails
11. Return array of image URLs (at least 1, even if fallback)
12. Create `packages/validators/src/activity.ts`
13. Import `z` from zod
14. Define `activityCreateSchema` with: type, name (3-100), description (10-500), tags (array, 1-10 items, each 1-30 chars), dateTime (future date), location (1-200)
15. Define `activityListSchema` with optional filters
16. Export both schemas
17. Update `packages/validators/src/index.ts` to export activity schemas
18. Create `packages/api/src/router/activity.ts`
19. Import `protectedProcedure` from `../trpc`
20. Import `z` from zod and activity schemas from validators
21. Import `TRPCError` from `@trpc/server`
22. Import `fetchUnsplashImages` from `../utils/unsplash`
23. Create `activityRouter` object (use pattern from `userRouter`: object satisfying `TRPCRouterRecord`)
24. Add `create` mutation: `protectedProcedure.input(activityCreateSchema).mutation(async ({ ctx, input }) => {...})`
25. In create mutation: Combine keywords: `const keywords = \`${input.name} ${input.tags.join(' ')}\``
26. In create mutation: Call `fetchUnsplashImages(keywords)` to get image URLs
27. In create mutation: Extract coverPhoto (first URL) and imageUrls (rest)
28. In create mutation: Get `ctx.user.id` for hostId (ensure `ctx.user` exists - protectedProcedure guarantees this)
29. In create mutation: Map input type to Prisma enum: `type: input.type.toUpperCase()` (convert 'workdate' → 'WORKDATE')
30. In create mutation: Call `ctx.db.activity.create({ data: { type, name: input.name, description: input.description, tags: input.tags, dateTime: input.dateTime, location: input.location, hostId, coverPhoto, imageUrls } })`
31. In create mutation: Include host relation: `include: { host: true }`
32. Add `list` query: `protectedProcedure.input(activityListSchema.optional()).query(...)`
33. In list query: Filter `dateTime: { gte: new Date() }`
34. In list query: Order by `dateTime: 'asc'`
35. In list query: Limit results (default 50, use `input?.limit ?? 50`)
36. In list query: Include host relation: `include: { host: true }`
37. Export `activityRouter` (satisfies `TRPCRouterRecord`)
38. Open `packages/api/src/router/root.ts`
39. Import `activityRouter` from `./activity`
40. Add `activity: activityRouter` to `appRouter`
41. Run `pnpm typecheck` from root to verify no TypeScript errors
42. Test create endpoint (manual or via tRPC client) - verify Unsplash images fetched
43. Test list endpoint returns activities

---

### RFC-003: Frontend Integration

**Title**: Connect SwipeFeed to Real API with Mock Fallback and Add Create Activity Form  
**Summary**: Fetch real activities, append mock data, implement activity creation UI.  
**Dependencies**: RFC-002 (Activity API Endpoints)

#### Stages

**Stage 1: SwipeFeed Integration**

1. Import tRPC hooks in SwipeFeed component
2. Fetch real activities via tRPC query
3. Import mock activities from `mockData.ts`
4. Combine: real activities first, then mock activities
5. Handle loading and error states
6. Map API response to component props

**Stage 2: Create Activity Form**

1. Create `CreateActivityForm.tsx` component
2. Add form fields: type (select), name (input), description (textarea), tags (multi-input/chips), dateTime (datetime-local), location (input)
3. Add form validation (match Zod schema)
4. Wire submit to tRPC create mutation
5. Handle success/error states
6. Show loading state during Unsplash image fetch

**Stage 3: UI Integration**

1. Add "Create Activity" button/modal trigger
2. Connect form to create flow
3. Refresh SwipeFeed after successful creation (invalidate query)
4. Handle empty state (shouldn't happen with mock fallback, but handle gracefully)

**Stage 4: Testing**

1. Test creating activity via form
2. Verify activity appears in SwipeFeed
3. Test error handling
4. Test loading states

#### Acceptance Criteria

- ✅ SwipeFeed displays real activities from API first
- ✅ SwipeFeed appends mock activities after real ones (mixed feed)
- ✅ SwipeFeed shows loading state while fetching
- ✅ SwipeFeed shows error state if fetch fails (but still shows mock)
- ✅ SwipeFeed never shows empty state (mock fallback ensures content)
- ✅ Create Activity form validates input (name, description, tags, dateTime, location)
- ✅ Create Activity form submits to API
- ✅ Form shows loading state during creation (including Unsplash fetch)
- ✅ After creation, SwipeFeed refreshes with new activity (appears first)
- ✅ Form shows success/error messages

#### API Contracts

See RFC-002 for backend contracts. Frontend uses:

- `trpc.activity.list.useQuery()` for SwipeFeed
- `trpc.activity.create.useMutation()` for creation

#### What's Functional Now

- End-to-end flow: User creates activity → appears in SwipeFeed
- Real data persistence and retrieval

#### Ready For

- Future phases: Join flows, editing, filtering

#### Implementation Checklist

**Pre-Flight Checks**:

1. ✅ Verify Phase 2 (Activity API Endpoints) is complete and tested
2. ✅ Verify `trpc.activity.list` and `trpc.activity.create` are accessible from frontend
3. ✅ Verify UI components: Dialog, Select, Form, Sonner (all exist in `@sassy/ui`)

**Component Verification** (COMPLETE):

- ✅ Dialog: `@sassy/ui/dialog` (Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter)
- ✅ Select: `@sassy/ui/select` (Select, SelectTrigger, SelectValue, SelectContent, SelectItem)
- ✅ Form: `@sassy/ui/form` (useForm, Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
- ✅ Input: `@sassy/ui/input` (Input)
- ✅ Textarea: `@sassy/ui/textarea` (Textarea)
- ✅ Button: `@sassy/ui/button` (Button)
- ✅ Toast: `@sassy/ui/sonner` (toast) - Already configured in `apps/nextjs/src/app/layout.tsx`

**SwipeFeed Integration**:

4. Open `apps/nextjs/src/components/SwipeFeed.tsx`
5. Import `useTRPC` hook: `import { useTRPC } from '~/trpc/react'`
6. Import `useQuery` from `@tanstack/react-query`: `import { useQuery } from '@tanstack/react-query'`
7. Keep `mockActivities` import (needed for fallback)
8. Add tRPC query:
   ```typescript
   const trpc = useTRPC();
   const {
     data: realActivities = [],
     isLoading,
     error,
   } = useQuery(trpc.activity.list.queryOptions());
   ```
9. **Create Type Adapter Function**: Map API response to `ActivityPost` interface:

   ```typescript
   // Import Activity type from Prisma generated types
   import type { Activity } from "@sassy/db";

   import type { ActivityPost } from "~/lib/mockData";

   type ActivityWithHost = Activity & {
     host: {
       id: string;
       firstName: string | null;
       lastName: string | null;
       imageUrl: string | null;
     };
     participants?: Array<{ userId: string }>;
   };

   const adaptActivity = (activity: ActivityWithHost): ActivityPost => ({
     id: activity.id,
     activityType: activity.type.toLowerCase() as ActivityPost["activityType"],
     dateTime: activity.dateTime,
     description: activity.description,
     coverPhoto: activity.coverPhoto,
     activityPhotos: activity.imageUrls,
     hostUserId: activity.host.id,
     maxParticipants: activity.maxParticipants,
     locationHiddenAddress: activity.location,
     locationHint: activity.location.split(",")[0]?.trim() || activity.location,
     participationCount: activity.participants?.length || 0,
     participants: activity.participants?.map((p) => p.userId) || [],
     // Optional fields not in API - leave undefined
     meetupNotes: undefined,
     activityPhoto: activity.imageUrls[0] || activity.coverPhoto,
   });
   ```

   **Note**: API returns `Activity` with `host` relation. The `list` query includes `host` relation, but `participants` may not be included by default. If needed, update the API query to include participants count.

10. Combine activities: `const allActivities = [...realActivities.map(adaptActivity), ...mockActivities]`
11. Update `currentActivity` to use `allActivities[currentIndex]` instead of `mockActivities[currentIndex]`
12. Update `nextActivity` to use `allActivities[currentIndex + 1]`
13. Add loading state: Show loading spinner overlay but still render mock activities in background (never show empty state)
14. Handle error gracefully: Log error with `console.error` but continue with mock activities
15. Update `allUsers` logic: Keep `[currentUser, ...mockUsers]` - host data comes from `activity.host` relation in API response

**Create Activity Form**:

16. Create `apps/nextjs/src/components/CreateActivityForm.tsx`
17. Import dependencies:

    ```typescript
    import { useState } from "react";
    import { useQueryClient } from "@tanstack/react-query";

    import { Button } from "@sassy/ui/button";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
    } from "@sassy/ui/dialog";
    import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      useForm,
    } from "@sassy/ui/form";
    import { Input } from "@sassy/ui/input";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@sassy/ui/select";
    import { toast } from "@sassy/ui/sonner";
    import { Textarea } from "@sassy/ui/textarea";
    import { activityCreateSchema } from "@sassy/validators";

    import { useTRPC } from "~/trpc/react";
    ```

18. Create component props interface:
    ```typescript
    interface CreateActivityFormProps {
      isOpen: boolean;
      onClose: () => void;
    }
    ```
19. Initialize form with `useForm`:
    ```typescript
    const form = useForm({
      schema: activityCreateSchema,
      defaultValues: {
        type: "workdate",
        name: "",
        description: "",
        tags: [],
        dateTime: new Date(),
        location: "",
      },
    });
    ```
20. Initialize tRPC mutation and query client:
    ```typescript
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const createMutation = useMutation(
      trpc.activity.create.mutationOptions({
        onSuccess: () => {
          toast.success("Activity created successfully!");
          queryClient.invalidateQueries({ queryKey: [["activity", "list"]] });
          form.reset();
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create activity");
        },
      }),
    );
    ```
21. Add form fields with FormField wrappers:
    - **Type**: Select dropdown:
      ```typescript
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activity Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="workdate">Work Date</SelectItem>
                <SelectItem value="studydate">Study Date</SelectItem>
                <SelectItem value="hangout">Hangout</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      ```
    - **Name**: Text input (min 3, max 100 chars)
    - **Description**: Textarea (min 10, max 500 chars)
    - **Tags**: Input field with comma-separated tags:
      ```typescript
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., coffee, coding, networking"
                value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean);
                  field.onChange(tags);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      ```
    - **Date/Time**: Input with `type="datetime-local"`:
      ```typescript
      <FormField
        control={form.control}
        name="dateTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date & Time</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                value={field.value instanceof Date
                  ? field.value.toISOString().slice(0, 16)
                  : field.value}
                onChange={(e) => {
                  field.onChange(new Date(e.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      ```
    - **Location**: Text input (min 1, max 200 chars)
22. Handle form submission:
    ```typescript
    const onSubmit = async (values: z.infer<typeof activityCreateSchema>) => {
      // Ensure tags is array (form handles conversion)
      // Ensure dateTime is Date object (form handles conversion)
      await createMutation.mutateAsync(values);
    };
    ```
    **Note**: Form handles type conversions via FormField onChange handlers above
23. Show loading state: Disable submit button when `createMutation.isPending` is true
24. Display loading indicator in submit button: `{createMutation.isPending ? 'Creating...' : 'Create Activity'}`

**UI Integration**:

25. Open `apps/nextjs/src/app/page.tsx`
26. Add state for modal: `const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)`
27. Import CreateActivityForm: `import { CreateActivityForm } from '~/components/CreateActivityForm'`
28. Add "Create Activity" button in header or as floating action button (FAB)
29. Wire button click: `onClick={() => setIsCreateModalOpen(true)}`
30. Render CreateActivityForm with Dialog wrapper:
    ```typescript
    <CreateActivityForm
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
    />
    ```
31. **Dialog Implementation**: CreateActivityForm should wrap content in Dialog:
    ```typescript
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>
            Share an activity and connect with like-minded people
          </DialogDescription>
        </DialogHeader>
        {/* Form content */}
        <DialogFooter>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    ```

**Testing**:

32. Test: Create activity → verify appears FIRST in SwipeFeed (before mock)
33. Test: Loading states display correctly (form shows loading, SwipeFeed shows loading spinner)
34. Test: Error handling works (form shows error toast, SwipeFeed still shows mock activities)
35. Test: Mock activities appear after real ones
36. Test: Unsplash images are fetched and displayed correctly
37. Test: Form validation prevents invalid submissions

---

## Rules (for this project)

### Tech Stack

- **Monorepo**: Turborepo with pnpm workspaces
- **Database**: Prisma ORM with Supabase PostgreSQL
- **API**: tRPC v11 with TanStack Query integration
- **Auth**: Clerk (source of truth for auth, sync to DB User table)
- **UI**: Next.js 15 App Router, Tailwind CSS v4, shadcn/ui

### Code Standards

- **TypeScript**: Strict mode, no `any`, explicit types
- **Validation**: Zod schemas for all inputs
- **Error Handling**: TRPCError with proper codes and messages
- **Naming**: kebab-case files, PascalCase components, camelCase variables

### Architecture Patterns

- **Service Co-location**: Domain logic in packages (e.g., `packages/activity` if needed)
- **tRPC Procedures**: Use `protectedProcedure` for authenticated endpoints
- **Database Relations**: Use Prisma relations, not manual joins
- **Image URLs**: Store as strings (placeholder URLs for now)

### Performance

- **Queries**: Limit results (default 50 for list)
- **Indexes**: Add indexes on frequently queried fields (dateTime, hostId, status)
- **Caching**: React Query handles caching automatically

### Security

- **Authentication**: All Activity endpoints require Clerk auth
- **Authorization**: Users can only create activities (hostId auto-set)
- **Validation**: Zod schemas validate all inputs
- **SQL Injection**: Prisma handles parameterization

### Documentation

- **Code Comments**: JSDoc for public procedures
- **Schema Docs**: Prisma schema is self-documenting
- **API Docs**: tRPC generates types automatically

---

## Verification (Comprehensive Review)

### Gap Analysis

- ✅ Database schema matches mock data structure
- ✅ API endpoints cover create and list operations
- ✅ Frontend integration plan covers SwipeFeed and form
- ⚠️ Missing: Error handling details for edge cases
- ⚠️ Missing: Image placeholder strategy details

### Improvement Recommendations

1. **Image Placeholders**: Use consistent placeholder service (e.g., Unsplash API with activity type as keyword)
2. **Error Messages**: User-friendly error messages for validation failures
3. **Loading States**: Skeleton loaders for better UX
4. **Empty States**: Friendly empty state messages

### Quality Assessment

- **Completeness**: 90% - Core flow covered, edge cases need refinement
- **Clarity**: 95% - Clear phases and checklists
- **Feasibility**: 100% - All tasks are achievable
- **Risk**: Low - Incremental changes, can test at each phase

---

## Change Management

### Change Classification

- **Type**: New Feature (Activity Creation)
- **Scope**: Backend migration + Frontend integration
- **Impact**: Medium (touches DB, API, Frontend)

### Impact Analysis

- **Components**: Database schema, API router, SwipeFeed component, new form component
- **Timeline**: 3 phases, estimated 1-2 days total
- **Dependencies**: Prisma, tRPC, Clerk auth (all configured)
- **UX**: Improves from mock data to real persistence

### Implementation Strategy

- **Approach**: Incremental (phase by phase)
- **Testing**: Manual testing at each phase
- **Rollback**: Can revert Prisma migration if needed

### Documentation Updates

- Update `.cursor/context/all-context.md` after completion
- Document new API endpoints
- Update README if needed

---

## Ops Runbook

### Database Migration

1. Backup database (if production): `pg_dump $DATABASE_URL > backup.sql`
2. Run migration: `pnpm db:push`
3. Verify: `pnpm db:studio` - check models exist
4. Rollback (if needed): `prisma migrate reset` (⚠️ deletes data)

### API Deployment

1. Build packages: `pnpm build`
2. Type check: `pnpm typecheck`
3. Deploy: Standard Vercel/deployment process

### Troubleshooting

- **Migration fails**: Check Prisma schema syntax, verify DATABASE_URL
- **API errors**: Check tRPC router exports, verify auth context
- **Frontend errors**: Check tRPC client setup, verify query/mutation calls

---

## Acceptance Criteria (Versioned)

### v1.0 (This Plan)

- ✅ User can create activity via form
- ✅ Activity saved to database
- ✅ SwipeFeed displays real activities from API
- ✅ Activities filtered by date (future only)
- ✅ Host information included in activity data

### v1.1 (Future)

- Activity editing
- Activity deletion
- Join/registration flows
- Image uploads

---

## Future Work

1. **Join Flows**: Participant model ready, need approval/rejection UI
2. **Image Uploads**: Supabase bucket setup, upload flow
3. **Activity Filtering**: By type, location, date range
4. **Activity Editing**: Update existing activities
5. **Real-time Updates**: tRPC subscriptions for live feed
6. **Pagination**: Cursor-based pagination for large activity lists
7. **User Profiles**: Profile editing UI for age, profession, interests
8. **Activity Sharing**: Generate shareable links

---

## Cursor + RIPER-5 Guidance

### Cursor Plan Mode

1. Import this checklist into Cursor Plan mode
2. Execute phases sequentially (RFC-001 → RFC-002 → RFC-003)
3. After each RFC, update status markers (✅/🚧/⏳)
4. Update "What's Functional Now" sections as you progress

### RIPER-5 Mode

- **RESEARCH**: ✅ Complete (context file generated, codebase understood)
- **INNOVATE**: ✅ Complete (architecture decisions made)
- **PLAN**: ✅ Complete (this document)
- **EXECUTE**: ⏳ Ready - Begin with RFC-001 when approved
- **REVIEW**: After execution, validate against acceptance criteria

### Next Steps

1. Review this plan
2. Approve or request changes
3. When approved, say "ENTER EXECUTE MODE"
4. Begin with RFC-001: Database Migration

---

**Plan Generated**: 2025-11-29  
**Last Updated**: 2025-11-29  
**Status**: ⏳ Awaiting Approval
