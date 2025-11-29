"use client";

import type { CSSProperties, ReactNode } from "react";
import { Bell, Hash, Inbox, Pin, Users2 } from "lucide-react";
import { siDiscord } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { defaultRandomAvatar } from "~/app/_components/platform-preview/default-random-avatar";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const DISCORD_BLURPLE = `#${siDiscord.hex}`;
const PANEL_MUTED = "#1f2025";
const PANEL_SHADE = "#23262b";

interface DiscordPreviewProps {
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

export function DiscordPreview({
  userName,
  userEmail: _userEmail,
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: DiscordPreviewProps) {
  const resolvedAvatar = useResolvedAvatar(localUrl);
  const displayName = userName || "Novac";

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-[28px] border border-black/35 text-white shadow-[0_30px_80px_rgba(6,8,16,0.55)]"
      style={
        {
          maxWidth: "760px",
          background:
            "linear-gradient(135deg, rgba(18,20,27,0.98) 0%, rgba(22,24,31,0.96) 50%, rgba(14,16,24,0.98) 100%)",
        } as CSSProperties
      }
    >
      <div
        className="flex flex-row divide-x divide-white/5"
        style={{
          background: "linear-gradient(155deg, #11131a 0%, #161821 100%)",
        }}
      >
        <ServerRail />

        <section
          className="space-y-5 px-5 py-5"
          style={{
            background:
              "linear-gradient(160deg, rgba(30,32,37,0.94), rgba(24,26,33,0.92))",
          }}
        >
          <ChannelHeader />
          <FilterTabs />

          <ul className="space-y-5">
            <MessageCard
              name={displayName}
              time="Today at 5:49 AM"
              avatar={
                <AvatarPreview
                  config={
                    avatarConfig
                      ? { ...avatarConfig, size: 96, rounded: true }
                      : {
                          bgColor,
                          // Default animationStyle when not provided (for openpeeps avatar)
                          animationStyle: {
                            photoMovement: "rise",
                            addOnEffect: null,
                          },
                          size: 96,
                          rounded: true,
                        }
                  }
                  bgRemovedUrl={bgRemovedUrl}
                  localUrl={localUrl ?? undefined} // Pass original - AvatarPreview handles default Openpeeps internally
                  isLoading={isLoading}
                  badge={badge}
                  preferCanvasForGif={preferCanvasForGif}
                />
              }
            >
              <p className="text-base leading-7 text-white/90">
                you DM <Mention>@JM@Poe</Mention> and link the post in the
                channel — they still owe us that{" "}
                <span
                  className="text-[color:var(--blurple)]"
                  style={{ "--blurple": DISCORD_BLURPLE } as CSSProperties}
                >
                  5M
                </span>{" "}
                points.
              </p>
            </MessageCard>

            <MessageCard
              name="Random Guy"
              time="Today at 5:51 AM"
              avatar={<div>{defaultRandomAvatar}</div>}
            >
              <p className="text-base leading-7 text-white/85">
                This server is so dead - we need gifavatar.app man 😭
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <EmojiReaction emoji="🥺" count={5} />
                <EmojiReaction emoji="🙂" />
              </div>
            </MessageCard>
          </ul>
        </section>
      </div>
    </div>
  );
}

function ServerRail() {
  return (
    <aside className="flex flex-col items-center gap-4 border-r border-white/5 bg-[#18191d] px-3 py-6">
      {SERVER_ICONS.map((server) => (
        <ServerIcon key={server.label} {...server} />
      ))}
    </aside>
  );
}

function ChannelHeader() {
  return (
    <header
      className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-[color:var(--muted)] px-5 py-4 shadow-[0_22px_48px_rgba(8,10,18,0.55)]"
      style={{ "--muted": PANEL_MUTED } as CSSProperties}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--blurple)]/20 text-[color:var(--blurple)]"
        style={{ "--blurple": DISCORD_BLURPLE } as CSSProperties}
      >
        <Hash className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold text-white">Discord</h1>
      </div>
      <div className="flex items-center gap-3 text-white/45">
        <Bell className="h-5 w-5" aria-hidden="true" />
        <Pin className="h-5 w-5" aria-hidden="true" />
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
    </header>
  );
}

