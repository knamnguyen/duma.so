"use client";

import type { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";
import type { SimpleIcon } from "simple-icons";
import { MapPin, Share2 } from "lucide-react";
import { siGmail, siTelegram, siWhatsapp, siX } from "simple-icons";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { defaultRandomAvatar } from "~/app/_components/platform-preview/default-random-avatar";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";
import BeaconsIcon from "~/app/assets/logos/beacons.svg";
import LinkedInIcon from "~/app/assets/logos/linkedin.svg";

const BACKGROUND_HEX = "#FFF7E7";
const ACCENT_HEX = "#FF6FAE";
const CTA_SHADOW = "0 20px 38px rgba(243, 190, 78, 0.28)";

type SocialIconEntry =
  | { type: "simple-icon"; icon: SimpleIcon }
  | {
      type: "component";
      component: ComponentType<SVGProps<SVGSVGElement>>;
      title: string;
    };

const SOCIAL_ICONS: readonly SocialIconEntry[] = [
  { type: "simple-icon", icon: siX },
  { type: "component", component: LinkedInIcon, title: "LinkedIn" },
  { type: "component", component: BeaconsIcon, title: "Beacons" },
  { type: "simple-icon", icon: siGmail },
  { type: "simple-icon", icon: siWhatsapp },
  { type: "simple-icon", icon: siTelegram },
] as const;

interface BeaconsPreviewProps {
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

export function BeaconsPreview({
  userName,
  userEmail: _userEmail, // kept for API parity
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: BeaconsPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);

  return (
    <div
      className="mx-auto max-w-sm overflow-hidden rounded-[34px] bg-white text-[#123e35] shadow-xl ring-1 ring-black/5"
      style={{ backgroundColor: BACKGROUND_HEX }}
    >
      <div className="space-y-7 p-7 pb-8">
        <header className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_12px_24px_rgba(18,62,53,0.12)]">
            <BeaconsIcon
              aria-label="Beacons logo"
              className="h-6 w-6 text-[#123e35]"
            />
          </div>
          <span className="text-lg font-extrabold text-[#111827]">Beacons</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-[#123e35] shadow-inner">
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </div>
        </header>

        <div className="flex justify-center">
          <div className="rounded-[28px] border border-[#123e35]/10 bg-white p-2 shadow-[0_16px_48px_rgba(18,62,53,0.18)]">
            <AvatarPreview
              config={
                avatarConfig
                  ? { ...avatarConfig, size: 140, rounded: false }
                  : {
                      bgColor,
                      // Default animationStyle when not provided (for openpeeps avatar)
                      animationStyle: {
                        photoMovement: "rise",
                        addOnEffect: null,
                      },
                      size: 140,
                      rounded: false,
                    }
              }
              bgRemovedUrl={bgRemovedUrl}
              localUrl={localUrl ?? undefined} // Pass original - AvatarPreview handles default Openpeeps internally
              isLoading={isLoading}
              badge={badge}
              preferCanvasForGif={preferCanvasForGif}
            />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-semibold text-[#0e2f26]">
              {userName || "Ky - Nam"}
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-[#1d5045]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>San Francisco (soon)</span>
            </div>
          </div>
          <p className="mx-auto max-w-xs text-sm leading-6 text-[#1f5347]">
            24 y/o tech founder building cool stuffs in my mom&apos;s garage
          </p>
        </div>

        <div className="flex justify-center gap-3 text-[#123e35]">
          {SOCIAL_ICONS.map((icon, index) => (
            <SocialIcon key={`${icon.type}-${index}`} icon={icon} />
          ))}
        </div>

        <div
          className="rounded-[26px] border border-white/40 p-4"
          style={{ boxShadow: CTA_SHADOW, background: "#FFEFBE" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md">
              {defaultRandomAvatar}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#10372f]">
                Book a call
              </p>
              <p className="text-xs text-[#1c5246]">please dm me first &lt;3</p>
            </div>
          </div>
        </div>

        <div className="rounded-full bg-white/90 p-1">
          <div className="grid grid-cols-2 gap-1 text-sm font-semibold">
            <button
              className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-white shadow-[0_10px_22px_rgba(255,111,174,0.35)]"
              style={{ "--accent": ACCENT_HEX } as CSSProperties}
              type="button"
            >
              Beacons
            </button>
            <button
              className="rounded-full px-4 py-2 text-[#155045] transition-colors hover:bg-[#f3fcf8]"
              type="button"
            >
              Try for free!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ icon }: { icon: SocialIconEntry }) {
  if (icon.type === "component") {
    const Component = icon.component;
    return (
      <Component
        role="img"
        aria-label={`${icon.title} logo`}
        className="h-5 w-5 opacity-90 transition-opacity hover:opacity-100"
      />
    );
  }

  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
      className="opacity-90 transition-opacity hover:opacity-100"
    >
      <title>{icon.icon.title}</title>
      <path d={icon.icon.path} />
    </svg>
  );
}
