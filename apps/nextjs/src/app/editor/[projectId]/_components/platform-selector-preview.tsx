"use client";

import type { SimpleIcon } from "simple-icons";
import { useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@sassy/ui/card";

import type { AnimationStyle } from "../../../_components/animation-style-selector";
import type { TransformConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { BeaconsPreview } from "~/app/_components/platform-preview/platform-preview/beacons-preview";
import { DevPreview } from "~/app/_components/platform-preview/platform-preview/dev-preview";
import { DiscordPreview } from "~/app/_components/platform-preview/platform-preview/discord-preview";
import { FandomPreview } from "~/app/_components/platform-preview/platform-preview/fandom-preview";
import { GmailThreadPreview } from "~/app/_components/platform-preview/platform-preview/gmail-thread-preview";
import { LinktreePreview } from "~/app/_components/platform-preview/platform-preview/linktree-preview";
import { MediumPreview } from "~/app/_components/platform-preview/platform-preview/medium-preview";
import { MyAnimeListPreview } from "~/app/_components/platform-preview/platform-preview/myanimelist-preview";
import { PatreonPreview } from "~/app/_components/platform-preview/platform-preview/patreon-preview";
import { PixivPreview } from "~/app/_components/platform-preview/platform-preview/pixiv-preview";
import { SubstackPreview } from "~/app/_components/platform-preview/platform-preview/substack-preview";
import { VGenPreview } from "~/app/_components/platform-preview/platform-preview/vgen-preview";
import BeaconsIcon from "~/app/assets/logos/beacons.svg";
import GmailIcon from "~/app/assets/logos/gmail.svg";
import VGenIcon from "~/app/assets/logos/vgen.svg";

export type PlatformKey =
  | "gmail"
  | "linktree"
  | "beacons"
  | "pixiv"
  | "fandom"
  | "myanimelist"
  | "devto"
  | "medium"
  | "substack"
  | "vgen"
  | "discord"
  | "patreon";

export const DEFAULT_PLATFORM_ID: PlatformKey = "gmail";

interface PlatformInfo {
  id: PlatformKey;
  label: string;
  brandColor: string;
  icon: SimpleIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconAlt?: string;
}

const PLATFORMS: PlatformInfo[] = [
  {
    id: "gmail",
    label: "Gmail",
    brandColor: `#${siGmail.hex}`,
    icon: GmailIcon,
  },
  {
    id: "linktree",
    label: "Linktree",
    brandColor: `#${siLinktree.hex}`,
    icon: siLinktree,
  },
  {
    id: "beacons",
    label: "Beacons",
    brandColor: "#FF6FAE",
    icon: BeaconsIcon,
  },
  {
    id: "pixiv",
    label: "Pixiv",
    brandColor: `#${siPixiv.hex}`,
    icon: siPixiv,
  },
  {
    id: "fandom",
    label: "Fandom",
    brandColor: `#${siFandom.hex}`,
    icon: siFandom,
  },
  {
    id: "myanimelist",
    label: "MyAnimeList",
    brandColor: `#${siMyanimelist.hex}`,
    icon: siMyanimelist,
  },
  {
    id: "devto",
    label: "Dev.to",
    brandColor: `#${siDevdotto.hex}`,
    icon: siDevdotto,
  },
  {
    id: "medium",
    label: "Medium",
    brandColor: `#${siMedium.hex}`,
    icon: siMedium,
  },
  {
    id: "substack",
    label: "Substack",
    brandColor: `#${siSubstack.hex}`,
    icon: siSubstack,
  },
  {
    id: "vgen",
    label: "VGen",
    brandColor: "#39E0B5",
    icon: VGenIcon,
  },
  {
    id: "discord",
    label: "Discord",
    brandColor: `#${siDiscord.hex}`,
    icon: siDiscord,
  },
  {
    id: "patreon",
    label: "Patreon",
    brandColor: `#${siPatreon.hex}`,
    icon: siPatreon,
  },
];

const getContrastColor = (hex: string): string => {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) return "#1F2937";
  const value = Number.parseInt(sanitized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const luminance =
    0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  return luminance > 0.6 ? "#1F2937" : "#FFFFFF";
};

const renderPlatformIcon = (
  icon: SimpleIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { size = 18, color }: { size?: number; color?: string },
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

type PlatformSelectorPreviewProps = {
  selectedPlatformId: PlatformKey;
  onPlatformChange: (platformId: PlatformKey) => void;
  bgRemovedUrl: string | null;
  localUrl: string | null;
  previewIsLoading: boolean;
  animationStyle: AnimationStyle;
  bgColor: string;
  displayName: string;
  emailAddress: string;
  greetingName: string;
  isLoaded: boolean;
  isSignedIn: boolean;
  isLoadingProject: boolean;
  avatarPreviewPosition?: "left" | "top" | "right";
  transformConfig?: TransformConfig;
  strokeConfig?: { enabled: boolean; weight: number; color: string };
  avatarCaptureRef?: React.RefObject<HTMLDivElement | null>;
  renderAvatarSquare?: boolean; // When true, renders avatar square for capture
};

export function PlatformSelectorPreview({
  selectedPlatformId,
  onPlatformChange,
  bgRemovedUrl,
  localUrl,
  previewIsLoading,
  animationStyle,
  bgColor,
  displayName,
  emailAddress,
  greetingName,
  isLoaded,
  isSignedIn,
  isLoadingProject,
  avatarPreviewPosition = "top",
  transformConfig,
  strokeConfig,
  avatarCaptureRef,
  renderAvatarSquare = false,
}: PlatformSelectorPreviewProps) {
  const selectedPlatform = useMemo(
    () => PLATFORMS.find((p) => p.id === selectedPlatformId) ?? PLATFORMS[0]!,
    [selectedPlatformId],
  );

  // Construct avatar config - always create new object reference
  const avatarConfig = useMemo(
    () => ({
      animationStyle: {
        photoMovement: animationStyle.photoMovement,
        addOnEffect: animationStyle.addOnEffect,
      },
      bgColor,
      transformConfig,
      strokeConfig: strokeConfig?.enabled ? strokeConfig : undefined,
    }),
    [
      animationStyle.photoMovement,
      animationStyle.addOnEffect,
      bgColor,
      transformConfig,
      strokeConfig,
    ],
  );

  // Render the selected platform preview
  // Always create new props object to ensure React detects changes
  const previewProps = useMemo(
    () => ({
      userName: displayName,
      userEmail: emailAddress,
      bgRemovedUrl: bgRemovedUrl ?? undefined,
      localUrl: localUrl ?? undefined,
      bgColor,
      isLoading: previewIsLoading,
      avatarConfig,
    }),
    [
      displayName,
      emailAddress,
      bgRemovedUrl,
      localUrl,
      bgColor,
      previewIsLoading,
      avatarConfig,
    ],
  );

  const renderPreview = () => {
    if (selectedPlatformId === "gmail") {
      return (
        <GmailThreadPreview
          key={`gmail-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "linktree") {
      return (
        <LinktreePreview
          key={`linktree-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "beacons") {
      return (
        <BeaconsPreview
          key={`beacons-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "pixiv") {
      return (
        <PixivPreview
          key={`pixiv-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "fandom") {
      return (
        <FandomPreview
          key={`fandom-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "myanimelist") {
      return (
        <MyAnimeListPreview
          key={`myanimelist-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "devto") {
      return (
        <DevPreview
          key={`devto-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "medium") {
      return (
        <MediumPreview
          key={`medium-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "substack") {
      return (
        <SubstackPreview
          key={`substack-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "vgen") {
      return (
        <VGenPreview
          key={`vgen-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "discord") {
      return (
        <DiscordPreview
          key={`discord-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    if (selectedPlatformId === "patreon") {
      return (
        <PatreonPreview
          key={`patreon-${animationStyle.photoMovement}-${animationStyle.addOnEffect}-${bgColor}`}
          {...previewProps}
        />
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        {isLoadingProject && (
          <span className="text-muted-foreground text-xs">Loading...</span>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          aria-label="Select a platform preview"
          className="flex items-center justify-center gap-1 overflow-x-auto rounded-full border border-gray-200 bg-white/80 p-2"
        >
          {PLATFORMS.map((platform) => {
            const isSelected = platform.id === selectedPlatformId;
            const contrast = getContrastColor(platform.brandColor);
            const iconColor = isSelected ? contrast : platform.brandColor;
            return (
              <Button
                key={platform.id}
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full border transition-transform hover:scale-[1.03]"
                style={
                  isSelected
                    ? {
                        backgroundColor: platform.brandColor,
                        color: contrast,
                        borderColor: platform.brandColor,
                      }
                    : {
                        borderColor: platform.brandColor,
                        color: platform.brandColor,
                        backgroundColor: "white",
                      }
                }
                onClick={() => onPlatformChange(platform.id)}
                aria-pressed={isSelected}
              >
                {renderPlatformIcon(platform.icon, {
                  size: 18,
                  color: iconColor,
                })}
                <span className="sr-only">{platform.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="text-muted-foreground text-center text-sm font-medium">
          {selectedPlatform.label} preview
        </div>

        {avatarPreviewPosition === "top" ? (
          <>
            <div className="flex justify-center">
              <AvatarPreview
                key={`avatar-${animationStyle.photoMovement ?? "none"}-${animationStyle.addOnEffect ?? "none"}-${bgColor}`}
                config={{
                  ...avatarConfig,
                  size: 180,
                  rounded: true,
                }}
                bgRemovedUrl={bgRemovedUrl}
                localUrl={localUrl}
                isLoading={previewIsLoading}
                captureRef={avatarCaptureRef}
                renderSquare={renderAvatarSquare}
              />
            </div>

            {isLoaded && isSignedIn && (
              <div className="text-center text-2xl font-semibold">
                Hi, {greetingName}!
              </div>
            )}

            {renderPreview()}
          </>
        ) : (
          <div
            className={`flex flex-row items-center justify-center gap-15 ${
              avatarPreviewPosition === "left" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <AvatarPreview
                key={`avatar-${animationStyle.photoMovement ?? "none"}-${animationStyle.addOnEffect ?? "none"}-${bgColor}`}
                config={{
                  ...avatarConfig,
                  size: 180,
                  rounded: true,
                }}
                bgRemovedUrl={bgRemovedUrl}
                localUrl={localUrl}
                isLoading={previewIsLoading}
                captureRef={avatarCaptureRef}
                renderSquare={renderAvatarSquare}
              />

              {isLoaded && isSignedIn && (
                <div className="text-center text-2xl font-semibold">
                  Hi, {greetingName}!
                </div>
              )}
            </div>

            <div className="flex items-center">{renderPreview()}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