function FilterTabs() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
      <FilterChip
        active
        icon={<Users2 className="h-3.5 w-3.5" aria-hidden="true" />}
      >
        Friends
      </FilterChip>
      <FilterChip>Online</FilterChip>
      <FilterChip>All</FilterChip>
      <FilterChip badge={1}>Pending</FilterChip>
      <FilterChip badge={10}>Suggestions</FilterChip>
    </div>
  );
}

function MessageCard({
  name,
  time,
  avatar,
  children,
}: {
  name: string;
  time: string;
  avatar: ReactNode;
  children: ReactNode;
}) {
  return (
    <li
      className="flex gap-4 rounded-xl border border-white/12 bg-[color:var(--shade)]/65 px-4 py-4 shadow-[0_16px_34px_rgba(9,11,18,0.45)]"
      style={{ "--shade": PANEL_SHADE } as CSSProperties}
    >
      <div className="flex shrink-0 items-center justify-center">{avatar}</div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
          <span className="font-semibold text-white">{name}</span>
          <span>{time}</span>
        </div>
        <div className="text-sm text-white/90">{children}</div>
      </div>
    </li>
  );
}

function FilterChip({
  children,
  active,
  badge,
  icon,
}: {
  children: ReactNode;
  active?: boolean;
  badge?: number;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 ${
        active
          ? "border-white/25 bg-white/15 text-white"
          : "border-white/12 bg-white/5 text-white/70 hover:border-white/18"
      }`}
    >
      {icon}
      {children}
      {typeof badge === "number" ? (
        <span className="rounded-full bg-[#ed4245] px-2 py-0.5 text-[11px] text-white">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

function EmojiReaction({ emoji, count }: { emoji: string; count?: number }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 text-xs">
      <span role="img" aria-label="reaction">
        {emoji}
      </span>
      {typeof count === "number" ? <span>{count}</span> : null}
    </span>
  );
}

function Mention({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-md bg-[color:var(--blurple)]/30 px-1.5 py-0.5 font-medium text-[color:var(--blurple)]"
      style={{ "--blurple": DISCORD_BLURPLE } as CSSProperties}
    >
      {children}
    </span>
  );
}

function ServerIcon({
  label,
  icon,
  color,
  isActive,
  badge,
}: {
  label?: string;
  icon?: ReactNode;
  color: string;
  isActive?: boolean;
  badge?: number;
}) {
  return (
    <div className="relative">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#1e2025] text-lg font-semibold text-white shadow-[0_12px_24px_rgba(8,10,16,0.55)] ${
          isActive
            ? "ring-4 ring-[color:var(--color)] ring-offset-2 ring-offset-[#121317]"
            : ""
        }`}
        style={{ "--color": color } as CSSProperties}
        aria-label={`${label ?? "Server"} icon`}
      >
        {icon ?? label}
      </div>
      {typeof badge === "number" ? (
        <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ed4245] text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(237,66,69,0.45)]">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

const SERVER_ICONS = [
  {
    label: "Discord",
    icon: <DiscordGlyph />,
    color: DISCORD_BLURPLE,
    isActive: true,
    badge: 5,
  },
  { label: "FN", color: "#ff4454", badge: 10 },
  { label: "S", color: "#5865F2" },
  { label: "24", color: "#ff1f51", badge: 1 },
] as const;

function DiscordGlyph() {
  return (
    <svg
      role="img"
      aria-label="Discord"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      style={{ color: DISCORD_BLURPLE }}
    >
      <path fill="currentColor" d={siDiscord.path} />
    </svg>
  );
}
