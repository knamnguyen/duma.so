"use client";

import type { Variants } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { Skeleton } from "@sassy/ui/skeleton";

import type { AddOnEffectStyle, PhotoMovementStyle } from "./avatar-animations";
import { useRandomPeepAvatar } from "~/app/social-referral/_components/use-random-peep-avatar";
import { addOnVariants, movementVariants } from "./avatar-animations";
import { GifCanvasRenderer, isGifUrl } from "./gif-canvas-renderer";
import { applyStrokeToImage } from "./image-stroke";

export const AVATAR_ANIMATION_DURATION_MS = 5_500;

export type AnimationStyle = {
  photoMovement: PhotoMovementStyle | null;
  addOnEffect: AddOnEffectStyle | null;
};

/**
 * Transform configuration for avatar positioning, scaling, and rotation.
 */
export type TransformConfig = {
  positionX: number; // -50 to +50 (percentage)
  positionY: number; // -50 to +50 (percentage)
  zoom: number; // 0.1 to 10
  rotate: number; // -180 to 180 (degrees)
  enableStillFrame: boolean; // toggle
  gifSize: number; // 50 to 500 (pixels, square)
  animationDuration: number; // 0.5 to 10 (seconds)
};

/**
 * Default transform configuration values.
 */
export const DEFAULT_TRANSFORM_CONFIG: TransformConfig = {
  positionX: 0,
  positionY: 0,
  zoom: 1,
  rotate: 0,
  enableStillFrame: true,
  gifSize: 200,
  animationDuration: 5.5,
};

/**
 * Stroke configuration for avatar outline.
 */
export type StrokeConfig = {
  enabled: boolean;
  weight: number;
  color: string;
};

/**
 * Configuration object for avatar rendering in platform previews.
 * This centralizes all avatar-related props to make it easy to add new features
 * without updating all platform preview files.
 */
export type AvatarConfig = {
  animationStyle?: AnimationStyle;
  bgColor?: string;
  size?: number;
  rounded?: boolean;
  transformConfig?: TransformConfig;
  strokeConfig?: StrokeConfig;
};

/**
 * Component for platform previews to render avatars with a config object.
 * This makes it easy to add new avatar features without updating all platform preview files.
 * Just update the AvatarConfig type and this component.
 */
