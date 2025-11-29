"use client";

import type { CSSProperties, ReactNode, SVGProps } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { siDevdotto } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const DEV_BRAND_HEX = `#${siDevdotto.hex}`;
const SURFACE_BG = "#f7f9fb";
const PANEL_BG = "#ffffff";
const SIDEBAR_BG = "#f0f2f5";

interface DevPreviewProps {
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

export function DevPreview({
  userName,
  userEmail: _userEmail, // API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: DevPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);
  const displayName =
    userName && userName.trim().length > 0 ? userName : "knamnguyen";
  const handle = displayName.toLowerCase().replace(/\s+/g, "");

  return (
    <div
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#e3e7ec] bg-[color:var(--surface)] text-[#1f2429] shadow-[0_20px_45px_rgba(43,57,76,0.12)]"
      style={{ "--surface": SURFACE_BG } as CSSProperties}
    >
      <header className="flex items-center gap-3 border-b border-[#e1e5ea] bg-white px-5 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-[#111827]">
          <DevLogo className="h-7 w-7" />
          <span>DEV Community</span>
        </div>
        <div className="ml-4 flex flex-1 items-center gap-2 rounded-full border border-[#d7dde4] bg-[#f4f6f8] px-4 py-2 text-sm text-[#5b6571]">
          <Sparkles className="h-4 w-4 text-[#7c3aed]" aria-hidden="true" />
          <span className="truncate">Search posts, tags, or creators...</span>
        </div>
      </header>

      <div className="space-y-4 px-5 py-6">
        <article
          className="rounded-3xl border border-[#d8dee6] bg-[color:var(--panel)] p-5 shadow-[0_16px_35px_rgba(80,102,124,0.12)]"
          style={{ "--panel": PANEL_BG } as CSSProperties}
        >
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col items-center gap-3 text-center">
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
              <div className="space-y-1 text-sm leading-tight text-[#5a6572]">
                <p className="text-base font-semibold text-[#10161b]">
                  {displayName}
                </p>
                <p>@{handle}</p>
                <p>Nov 8</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 text-[15px] leading-6 text-[#2b333c]">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[#10161b]">
                  What do you think about this new gifavatar.app? 🤔
                </p>
                <button
                  type="button"
                  className="rounded-full border border-[#d8dee6] p-2 text-[#5a6572] transition hover:bg-[#f4f6f8]"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <p>
                I'm shipping a tool to polish Gif Avatars before posting. Wanna
                give me some feedback?
              </p>
              <div className="rounded-2xl border border-[#e2e8f0] bg-[#f7f9fb] p-3 text-sm leading-6 text-[#3a434c]">
                <p className="font-semibold text-[#1b2732]">Juno Threadborne</p>
                <blockquote className="mt-1 border-l-2 border-[#cbd5e1] pl-3 text-[#5b6571] italic">
                  fixing the past is way more expensive than building the
                  future.
                </blockquote>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.3em] text-[#6b7380] uppercase">
            {HASHTAGS.map((tag) => (
              <span
                key={tag.text}
                className="rounded-full bg-[color:var(--tag-bg)] px-3 py-1 text-[11px] text-[color:var(--tag-fg)]"
                style={
                  {
                    "--tag-bg": tag.background,
                    "--tag-fg": tag.color,
                  } as CSSProperties
                }
              >
                {tag.text}
              </span>
            ))}
          </div>

          <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#4a5562]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {REACTION_EMOJIS.map((emoji) => (
                    <span
                      key={emoji.id}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white text-lg shadow-sm"
                      style={{ color: emoji.color }}
                      aria-hidden="true"
                    >
                      {emoji.symbol}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#1f2933]">
                  24 reactions
                </span>
              </div>
              <ReactionStat
                icon="💬"
                label="Comments"
                value="9"
                className="text-[#2563eb]"
              />
              <ReactionStat
                icon="🔖"
                label="Saves"
                value="3"
                className="text-[#7c3aed]"
              />
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

function ReactionStat({
  icon,
  value,
  label,
  className,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${className ?? ""}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[#1f2933]">{value}</span>
      <span className="text-xs tracking-[0.12em] text-[#6b7380] uppercase">
        {label}
      </span>
    </div>
  );
}

function DevLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      aria-label="Dev.to logo"
      viewBox="0 0 24 24"
      style={{ color: DEV_BRAND_HEX }}
    >
      <path fill="currentColor" d={siDevdotto.path} />
    </svg>
  );
}

const HASHTAGS = [
  { text: "#llm", background: "#ecfdf5", color: "#047857" },
  { text: "#css", background: "#eff6ff", color: "#1d4ed8" },
  { text: "#ai", background: "#fef2f2", color: "#dc2626" },
  { text: "#gifavatar", background: "#f5f3ff", color: "#7c3aed" },
] as const;

const REACTION_EMOJIS = [
  { id: "heart", symbol: "❤️‍🔥", color: "#ef4444" },
  { id: "fire", symbol: "🔥", color: "#f97316" },
  { id: "unicorn", symbol: "🦄", color: "#a855f7" },
  { id: "sparkles", symbol: "✨", color: "#facc15" },
] as const;
