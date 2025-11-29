"use client";

import type { ReactNode } from "react";
import type { SimpleIcon } from "simple-icons";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Clock3 } from "lucide-react";
import {
  siDevdotto,
  siDiscord,
  siFandom,
  siGmail,
  siLinktree,
  siMedium,
  siMyanimelist,
  siPatreon,
  siPixiv,
  siSubstack,
} from "simple-icons";

import { Button } from "@sassy/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sassy/ui/card";

import type { AnimationStyle } from "~/app/_components/animation-style-selector";
import type { PlatformKey } from "~/app/editor/[projectId]/_components/platform-selector-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import CreateGifavatarButton from "~/app/_components/create-gifavatar-button";
import BeaconsIcon from "~/app/assets/logos/beacons.svg";
import GmailIcon from "~/app/assets/logos/gmail.svg";
import VGenIcon from "~/app/assets/logos/vgen.svg";
import {
  DEFAULT_PLATFORM_ID,
  PlatformSelectorPreview,
} from "~/app/editor/[projectId]/_components/platform-selector-preview";
import { useTRPC } from "~/trpc/react";
import { CommunityPreviewCard } from "./_components/community-preview-card";
import { BeaconsPreview } from "./_components/platform-preview/platform-preview/beacons-preview";
import { DevPreview } from "./_components/platform-preview/platform-preview/dev-preview";
import { DiscordPreview } from "./_components/platform-preview/platform-preview/discord-preview";
import { FandomPreview } from "./_components/platform-preview/platform-preview/fandom-preview";
import { GmailThreadPreview } from "./_components/platform-preview/platform-preview/gmail-thread-preview";
import { LinktreePreview } from "./_components/platform-preview/platform-preview/linktree-preview";
import { MediumPreview } from "./_components/platform-preview/platform-preview/medium-preview";
import { MyAnimeListPreview } from "./_components/platform-preview/platform-preview/myanimelist-preview";
import { PatreonPreview } from "./_components/platform-preview/platform-preview/patreon-preview";
import { PixivPreview } from "./_components/platform-preview/platform-preview/pixiv-preview";
import { SubstackPreview } from "./_components/platform-preview/platform-preview/substack-preview";
import { VGenPreview } from "./_components/platform-preview/platform-preview/vgen-preview";

/**
 * Format date to "Created Nov 13, 2025" or "Created 1 day ago" format
 */
function formatProjectDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Created today";
  } else if (diffDays === 1) {
    return "Created 1 day ago";
  } else if (diffDays < 7) {
    return `Created ${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Created ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else {
    return `Created ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
}

interface ProjectCard {
  id: number;
  title: string;
  edited: string;
  status: "Draft" | "Published" | "In review";
  gradient: {
    from: string;
    via?: string;
    to: string;
  };
  description: string;
}

const DEFAULT_EMAIL = "gifavatar.app@gmail.com";

interface CommunityPreviewRendererArgs {
  displayName: string;
  userEmail: string;
  avatarUrl?: string;
  gradient: string;
  accentColor: string;
  isLoading: boolean;
  localUrl?: string | null;
  preferCanvasForGif?: boolean;
}

interface CommunityPreviewConfig {
  id: string;
  renderPreview: (args: CommunityPreviewRendererArgs) => ReactNode;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export default function HomePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const trpc = useTRPC();

