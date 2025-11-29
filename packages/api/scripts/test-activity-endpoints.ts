/**
 * Test script for Activity API endpoints
 * Run with: pnpm with-env bun scripts/test-activity-endpoints.ts
 *
 * NOTE: This script bypasses authentication for testing purposes.
 * In production, all endpoints require Clerk authentication.
 */

import type { User } from "@clerk/nextjs/server";

import { db } from "@sassy/db";

import { appRouter } from "../src/router/root";
import { createCallerFactory } from "../src/trpc";

// Create a test caller factory
const createCaller = createCallerFactory(appRouter);

async function testActivityEndpoints() {
  console.log("🧪 Testing Activity API Endpoints\n");

  // We need a user ID for testing - let's get the first user from DB
  const firstUser = await db.user.findFirst();

  if (!firstUser) {
    console.error(
      "❌ No users found in database. Please create a user first (via Clerk signup).",
    );
    process.exit(1);
  }

  console.log(
    `✅ Found test user: ${firstUser.id} (${firstUser.primaryEmailAddress})\n`,
  );

  // Create a minimal Clerk User object for testing
  // This bypasses auth - in real usage, auth is handled by middleware
  // We'll use type assertion since we're just testing
  const mockUser = {
    id: firstUser.id,
    firstName: firstUser.firstName,
    lastName: firstUser.lastName,
    username: firstUser.username,
    primaryEmailAddress: firstUser.primaryEmailAddress,
    imageUrl: firstUser.imageUrl ?? "",
  } as User;

  // Create a test caller with mocked context
  const caller = createCaller({
    db,
    headers: new Headers(),
    user: mockUser,
  });

  try {
    // Test 1: List activities (should return empty array initially)
    console.log("📋 Test 1: List activities (empty)");
    const emptyList = await caller.activity.list({});
    console.log(`✅ List returned ${emptyList.length} activities\n`);

    // Test 2: Create an activity
    console.log("➕ Test 2: Create activity");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    const createInput = {
      type: "hangout" as const,
      name: "Coffee & Code Session",
      description:
        "Let's meet up for coffee and work on our side projects together. Bring your laptop!",
      tags: ["coffee", "coding", "networking"],
      dateTime: futureDate,
      location: "Downtown Coffee Shop",
    };

    const createdActivity = await caller.activity.create(createInput);
    console.log("✅ Activity created successfully!");
    console.log(`   ID: ${createdActivity.id}`);
    console.log(`   Name: ${createdActivity.name}`);
    console.log(
      `   Cover Photo: ${createdActivity.coverPhoto.substring(0, 50)}...`,
    );
    console.log(
      `   Image URLs: ${createdActivity.imageUrls.length} images fetched\n`,
    );

    // Test 3: List activities again (should include the new one)
    console.log("📋 Test 3: List activities (with new activity)");
    const activitiesList = await caller.activity.list({});
    console.log(`✅ List returned ${activitiesList.length} activity(ies)`);
    if (activitiesList.length > 0) {
      const activity = activitiesList[0];
      console.log(`   First activity: ${activity.name}`);
      console.log(`   Host: ${activity.host.primaryEmailAddress}`);
      console.log(`   Date: ${activity.dateTime.toISOString()}\n`);
    }

    // Test 4: Get activity by ID
    console.log("🔍 Test 4: Get activity by ID");
    const activityById = await caller.activity.byId({ id: createdActivity.id });
    console.log(`✅ Activity found: ${activityById?.name}`);
    console.log(`   Participants: ${activityById?.participants.length ?? 0}\n`);

    // Test 5: Create another activity with different type
    console.log("➕ Test 5: Create another activity (sports type)");
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14); // 14 days from now

    const createInput2 = {
      type: "sports" as const,
      name: "Basketball Game",
      description:
        "Looking for players for a friendly basketball game at the local court.",
      tags: ["basketball", "sports", "exercise"],
      dateTime: futureDate2,
      location: "Community Sports Center",
    };

    const createdActivity2 = await caller.activity.create(createInput2);
    console.log(`✅ Second activity created: ${createdActivity2.name}\n`);

    // Test 6: List with filter
    console.log("📋 Test 6: List activities filtered by type (sports)");
    const sportsActivities = await caller.activity.list({ type: "sports" });
    console.log(`✅ Found ${sportsActivities.length} sports activity(ies)\n`);

    console.log("✅ All tests passed! 🎉");
  } catch (error) {
    console.error("❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

testActivityEndpoints();
