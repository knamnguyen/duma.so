"use client";

import type { ReactNode } from "react";
import type { SimpleIcon } from "simple-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  siDevdotto,
  siDiscord,
  siFacebook,
  siFandom,
  siGmail,
  siLinktree,
  siMedium,
  siMyanimelist,
  siPatreon,
  siPixiv,
  siSubstack,
  siThreads,
  siX,
} from "simple-icons";
import { toast } from "sonner";

import { Badge } from "@sassy/ui/badge";
import { Button } from "@sassy/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sassy/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sassy/ui/dialog";
import { Input } from "@sassy/ui/input";
import { Label } from "@sassy/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sassy/ui/table";
import { Textarea } from "@sassy/ui/textarea";
import { cn } from "@sassy/ui/utils";

import { AVATAR_ANIMATION_DURATION_MS } from "~/app/_components/avatar-preview";
import { capturePreviewAsGif } from "~/app/_components/platform-preview/capture-preview";
import { BeaconsPreview } from "~/app/_components/platform-preview/platform-preview/beacons-preview";
import { DevPreview } from "~/app/_components/platform-preview/platform-preview/dev-preview";
import { DiscordPreview } from "~/app/_components/platform-preview/platform-preview/discord-preview";
import { FandomPreview } from "~/app/_components/platform-preview/platform-preview/fandom-preview";
import { GmailThreadPreview } from "~/app/_components/platform-preview/platform-preview/gmail-thread-preview";
import { LinktreePreview } from "~/app/_components/platform-preview/platform-preview/linktree-preview";
import { MediumPreview } from "~/app/_components/platform-preview/platform-preview/medium-preview";
import { MyAnimeListPreview } from "~/app/_components/platform-preview/platform-preview/myanimelist-preview";
import { PatreonPreview } from "~/app/_components/platform-preview/platform-preview/patreon-preview";
import { PixivPreview } from "~/app/_components/platform-preview/platform-preview/pixiv-preview";
import { SubstackPreview } from "~/app/_components/platform-preview/platform-preview/substack-preview";
import { VGenPreview } from "~/app/_components/platform-preview/platform-preview/vgen-preview";
// Import SVG logos as React components using SVGR
import BeaconsIcon from "~/app/assets/logos/beacons.svg";
import FacebookIcon from "~/app/assets/logos/facebook.svg";
import GmailIcon from "~/app/assets/logos/gmail.svg";
import LinkedInIcon from "~/app/assets/logos/linkedin.svg";
import VGenIcon from "~/app/assets/logos/vgen.svg";
import { useTRPC } from "~/trpc/react";
import { useRandomPeepAvatar } from "./_components/use-random-peep-avatar";

// ============================================================================
// TYPE DEFINITIONS & MOCK DATA
// ============================================================================

type Platform =
  | "Gmail"
  | "Linktree"
  | "Beacons"
  | "Pixiv"
  | "Fandom.com"
  | "My Anime List"
  | "Dev.to"
  | "Medium"
  | "Substack"
  | "VGen"
  | "Discord"
  | "Patreon";

type SharePlatform = "X" | "LinkedIn" | "Threads" | "Facebook";

type SubmissionStatus =
  | "verifying"
  | "validated"
  | "invalid"
  | "duplicate"
  | "validation_failed";

type ServiceSubmissionPlatform = "x" | "linkedin" | "threads" | "facebook";

interface SubmissionRow {
  id: string;
  platform: SharePlatform;
  link: string;
  status: SubmissionStatus;
  creditsEarned: number;
  likes: number;
  comments: number;
  shares: number;
  lastScanned: Date;
  reasonForFailure?: string;
  rescanCount: number;
  engagements: number;
}

const DEFAULT_EMAIL = "gifavatar.app@gmail.com";
const DEFAULT_METRICS = {
  verifying: 0,
  validated: 0,
  rejected: 0,
  totalCredits: 0,
} as const;

