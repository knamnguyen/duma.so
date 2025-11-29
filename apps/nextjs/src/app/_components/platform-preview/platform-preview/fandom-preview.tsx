"use client";

import type { ReactNode } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { siFandom } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { defaultRandomAvatar } from "~/app/_components/platform-preview/default-random-avatar";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const BACKGROUND_HEX = "#11131a";

interface FandomPreviewProps {
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

export function FandomPreview({
  userName,
  userEmail: _userEmail, // API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: FandomPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto max-w-lg overflow-hidden rounded-xl border border-white/10 text-gray-100 shadow-[0_22px_46px_rgba(12,17,28,0.55)]"
      style={{ backgroundColor: BACKGROUND_HEX }}
    >
      <header className="flex items-center justify-between border-b border-white/5 bg-[#0d1018]/95 px-5 py-4">
        <div className="flex items-center">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <FandomLogo />
          </div>
          <span className="text-lg font-extrabold text-white">Fandom.com</span>
          <div></div>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:text-white"
          aria-label="Share profile"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <nav
        className="flex flex-wrap gap-2 px-5 py-3 text-[11px] font-semibold tracking-[0.32em] text-white/65 uppercase"
        aria-label="Fandom navigation"
      >
        {NAV_ITEMS.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 ${
              item === "Home"
                ? "bg-[#ffd95a] text-[#0d1018] shadow-[0_14px_24px_rgba(255,217,90,0.35)]"
                : "bg-white/5"
            }`}
          >
            {item}
          </span>
        ))}
      </nav>

      <main className="space-y-3 px-5 pb-5">
        <section
          aria-label="Featured discussion"
          className="rounded-2xl border border-white/8 bg-[#161b27] p-4 shadow-[0_18px_36px_rgba(7,10,18,0.55)]"
        >
          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#0f121b] p-2 shadow-inner">
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
                localUrl={localUrl ?? undefined} // Pass original - AvatarPreview handles default Openpeeps internally
                isLoading={isLoading}
                badge={badge}
              preferCanvasForGif={preferCanvasForGif}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                <span className="font-semibold text-white">
                  {userName || "Gif Avatar"}
                </span>
                <span>· 29m ago · in General</span>
              </div>
              <h3 className="text-base leading-6 font-semibold text-white">
                Will Doom ever return as Iron Man?
              </h3>
              <p className="text-sm leading-5 text-white/70">
                I think the current Iron Heart sucks so much she needs
                gifavatar.app to save the series
              </p>
              <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white/4 px-3 py-2 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <Heart
                    className="h-4 w-4 text-[#ff729f]"
                    aria-hidden="true"
                  />
                  0
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle
                    className="h-4 w-4 text-[#7dbffc]"
                    aria-hidden="true"
                  />
                  1
                </span>
                <span>Share</span>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Community reply"
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#1b1f2c]">
            {defaultRandomAvatar}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-white">Random Guy</span>
            <span className="mx-2 text-white/50">• now</span>
            <span>Great question for real!</span>
          </div>
        </section>
      </main>
    </div>
  );
}

const NAV_ITEMS = ["Home", "Illustrations", "Manga", "Novels"] as const;

interface FandomLogoProps {
  className?: string;
}

function FandomLogo({ className }: FandomLogoProps) {
  return (
    <>
      <span
        className="absolute top-4 h-4 w-4 rounded-full bg-[#ffe26a] blur-[1px]"
        aria-hidden="true"
      />
      <svg
        role="img"
        aria-label="Fandom logo"
        viewBox="0 0 24 24"
        className={`relative h-8 w-8 ${className}`}
        style={{ color: `#${siFandom.hex}` }}
      >
        <path fill="currentColor" d={siFandom.path} />
      </svg>
    </>
  );
}
