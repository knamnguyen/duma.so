"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Handshake, X } from "lucide-react";

import type { RouterOutputs } from "@sassy/api";
import { Button } from "@sassy/ui/button";

import type { ActivityPost } from "~/lib/mockData";
import { currentUser, mockActivities, mockUsers } from "~/lib/mockData";
import { useTRPC } from "~/trpc/react";
import { ActivityCard } from "./ActivityCard";

type ActivityWithHost = RouterOutputs["activity"]["list"][number];

// Generate mock participant IDs for real activities (consistent based on activity ID)
const generateMockParticipants = (
  activityId: string,
  maxParticipants: number,
  allMockUsers: typeof mockUsers,
): string[] => {
  // Use activityId as seed for consistent participant selection
  const seed = activityId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const participantCount = Math.min(
    Math.floor(maxParticipants * 0.6) + (seed % 3), // 60-80% filled
    maxParticipants - 1, // Leave at least 1 spot for host
    allMockUsers.length,
  );

  // Select participants based on seed for consistency
  const startIndex = seed % allMockUsers.length;
  const selectedIds: string[] = [];
  for (let i = 0; i < participantCount; i++) {
    const userIndex = (startIndex + i) % allMockUsers.length;
    selectedIds.push(allMockUsers[userIndex]?.id || "");
  }
  return selectedIds.filter(Boolean);
};

const adaptActivity = (
  activity: ActivityWithHost,
  allMockUsers: typeof mockUsers,
): ActivityPost => {
  // Generate mock participants for real activities
  const mockParticipantIds = generateMockParticipants(
    activity.id,
    activity.maxParticipants,
    allMockUsers,
  );

  return {
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
    // Use mock participants for real activities
    participationCount: mockParticipantIds.length + 1, // +1 for host
    participants: mockParticipantIds,
    // Optional fields not in API - leave undefined
    meetupNotes: undefined,
    activityPhoto: activity.imageUrls[0] || activity.coverPhoto,
  };
};