const generateRandomColor = (): string => {
  // Generate pleasant pastel colors
  const hues = [
    0, // Red
    30, // Orange
    60, // Yellow
    120, // Green
    180, // Cyan
    210, // Blue
    240, // Indigo
    270, // Purple
    300, // Magenta
    330, // Pink
  ];
  const hue = hues[Math.floor(Math.random() * hues.length)] ?? 0;
  const saturation = 40 + Math.random() * 30; // 40-70% saturation
  const lightness = 85 + Math.random() * 10; // 85-95% lightness (pastel)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const SHARE_PLATFORM_BY_SERVICE: Record<
  ServiceSubmissionPlatform,
  SharePlatform
> = {
  x: "X",
  linkedin: "LinkedIn",
  threads: "Threads",
  facebook: "Facebook",
};

const detectSharePlatform = (url: string): ServiceSubmissionPlatform | null => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      return "x";
    }
    if (hostname.includes("linkedin.com")) {
      return "linkedin";
    }
    if (hostname.includes("threads.com")) {
      return "threads";
    }
    if (hostname.includes("facebook.com")) {
      return "facebook";
    }
    return null;
  } catch {
    return null;
  }
};

type PlatformAsset =
  | { type: "simple-icon"; icon: SimpleIcon }
  | {
      type: "svg-component";
      component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      alt: string;
    };

interface PlatformDetail {
  brandColor: string;
  asset: PlatformAsset;
}

interface ShareButtonDetail {
  name: SharePlatform;
  brandColor: string;
  asset: PlatformAsset;
  wrap?: boolean;
  iconSize?: number;
}

const PLATFORM_DETAILS: Record<Platform, PlatformDetail> = {
  Gmail: {
    brandColor: `#${siGmail.hex}`,
    asset: {
      type: "svg-component",
      component: GmailIcon,
      alt: "Gmail logo",
    },
  },
  Linktree: {
    brandColor: `#${siLinktree.hex}`,
    asset: { type: "simple-icon", icon: siLinktree },
  },
  Beacons: {
    brandColor: "#FF6FAE",
    asset: {
      type: "svg-component",
      component: BeaconsIcon,
      alt: "Beacons logo",
    },
  },
  Pixiv: {
    brandColor: `#${siPixiv.hex}`,
    asset: { type: "simple-icon", icon: siPixiv },
  },
  "Fandom.com": {
    brandColor: `#${siFandom.hex}`,
    asset: { type: "simple-icon", icon: siFandom },
  },
  "My Anime List": {
    brandColor: `#${siMyanimelist.hex}`,
    asset: { type: "simple-icon", icon: siMyanimelist },
  },
  "Dev.to": {
    brandColor: `#${siDevdotto.hex}`,
    asset: { type: "simple-icon", icon: siDevdotto },
  },
  Medium: {
    brandColor: `#${siMedium.hex}`,
    asset: { type: "simple-icon", icon: siMedium },
  },
  Substack: {
    brandColor: `#${siSubstack.hex}`,
    asset: { type: "simple-icon", icon: siSubstack },
  },
  VGen: {
    brandColor: "#39E0B5",
    asset: {
      type: "svg-component",
      component: VGenIcon,
      alt: "VGen logo",
    },
  },
  Discord: {
    brandColor: `#${siDiscord.hex}`,
    asset: { type: "simple-icon", icon: siDiscord },
  },
  Patreon: {
    brandColor: `#${siPatreon.hex}`,
    asset: { type: "simple-icon", icon: siPatreon },
  },
};

const PLATFORM_ORDER: Platform[] = [
  "Gmail",
  "Linktree",
  "Beacons",
  "Pixiv",
  "Fandom.com",
  "My Anime List",
  "Dev.to",
  "Medium",
  "Substack",
  "VGen",
  "Discord",
  "Patreon",
];

