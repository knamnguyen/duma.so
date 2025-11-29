"use client";

import type { CSSProperties, ReactNode, SVGProps } from "react";
import { Mail, PenLine } from "lucide-react";
import { siSubstack } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";

const SUBSTACK_HEX = `#${siSubstack.hex}`;
const CARD_BG = "#ffffff";
const CARD_MAX_WIDTH = "620px";

interface SubstackPreviewProps {
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

export function SubstackPreview({
  userName,
  userEmail,
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: SubstackPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-3xl border border-[#f0e7de] bg-[color:var(--card-bg)] text-[#372f2b] shadow-[0_18px_40px_rgba(120,80,40,0.12)]"
      style={
        {
          "--card-bg": CARD_BG,
          maxWidth: CARD_MAX_WIDTH,
        } as CSSProperties
      }
    >
      <header
        className="flex flex-wrap items-center gap-3 border-b border-[#efe3d8] bg-[#fffaf3] px-6 py-4 text-sm font-semibold text-[#322922]"
        style={{ boxShadow: "inset 0 -1px 0 rgba(231, 209, 186, 0.6)" }}
      >
        <div className="flex items-center gap-3 text-base">
          <SubstackLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">Substack</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full border border-[#f3d7c0] px-3 py-1 text-[#6f5345]">
            6K subscribers
          </span>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-transparent bg-[color:var(--accent)] px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition hover:brightness-105"
            style={{ "--accent": SUBSTACK_HEX } as CSSProperties}
          >
            <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
            Publish
          </button>
        </div>
      </header>

      <div className="space-y-6 px-6 py-4">
        <section className="flex flex-col items-center gap-5 rounded-3xl border border-[#f0e2d6] bg-white px-5 py-0 text-sm leading-6 text-[#3d322e] shadow-[0_16px_30px_rgba(120,80,40,0.08)] sm:flex-row">
          <div className="mx-auto flex h-60 w-28 shrink-0 flex-col items-center justify-center gap-3 sm:mx-0">
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
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#302622]">
                {userName || "Ky-Nam - the BS Tribe (Build Stuffs)"}
              </h2>
              <p className="text-sm text-[#ba9072]">gifavatar.app</p>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-[#302622]">About me</h3>
            <p className="max-w-xl text-sm text-[#4d403a]">
              I create animated photos of myself to make viewers pause and
              smile. Perfect for increasing profile visit, email open rate,
              engagement, and to look cool 😎
            </p>

            <form className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="substack-email-preview" className="sr-only">
                Email address
              </label>
              <div className="relative flex-1">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#c2a28c]"
                />
                <input
                  id="substack-email-preview"
                  placeholder={userEmail || "knamnguyen.work@gmail.com"}
                  className="w-full rounded-full border border-[#e3d3c5] bg-white px-9 py-2 text-sm text-[#463a33] transition outline-none focus:border-[#d4b59f]"
                  readOnly
                />
              </div>
              <button
                type="button"
                className="rounded-full border border-transparent bg-[color:var(--accent)] px-6 py-2 text-xs font-semibold tracking-[0.3em] text-white uppercase transition hover:brightness-110"
                style={{ "--accent": SUBSTACK_HEX } as CSSProperties}
              >
                Subscribe
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.25em] text-[#8c6c57] uppercase">
              <span className="rounded-full border border-[#e8d3c5] px-3 py-1">
                View archive
              </span>
              <span className="rounded-full border border-[#e8d3c5] px-3 py-1">
                About
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SubstackLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      aria-label="Substack logo"
      viewBox="0 0 24 24"
      style={{ color: SUBSTACK_HEX }}
    >
      <path fill="currentColor" d={siSubstack.path} />
    </svg>
  );
}
