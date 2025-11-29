"use client";

import type { CSSProperties, ReactNode, SVGProps } from "react";
import { Gift } from "lucide-react";
import { siPatreon } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const PATREON_BLUSH = "#ff424d";
const PATREON_DARK = "#111118";
const PATREON_CARD_BG = "#1a1a23";

interface PatreonPreviewProps {
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

export function PatreonPreview({
  userName,
  userEmail: _userEmail,
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: PatreonPreviewProps) {
  const resolvedAvatar = useResolvedAvatar(localUrl);
  const displayName = userName || "callimohu";

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-[32px] border border-white/10 text-white shadow-[0_34px_70px_rgba(8,8,12,0.65)]"
      style={
        {
          maxWidth: "700px",
          background:
            "linear-gradient(160deg, rgba(10,10,18,0.98) 0%, rgba(18,18,28,0.96) 100%)",
        } as CSSProperties
      }
    >
      <div className="relative h-25 w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,#2e2d39,#151520_65%)]">
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute top-1/2 -left-20 h-44 w-44 -translate-y-1/2 rounded-full blur-[60px]"
            style={{ background: PATREON_BLUSH }}
            aria-hidden="true"
          />
          <div
            className="absolute top-10 -right-10 h-32 w-32 rounded-full blur-[50px]"
            style={{ background: "#3f4196" }}
            aria-hidden="true"
          />
        </div>
        <div className="relative flex h-full items-end justify-between px-6 pb-6">
          <div className="flex items-center gap-4">
            <PatreonLogo className="h-10 w-10" />
            <span className="text-lg font-extrabold text-white">Patreon</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-white/20"
          >
            <Gift className="h-4 w-4" aria-hidden="true" />
            Gift membership
          </button>
        </div>
      </div>

      <main
        className="space-y-6 bg-[color:var(--card-bg)] px-6 py-7"
        style={{ "--card-bg": PATREON_CARD_BG } as CSSProperties}
      >
        <section className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="w-38">
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
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {displayName}
              </h2>
              <p className="max-w-sm text-sm text-white/70">
                I show people how to get the best moving animated gif avatars on
                the internet with gifavatar.app
              </p>
            </div>
          </div>
          <div className="ml-auto flex flex-col gap-3 text-sm font-semibold text-white/80">
            <MetricRow label="Members" value="116" />
            <MetricRow label="Posts" value="150" />
            <MetricRow label="Earnings" value="$435.8" />
          </div>
        </section>

        <section className="grid gap-3 text-sm font-semibold text-white/85 md:grid-cols-2">
          <button
            type="button"
            className="rounded-2xl border border-white/12 bg-white/10 px-5 py-3 text-left shadow-[0_18px_36px_rgba(7,9,15,0.5)] transition hover:bg-white/14"
          >
            Join for free
          </button>
          <button
            type="button"
            className="rounded-2xl border border-white/25 bg-white px-5 py-3 text-left text-[#151520] shadow-[0_18px_36px_rgba(255,255,255,0.25)] transition hover:brightness-95"
          >
            See membership options
          </button>
        </section>
      </main>
    </div>
  );
}

function PatreonLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-white"
      style={{ width: 60, height: 60 }} // You can adjust size as needed
      aria-hidden="true"
    >
      <svg
        {...props}
        role="img"
        aria-label="Patreon logo"
        viewBox="0 0 24 24"
        style={{ color: `#${siPatreon.hex}` }}
      >
        <path fill="currentColor" d={siPatreon.path} />
      </svg>
    </span>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-end gap-3 rounded-xl border border-white/12 bg-white/5 px-2 py-2">
      <span className="text-base text-white">{value}</span>
      <span className="text-xs text-white/60 uppercase">{label}</span>
      <span
        className="inline-flex h-2 w-2 shrink-0 rounded-full"
        style={{ background: PATREON_BLUSH }}
        aria-hidden="true"
      />
    </div>
  );
}

const BENEFITS = [
  "Monthly look drops with alt variations",
  "PSD + lighting setup for personal tweaking",
  "Priority commission queue access",
] as const;