export const SwipeFeed = () => {
  // Use array instead of Set for better React compatibility
  const [swipedActivityIds, setSwipedActivityIds] = useState<string[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastActivityIds, setLastActivityIds] = useState<string>("");
  // Touch gesture tracking
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const trpc = useTRPC();
  const {
    data: realActivities = [],
    isLoading,
    error,
  } = useQuery(trpc.activity.list.queryOptions());

  // Memoize adapted activities to prevent unnecessary recalculations
  const adaptedRealActivities = useMemo(
    () => realActivities.map((activity) => adaptActivity(activity, mockUsers)),
    [realActivities],
  );

  // Combine real activities first, then mock activities (always include mock at bottom)
  const baseActivities = useMemo(
    () => [...adaptedRealActivities, ...mockActivities],
    [adaptedRealActivities],
  );

  // Create stable string of activity IDs to detect when activities change
  const currentActivityIds = useMemo(
    () => baseActivities.map((a) => a.id).join(","),
    [baseActivities],
  );

  // Reset swiped IDs when new activities are added (after refetch)
  useEffect(() => {
    if (currentActivityIds !== lastActivityIds && lastActivityIds !== "") {
      // New activities detected - reset swiped list to show new ones
      setSwipedActivityIds([]);
    }
    setLastActivityIds(currentActivityIds);
  }, [currentActivityIds, lastActivityIds]);

  // Derive activity queue directly from baseActivities and swiped items
  // This avoids state updates during render
  const swipedSet = useMemo(
    () => new Set(swipedActivityIds),
    [swipedActivityIds],
  );
  const activityQueue = useMemo(() => {
    // Filter out swiped activities and reorder: unswiped first, then swiped at bottom
    const unswiped = baseActivities.filter((a) => !swipedSet.has(a.id));
    const swiped = baseActivities.filter((a) => swipedSet.has(a.id));
    return [...unswiped, ...swiped];
  }, [baseActivities, swipedSet]);

  // Generate mock data for real host users
  const generateMockHostData = (hostId: string, activityType: string) => {
    // Use hostId as seed for consistent mock data
    const seed = hostId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const professions = [
      "Software Engineer",
      "Product Designer",
      "Data Scientist",
      "Marketing Manager",
      "UX Researcher",
      "Content Creator",
      "Startup Founder",
      "Lawyer",
      "Chef",
      "Photographer",
      "Architect",
      "Personal Trainer",
      "Journalist",
      "DevOps Engineer",
    ];

    const interestSets = [
      ["workdate", "sports", "hangout"],
      ["workdate", "events", "hangout"],
      ["sports", "studydate"],
      ["hangout", "events", "workdate"],
      ["workdate", "studydate", "hangout"],
      ["hangout", "events"],
      ["sports", "hangout"],
      ["events", "hangout"],
      ["workdate", "hangout"],
      ["sports", "workdate"],
    ];

    const bios = [
      "Building in public. Coffee-fueled coding sessions. Always shipping.",
      "Full-stack dev • Rock climbing enthusiast • Always down for pickleball",
      "UI/UX designer • Concert lover • Foodie at heart",
      "ML engineer • Marathon runner • Beach volleyball player",
      "Growth hacker • Wine enthusiast • Brunch queen",
      "User researcher • Cafe hopper • Board game addict",
      "YouTuber • Photography lover • Nature explorer",
      "Building SaaS • Angel investor • Tennis player",
      "Visual artist • Yoga instructor • Music festival goer",
      "PM at tech startup • Cyclist • Craft beer lover",
    ];

    const pastEventTemplates = [
      [
        { title: "Startup Founders Brunch", type: "hangout", attendees: 8 },
        { title: "Coworking & Coffee", type: "workdate", attendees: 5 },
      ],
      [
        { title: "Pickleball Tournament", type: "sports", attendees: 8 },
        { title: "Coding Bootcamp Reunion", type: "hangout", attendees: 15 },
        { title: "Weekend Hackathon", type: "workdate", attendees: 12 },
      ],
      [
        { title: "K-Pop Concert Meetup", type: "event", attendees: 6 },
        { title: "Ramen Crawl", type: "hangout", attendees: 8 },
        { title: "Design Sprint", type: "workdate", attendees: 5 },
      ],
      [
        { title: "Beach Volleyball League", type: "sports", attendees: 10 },
        { title: "AI Study Group", type: "studydate", attendees: 7 },
        { title: "Ocean Beach Run", type: "sports", attendees: 12 },
      ],
    ];

    return {
      profession: professions[seed % professions.length],
      interests: interestSets[seed % interestSets.length],
      bio: bios[seed % bios.length],
      pastEvents: pastEventTemplates[seed % pastEventTemplates.length],
    };
  };

  // Create user objects from real activity hosts with mock data
  const realHostUsers = realActivities.map((activity) => {
    const mockData = generateMockHostData(activity.host.id, activity.type);
    return {
      id: activity.host.id,
      name:
        `${activity.host.firstName || ""} ${activity.host.lastName || ""}`.trim() ||
        "User",
      age: 25 + (activity.host.id.charCodeAt(0) % 15), // Age between 25-40
      profession: mockData.profession,
      profilePhoto: activity.host.imageUrl || mockUsers[0]?.profilePhoto || "",
      interests: mockData.interests,
      locationCity: "San Francisco",
      bio: mockData.bio,
      pastEvents: mockData.pastEvents,
      activityPhotos: activity.imageUrls.slice(0, 3), // Use activity images as user photos
    };
  });

  const allUsers = [currentUser, ...realHostUsers, ...mockUsers];

  const currentActivity = activityQueue[0];
  const currentHost = currentActivity
    ? allUsers.find((u) => u.id === currentActivity.hostUserId)
    : null;
  const nextActivity = activityQueue[1];
  const nextHost = nextActivity
    ? allUsers.find((u) => u.id === nextActivity.hostUserId)
    : null;

  // Log errors but continue with mock activities
  if (error) {
    console.error("Error fetching activities:", error);
  }

  const handleSwipe = (liked: boolean) => {
    const currentActivityId = activityQueue[0]?.id;
    if (!currentActivityId) return;

    // Animate out
    const direction = liked ? 1 : -1;
    setDragOffset({ x: direction * 1000, y: 0 });

    setTimeout(() => {
      // Reset position FIRST
      setDragOffset({ x: 0, y: 0 });

      // Mark current activity as swiped (moves it to bottom of queue)
      setTimeout(() => {
        setSwipedActivityIds((prev) => {
          if (prev.includes(currentActivityId)) return prev;
          return [...prev, currentActivityId];
        });
      }, 50);
    }, 300);
  };

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only start dragging if horizontal movement is clearly dominant
    // This prevents interference with vertical scrolling inside ActivityCard
    // Require at least 15px horizontal movement and horizontal must be > 1.5x vertical
    if (absDeltaX > 15 && absDeltaX > absDeltaY * 1.5) {
      if (!isDragging) {
        setIsDragging(true);
      }
      // Update drag offset for visual feedback
      setDragOffset({ x: deltaX, y: 0 });
      // Prevent scrolling when swiping horizontally
      e.preventDefault();
    } else if (absDeltaY > absDeltaX) {
      // User is scrolling vertically - reset and allow normal scroll
      if (isDragging) {
        setDragOffset({ x: 0, y: 0 });
        setIsDragging(false);
        setTouchStart(null);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) {
      return;
    }

    const touch = e.changedTouches[0];
    if (!touch) {
      setTouchStart(null);
      setIsDragging(false);
      return;
    }

    const deltaX = touch.clientX - touchStart.x;
    const absDeltaX = Math.abs(deltaX);
    const SWIPE_THRESHOLD = 100; // Minimum distance to trigger swipe

    // Only trigger swipe if we were actually dragging horizontally
    if (isDragging && absDeltaX >= SWIPE_THRESHOLD) {
      const liked = deltaX > 0; // Swipe right = like, swipe left = reject
      handleSwipe(liked);
    } else if (isDragging) {
      // Snap back to center if threshold not met
      setDragOffset({ x: 0, y: 0 });
    }

    // Reset touch state
    setTouchStart(null);
    setIsDragging(false);
  };

  if (!currentActivity || !currentHost) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No more activities to show</p>
      </div>
    );
  }

  const rotation = dragOffset.x * 0.05;
  const opacity = 1 - Math.abs(dragOffset.x) / 1000;

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-8 pb-32">
      {/* Loading overlay */}
      {isLoading && (
        <div className="bg-background/50 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-muted-foreground">Loading activities...</div>
        </div>
      )}
      {/* Stack container */}
      <div className="relative mb-8">
        {/* Next card (behind) */}
        {nextActivity && nextHost && (
          <div
            className="pointer-events-none absolute top-0 left-0 w-full"
            style={{
              transform: "scale(0.95)",
              opacity: 0.5,
            }}
          >
            <ActivityCard
              activity={nextActivity}
              host={nextHost}
              allUsers={allUsers}
            />
          </div>
        )}

        {/* Current card (front) */}
        <div
          key={currentActivity.id}
          className="animate-in fade-in zoom-in-95 relative transition-all duration-300 select-none"
          style={{
            transform: `translateX(${dragOffset.x}px) rotate(${rotation}deg)`,
            opacity: Math.max(opacity, 0.5),
            transition: isDragging
              ? "none"
              : "transform 0.3s ease-out, opacity 0.3s ease-out",
            zIndex: 10,
            touchAction: isDragging ? "none" : "pan-y", // Allow vertical scrolling when not dragging
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ActivityCard
            activity={currentActivity}
            host={currentHost}
            allUsers={allUsers}
          />
        </div>
      </div>

      {/* Sticky Swipe Actions */}
      <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 gap-6">
        <Button
          variant="outline"
          className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive border-border bg-background text-foreground h-16 w-16 rounded-full border-2 p-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          onClick={() => handleSwipe(false)}
        >
          <X className="h-8 w-8 stroke-current stroke-2" />
        </Button>
        <Button
          className="border-primary hover:bg-primary/90 h-16 w-16 rounded-full border-2 p-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          onClick={() => handleSwipe(true)}
        >
          <Handshake className="h-8 w-8 stroke-current stroke-2" />
        </Button>
      </div>
    </div>
  );
};
