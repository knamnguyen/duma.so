// Shared motion spec for preview parity and server rendering
// NOTE: We are prioritizing client-side DOM capture method (capturePreviewAsGif)
// over server-side generation. This motion spec is kept for reference/fallback
// but is currently only used by the unused generateGif server endpoint.

export const MOTION = {
  width: 200,
  height: 200,
  fps: 10,
  durationSeconds: 5.5,
  stillSeconds: 0.5,
  wiggleAmplitude: 6, // px
  wiggleHz: 1.2,
  rotateDeg: 2,
} as const;

export type GifStyle = "rise-bottom" | "rise-left" | "rise-right";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  // classic easeOutBack with s ~ 1.70158
  const s = 1.70158;
  return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
};
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const sampleTransform = (
  style: GifStyle,
  t: number, // seconds since start
  durationSeconds?: number, // optional custom duration, defaults to MOTION.durationSeconds
): { x: number; y: number; rotate: number } => {
  const { height, width, stillSeconds, wiggleAmplitude, wiggleHz, rotateDeg } =
    MOTION;
  // Use custom duration if provided, otherwise use MOTION default
  const animDuration = durationSeconds ?? MOTION.durationSeconds;
  if (t <= stillSeconds) {
    return { x: 0, y: 0, rotate: 0 };
  }
  const mt = Math.max(0, t - stillSeconds);
  const motionDur = animDuration - stillSeconds;
  const p = Math.min(1, mt / motionDur);
  const wiggle = wiggleAmplitude * Math.sin(2 * Math.PI * wiggleHz * mt);
  const rot = rotateDeg * Math.sin(2 * Math.PI * wiggleHz * mt);
  if (style === "rise-bottom") {
    const y = (1 - easeOutCubic(p)) * height;
    return { x: wiggle, y, rotate: rot };
  }
  if (style === "rise-left") {
    const x = -((1 - easeOutCubic(p)) * width);
    return { x: x + wiggle, y: 0, rotate: rot };
  }
  // rise-right
  const x = (1 - easeOutCubic(p)) * width;
  return { x: x + wiggle, y: 0, rotate: rot };
};

/**
 * Extended transform returned by the new server-side sampler to support
 * additional editor movement styles. Optional fields default to identity.
 */
export type ExtendedTransform = {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  opacity?: number; // 0..1
};

/**
 * Sample additional movement styles used by the editor preview.
 * This function is intentionally simple and approximate; it favors
 * perceptible differences over exact parity with Framer Motion.
 */
export function samplePhotoMovement(
  photoMovement: string,
  t: number,
  durationSeconds?: number,
): ExtendedTransform {
  const { height, width, stillSeconds, wiggleAmplitude, wiggleHz, rotateDeg } =
    MOTION;
  const animDuration = durationSeconds ?? MOTION.durationSeconds;
  if (t <= stillSeconds) {
    return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
  }
  const mt = Math.max(0, t - stillSeconds);
  const motionDur = Math.max(0.0001, animDuration - stillSeconds);
  const p = clamp01(mt / motionDur);
  const wiggle = wiggleAmplitude * Math.sin(2 * Math.PI * wiggleHz * mt);
  const rot = rotateDeg * Math.sin(2 * Math.PI * wiggleHz * mt);

  // Normalize common names used in the editor
  switch (photoMovement) {
    case "rise": {
      const y = (1 - easeOutCubic(p)) * height;
      return { x: wiggle, y, rotate: rot, scale: 1, opacity: 1 };
    }
    case "pan": {
      // Horizontal slide; caller decides left/right by initial offset or sign externally.
      // Return neutral; router will select left/right via legacy helper when needed.
      const x = (1 - easeOutCubic(p)) * width;
      return { x, y: 0, rotate: rot, scale: 1, opacity: 1 };
    }
    case "drift": {
      // Gentle sinusoidal drift in both axes
      const x = 12 * Math.sin(2 * Math.PI * (wiggleHz / 2) * mt);
      const y = 10 * Math.sin(2 * Math.PI * (wiggleHz / 3) * mt);
      return { x, y, rotate: rot / 2, scale: 1, opacity: 1 };
    }
    case "baseline": {
      // Subtle up/down around baseline
      const y = 8 * Math.sin(2 * Math.PI * (wiggleHz / 2) * mt);
      return { x: 0, y, rotate: 0, scale: 1, opacity: 1 };
    }
    case "stomp": {
      // Bounce-like ease: fast down, ease-up
      const y = (1 - easeOutBack(p)) * (height * 0.6);
      return { x: 0, y, rotate: 0, scale: 1, opacity: 1 };
    }
    case "pop": {
      // Scale pulse 0.95 -> 1.08 -> 1
      const s = 0.95 + 0.13 * Math.sin(Math.PI * p);
      return { x: 0, y: 0, rotate: 0, scale: s, opacity: 1 };
    }
    case "fade": {
      // Opacity ramp over first third
      const ramp = clamp01(mt / (motionDur / 3));
      const opacity = 0.2 + 0.8 * ramp;
      return { x: 0, y: 0, rotate: 0, scale: 1, opacity };
    }
    default: {
      // Fallback to rise-ish feel
      const y = (1 - easeOutCubic(p)) * height;
      return { x: wiggle, y, rotate: rot, scale: 1, opacity: 1 };
    }
  }
}
