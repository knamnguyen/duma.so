"use client";

import type { CSSProperties, ReactNode, SVGProps } from "react";
import { Bell, PenSquare } from "lucide-react";
import { siMedium } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const MEDIUM_HEX = `#${siMedium.hex}`;
const CARD_BG = "#ffffff";
const CARD_MAX_WIDTH = "760px";

interface MediumPreviewProps {
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

export function MediumPreview({
  userName,
  userEmail: _userEmail, // API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: MediumPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-3xl border border-[#d8ece1] bg-[color:var(--card-bg)] text-[#242424] shadow-[0_18px_38px_rgba(15,40,20,0.1)]"
      style={
        { "--card-bg": CARD_BG, maxWidth: CARD_MAX_WIDTH } as CSSProperties
      }
    >
      <header className="flex items-center justify-between border-b border-[#d9ece1] bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <MediumLogo className="h-8 w-8" />
          <span className="text-lg font-extrabold text-[#242424]">Medium</span>
          <div className="hidden h-9 w-56 items-center rounded-full border border-[#d0e7db] bg-[#f8fbfa] px-4 text-sm text-[#5f6d66] sm:flex">
            Search Medium
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#47524c]">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-[#cbe4d9] bg-[#f3f9f6] px-4 py-2 font-medium text-[#2a3b33] transition hover:bg-white sm:flex"
          >
            <PenSquare className="h-4 w-4" aria-hidden="true" />
            Write
          </button>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </div>
      </header>

      <div className="space-y-4 px-5 py-6">
        <section className="flex items-start gap-4 rounded-3xl border border-[#d4e8dd] bg-white p-4 shadow-[0_14px_32px_rgba(28,62,45,0.08)]">
          <div className="h-24 w-24">
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

          <div className="space-y-1 pl-5">
            <h2 className="truncate text-lg font-semibold text-[#1f2d26]">
              {userName || "Written by Ky Nam Nguyen"}
            </h2>
            <p className="text-xs text-[#4f5e55]">3 followers • 17 following</p>
            <p className="max-w-md text-sm leading-6 text-[#3b4a42]">
              Multi-disciplinary approach to build an equitable, exciting, and
              empowering world.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                className="rounded-full bg-[color:var(--medium)] px-3.5 py-1.5 text-sm font-semibold text-white transition hover:brightness-105"
                style={{ "--medium": MEDIUM_HEX } as CSSProperties}
              >
                Follow
              </button>
              <button
                type="button"
                className="rounded-full border border-[#cbe4d9] px-3.5 py-1.5 text-sm text-[#2a3b33] transition hover:bg-[#f6fbf8]"
              >
                Manage publications
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d4e8dd] bg-white p-4 shadow-[0_12px_28px_rgba(32,72,52,0.08)]">
          <div className="flex items-center justify-between border-b border-[#e3f1ea] pb-2 text-sm font-medium text-[#2d3c33]">
            <span className="border-b-2 border-[#1f8a5f] pb-1 text-[#1f8a5f]">
              For you
            </span>
            <button
              type="button"
              className="text-xs font-semibold tracking-[0.2em] text-[#7a8b83] uppercase"
            >
              View all
            </button>
          </div>
          <article className="mt-3 rounded-2xl border border-[#dbeee3] bg-[#f8fbfa] p-3">
            <div className="text-[11px] tracking-[0.2em] text-[#6b7a72] uppercase">
              In Generative AI • Adham Khaled
            </div>
            <h3 className="mt-2 line-clamp-2 text-base font-semibold text-[#223028]">
              Stanford Just Killed Prompt Engineering With 8 Words (And I Can't
              Believe It Worked)
            </h3>
          </article>
        </section>
      </div>
    </div>
  );
}

function MediumLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      aria-label="Medium logo"
      viewBox="0 0 24 24"
      style={{ color: MEDIUM_HEX }}
    >
      <path fill="currentColor" d={siMedium.path} />
    </svg>
  );
}