const SHARE_BUTTONS: ShareButtonDetail[] = [
  {
    name: "X",
    brandColor: `#${siX.hex}`,
    asset: { type: "simple-icon", icon: siX },
    iconSize: 28,
  },
  {
    name: "LinkedIn",
    brandColor: "#0A66C2",
    asset: {
      type: "svg-component",
      component: LinkedInIcon,
      alt: "LinkedIn logo",
    },
    wrap: false,
    iconSize: 48,
  },
  {
    name: "Threads",
    brandColor: `#${siThreads.hex}`,
    asset: { type: "simple-icon", icon: siThreads },
    iconSize: 28,
  },
  {
    name: "Facebook",
    brandColor: "#1877F2",
    asset: {
      type: "svg-component",
      component: FacebookIcon,
      alt: "Facebook logo",
    },
    wrap: false,
    iconSize: 48,
  },
];

const DEFAULT_CAPTION =
  "I just created this amazing animated gif avatar for gmail and people will be so impressed when they see it. Thank you @withkynam for creating gifavatar[dot]app!";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const truncateUrl = (url: string, maxLength = 40): string => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
};

const ensureHashPrefix = (hex: string): string =>
  hex.startsWith("#") ? hex : `#${hex}`;

const getContrastColor = (hex: string): string => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance =
    0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  return luminance > 0.6 ? "#1F2937" : "#FFFFFF";
};

const renderSimpleIcon = (
  icon: SimpleIcon,
  {
    size = 24,
    color,
  }: {
    size?: number;
    color?: string;
  } = {},
): ReactNode => (
  <svg
    role="img"
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color ?? ensureHashPrefix(icon.hex)}
  >
    <path d={icon.path} />
  </svg>
);

const renderPlatformIcon = (
  asset: PlatformAsset,
  {
    size = 28,
    color,
    isSelected,
    contrastColor,
    wrap = true,
  }: {
    size?: number;
    color?: string;
    isSelected?: boolean;
    contrastColor: string;
    wrap?: boolean;
  },
): ReactNode => {
  if (asset.type === "simple-icon") {
    return renderSimpleIcon(asset.icon, {
      size,
      color: color ?? (isSelected ? contrastColor : undefined),
    });
  }
  const IconComponent = asset.component;
  if (!wrap) {
    return (
      <IconComponent
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", display: "block" }}
        className="object-cover"
        aria-label={asset.alt}
      />
    );
  }
  const containerSize = size + 10;
  return (
    <div
      className="flex items-center justify-center rounded-full bg-white/90"
      style={{ width: containerSize, height: containerSize }}
    >
      <IconComponent
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain"
        aria-label={asset.alt}
      />
    </div>
  );
};

