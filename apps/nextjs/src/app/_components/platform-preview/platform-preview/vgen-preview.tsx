"use client";

import type { CSSProperties, ReactNode } from "react";
import { MessageCircleMore, Star } from "lucide-react";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";
import VGenLogo from "~/app/assets/logos/vgen.svg";

const VGEN_LIME = "#B7FF2A";
const VGEN_TEAL = "#38D4FF";
const VGEN_DEEP_PURPLE = "#0E1329";
const CARD_MAX_WIDTH = "680px";

interface VGenPreviewProps {
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

export function VGenPreview({
  userName,
  userEmail: _userEmail,
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: VGenPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);
  const displayName = userName || "nocnoc";

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-[32px] border border-white/8 bg-[color:var(--deep)] text-white shadow-[0_28px_70px_rgba(4,6,22,0.6)]"
      style={
        {
          maxWidth: CARD_MAX_WIDTH,
          "--deep": VGEN_DEEP_PURPLE,
          background:
            "linear-gradient(150deg, rgba(7,12,34,0.96) 0%, rgba(10,16,40,0.97) 48%, rgba(12,24,55,0.95) 100%)",
        } as CSSProperties
      }
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold text-white/70 uppercase">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <VGenLogo className="h-7 w-7" aria-label="VGen logo" />
          </div>
          <span className="text-lg font-extrabold text-white">VGen</span>
        </div>
        <nav className="hidden gap-3 sm:flex">
          <span className="rounded-full border border-white/15 px-4 py-1">
            Commissions
          </span>
          <span className="rounded-full border border-white/15 px-4 py-1">
            Portfolio
          </span>
        </nav>
        <button
          type="button"
          className="rounded-full border border-transparent bg-[color:var(--lime)] px-5 py-2 text-[#151022] shadow-[0_6px_18px_rgba(183,255,42,0.35)] transition hover:brightness-110"
          style={{ "--lime": VGEN_LIME } as CSSProperties}
        >
          Send Request
        </button>
      </header>

      <div className="space-y-3 px-3 py-3">
        <section className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[#111b41] p-6 shadow-[0_24px_48px_rgba(4,8,22,0.55)]">
          <div
            className="absolute inset-0 opacity-45"
            style={{
              background:
                "radial-gradient(circle at 20% 15%, rgba(183,255,42,0.45), transparent 60%), radial-gradient(circle at 82% 10%, rgba(56,212,255,0.35), transparent 65%)",
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="w-38">
                <AvatarPreview
                  config={
                    avatarConfig
                      ? { ...avatarConfig, size: 145, rounded: true }
                      : {
                          bgColor,
                          // Default animationStyle when not provided (for openpeeps avatar)
                          animationStyle: {
                            photoMovement: "rise",
                            addOnEffect: null,
                          },
                          size: 145,
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
              <div className="flex flex-col justify-items-start space-y-3">
                <div className="text-xs text-white/50 uppercase">
                  VGen Creator
                </div>
                <div className="flex flex-row items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {displayName}
                  </h2>
                  <Chip icon={<Star className="h-3 w-3" />} color={VGEN_TEAL}>
                    <span className="text-xs">5.0 (409 reviews)</span>
                  </Chip>
                </div>
                <div className="flex w-80 flex-row gap-3 md:text-right">
                  <button
                    type="button"
                    className="rounded-full border border-transparent bg-white px-5 py-2 text-sm font-semibold text-[#13162b] transition hover:brightness-95"
                  >
                    Follow
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative mt-6 rounded-full bg-[color:var(--lime)] px-6 py-2 text-center text-sm font-semibold tracking-[0.3em] text-[#191026] uppercase"
            style={{ "--lime": VGEN_LIME } as CSSProperties}
          >
            Available for new projects
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {COMMISSIONS.map((commission) => (
            <article
              key={commission.title}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0d142f] shadow-[0_22px_46px_rgba(6,10,30,0.6)]"
            >
              <div
                className="absolute inset-0 opacity-35"
                style={{
                  background: `radial-gradient(circle at top right, ${commission.previewHighlight}, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              <div className="relative flex flex-col gap-2 p-2">
                <div
                  className="h-20 overflow-hidden rounded-[18px] border border-white/10 bg-[#151d3c] shadow-inner"
                  style={{
                    background: commission.previewBackground,
                  }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{commission.title}</h3>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span
                    className="rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/15 px-2 py-1 text-[11px] font-semibold tracking-[0.3em] uppercase"
                    style={{ "--accent": VGEN_TEAL } as CSSProperties}
                  >
                    {commission.delivery}
                  </span>
                  <span
                    className="rounded-full border border-transparent bg-[color:var(--lime)] px-4 py-1 text-[#141726] shadow-[0_6px_14px_rgba(183,255,42,0.35)]"
                    style={{ "--lime": VGEN_LIME } as CSSProperties}
                  >
                    ${commission.price}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function Chip({
  icon,
  children,
  color,
}: {
  icon: ReactNode;
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      className="flex items-center gap-2 rounded-full border border-[color:var(--chip)]/40 bg-[color:var(--chip)]/15 px-3 py-1 text-sm font-medium"
      style={{ "--chip": color } as CSSProperties}
    >
      {icon}
      <span className="tracking-tight">{children}</span>
    </span>
  );
}

const COMMISSIONS = [
  {
    title: "Animated Emotes",
    delivery: "5 days",
    price: "85",
    previewBackground:
      "linear-gradient(135deg, rgba(34,55,122,0.72) 0%, rgba(10,26,58,0.9) 90%)",
    previewHighlight: "rgba(56,212,255,0.5)",
  },
  {
    title: "Live2D Rig-Ready Chibi",
    delivery: "7 days",
    price: "210",
    previewBackground:
      "linear-gradient(140deg, rgba(50,24,84,0.78) 0%, rgba(13,18,44,0.9) 85%)",
    previewHighlight: "rgba(183,255,42,0.45)",
  },
] as const;