export function AvatarPreview({
  config,
  bgRemovedUrl,
  localUrl,
  isLoading,
  badge,
  captureRef,
  renderSquare = false,
  preferCanvasForGif = true,
}: {
  config?: AvatarConfig;
  bgRemovedUrl?: string | null;
  localUrl?: string | null;
  isLoading?: boolean;
  badge?: ReactNode;
  captureRef?: React.RefObject<HTMLDivElement | null>;
  renderSquare?: boolean; // When true, renders square without circular mask (for capture)
  preferCanvasForGif?: boolean;
}) {
  const bgColor = config?.bgColor ?? "#ffffff";
  const animationStyle = config?.animationStyle;
  const size = config?.size ?? 96;
  const rounded = config?.rounded ?? true;
  const strokeConfig = config?.strokeConfig;

  // Get transform config early (needed for animation duration)
  const transformConfig = config?.transformConfig ?? DEFAULT_TRANSFORM_CONFIG;

  const needsDefaultAvatar = !localUrl && !bgRemovedUrl;
  // Get default Openpeeps URL internally as fallback (only when needed)
  const defaultOpenpeepsUrl = useRandomPeepAvatar(needsDefaultAvatar);

  // Check if localUrl is a GIF (for canvas rendering - needed for proper frame capture)
  const isLocalUrlGif = isGifUrl(localUrl);
  // Only render GIFs on canvas when explicitly requested (for capture scenarios)
  const shouldRenderGifOnCanvas = preferCanvasForGif && isLocalUrlGif;

  // Apply stroke to bgRemovedUrl if stroke config is provided
  const [strokedUrl, setStrokedUrl] = useState<string | null>(null);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isCancelled = false;

    const shouldApplyStroke =
      !localUrl &&
      typeof bgRemovedUrl === "string" &&
      bgRemovedUrl.length > 0 &&
      strokeConfig?.enabled &&
      strokeConfig.weight > 0;

    if (shouldApplyStroke) {
      const sourceUrl = bgRemovedUrl;
      timeoutId = setTimeout(() => {
        applyStrokeToImage(sourceUrl, strokeConfig)
          .then((url) => {
            if (!isCancelled) {
              setStrokedUrl(url);
            }
          })
          .catch((error) => {
            console.error("Failed to apply stroke:", error);
            if (!isCancelled) {
              setStrokedUrl(null);
            }
          });
      }, 200);
    } else {
      setStrokedUrl(null);
    }

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [bgRemovedUrl, strokeConfig, localUrl]);

  // Use stroked URL if available, otherwise use original
  const displayUrl = strokedUrl ?? bgRemovedUrl;

  // Determine if we should animate:
  // - If localUrl is provided and matches defaultOpenpeepsUrl → animate (Openpeeps avatar)
  // - If localUrl is provided and different from defaultOpenpeepsUrl → don't animate (custom gifavatar)
  // - If using bgRemovedUrl (no localUrl) → animate (editor preview)
  // - If using defaultOpenpeepsUrl (no localUrl, no bgRemovedUrl) → animate (Openpeeps avatar)
  const isOpenpeepsAvatar = !localUrl || localUrl === defaultOpenpeepsUrl;
  const isCustomGifavatar = localUrl && localUrl !== defaultOpenpeepsUrl;
  const shouldAnimate = isOpenpeepsAvatar || (bgRemovedUrl && !localUrl);

  // Determine movement variant with custom duration
  let movementVariant: Variants | undefined = undefined;
  let customTransition: { duration: number } | undefined = undefined;

  if (shouldAnimate) {
    // Get base variant
    const baseVariant = animationStyle?.photoMovement
      ? movementVariants[animationStyle.photoMovement]
      : movementVariants.rise;

    // Apply custom animation duration if provided
    const animationDuration = transformConfig.animationDuration;
    if (baseVariant && animationDuration) {
      // Clone and override duration
      movementVariant = {
        ...baseVariant,
        animate: {
          ...baseVariant.animate,
          transition: {
            ...(baseVariant.animate as any)?.transition,
            duration: animationDuration,
          },
        },
      };
      // Also store transition separately for direct prop usage
      const baseTransition = (baseVariant.animate as any)?.transition;
      customTransition = {
        ...baseTransition,
        duration: animationDuration,
      };
    } else {
      movementVariant = baseVariant;
    }
  }
  // If it's a custom gifavatar, movementVariant remains undefined (no animation)

  // Calculate transform values from config
  const { positionX, positionY, zoom, rotate } = transformConfig;

  // Convert percentage to pixels for current size
  const offsetX = (positionX / 100) * (size / 2);
  const offsetY = (positionY / 100) * (size / 2);

  // Memoize static transform style (must be at top level, not in conditional)
  const staticTransformStyle = useMemo(
    () => ({
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotate(${rotate}deg)`,
    }),
    [offsetX, offsetY, zoom, rotate],
  );

  // Determine add-on variant and merge with static transforms
  let addOnVariant: Variants | undefined = undefined;
  if (animationStyle?.addOnEffect) {
    const baseAddOnVariant = addOnVariants[animationStyle.addOnEffect];
    if (baseAddOnVariant) {
      // Merge static transforms with add-on variant
      // Framer Motion transforms are additive, so we need to apply base transforms
      const baseAnimate = baseAddOnVariant.animate as
        | Record<string, unknown>
        | undefined;

      // Build merged animate object
      const mergedAnimate: Record<string, unknown> = {};

      // Preserve all non-transform properties from base variant
      if (baseAnimate) {
        Object.keys(baseAnimate).forEach((key) => {
          if (
            key !== "scale" &&
            key !== "rotate" &&
            key !== "x" &&
            key !== "y"
          ) {
            mergedAnimate[key] = baseAnimate[key];
          }
        });
      }

      // Add static transforms to variant
      mergedAnimate.x = offsetX;
      mergedAnimate.y = offsetY;

      // Merge scale: add-on effects may have scale, so we multiply
      if (baseAnimate?.scale !== undefined) {
        mergedAnimate.scale = Array.isArray(baseAnimate.scale)
          ? (baseAnimate.scale as number[]).map((s: number) => s * zoom)
          : (baseAnimate.scale as number) * zoom;
      } else {
        mergedAnimate.scale = zoom;
      }

      // Merge rotate: add-on effects may have rotate, so we add
      if (baseAnimate?.rotate !== undefined) {
        mergedAnimate.rotate = Array.isArray(baseAnimate.rotate)
          ? (baseAnimate.rotate as number[]).map((r: number) => r + rotate)
          : (baseAnimate.rotate as number) + rotate;
      } else {
        mergedAnimate.rotate = rotate;
      }

      addOnVariant = {
        ...baseAddOnVariant,
        animate: mergedAnimate as any,
      };
    }
  } else {
    // No add-on effect - create variant with just static transforms
    if (offsetX !== 0 || offsetY !== 0 || zoom !== 1 || rotate !== 0) {
      addOnVariant = {
        animate: {
          x: offsetX,
          y: offsetY,
          scale: zoom,
          rotate: rotate,
        },
      };
    }
  }

  return (
    <div
      ref={captureRef}
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* Masked avatar - when renderSquare is true (for capture), render square without mask */}
      <div
        className={`absolute inset-0 ${renderSquare ? "overflow-hidden" : "overflow-hidden rounded-full border-2 border-gray-200"}`}
        style={{ background: bgColor }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <Skeleton
              className={
                rounded ? "h-3/4 w-3/4 rounded-full" : "h-3/4 w-3/4 rounded-md"
              }
            />
          </div>
        )}

        {/* Wrapper for movement animation */}
        {movementVariant ? (
          <motion.div
            key={`movement-${animationStyle?.photoMovement ?? "default"}-${transformConfig.animationDuration}`}
            className="absolute inset-0"
            variants={movementVariant}
            initial="initial"
            animate="animate"
            transition={customTransition}
          >
            {/* Inner container for add-on effects */}
            <motion.div
              key={`addon-${animationStyle?.addOnEffect ?? "none"}-${offsetX}-${offsetY}-${zoom}-${rotate}`}
              className="relative h-full w-full"
              variants={addOnVariant}
              animate={addOnVariant ? "animate" : undefined}
            >
              {localUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={localUrl}
                  alt={isCustomGifavatar ? "custom gifavatar" : "avatar"}
                  className="h-full w-full object-contain"
                />
              ) : displayUrl ? (
                <Image
                  src={displayUrl}
                  alt="avatar cutout"
                  fill
                  className="object-contain"
                />
              ) : defaultOpenpeepsUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={defaultOpenpeepsUrl}
                  alt="avatar"
                  className="h-full w-full object-contain"
                />
              ) : null}
            </motion.div>
          </motion.div>
        ) : (
          /* No animation wrapper - just render the avatar directly (custom gifavatar) */
          <div className="absolute inset-0" style={staticTransformStyle}>
            {localUrl ? (
              shouldRenderGifOnCanvas ? (
                // Render GIF on canvas for proper frame capture
                // Key ensures proper cleanup/remount when URL changes
                <GifCanvasRenderer
                  key={localUrl}
                  gifUrl={localUrl}
                  width={size}
                  height={size}
                  className="h-full w-full object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={localUrl}
                  src={localUrl}
                  alt="custom gifavatar"
                  className="h-full w-full object-contain"
                />
              )
            ) : null}
          </div>
        )}
      </div>
      {badge ? (
        <div className="pointer-events-none absolute right-3 bottom-2 flex h-7 w-7 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          {badge}
        </div>
      ) : null}
    </div>
  );
}