const formatStatusBadge = (
  status: SubmissionStatus,
  rescanCount: number,
): {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ReactNode;
  label: string;
  className?: string;
} => {
  switch (status) {
    case "verifying":
      return {
        variant: "secondary",
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        label: "Verifying",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "validated":
      return {
        variant: "default",
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: `Validated ${rescanCount}/3`,
        className: "bg-green-100 text-green-800 border-green-200",
      };
    case "invalid":
      return {
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
        label: "Missing keywords",
        className: "bg-pink-100 text-pink-800 border-pink-200",
      };
    case "duplicate":
      return {
        variant: "outline",
        icon: <Clock className="h-3 w-3" />,
        label: "Duplicate submission",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      };
    case "validation_failed":
      return {
        variant: "outline",
        icon: <AlertTriangle className="h-3 w-3" />,
        label: "Could not retrieve post",
        className: "bg-orange-100 text-orange-800 border-orange-200",
      };
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SocialReferPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const trpc = useTRPC();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("Gmail");
  const [shareUrl, setShareUrl] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGifAvatarUrl, setSelectedGifAvatarUrl] = useState<
    string | null
  >(null);
  const currentPlatformDetail = PLATFORM_DETAILS[selectedPlatform];
  const previewContrast = getContrastColor(currentPlatformDetail.brandColor);
  const isGmailSelected = selectedPlatform === "Gmail";
  const previewCardRef = useRef<HTMLDivElement | null>(null);
  const displayName = useMemo(() => {
    if (!user) return "Gif Avatar User";
    if (user.fullName && user.fullName.trim().length > 0) {
      return user.fullName;
    }
    const nameFromParts = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (nameFromParts.length > 0) return nameFromParts;
    if (user.username && user.username.trim().length > 0) {
      return user.username;
    }
    return "Gif Avatar User";
  }, [user]);
  const previewName =
    isLoaded && isSignedIn ? displayName : "Gif Avatar Community Member";
  const peepAvatarUrl = useRandomPeepAvatar();
  const avatarUrl = selectedGifAvatarUrl;
  const randomBgColor = useMemo(() => generateRandomColor(), []);

  const metricsQuery = useQuery({
    ...trpc.social.metrics.queryOptions(),
    enabled: isLoaded && isSignedIn,
  });
  const submissionsQuery = useQuery({
    ...trpc.social.listSubmissions.queryOptions(),
    enabled: isLoaded && isSignedIn,
  });
  const userResultsQuery = useQuery({
    ...trpc.editor.listAllUserResults.queryOptions(),
    enabled: isLoaded && isSignedIn && isDialogOpen,
  });
  const { mutateAsync: submitPost, isPending: isSubmitting } = useMutation(
    trpc.social.submitPost.mutationOptions({
      onSuccess: () => {
        void metricsQuery.refetch();
        void submissionsQuery.refetch();
      },
    }),
  );

  const metrics = metricsQuery.data ?? DEFAULT_METRICS;
  const submissions: SubmissionRow[] = useMemo(() => {
    if (!submissionsQuery.data) return [];
    return submissionsQuery.data.map((submission) => {
      const platform =
        SHARE_PLATFORM_BY_SERVICE[
          submission.platform as ServiceSubmissionPlatform
        ] ?? "X";
      const creditsEarned = Math.max(
        (submission.creditAwarded ?? 0) - (submission.creditPenalty ?? 0),
        0,
      );
      const lastScanned =
        submission.lastAttemptAt ??
        submission.verifiedAt ??
        submission.createdAt;
      return {
        id: submission.id,
        platform,
        link: submission.originalUrl,
        status: submission.status,
        creditsEarned,
        likes: submission.likes,
        comments: submission.comments,
        shares: submission.shares,
        lastScanned,
        reasonForFailure: submission.errorMessage ?? undefined,
        rescanCount: submission.rescanCount,
        engagements: submission.totalEngagement ?? 0,
      };
    });
  }, [submissionsQuery.data]);

  const renderSelectedPreview = () => {
    // AvatarPreview handles default Openpeeps internally and distinguishes between Openpeeps (animate) and custom gifavatar (no animation)
    const baseProps = {
      userName: previewName,
      userEmail: DEFAULT_EMAIL,
      localUrl: avatarUrl, // Can be custom gifavatar URL or null (will use default Openpeeps)
      bgColor: randomBgColor,
      isLoading: !isLoaded,
      // Always pass avatarConfig with animationStyle - AvatarPreview will decide whether to use it based on localUrl vs default Openpeeps
      avatarConfig: {
        bgColor: randomBgColor,
        animationStyle: {
          photoMovement: "rise" as const,
          addOnEffect: null,
        },
      },
    };

    const commonProps = baseProps;

    if (selectedPlatform === "Gmail") {
      return <GmailThreadPreview {...commonProps} />;
    }

    if (selectedPlatform === "Linktree") {
      return <LinktreePreview {...commonProps} />;
    }

    if (selectedPlatform === "Beacons") {
      return <BeaconsPreview {...commonProps} />;
    }

    if (selectedPlatform === "Pixiv") {
      return <PixivPreview {...commonProps} />;
    }

    if (selectedPlatform === "Fandom.com") {
      return <FandomPreview {...commonProps} />;
    }

    if (selectedPlatform === "My Anime List") {
      return <MyAnimeListPreview {...commonProps} />;
    }

    if (selectedPlatform === "Dev.to") {
      return <DevPreview {...commonProps} />;
    }

    if (selectedPlatform === "Medium") {
      return <MediumPreview {...commonProps} />;
    }

    if (selectedPlatform === "Substack") {
      return <SubstackPreview {...commonProps} />;
    }

    if (selectedPlatform === "VGen") {
      return <VGenPreview {...commonProps} />;
    }

    if (selectedPlatform === "Discord") {
      return <DiscordPreview {...commonProps} />;
    }

    if (selectedPlatform === "Patreon") {
      return <PatreonPreview {...commonProps} />;
    }

    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg">
          {renderPlatformIcon(currentPlatformDetail.asset, {
            size: 36,
            contrastColor: previewContrast,
            isSelected: true,
            color: previewContrast,
          })}
        </div>
        <p className="text-lg font-semibold">Preview for {selectedPlatform}</p>
        <p className="mt-2 text-sm">
          Download this image separately after copying the caption
        </p>
      </div>
    );
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_CAPTION);
      toast.success("Caption copied to clipboard!");
    } catch {
      toast.error("Failed to copy caption. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!shareUrl.trim()) {
      toast.error("Please enter a share URL");
      return;
    }

    const detectedPlatform = detectSharePlatform(shareUrl);
    if (!detectedPlatform) {
      toast.error(
        "Invalid URL. Please use a link from X, LinkedIn, Threads, or Facebook.",
      );
      return;
    }

    try {
      await submitPost({ platform: detectedPlatform, url: shareUrl.trim() });
      toast.success("Submission received! Verification in progress...");
      setShareUrl("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit post for verification.";
      toast.error(message);
    }
  };

  const handleDownloadPreview = async () => {
    const previewElement = previewCardRef.current;
    if (!previewElement) {
      toast.error("Preview is not ready yet. Please try again.");
      return;
    }

    setIsCapturing(true);

    try {
      const blob = await capturePreviewAsGif({
        element: previewElement,
        durationMs: AVATAR_ANIMATION_DURATION_MS,
        fps: 12,
      });

      const fileSlug = selectedPlatform
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `gifavatar-preview-${fileSlug || "platform"}.gif`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);

      toast.success("GIF download ready!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to capture preview. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1eb,_#fdfdfd,_#e9edf2)] px-40 py-4">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-7xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Referral Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Share on social media to earn credits!
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Message */}
        <Card className="border-2 border-pink-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Share feelings about Gif Avatar on{" "}
              <span className="font-bold text-pink-600">
                X, Threads, LinkedIn, Facebook
              </span>{" "}
              to earn premium usage!
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Row 1: Caption & Share + Submit & Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Caption & Share */}
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>
                Step 1 - Write caption with word{" "}
                <span className="font-bold text-pink-600">
                  gifavatar[dot]app
                </span>{" "}
                &amp; share
              </CardTitle>
              <CardDescription className="space-y-1">
                <p>
                  • Caption MUST includes the word website gifavatar[dot]app
                </p>
                <p>
                  • Please download the GIF preview below to share along with
                  your caption
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="caption">
                  Sample caption (you can copy this for convenience)
                </Label>
                <div className="relative mt-2">
                  <Textarea
                    id="caption"
                    value={DEFAULT_CAPTION}
                    readOnly
                    rows={6}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 rounded-xl bg-[#ff6fae] text-white shadow-[0_12px_26px_rgba(255,111,174,0.32)] hover:bg-[#ff4f9f] hover:text-white"
                    onClick={handleCopyCaption}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Share on</Label>
                <div className="mt-2 flex gap-2">
                  {SHARE_BUTTONS.map(
                    ({ name, asset, brandColor, wrap, iconSize }) => {
                      const contrast = getContrastColor(brandColor);
                      const shouldWrap = wrap ?? asset.type === "simple-icon";
                      const iconColor =
                        asset.type === "simple-icon" ? contrast : undefined;
                      return (
                        <Button
                          key={name}
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 overflow-hidden rounded-full border-0 p-0 shadow-sm transition-transform hover:scale-105"
                          style={{
                            backgroundColor: brandColor,
                            color: contrast,
                          }}
                          title={name}
                        >
                          <div className="flex h-full w-full items-center justify-center">
                            {renderPlatformIcon(asset, {
                              size: iconSize ?? 24,
                              color: iconColor,
                              contrastColor: contrast,
                              isSelected: true,
                              wrap: shouldWrap,
                            })}
                          </div>
                          <span className="sr-only">{name}</span>
                        </Button>
                      );
                    },
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit & Analytics */}
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>
                Step 2 - Paste the link to your post to earn immediate credits
                here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="postLink">Post Link</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="postLink"
                    type="url"
                    placeholder="Paste your share link here..."
                    value={shareUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShareUrl(e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Supported: X, LinkedIn, Threads, Facebook
                </p>
                <Button
                  className="mt-3 w-full rounded-xl bg-[#ff6fae] text-white shadow-[0_14px_30px_rgba(255,111,174,0.35)] hover:bg-[#ff4f9f] hover:text-white"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isSignedIn}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Validation"
                  )}
                </Button>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                    <Loader2 className="h-7 w-7 animate-spin text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-800">
                        {metricsQuery.isLoading ? "-" : metrics.verifying}
                      </p>
                      <p className="text-sm text-yellow-700">Verifying</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-800">
                        {metricsQuery.isLoading ? "-" : metrics.validated}
                      </p>
                      <p className="text-sm text-green-700">Validated</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-pink-200 bg-pink-50">
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                    <XCircle className="h-7 w-7 text-pink-600" />
                    <div>
                      <p className="text-2xl font-bold text-pink-800">
                        {metricsQuery.isLoading ? "-" : metrics.rejected}
                      </p>
                      <p className="text-sm text-pink-700">Rejected</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-pink-200 bg-pink-50">
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                    <div className="text-3xl">💳</div>
                    <div>
                      <p className="text-2xl font-bold text-pink-800">
                        {metricsQuery.isLoading ? "-" : metrics.totalCredits}
                      </p>
                      <p className="text-sm text-pink-700">Current Credits</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Optional step (Platform Selection) + Preview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Optional Step - Platform Selector */}
          <Card
            id="recommended"
            className="bg-white/80 backdrop-blur transition-shadow"
            ref={(el) => {
              // no-op; ref managed below via recommendedRef
            }}
          >
            <CardHeader>
              <CardTitle>
                Recommended - Post a Gif Avatar preview for more free credits
              </CardTitle>
              <CardDescription>
                this is how your Gif Avatar will appear on applicable platforms
                as well!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Button group moved above selector grid */}
              <div className="mb-4 space-y-3">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full rounded-xl border-pink-200 bg-white text-[#ff6fae] hover:bg-pink-50 hover:text-[#ff4f9f]"
                      variant="outline"
                    >
                      Select different gifavatar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select a GifAvatar</DialogTitle>
                      <DialogDescription>
                        Choose from your created gifavatars (sorted by creation
                        date, earliest first)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      {userResultsQuery.isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2">Loading gifavatars...</span>
                        </div>
                      ) : userResultsQuery.data?.results.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                          No gifavatars found. Create one first!
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                          {userResultsQuery.data?.results.map((result) => (
                            <div
                              key={result.id}
                              className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 transition-all hover:border-pink-400 hover:shadow-lg"
                              onClick={() => {
                                setSelectedGifAvatarUrl(result.url);
                                setIsDialogOpen(false);
                              }}
                            >
                              <img
                                src={result.url}
                                alt={`GifAvatar created ${format(
                                  result.createdAt,
                                  "MMM d, yyyy",
                                )}`}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                <p className="text-xs">
                                  {format(result.createdAt, "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  className="w-full rounded-xl bg-[#ff6fae] text-white shadow-[0_14px_30px_rgba(255,111,174,0.35)] hover:bg-[#ff4f9f] hover:text-white"
                  disabled={isCapturing}
                  onClick={handleDownloadPreview}
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing GIF preview...
                    </>
                  ) : (
                    <>
                      Download GIF preview of your GifAvatar on{" "}
                      {selectedPlatform}
                    </>
                  )}
                </Button>
              </div>

              {/* Platform selector grid */}
              <div className="grid grid-cols-3 gap-3">
                {PLATFORM_ORDER.map((platform) => {
                  const detail = PLATFORM_DETAILS[platform];
                  const isSelected = selectedPlatform === platform;
                  const contrast = getContrastColor(detail.brandColor);
                  return (
                    <Button
                      key={platform}
                      variant="outline"
                      className={cn(
                        "flex h-auto items-center justify-start gap-3 rounded-xl border-2 py-3 text-left text-base transition-colors",
                        isSelected ? "shadow-md" : "bg-white/95",
                      )}
                      style={
                        isSelected
                          ? {
                              backgroundColor: detail.brandColor,
                              color: contrast,
                            }
                          : { borderColor: detail.brandColor }
                      }
                      onClick={() => setSelectedPlatform(platform)}
                    >
                      {renderPlatformIcon(detail.asset, {
                        size: 26,
                        isSelected,
                        contrastColor: contrast,
                      })}
                      <span className="font-medium">{platform}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Platform Preview */}
          <Card
            ref={previewCardRef}
            className={cn(
              "relative flex items-center justify-center overflow-hidden border-0 shadow-md",
            )}
            style={{
              background: `linear-gradient(135deg, ${ensureHashPrefix(
                currentPlatformDetail.brandColor,
              )}1a, ${ensureHashPrefix(currentPlatformDetail.brandColor)}cc)`,
              color: previewContrast,
            }}
          >
            <CardContent className="flex h-full min-h-[300px] w-full items-center justify-center pt-2">
              {renderSelectedPreview()}
            </CardContent>
          </Card>
        </div>

        {/* Submission History Table */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Share Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Credits Earned</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>Reason for failure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="py-8 text-center text-sm text-gray-500"
                      >
                        Loading submissions...
                      </TableCell>
                    </TableRow>
                  ) : submissions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="py-8 text-center text-sm text-gray-500"
                      >
                        {isSignedIn
                          ? "You haven't submitted any posts yet."
                          : "Sign in to view your submission history."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => {
                      const statusBadge = formatStatusBadge(
                        submission.status,
                        submission.rescanCount,
                      );
                      return (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.platform}
                          </TableCell>
                          <TableCell>
                            <a
                              href={submission.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ff6fae] hover:underline"
                            >
                              {truncateUrl(submission.link)}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusBadge.variant}
                              className={cn("gap-1", statusBadge.className)}
                            >
                              {statusBadge.icon}
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{submission.creditsEarned}</TableCell>
                          <TableCell>{submission.likes}</TableCell>
                          <TableCell>{submission.comments}</TableCell>
                          <TableCell>{submission.shares}</TableCell>
                          <TableCell>
                            {format(submission.lastScanned, "M/d/yyyy")}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {submission.reasonForFailure ?? "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hash-target highlight for Recommended section */}
      <HashHighlight targetId="recommended" />
      {/* "How it works" drawer is provided globally in layout */}
    </div>
  );
}

function HashHighlight({ targetId }: { targetId: string }) {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId) as HTMLElement | null;
    elementRef.current = el ?? null;

    const apply = () => {
      if (window.location.hash === `#${targetId}` && elementRef.current) {
        elementRef.current.classList.add(
          "ring-4",
          "ring-[#FF6FAE]",
          "shadow-[0_18px_44px_rgba(255,111,174,0.35)]",
          "animate-pulse",
        );
        elementRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.setTimeout(() => {
          elementRef.current?.classList.remove(
            "ring-4",
            "ring-[#FF6FAE]",
            "shadow-[0_18px_44px_rgba(255,111,174,0.35)]",
            "animate-pulse",
          );
        }, 2400);
      }
    };

    apply();
    const onHash = () => apply();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [targetId]);

  return null;
}
