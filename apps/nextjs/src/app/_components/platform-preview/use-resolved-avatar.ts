"use client";

import { useMemo } from "react";

import { useRandomPeepAvatar } from "~/app/social-referral/_components/use-random-peep-avatar";

/**
 * Returns the supplied local avatar URL if present, otherwise falls back to
 * a generated OpenPeeps data URL.
 */
export function useResolvedAvatar(localUrl?: string | null): string {
  const needsFallback =
    !localUrl || (typeof localUrl === "string" && localUrl.trim().length === 0);
  const peepAvatar = useRandomPeepAvatar(needsFallback);

  return useMemo(() => {
    if (localUrl && localUrl.trim().length > 0) {
      return localUrl;
    }

    return peepAvatar;
  }, [localUrl, peepAvatar]);
}
