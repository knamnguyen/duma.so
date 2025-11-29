# Repository Context

## Status
- **Scanned at**: 2025-11-29 14:41:22
- **Repo HEAD**: f8fef7f623496e34e9a00d81a3ac576adbcc6691
- **Mode**: Full Scan (Migration Context)

## Changes since last update
- **Initial Context Generation for Duma**: This repository is in the process of migrating from a legacy "Gif Avatar" project to "Duma" (Social Activity Discovery App).
- **Frontend State**: `apps/nextjs` contains the Duma UI with mock data (`src/lib/mockData.ts`).
- **Backend State**: `packages/api` and `packages/db` still contain legacy schemas and routers (`UserUpload`, `BackgroundRemoved`, etc.) which need to be replaced or significantly updated.
- **Goal**: Enable real user signup (Clerk + Supabase) and "Create Activity" functionality.

---

## Product & PRD Context

### Overview
**Product**: Duma – Social Activity Discovery App
**Elevator Pitch**: A mobile-first app for discovering and joining small group activities (3–4 people) via a Tinder-style swipe interface.
**Core Value**: Effortless discovery of small, intimate group activities without the friction of large event planning.

### Goals & Success Metrics
- **Primary Goals**:
  - Make finding small group activities effortless.
  - Facilitate meeting new people through shared interests.
  - Reduce friction for hosts creating activities.
- **Success Metrics**:
  - Activation: % new users completing profile + 1 swipe.
  - Engagement: Avg daily swipes, % users with upcoming activity.
  - Value: Activities with 2+ participants.

### Scope
- **In-Scope (v1)**:
  - Swipe Feed (Discover)
  - Activity Creation (Host)
  - Join Requests
  - User Profiles (Basic)
  - Chat (Group per activity)
- **Out-of-Scope**:
  - Payments/Ticketing
  - Complex Reputation Systems
  - Video/Audio Calls
  - Large Events (>10 people)

### Features Catalog
1. **Discover**: Swipeable feed of activity cards.
2. **Activity Details**: Drawer with host info, participants, time/loc.
3. **Create Activity**: Simple flow to publish a new activity.
4. **My Activities**: List of hosted and joined events.
5. **Profile**: User identity, interests, and history.
6. **Chat**: Group messaging for coordinated activities.

### Architecture Decisions
- **Monorepo**: Turborepo with T3 Stack.
- **Auth**: Clerk (Source of Truth for Auth) synced to DB User table.
- **Database**: Supabase (PostgreSQL) via Prisma ORM.
- **API**: tRPC for type-safe frontend-backend communication.
- **UI**: Tailwind CSS v4 + shadcn/ui.

### Schemas Snapshot

#### Legacy (To Be Deprecated/Modified)
- `User` (Exists but needs field updates)
- `UserUpload`, `BackgroundRemoved`, `UserResult` (Legacy Gif Avatar - DELETE)
- `SocialSubmission` (Legacy - DELETE)

#### Target Schema (Duma)
Based on `mockData.ts`, the following models are required:

**User (Updates)**
- `id`: String (Clerk ID)
- `username`: String
- `name`: String
- `age`: Int
- `profession`: String
- `city`: String
- `bio`: String?
- `interests`: String[] (or relation)
- `profilePhoto`: String
- `activityPhotos`: String[]

**Activity (New)**
- `id`: String (CUID)
- `hostId`: String (Relation to User)
- `type`: Enum (WORKDATE, STUDYDATE, HANGOUT, SPORTS, EVENT, OTHER)
- `title`: String
- `description`: String
- `dateTime`: DateTime
- `maxParticipants`: Int
- `locationName`: String
- `locationAddress`: String?
- `locationHint`: String
- `coverPhoto`: String
- `status`: Enum (OPEN, FULL, CANCELLED, COMPLETED)
- `createdAt`: DateTime

**Participant (New)**
- `id`: String
- `userId`: String
- `activityId`: String
- `status`: Enum (PENDING, APPROVED, REJECTED)
- `joinedAt`: DateTime

**Message (New - for Chat)**
- `id`: String
- `activityId`: String
- `senderId`: String
- `content`: String
- `createdAt`: DateTime

---

## Tech Stack Overview

| Area | Technology | Version/Note |
|------|------------|--------------|
| **Language** | TypeScript | 5.7.3 |
| **Framework** | Next.js | 15.2.2 (App Router) |
| **Package Manager** | pnpm | 10.6.3 |
| **Build System** | Turborepo | 2.3.4 |
| **Styling** | Tailwind CSS | v4.1.8 |
| **UI Library** | shadcn/ui | - |
| **Database** | PostgreSQL (Supabase) | - |
| **ORM** | Prisma | Latest |
| **API** | tRPC | v11 (catalog) |
| **Auth** | Clerk | ^6.12.5 |
| **State** | TanStack Query | v5 |

---

## Monorepo Layout

- **apps/nextjs**: Main application (Duma UI + tRPC Client)
- **packages/api**: tRPC Routers and Root definition. **Needs Migration**.
- **packages/db**: Prisma Schema and Client. **Needs Migration**.
- **packages/ui**: Shared UI components.
- **packages/validators**: Shared Zod schemas.
- **packages/stripe**: Stripe integration (likely keep for future, but low priority).
- **packages/social-referral**: Legacy? Investigate/Remove.
- **packages/supabase-bucket**: Image upload utilities (Keep for photos).

---

## Conventions & Rules

- **Service Co-location**: Domain logic belongs in packages (e.g., `packages/activity/src/activity-service.ts`), not just API routers.
- **Environment Variables**: Use `dotenv-cli` and `pnpm with-env` pattern for scripts.
- **Type Safety**: Strict TypeScript. No `any`. Use Zod for validation.
- **Naming**: kebab-case files, PascalCase components/classes.
- **Auth**: `ctx.auth.userId` from Clerk in tRPC.

---

## Open Questions
1. **Image Storage**: Will we use Supabase Storage or the existing `packages/supabase-bucket` setup? (Likely the latter).
2. **Real-time**: Does Chat need WebSockets (subscriptions) immediately, or is polling acceptable for v1? (Mock data implies standard query/mutation, polling likely easiest for MVP).
3. **Migration Strategy**: Should we delete all legacy tables or keep them parallel for now? (Recommendation: Clean slate for `UserUpload` etc., update `User`).

