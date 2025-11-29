"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";

import CreateGifavatarButton from "./create-gifavatar-button";
import CreditBalance from "./credit-balance";

function AppHeader(): React.ReactElement {
  const pathname = usePathname();
  const isActive = (href: string): boolean => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <a className="flex items-center gap-3" href="/">
          <Image
            src="/gifavatar-logo.png"
            alt="Gifavatar logo"
            width={36}
            height={36}
            className="h-8 w-8 rounded-full object-cover"
            priority={false}
          />
          <span className="text-lg font-semibold tracking-tight text-[#161a1d]">
            Gifavatar
          </span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#4a5562] md:flex">
          <Link
            href="/"
            className={`relative pb-1 transition-colors ${isActive("/") ? "border-b-2 border-[#ff6fae] text-[#ff6fae]" : "border-b-2 border-transparent text-[#4a5562] hover:border-[#ff6fae]/60 hover:text-[#ff6fae]"}`}
          >
            Gif Avatars Dashboard
          </Link>
          <Link
            href="/social-referral"
            className={`relative pb-1 transition-colors ${isActive("/social-referral") ? "border-b-2 border-[#ff6fae] text-[#ff6fae]" : "border-b-2 border-transparent text-[#4a5562] hover:border-[#ff6fae]/60 hover:text-[#ff6fae]"}`}
          >
            Get 100% free forever usage
          </Link>
          <Link
            href="https://withkynam.com"
            className="border-b-2 border-transparent text-[#4a5562] transition-colors hover:border-[#ff6fae]/60 hover:text-[#ff6fae]"
          >
            About Creator
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <CreditBalance />
          <CreateGifavatarButton variant="header" />
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default AppHeader;
