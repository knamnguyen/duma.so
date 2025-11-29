import type { Variants } from "motion/react";

export type PhotoMovementStyle =
  | "rise"
  | "pan"
  | "fade"
  | "pop"
  | "wipe"
  | "blur"
  | "succession"
  | "breathe"
  | "baseline"
  | "drift"
  | "tectonic"
  | "tumble"
  | "neon"
  | "scrapbook"
  | "stomp";

export type AddOnEffectStyle = "rotate" | "flicker" | "pulse" | "wiggle";

export type PreviewStyle = "rise-bottom" | "rise-left" | "rise-right";

// Default animation duration in seconds
export const DEFAULT_ANIMATION_DURATION = 0.8;

// Photo Movement Variants - Strong Entrance Animations (looping)
export const movementVariants: Record<PhotoMovementStyle, Variants> = {
  rise: {
    initial: { y: 200, rotate: 0 },
    animate: {
      y: 20,
      rotate: [0, 2, -2, 2, 0],
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.34, 1.56, 0.64, 1], // backOut - crisp bounce
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  pan: {
    initial: { x: -200 },
    animate: {
      x: 0,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad - smooth
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  fade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "easeOut", // smooth fade
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  pop: {
    initial: { scale: 0.3, opacity: 0 },
    animate: {
      scale: [0.3, 1.15, 1],
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.68, -0.55, 0.265, 1.55], // backOut - crisp pop
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  wipe: {
    initial: { clipPath: "inset(0 100% 0 0)", x: -50 },
    animate: {
      clipPath: "inset(0 0% 0 0)",
      x: 0,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.43, 0.13, 0.23, 0.96], // sharp ease
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  blur: {
    initial: { filter: "blur(20px)", opacity: 0, scale: 0.9 },
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  succession: {
    initial: { scale: 0.5, y: 100, opacity: 0, filter: "blur(10px)" },
    animate: {
      scale: 1,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  breathe: {
    initial: { scale: 0.8, opacity: 0.7 },
    animate: {
      scale: [0.8, 1.05, 1],
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  baseline: {
    initial: { y: 150, scale: 0.8, opacity: 0 },
    animate: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.34, 1.56, 0.64, 1], // backOut
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  drift: {
    initial: { x: -200, y: 20, opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "easeOut", // smooth drift
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  tectonic: {
    initial: { x: -180, scale: 0.9, opacity: 0 },
    animate: {
      x: [0, -50, 0],
      scale: [0.9, 0.95, 1],
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.43, 0.13, 0.23, 0.96], // sharp
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  tumble: {
    initial: { x: -150, y: 100, rotate: -45, opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.68, -0.55, 0.265, 1.55], // backOut - crisp tumble
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  neon: {
    initial: { scale: 0.7, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      filter: [
        "brightness(0.5) drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))",
        "brightness(1.5) drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))",
        "brightness(1) drop-shadow(0 0 5px rgba(139, 92, 246, 0.3))",
      ],
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  scrapbook: {
    initial: { x: -50, y: -30, rotate: -10, scale: 0.8, opacity: 0 },
    animate: {
      x: [0, 10, 0],
      y: [0, 10, 0],
      rotate: [0, 5, 0],
      scale: [0.8, 0.95, 1],
      opacity: 1,
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.34, 1.56, 0.64, 1], // backOut
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  stomp: {
    initial: { scale: 0.3, y: 150, opacity: 0 },
    animate: {
      scale: [0.3, 1.2, 0.95, 1],
      y: [150, -10, 5, 0],
      opacity: [0, 0.9, 1, 1],
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.68, -0.55, 0.265, 1.55], // backOut - very crisp stomp
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
};

// Add-on Effect Variants - Subtle Touches (looping)
export const addOnVariants: Record<AddOnEffectStyle, Variants> = {
  rotate: {
    animate: {
      rotate: 45,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      },
    },
  },
  flicker: {
    animate: {
      opacity: [1, 0.3, 1, 0.3, 1],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
  pulse: {
    animate: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
  wiggle: {
    animate: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
};

// Legacy movement variants for backward compatibility (looping)
export const legacyMovementVariants: Record<PreviewStyle, Variants> = {
  "rise-bottom": movementVariants.rise,
  "rise-left": {
    initial: { x: -200, rotate: 0 },
    animate: {
      x: 0,
      rotate: [0, 2, -2, 2, 0],
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.34, 1.56, 0.64, 1],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
  "rise-right": {
    initial: { x: 200, rotate: 0 },
    animate: {
      x: 0,
      rotate: [0, -2, 2, -2, 0],
      transition: {
        duration: DEFAULT_ANIMATION_DURATION,
        ease: [0.34, 1.56, 0.64, 1],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.3,
      },
    },
  },
};
