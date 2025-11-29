"use client";

import { cn } from "@sassy/ui/utils";

import type {
  AddOnEffectStyle,
  PhotoMovementStyle,
} from "~/app/_components/avatar-animations";

export type AnimationStyle = {
  photoMovement: PhotoMovementStyle | null;
  addOnEffect: AddOnEffectStyle | null;
};

// Re-export types for convenience
export type { AddOnEffectStyle, PhotoMovementStyle };

type AnimationStyleSelectorProps = {
  selectedStyle: AnimationStyle;
  onStyleChange: (style: AnimationStyle) => void;
};

const PHOTO_MOVEMENT_STYLES: Array<{
  id: PhotoMovementStyle;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "rise",
    label: "Rise",
    icon: (
      <div className="flex items-end gap-1">
        <div className="h-3 w-4 rounded bg-purple-200" />
        <div className="h-4 w-4 rounded bg-purple-400" />
        <div className="h-5 w-4 rounded bg-purple-600" />
        <svg
          className="h-4 w-4 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "pan",
    label: "Pan",
    icon: (
      <div className="flex items-center gap-1">
        <div className="h-4 w-3 rounded bg-purple-200" />
        <div className="h-4 w-4 rounded bg-purple-400" />
        <div className="h-4 w-3 rounded bg-purple-600" />
        <svg
          className="h-4 w-4 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "fade",
    label: "Fade",
    icon: (
      <div className="flex items-center gap-1">
        <div className="h-4 w-3 rounded bg-purple-600 opacity-100" />
        <div className="h-4 w-3 rounded bg-purple-600 opacity-60" />
        <div className="h-4 w-3 rounded bg-purple-600 opacity-30" />
      </div>
    ),
  },
  {
    id: "pop",
    label: "Pop",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-6 w-6 rounded bg-purple-200" />
        <div className="absolute h-5 w-5 rounded bg-purple-400" />
        <div className="relative h-4 w-4 rounded bg-purple-600" />
        <svg
          className="absolute -left-2 h-3 w-3 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <svg
          className="absolute -right-2 h-3 w-3 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "wipe",
    label: "Wipe",
    icon: (
      <div className="flex items-center">
        <div className="h-4 w-4 rounded-l bg-purple-600" />
        <div className="h-4 w-4 rounded-r bg-purple-300 opacity-60" />
      </div>
    ),
  },
  {
    id: "blur",
    label: "Blur",
    icon: <div className="h-6 w-6 rounded bg-purple-600 blur-sm" />,
  },
  {
    id: "succession",
    label: "Succession",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="h-6 w-6 rounded bg-purple-600 blur-sm" />
        <svg
          className="absolute -top-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -top-1 -right-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -bottom-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -right-1 -bottom-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "breathe",
    label: "Breathe",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-6 w-6 rounded bg-purple-200" />
        <div className="absolute h-5 w-5 rounded bg-purple-400" />
        <div className="relative h-4 w-4 rounded bg-purple-600" />
        <svg
          className="absolute -top-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          className="absolute -top-1 -right-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          className="absolute -bottom-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          className="absolute -right-1 -bottom-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "baseline",
    label: "Baseline",
    icon: (
      <div className="flex flex-col items-center gap-1">
        <div className="h-1 w-2 rounded bg-purple-200" />
        <div className="h-2 w-2 rounded bg-purple-400" />
        <div className="h-3 w-2 rounded bg-purple-600" />
        <div className="h-0.1 w-0.2 bg-purple-600" />
      </div>
    ),
  },
  {
    id: "drift",
    label: "Drift",
    icon: (
      <div className="relative flex items-center">
        <div className="absolute left-0 h-4 w-4 rounded bg-purple-200 opacity-60" />
        <div className="absolute left-2 h-4 w-4 rounded bg-purple-400 opacity-80" />
        <div className="relative left-4 h-4 w-4 rounded bg-purple-600" />
        <svg
          className="absolute bottom-0 left-0 h-3 w-6 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "tectonic",
    label: "Tectonic",
    icon: (
      <div className="relative flex items-center">
        <div className="absolute left-0 h-4 w-4 rounded bg-purple-200" />
        <div className="absolute left-2 h-4 w-4 rounded bg-purple-400" />
        <div className="relative left-4 h-4 w-4 rounded bg-purple-600" />
        <svg
          className="absolute bottom-0 left-0 h-3 w-6 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "tumble",
    label: "Tumble",
    icon: (
      <div className="relative flex items-center">
        <div className="absolute top-2 left-0 h-3 w-3 rotate-12 rounded bg-purple-200" />
        <div className="absolute top-1 left-2 h-3 w-3 rotate-6 rounded bg-purple-400" />
        <div className="absolute left-3 h-4 w-4 rotate-0 rounded bg-purple-600" />
        <svg
          className="absolute -top-1 left-2 h-4 w-4 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "neon",
    label: "Neon",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="absolute top-1 right-1 h-4 w-4 rounded border-2 border-purple-300" />
        <div className="relative h-5 w-5 rounded bg-purple-600" />
        <svg
          className="absolute -top-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <svg
          className="absolute -right-1 -bottom-1 h-2 w-2 text-purple-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "scrapbook",
    label: "Scrapbook",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="absolute top-0 left-0 h-4 w-4 -rotate-6 rounded bg-purple-300" />
        <div className="relative top-1 right-0 h-4 w-4 rotate-6 rounded bg-purple-600" />
      </div>
    ),
  },
  {
    id: "stomp",
    label: "Stomp",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-7 w-7 rounded border-2 border-purple-200" />
        <div className="absolute h-6 w-6 rounded border-2 border-purple-300" />
        <div className="relative h-5 w-5 rounded bg-purple-600" />
        <svg
          className="absolute -top-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -top-1 -right-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -bottom-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -right-1 -bottom-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
      </div>
    ),
  },
];

const ADD_ON_EFFECTS: Array<{
  id: AddOnEffectStyle;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "rotate",
    label: "Rotate",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="h-5 w-5 rounded-full bg-purple-600" />
        <svg
          className="absolute -top-1 h-3 w-3 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <svg
          className="absolute -bottom-1 h-3 w-3 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "flicker",
    label: "Flicker",
    icon: (
      <div className="flex items-center gap-0.5">
        <div className="h-5 w-2 rounded bg-purple-200" />
        <div className="h-5 w-2 rounded bg-purple-400" />
        <div className="h-5 w-2 rounded bg-purple-600" />
      </div>
    ),
  },
  {
    id: "pulse",
    label: "Pulse",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-6 w-6 rounded-full border-2 border-purple-300" />
        <div className="absolute h-5 w-5 rounded-full border-2 border-purple-400" />
        <div className="relative h-4 w-4 rounded-full bg-purple-600" />
        <svg
          className="absolute -top-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -top-1 -right-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -bottom-1 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <svg
          className="absolute -right-1 -bottom-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "wiggle",
    label: "Wiggle",
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="flex gap-0.5">
          <div className="h-3 w-1 bg-purple-600" />
          <div className="h-4 w-1 bg-purple-600" />
          <div className="h-3 w-1 bg-purple-600" />
        </div>
        <svg
          className="absolute top-0 -right-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <svg
          className="absolute bottom-0 -left-1 h-2 w-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
    ),
  },
];

