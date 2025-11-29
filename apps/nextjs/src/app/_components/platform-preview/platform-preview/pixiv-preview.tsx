"use client";

import type { CSSProperties, ReactNode, SVGProps } from "react";
import { Brush, MapPin, MessageCircle, Search, Users } from "lucide-react";
import { siPixiv } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const BRAND_HEX = "#0096FA";
const ACCENT_CYAN = "#4BD8FF";
const ACCENT_PURPLE = "#7A5BFF";

interface PixivPreviewProps {
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

function PixivLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      aria-label="Pixiv logo"
      viewBox="0 0 24 24"
      style={{ color: BRAND_HEX }}
    >
      <path fill="currentColor" d={siPixiv.path} />
    </svg>
  );
}

export function PixivPreview({
  userName,
  userEmail: _userEmail, // API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: PixivPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#0b1121] text-white shadow-[0_20px_45px_rgba(11,17,33,0.45)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(24,38,68,0.95) 0%, rgba(10,13,23,0.98) 65%, rgba(10,13,23,1) 100%)",
      }}
    >
      <header
        className="flex flex-col gap-3 border-b border-white/10 bg-[color:var(--nav-bg)] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
        style={{ "--nav-bg": "rgba(11, 24, 52, 0.85)" } as CSSProperties}
      >
        <div className="flex items-center gap-2">
          <PixivLogo className="h-7 w-7" />
          <span className="text-base font-semibold text-white">Pixiv.net</span>
        </div>
        <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <div
            className="flex w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 focus-within:border-white/30 focus-within:bg-white/10 sm:max-w-md"
            role="search"
          >
            <Search className="h-4 w-4 text-white/60" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search artworks"
              aria-label="Search artworks"
              readOnly
              className="flex-1 border-0 bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--pixiv-button)] px-4 py-2 text-xs font-semibold tracking-[0.28em] text-[#041431] uppercase shadow-[0_12px_24px_rgba(0,150,250,0.32)] transition hover:brightness-110"
            style={{ "--pixiv-button": ACCENT_CYAN } as CSSProperties}
          >
            <Brush className="h-4 w-4" aria-hidden="true" />
            Draw
          </button>
        </div>
      </header>
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-start gap-6">
          <div className="rounded-2xl border border-white/20 bg-[#0b1121] p-1 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
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
            <div className="mt-7 flex flex-row items-center gap-6">
              <h2 className="text-lg leading-6 font-semibold">
                {userName || "光乃アトリエ"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[11px] tracking-[0.3em] text-white uppercase">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  フォロー中&nbsp;580
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  日本
                </span>
              </div>
            </div>
            <p
              className="text-[10px] leading-5 text-white"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              物語を描くイラストレーター。ご依頼は 1476619342@qq.com
              まで。映画「流浪地球」「焼不尽」のビジュアルを担当。
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-[color:var(--pixiv)] px-5 py-2 text-xs font-semibold tracking-[0.28em] text-white uppercase shadow-[0_12px_24px_rgba(0,150,250,0.35)] transition hover:bg-[#0a83da]"
                style={{ "--pixiv": BRAND_HEX } as React.CSSProperties}
              >
                Follow
              </button>
              <button
                type="button"
                className="rounded-full border border-white/35 px-5 py-2 text-xs font-semibold tracking-[0.28em] text-white/85 uppercase transition hover:bg-white/10"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-3 h-[3px] w-full rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(73,216,255,0.2) 0%, ${ACCENT_CYAN} 40%, ${ACCENT_PURPLE} 100%)`,
          }}
        />

        <nav
          className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold tracking-[0.28em] text-white/65 uppercase"
          aria-label="Pixiv sections"
        >
          {PIXIV_TABS.map((tab) => {
            const isActive = tab === "Home";
            return (
              <span
                key={tab}
                className={`rounded-full px-3 py-1 ${
                  isActive
                    ? "bg-[color:var(--accent-pill)] text-[#041431] shadow-[0_10px_18px_rgba(0,150,250,0.28)]"
                    : "bg-white/5"
                }`}
                style={
                  isActive
                    ? ({
                        "--accent-pill": ACCENT_CYAN,
                      } as CSSProperties)
                    : undefined
                }
              >
                {tab}
              </span>
            );
          })}
        </nav>

        <section
          aria-label="Featured illustrations"
          className="mt-3 flex gap-2"
        >
          {SHOWCASE_ITEMS.map((item) => (
            <article
              key={item.title}
              className="flex-1 rounded-2xl border border-white/8 bg-white/5 p-2.5 text-[11px] text-white/80 shadow-[0_12px_22px_rgba(8,12,23,0.35)]"
            >
              <div
                className="relative h-14 w-full rounded-xl"
                style={{ background: item.background }}
                aria-hidden="true"
              >
                <div className="absolute -bottom-3 left-3"></div>
              </div>
              <div className="mt-3 flex items-center justify-between font-semibold text-white">
                <span>{item.title}</span>
                <span className="flex items-center gap-1 text-[10px] text-white/70">
                  <MessageCircle className="h-3 w-3" aria-hidden="true" />
                  {item.commentCount}件
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-4 text-white/65">
                {item.caption}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

const PIXIV_TABS = ["Home", "Illustrations", "Manga"] as const;

const SHOWCASE_ITEMS = [
  {
    title: "星空の旅人",
    caption: "夜空を渡る旅人が異世界の光を追いかける物語。",
    commentCount: 20,
    background:
      "linear-gradient(135deg, rgba(59,125,255,0.85) 0%, rgba(25,48,124,0.9) 100%)",
  },
  {
    title: "アフターグロー",
    caption: "雲海を駆ける少年が翼の仲間と新しい旅路を探す。",
    commentCount: 15,
    background:
      "linear-gradient(135deg, rgba(122,91,255,0.85) 0%, rgba(54,27,125,0.9) 100%)",
  },
] as const;
