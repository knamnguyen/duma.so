"use client";

import { MouseEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@sassy/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@sassy/ui/drawer";

export function HowItWorksDrawer() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const goToRecommended = (e?: MouseEvent) => {
    if (e) e.preventDefault();
    const target = "/social-referral#recommended";
    setOpen(false);
    if (pathname === "/social-referral") {
      // Already on page: update hash to trigger highlight
      if (window.location.hash !== "#recommended") {
        window.location.hash = "#recommended";
      } else {
        // Re-dispatch to re-apply effect
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      router.push(target);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="pointer-events-none fixed right-6 bottom-6 z-40 flex justify-end">
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="pointer-events-auto cursor-pointer rounded-xl bg-[#FF6FAE] px-8 py-7 text-lg font-semibold text-white shadow-[0_12px_40px_rgba(255,111,174,0.45)] shadow-lg ring-2 ring-white/50 hover:bg-[#ff5aa3] hover:shadow-[0_16px_56px_rgba(255,111,174,0.55)]"
          >
            How it works to earn 100% free credits
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>
              How it works to earn 100% free credits to use forever
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-4 text-gray-800">
            <div className="space-y-4">
              <div>
                <p className="font-medium">🛼 Steps to get free credits:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                  <li>
                    Write a post that includes the word{" "}
                    <span className="font-semibold">
                      "gifavatar[dot]app"
                    </span>{" "}
                  </li>
                  <li>Share the post on X, Threads, LinkedIn or Facebook.</li>
                  <li>
                    Include in your post a picture of your gifavatar preview
                    (download{" "}
                    <a
                      href="/social-referral#recommended"
                      onClick={goToRecommended}
                      className="cursor-pointer text-[#FF6FAE] underline"
                    >
                      here
                    </a>
                    )
                  </li>
                  <li>
                    Submit the link to the post you made ({" "}
                    <a
                      href="/social-referral#recommended"
                      onClick={goToRecommended}
                      className="cursor-pointer text-[#FF6FAE] underline"
                    >
                      here
                    </a>
                    )
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium">🎁 Credit Rewards:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                  <li>
                    For a post validated to have the word{" "}
                    <span className="font-semibold">"gifavatar[dot]app"</span> -
                    you instanty earn 5 credits
                  </li>
                  <li>
                    We will rescan daily - for every 10 interactions (like,
                    comment, share) - you earn 10 credits
                  </li>
                </ul>
                <p className="mt-2 text-base text-[#FF6FAE] italic">
                  =&gt; You should write a good caption + include a gif of how
                  your gif avatar looks like
                </p>
                <p className="text-base text-[#FF6FAE] italic">
                  =&gt; You can download this gif in high quality in the
                  recommended preview ({" "}
                  <a
                    href="/social-referral#recommended"
                    onClick={goToRecommended}
                    className="cursor-pointer text-black underline"
                  >
                    here
                  </a>
                  )
                </p>
              </div>
              <div>
                <p className="font-medium">✏️ Please note:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                  <li>
                    Your post must be public and be up (not deleted) for at
                    least 4 days.
                  </li>
                  <li>
                    Our system rescans the post daily - credits will be deducted
                    if posts are removed.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <DrawerFooter className="px-6">
            <Button variant="primary" onClick={(e) => goToRecommended(e)}>
              Earn in Referral Dashboard
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