export function AnimationStyleSelector({
  selectedStyle,
  onStyleChange,
}: AnimationStyleSelectorProps) {
  const handlePhotoMovementClick = (style: PhotoMovementStyle) => {
    onStyleChange({
      ...selectedStyle,
      photoMovement: selectedStyle.photoMovement === style ? null : style,
    });
  };

  const handleAddOnEffectClick = (effect: AddOnEffectStyle) => {
    onStyleChange({
      ...selectedStyle,
      addOnEffect: selectedStyle.addOnEffect === effect ? null : effect,
    });
  };

  return (
    <div className="space-y-4">
      {/* Photo Movement (General) Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Photo movement (general)</h3>
        <div className="grid grid-cols-5 gap-2">
          {PHOTO_MOVEMENT_STYLES.map((style) => {
            const isSelected = selectedStyle.photoMovement === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handlePhotoMovementClick(style.id)}
                className={cn(
                  "group flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 transition-all hover:scale-[1.02]",
                  isSelected
                    ? "border-purple-600 bg-gray-100"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
                aria-pressed={isSelected}
              >
                <div className="flex h-6 w-6 scale-75 items-center justify-center">
                  {style.icon}
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {style.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add-on Effects Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Add-on effects</h3>
        <div className="grid grid-cols-5 gap-2">
          {ADD_ON_EFFECTS.map((effect) => {
            const isSelected = selectedStyle.addOnEffect === effect.id;
            return (
              <button
                key={effect.id}
                type="button"
                onClick={() => handleAddOnEffectClick(effect.id)}
                className={cn(
                  "group flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 transition-all hover:scale-[1.02]",
                  isSelected
                    ? "border-purple-600 bg-gray-100"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
                aria-pressed={isSelected}
              >
                <div className="flex h-6 w-6 scale-75 items-center justify-center">
                  {effect.icon}
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {effect.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
