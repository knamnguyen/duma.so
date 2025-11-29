"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import { Skeleton } from "@sassy/ui/skeleton";
import { cn } from "@sassy/ui/utils";

import { useTRPC } from "~/trpc/react";

type CreditBalanceProps = {
  className?: string;
};

export function CreditBalance({ className }: CreditBalanceProps) {
  const { isLoaded, isSignedIn } = useUser();
  const trpc = useTRPC();

  const metricsQuery = useQuery({
    ...trpc.social.metrics.queryOptions(),
    enabled: isLoaded && isSignedIn,
  });

  const isLoading =
    metricsQuery.isLoading ||
    (!metricsQuery.data && !metricsQuery.isError && isLoaded && isSignedIn);
  const displayValue = useMemo(() => {
    if (metricsQuery.isError) return "--";
    const credits = metricsQuery.data?.totalCredits ?? 0;
    return credits.toLocaleString();
  }, [metricsQuery.data?.totalCredits, metricsQuery.isError]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className={cn("flex items-center", className)}>
      {isLoading ? (
        <Skeleton className="h-10 w-[100px] rounded-xl border border-black/5 bg-white/70 shadow-[0_16px_36px_rgba(17,24,39,0.08)]" />
      ) : (
        <div className="flex h-10 min-w-[100px] flex-row justify-center gap-1 rounded-xl border border-black/5 bg-white/80 px-2 shadow-[0_16px_36px_rgba(17,24,39,0.08)]">
          <a className="flex items-center gap-1" href="/social-referral">
            <span className="flex items-center text-sm font-semibold text-[#64748b]">
              Credits
            </span>
            <div className="flex items-center gap-1">
              <span className="text-base font-semibold text-[#111827]">
                {displayValue}
              </span>
              <Sparkles className="h-4 w-4 text-[#ff6fae]" aria-hidden />
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

export default CreditBalance;
