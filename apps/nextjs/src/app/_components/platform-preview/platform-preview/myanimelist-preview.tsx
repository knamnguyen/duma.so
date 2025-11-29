/**
 * MyAnimeList preview component (Phase 5 of platform previews expansion).
 *
 * Mirrors the Gmail preview props contract and renders a condensed MAL profile
 * card showcasing avatar, stats, navigation chips, and favorites.
 */

"use client";

import type { CSSProperties, ReactNode } from "react";
import { MapPin, Star } from "lucide-react";
import { siMyanimelist } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const MAL_BRAND = `#${siMyanimelist.hex}`;
const CARD_BG = "#19223c";
const HEADER_GRADIENT =
  "linear-gradient(135deg, rgba(78,124,233,0.92) 0%, rgba(46,81,162,0.98) 45%, rgba(30,58,138,0.98) 100%)";
const STAT_ITEMS: ReadonlyArray<{
  label: string;
  value: string;
  color: string;
}> = [
  { label: "Watching", value: "0", color: "#4ade80" },
  { label: "On Hold", value: "0", color: "#fbbf24" },
  { label: "Dropped", value: "0", color: "#f87171" },
] as const;

const NAV_LINKS: ReadonlyArray<string> = ["Anime List", "Manga List"] as const;
const FAVORITES: ReadonlyArray<{
  title: string;
  subtitle: string;
  gradient: string;
}> = [
  {
    title: "Frieren",
    subtitle: "Series",
    gradient:
      "linear-gradient(135deg, rgba(86,126,255,0.8) 0%, rgba(20,45,95,0.9) 100%)",
  },
  {
    title: "A.O.T",
    subtitle: "Series",
    gradient:
      "linear-gradient(135deg, rgba(142,89,255,0.8) 0%, rgba(57,35,112,0.9) 100%)",
  },
] as const;

interface MyAnimeListPreviewProps {
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

export function MyAnimeListPreview({
  userName,
  userEmail: _userEmail, // kept for API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: MyAnimeListPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-white/10 text-white shadow-[0_22px_46px_rgba(12,17,28,0.55)]"
      style={{ background: CARD_BG }}
    >
      <header
        className="px-5 py-3 text-white"
        style={{ background: HEADER_GRADIENT }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MALLogo className="h-6 w-6 text-white" />
              <span className="text-sm font-extrabold text-white uppercase">
                MyAnimeList.net
              </span>
            </div>
          </div>
          <div className="rounded-full border border-white/60 px-3 py-1 text-xs font-semibold text-white shadow-[0_6px_14px_rgba(12,26,60,0.35)]">
            SINCE 2020
          </div>
        </div>
      </header>

      <div className="space-y-2 px-5 pt-2 pb-3">
        <section
          aria-label="Profile row"
          className="grid gap-4 rounded-xl border border-white/10 bg-[#141d33]/92 p-2 shadow-[0_16px_32px_rgba(8,12,23,0.45)] sm:grid-cols-[200px_auto]"
        >
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-[#141a2b] p-2 shadow-[0_12px_24px_rgba(5,10,20,0.4)]">
              <AvatarPreview
                config={
                  avatarConfig
                    ? { ...avatarConfig, size: 110, rounded: false }
                    : {
                        bgColor,
                        // Default animationStyle when not provided (for openpeeps avatar)
                        animationStyle: {
                          photoMovement: "rise",
                          addOnEffect: null,
                        },
                        size: 110,
                        rounded: false,
                      }
                }
                bgRemovedUrl={bgRemovedUrl}
                localUrl={localUrl ?? undefined} // Pass original - AvatarPreview handles default Openpeeps internally
                isLoading={isLoading}
                badge={badge}
              preferCanvasForGif={preferCanvasForGif}
              />
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <h2 className="text-xl leading-tight font-semibold text-white">
                  {userName || "knamnguyen"}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs tracking-[0.35em] text-white uppercase">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    JAPAN
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs text-white">
              <div className="rounded-md bg-white/12 px-2 py-1 text-white">
                Level 5
              </div>
              <div>Last login: 2h ago</div>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#10162a]/90 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.35em] text-white uppercase">
              <Star className="h-4 w-4 text-[#ffd166]" aria-hidden="true" />
              Favorites
            </div>
            <nav className="flex flex-wrap gap-2 text-xs font-semibold tracking-[0.3em] text-white uppercase">
              {NAV_LINKS.map((link, idx) => (
                <span
                  key={link}
                  className={`rounded-full px-2 py-1 ${
                    idx === 0
                      ? "bg-[color:var(--mal-pill)] text-white shadow-[0_10px_24px_rgba(46,81,162,0.45)]"
                      : "bg-white/15 text-white"
                  }`}
                  style={
                    idx === 0
                      ? ({ "--mal-pill": MAL_BRAND } as CSSProperties)
                      : undefined
                  }
                >
                  {link}
                </span>
              ))}
            </nav>
            <div className="grid gap-3 sm:grid-cols-2">
              {FAVORITES.map((favorite) => (
                <article
                  key={favorite.title}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#161c2c]/85 p-3 shadow-[0_12px_26px_rgba(8,12,23,0.35)]"
                >
                  <div
                    className="h-16 w-16 shrink-0 rounded-lg"
                    style={{ background: favorite.gradient }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">
                      {favorite.title}
                    </div>
                    <div className="text-xs text-white">
                      {favorite.subtitle}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Library stats"
          className="rounded-xl border border-white/12 bg-[#11182d]/95 p-4 text-sm text-white shadow-[0_16px_32px_rgba(8,12,23,0.45)]"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {STAT_ITEMS.map(({ label, value, color }) => (
              <StatCard key={label} label={label} value={value} color={color} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface MALLogoProps {
  className?: string;
}

function MALLogo({ className }: MALLogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white ${className ?? ""}`}
      style={{ width: 40, height: 40 }} // You can adjust size as needed
      aria-hidden="true"
    >
      <svg
        role="img"
        aria-label="MyAnimeList logo"
        viewBox="0 0 24 24"
        style={{ color: MAL_BRAND, width: 24, height: 24 }}
      >
        <path d={siMyanimelist.path} fill="currentColor" />
      </svg>
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-[#1f2740]/85 px-3 py-2 shadow-[0_8px_16px_rgba(9,14,26,0.35)]">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="text-[11px] tracking-[0.3em] text-white uppercase">
          {label}
        </div>
      </div>
      <div className="mt-2 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
