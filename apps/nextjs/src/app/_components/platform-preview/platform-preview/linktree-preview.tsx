"use client";

import type { ReactNode } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siFacebook,
  siInstagram,
  siLinktree,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const LINKTREE_HEX = `#${siLinktree.hex}`;
const BACKGROUND_HEX = "#dde6d6";
const TAGLINE = "Photographer";

const SOCIAL_ICONS: readonly SimpleIcon[] = [
  siTiktok,
  siYoutube,
  siX,
  siFacebook,
  siInstagram,
] as const;

const LINK_BUTTONS: readonly string[] = [
  "My Portfolio",
  "Get gifavatar.app",
  "Visit My Online Store",
  "Contact Me",
] as const;

interface LinktreePreviewProps {
  userName: string;
  userEmail: string;
  bgRemovedUrl?: string;
  localUrl?: string | null;
  avatarConfig?: AvatarConfig;
  bgColor?: string;
  isLoading?: boolean;
  badge?: ReactNode;
  preferCanvasForGif?: boolean;
}

export function LinktreePreview({
  userName,
  userEmail: _userEmail, // kept for API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: LinktreePreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto max-w-sm overflow-hidden rounded-[32px] text-center shadow-xl"
      style={{ backgroundColor: BACKGROUND_HEX }}
    >
      <div className="relative">
        <div className="h-32 w-full rounded-b-[48px] bg-gradient-to-b from-[#2d4d3a] to-[#3d5b43]">
          <div className="flex h-full items-center justify-center gap-3 text-white">
            <LinktreeGlyph className="h-10 w-10" />
            <span className="text-sm tracking-[0.4em] uppercase">
              Linktree in bio
            </span>
          </div>
        </div>
        <div className="absolute top-22 left-1/2 -translate-x-1/2">
          <div className="ring- rounded-full bg-white p-2 shadow-2xl ring-white/60">
            <AvatarPreview
              config={
                avatarConfig
                  ? { ...avatarConfig, size: 120, rounded: true }
                  : {
                      bgColor,
                      // Default animationStyle when not provided (for openpeeps avatar)
                      animationStyle: {
                        photoMovement: "rise",
                        addOnEffect: null,
                      },
                      size: 120,
                      rounded: true,
                    }
              }
              bgRemovedUrl={bgRemovedUrl}
              localUrl={localUrl ?? undefined} // AvatarPreview handles default Openpeeps internally
              isLoading={isLoading}
              badge={badge}
              preferCanvasForGif={preferCanvasForGif}
            />
          </div>
        </div>
      </div>

      <div className="px-8 pt-28 pb-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#16321f]">
            {userName || "Sarah Minetta"}
          </h2>
          <p className="text-sm tracking-[0.45em] text-[#2f5139] uppercase">
            {TAGLINE}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-center gap-5 text-[#16321f]">
          {SOCIAL_ICONS.map((icon) => (
            <SocialIcon key={icon.title} icon={icon} />
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {LINK_BUTTONS.map((label) => (
            <button
              key={label}
              className="w-full rounded-2xl bg-white py-3 text-lg font-medium text-[#16321f] shadow-[0_18px_35px_rgba(31,54,39,0.18)] transition-transform hover:scale-[1.02]"
              style={{ border: `1px solid ${LINKTREE_HEX}33` }}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LinktreeGlyphProps {
  className?: string;
}

function LinktreeGlyph({ className }: LinktreeGlyphProps) {
  return (
    <svg
      role="img"
      aria-label="Linktree logo"
      viewBox="0 0 24 24"
      className={className}
      style={{ color: LINKTREE_HEX }}
    >
      <path fill="currentColor" d={siLinktree.path} />
    </svg>
  );
}

function SocialIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