  // Load user projects
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    ...trpc.editor.listProjects.queryOptions({ limit: 10 }),
    enabled: Boolean(isSignedIn && isLoaded),
    refetchOnWindowFocus: false,
  });

  // Load community results
  const { data: communityResultsData, isLoading: isLoadingCommunityResults } =
    useQuery({
      ...trpc.editor.listCommunityResults.queryOptions(),
      refetchOnWindowFocus: false,
    });

  // Platform selector state
  const [selectedPlatformId, setSelectedPlatformId] =
    useState<PlatformKey>(DEFAULT_PLATFORM_ID);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>({
    photoMovement: null,
    addOnEffect: null,
  });
  const [bgColor, setBgColor] = useState<string>("#ffffff");

  const displayName = useMemo(() => {
    if (!user) return "Gif Avatar User";
    if (user.fullName && user.fullName.trim().length > 0) {
      return user.fullName;
    }
    const nameFromParts = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (nameFromParts.length > 0) return nameFromParts;
    if (user.username && user.username.trim().length > 0) {
      return user.username;
    }
    return "Gif Avatar User";
  }, [user]);

  const communityPreviews: CommunityPreviewConfig[] = useMemo(
    () => [
      {
        id: "gmail",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <GmailThreadPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "linktree",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <LinktreePreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "beacons",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <BeaconsPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "pixiv",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <PixivPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "fandom",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <FandomPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "myanimelist",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <MyAnimeListPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "devto",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <DevPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "medium",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <MediumPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "substack",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <SubstackPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "vgen",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <VGenPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "discord",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <DiscordPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
      {
        id: "patreon",
        renderPreview: ({
          displayName: name,
          userEmail,
          accentColor,
          isLoading,
          localUrl,
          preferCanvasForGif = false,
        }) => (
          <PatreonPreview
            userName={name}
            userEmail={userEmail}
            localUrl={localUrl ?? undefined}
            avatarConfig={{
              animationStyle: {
                photoMovement: "rise" as const,
                addOnEffect: null,
              },
            }}
            bgColor={accentColor}
            isLoading={isLoading}
            preferCanvasForGif={preferCanvasForGif}
          />
        ),
      },
    ],
    [displayName],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1eb,_#fdfdfd,_#e9edf2)] text-[#1f1f1f]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-12 pb-16">
        <section className="space-y-18 py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
            {/* Column 1: Hero title (aim for max ~2 rows by constraining width) */}
            <div className="min-w-0 flex-1">
              <h1 className="mx-auto max-w-[700px] text-center text-4xl font-bold tracking-tight text-balance text-[#111827] sm:mx-0 sm:text-right sm:text-5xl">
                Stand out online with a free{" "}
                <span className="text-[#ff6fae]">Gifavatar</span>
              </h1>
            </div>
            {/* Vertical separator */}
            <div className="hidden h-28 w-px bg-black/10 sm:block" />
            {/* Column 2: Rotating impact line */}
            <div className="flex flex-1 justify-center">
              <RotatingImpactLine animationStyle={animationStyle} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <p className="mx-auto max-w-2xl text-base text-[#4a5562] sm:text-lg">
                Create a unique animated photo of yourself to make viewers pause
                and smile
              </p>

              <p className="mx-auto max-w-2xl text-base text-[#4a5562] sm:text-lg">
                Work on 12 popular social media and communication platforms
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CreateGifavatarButton />
              <Button
                variant="outline"
                className="rounded-xl border-black/10 bg-white/80 px-6 py-2 text-sm font-semibold text-[#1f1f1f] hover:bg-white"
              >
                <Link href="/social-referral">Get 100% free usage</Link>
              </Button>
            </div>
          </div>
        </section>

        {isLoaded && user && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-4xl font-semibold text-[#111827]">
                  Your projects
                </h2>
                <p className="text-sm text-[#4a5562]">
                  Continue building from where you left off.
                </p>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {isLoadingProjects ? (
                <div className="text-sm text-[#4a5562]">
                  Loading projects...
                </div>
              ) : projectsData?.items && projectsData.items.length > 0 ? (
                projectsData.items.map((item, index) => {
                  const projectId = item.upload.id;
                  const projectNumber = index + 1;
                  const formattedDate = formatProjectDate(
                    item.upload.createdAt,
                  );

                  return (
                    <Link key={item.upload.id} href={`/editor/${projectId}`}>
                      <Card className="min-w-[260px] flex-shrink-0 cursor-pointer border border-black/5 bg-white/90 shadow-[0_18px_44px_rgba(17,24,39,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(17,24,39,0.12)]">
                        <div className="relative h-40 w-full overflow-hidden rounded-t-[28px] rounded-b-[40px]">
                          <Image
                            src={item.coverUrl}
                            alt={`Project ${projectNumber} cover`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader className="space-y-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-[#111827]">
                              Project {projectNumber}
                            </CardTitle>
                          </div>
                          <CardDescription className="flex items-center gap-2 text-xs tracking-wider text-[#4a5562] uppercase">
                            <Clock3 className="h-3.5 w-3.5 text-[#ff6fae]" />
                            {formattedDate}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })
              ) : (
                <div className="text-sm text-[#4a5562]">
                  No projects yet. Create your first Gifavatar to get started!
                </div>
              )}
            </div>
          </section>
        )}

        <section className="flex flex-col items-center justify-between space-y-6 pt-10">
          <h2 className="text-4xl font-semibold text-[#111827]">
            How Gifavatar looks like on supported platforms
          </h2>
          <PlatformSelectorPreview
            selectedPlatformId={selectedPlatformId}
            onPlatformChange={setSelectedPlatformId}
            bgRemovedUrl={null}
            localUrl={null}
            previewIsLoading={false}
            animationStyle={animationStyle}
            bgColor={bgColor}
            displayName={displayName}
            emailAddress={DEFAULT_EMAIL}
            greetingName={
              user?.firstName || displayName.split(" ")[0] || "there"
            }
            isLoaded={isLoaded ?? false}
            isSignedIn={isSignedIn ?? false}
            isLoadingProject={false}
            avatarPreviewPosition="left"
          />
        </section>

        <section className="space-y-8 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-semibold text-[#111827]">
              Community creations
            </h2>
          </div>
          {/* Top: Dynamic community creations - 50 latest UserResult URLs */}
          <div className="columns-1 gap-6 sm:columns-2">
            {isLoadingCommunityResults ? (
              <div className="text-sm text-[#4a5562]">
                Loading community creations...
              </div>
            ) : (
              communityResultsData?.results?.slice(0, 10)?.map((result) => {
                const previewCount = communityPreviews.length;
                if (previewCount === 0) return null;
                const previewIndex = hashString(result.id) % previewCount;
                const selectedPreview = communityPreviews[previewIndex];
                if (!selectedPreview) return null;
                return (
                  <CommunityPreviewCard
                    key={result.id}
                    displayName={displayName}
                    userEmail={DEFAULT_EMAIL}
                    isLoading={!isLoaded}
                    localUrl={result.url}
                    renderPreview={selectedPreview.renderPreview}
                    preferCanvasForGif={false}
                  />
                );
              })
            )}
          </div>

          {/* Bottom: Static sample cards - 12 platform previews without localUrl */}
          <div className="columns-1 gap-6 sm:columns-2">
            {communityPreviews.map((preview) => (
              <CommunityPreviewCard
                key={`sample-${preview.id}`}
                displayName={displayName}
                userEmail={DEFAULT_EMAIL}
                isLoading={!isLoaded}
                renderPreview={preview.renderPreview}
                preferCanvasForGif={false}
              />
            ))}
          </div>
        </section>
      </main>
      <style jsx global>{`
        @keyframes gifavatar-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes gifavatar-fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Lightweight inline component for the rotating impact line
function RotatingImpactLine({
  animationStyle,
}: {
  animationStyle: AnimationStyle;
}) {
  const renderPlatformIcon = (
    icon: SimpleIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>,
    { size = 16, color }: { size?: number; color?: string },
  ) => {
    if (typeof icon === "function") {
      const IconComponent = icon;
      return <IconComponent width={size} height={size} style={{ color }} />;
    }
    return (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color ?? `#${icon.hex}`}
      >
        <path d={icon.path} />
      </svg>
    );
  };

  const items: Array<{
    id: PlatformKey;
    label: string;
    brandColor: string;
    metric: string;
    icon: SimpleIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    {
      id: "gmail",
      label: "Gmail",
      brandColor: "#EA4335",
      metric: "email open rate",
      icon: GmailIcon,
    },
    {
      id: "linktree",
      label: "Linktree",
      brandColor: "#43E55E",
      metric: "profile click-through",
      icon: siLinktree,
    },
    {
      id: "beacons",
      label: "Beacons",
      brandColor: "#FF6FAE",
      metric: "link-in-bio clicks",
      icon: BeaconsIcon,
    },
    {
      id: "pixiv",
      label: "Pixiv",
      brandColor: "#0096FA",
      metric: "profile visits",
      icon: siPixiv,
    },
    {
      id: "fandom",
      label: "Fandom",
      brandColor: "#FF4D6D",
      metric: "profile engagement",
      icon: siFandom,
    },
    {
      id: "myanimelist",
      label: "MyAnimeList",
      brandColor: "#2E51A2",
      metric: "profile views",
      icon: siMyanimelist,
    },
    {
      id: "devto",
      label: "Dev.to",
      brandColor: "#0A0A0A",
      metric: "profile click-through",
      icon: siDevdotto,
    },
    {
      id: "medium",
      label: "Medium",
      brandColor: "#000000",
      metric: "reader click-through",
      icon: siMedium,
    },
    {
      id: "substack",
      label: "Substack",
      brandColor: "#FF6719",
      metric: "subscriber click-through",
      icon: siSubstack,
    },
    {
      id: "vgen",
      label: "VGen",
      brandColor: "#39E0B5",
      metric: "commissions booked",
      icon: VGenIcon,
    },
    {
      id: "discord",
      label: "Discord",
      brandColor: "#5865F2",
      metric: "DMs and server joins",
      icon: siDiscord,
    },
    {
      id: "patreon",
      label: "Patreon",
      brandColor: "#000000",
      metric: "pledges started",
      icon: siPatreon,
    },
  ];

  const [index, setIndex] = useState<number>(0);
  const current = items[index % items.length]!;

  // Simple contrast color calculation for badge/text over brand color
  const getContrast = (hex: string): string => {
    const sanitized = hex.replace("#", "");
    if (sanitized.length !== 6) return "#1F2937";
    const num = Number.parseInt(sanitized, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const luminance =
      0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
    return luminance > 0.6 ? "#1F2937" : "#FFFFFF";
  };

  // Rotate one-by-one slowly
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
      {/* Left: avatar */}
      <div
        key={`avatar-${current.id}-${index}`}
        className="flex items-center"
        style={{ animation: "gifavatar-fade-in-up 500ms ease-out" }}
      >
        <AvatarPreview
          config={{
            animationStyle: {
              photoMovement: animationStyle.photoMovement,
              addOnEffect: animationStyle.addOnEffect,
            },
            bgColor: current.brandColor,
            size: 112,
            rounded: true,
          }}
          isLoading={false}
          badge={
            <div aria-label={`${current.label} logo`}>
              {renderPlatformIcon(current.icon, {
                size: 18,
                color: current.brandColor,
              })}
            </div>
          }
        />
      </div>

      {/* Right: text block (left-aligned, fixed width to prevent shifting) */}
      <div className="flex flex-col items-start text-left leading-tight">
        <div
          className="text-2xl font-bold whitespace-nowrap text-[#111827]"
          style={{ width: "22ch" }}
        >
          Boost
        </div>
        <div
          key={`metric-${current.id}-${index}`}
          className="text-2xl font-bold whitespace-nowrap text-[#ff6fae]"
          style={{
            width: "22ch",
            animation: "gifavatar-fade-in-up 500ms ease-out",
          }}
        >
          {current.metric}
        </div>
        <div
          className="text-2xl font-bold whitespace-nowrap text-[#111827]"
          style={{ width: "22ch" }}
        >
          by 300–500%
        </div>
      </div>
    </div>
  );
}
