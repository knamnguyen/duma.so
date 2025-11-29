"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

import { useRandomPeepAvatar } from "~/app/social-referral/_components/use-random-peep-avatar";

interface PreviewRendererArgs {
  displayName: string;
  userEmail: string;
  avatarUrl?: string;
  gradient: string;
  accentColor: string;
  isLoading: boolean;
  localUrl?: string | null;
  preferCanvasForGif?: boolean;
}

interface CommunityPreviewCardProps {
  displayName: string;
  userEmail: string;
  isLoading: boolean;
  renderPreview: (args: PreviewRendererArgs) => ReactNode;
  localUrl?: string | null;
  preferCanvasForGif?: boolean;
}

const pastelHues = [0, 30, 60, 120, 180, 210, 240, 270, 300, 330];

const generateRandomGradient = (): {
  gradient: string;
  accentColor: string;
} => {
  const hue = pastelHues[Math.floor(Math.random() * pastelHues.length)] ?? 0;
  const offset = 20 + Math.random() * 30;
  const saturation = 45 + Math.random() * 20;
  const startLightness = 78 + Math.random() * 12;
  const endLightness = startLightness - 8;
  const accent = `hsl(${(hue + offset) % 360}, ${saturation + 10}%, ${Math.min(startLightness + 6, 95)}%)`;
  const startColor = `hsl(${hue}, ${saturation}%, ${startLightness}%)`;
  const endColor = `hsl(${(hue + offset) % 360}, ${saturation + 5}%, ${endLightness}%)`;
  return {
    gradient: `linear-gradient(135deg, ${startColor}, ${endColor})`,
    accentColor: accent,
  };
};

export function CommunityPreviewCard({
  displayName,
  userEmail,
  isLoading,
  renderPreview,
  localUrl,
  preferCanvasForGif = true,
}: CommunityPreviewCardProps) {
  const avatarUrl = useRandomPeepAvatar(!localUrl);
  const { gradient, accentColor } = useMemo(() => generateRandomGradient(), []);
  // Only wait for random peep avatar if localUrl is not provided (since AvatarPreview prioritizes localUrl)
  const computedIsLoading = isLoading || (!localUrl && avatarUrl.length === 0);

  return (
    <div
      className="mb-6 break-inside-avoid-column overflow-hidden rounded-[28px] border border-white/20 shadow-[0_18px_44px_rgba(17,24,39,0.12)]"
      style={{ background: gradient }}
    >
      <div className="bg-white/30 px-1.5 pt-1.5">
        <div className="rounded-[24px] bg-white/80 p-2 shadow-[0_16px_35px_rgba(17,24,39,0.12)]">
          {renderPreview({
            displayName,
            userEmail,
            avatarUrl,
            gradient,
            accentColor,
            isLoading: computedIsLoading,
            localUrl,
            preferCanvasForGif,
          })}
        </div>
      </div>
    </div>
  );
}
