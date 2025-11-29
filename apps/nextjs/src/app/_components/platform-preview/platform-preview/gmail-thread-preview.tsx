"use client";

import type { ReactNode } from "react";

import type { AvatarConfig } from "~/app/_components/avatar-preview";
import { AvatarPreview } from "~/app/_components/avatar-preview";
import { defaultRandomAvatar } from "~/app/_components/platform-preview/default-random-avatar";
import { useResolvedAvatar } from "~/app/_components/platform-preview/use-resolved-avatar";
import GmailIcon from "~/app/assets/logos/gmail.svg";

interface GmailThreadPreviewProps {
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

export function GmailThreadPreview({
  userName,
  userEmail,
  bgRemovedUrl,
  localUrl,
  avatarConfig,
  bgColor = "#ffffff",
  isLoading = false,
  badge = null,
  preferCanvasForGif = true,
}: GmailThreadPreviewProps) {
  const resolvedLocalAvatar = useResolvedAvatar(localUrl);
  const messages = [
    {
      id: 1,
      sender: userName || "You",
      senderEmail: userEmail || "you@example.com",
      avatar: bgRemovedUrl || resolvedLocalAvatar,
      content:
        "Hi Random guy, I'd love to connect and discuss potential collaboration opportunities. Would you be interested in a quick coffee chat?",
      time: "2:14 PM",
      isUser: true,
    },
    {
      id: 2,
      sender: "Random guy",
      senderEmail: "randomguy@company.com",
      avatar: null, // Will use boring default
      content:
        "Wow, that's the coolest animated profile picture I've ever seen! Where did you get that amazing avatar?",
      time: "2:28 PM",
      isUser: false,
    },
  ];

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-4 font-['Roboto',_system-ui,_sans-serif] shadow-sm">
      {/* Gmail App Bar */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3.5">
        <button className="text-gray-600">
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
            />
          </svg>
        </button>
        <div className="flex-1 rounded-full bg-gray-100 px-5 py-2.5 text-[16px] text-gray-600">
          Search in mail
        </div>
        <div className="h-6 w-6">
          <GmailIcon className="h-6 w-6" />
        </div>
      </div>

      {/* Indicators row */}
      <div className="flex items-center justify-between px-3 pt-2 pb-2">
        <div className="text-[15px] font-semibold text-gray-800">
          Leads Outreach Inbox
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-0.5 text-[15px]">
            Sent
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-0.5 text-[15px]">
            To
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-0.5 text-[15px]">
            Date
          </span>
          <span className="rounded-full bg-[#d93025] px-2.5 py-0.5 text-[14px] font-semibold text-white">
            +99 unread
          </span>
        </div>
      </div>

      {/* Thread Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
        <div className="h-5 w-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 49.4 512 399.42">
            <g fill="none" fillRule="evenodd">
              <g fillRule="nonzero">
                <path
                  fill="#4285f4"
                  d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z"
                />
                <path
                  fill="#34a853"
                  d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z"
                />
                <path
                  fill="#fbbc04"
                  d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z"
                />
              </g>
              <path
                fill="#ea4335"
                d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z"
              />
              <path
                fill="#c5221f"
                fillRule="nonzero"
                d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z"
              />
            </g>
          </svg>
        </div>
        <div className="truncate text-base font-medium text-gray-900">
          Yo - wanna get the only moving avatar on the internet?
        </div>
      </div>

      {/* Messages Thread */}
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex gap-3 rounded p-2 transition-colors hover:bg-gray-50"
          >
            {/* Avatar (shared) */}
            <div className="flex-shrink-0 self-start">
              {message.isUser && message.avatar ? (
                <AvatarPreview
                  config={
                    avatarConfig
                      ? { ...avatarConfig, size: 70, rounded: true }
                      : {
                          bgColor,
                          // Default animationStyle when not provided (for openpeeps avatar)
                          animationStyle: {
                            photoMovement: "rise",
                            addOnEffect: null,
                          },
                          size: 70,
                          rounded: true,
                        }
                  }
                  bgRemovedUrl={bgRemovedUrl}
                  localUrl={localUrl ?? undefined} // Pass original - AvatarPreview handles default Openpeeps internally
                  isLoading={isLoading}
                  badge={badge}
                  preferCanvasForGif={preferCanvasForGif}
                />
              ) : (
                defaultRandomAvatar
              )}
            </div>

            {/* Message Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[14px] text-gray-600 md:text-[15px]">
                <span className="max-w-[140px] truncate font-medium text-gray-900">
                  {message.sender}
                </span>
                <span className="hidden max-w-[180px] truncate text-gray-500 sm:block">
                  &lt;{message.senderEmail}&gt;
                </span>
                <span className="ml-auto flex-shrink-0 text-gray-500">
                  {message.time}
                </span>
              </div>
              <div className="mt-1 text-[14px] leading-snug text-gray-800 md:text-[15px]">
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer removed per spec */}
    </div>
  );
}
