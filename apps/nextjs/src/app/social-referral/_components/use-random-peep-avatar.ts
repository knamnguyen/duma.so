"use client";

import type { CSSProperties } from "react";
import { createElement, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Peep from "react-peeps";

interface PeepConfiguration {
  accessory?: string;
  body?: string;
  face?: string;
  facialHair?: string;
  hair?: string;
  strokeColor?: string;
  backgroundColor?: string;
  circleStyle?: CSSProperties;
  wrapperBackground?: string;
}

const PEEP_STROKE_COLOR = "#000000";

const PEEP_BACKGROUND_COLOR = "#FFFFFF";

const PEEP_STYLE: CSSProperties = {
  width: 220,
  height: 220,
  justifyContent: "center",
  alignSelf: "center",
};

const PEEP_CIRCLE_STYLE: CSSProperties = {
  backgroundColor: "#F8FAFC",
  width: 200,
  height: 200,
  alignSelf: "center",
  borderRadius: 100,
  overflow: "hidden",
  borderWidth: 3,
  borderColor: "#e5e7eb",
  borderStyle: "solid",
};

const PEEP_VARIANTS: readonly [PeepConfiguration, ...PeepConfiguration[]] = [
  {
    accessory: "GlassRoundThick",
    body: "Shirt",
    face: "Cute",
    hair: "ShortVolumed",
    facialHair: "Dali",
    strokeColor: PEEP_STROKE_COLOR,
    backgroundColor: PEEP_BACKGROUND_COLOR,
    circleStyle: { ...PEEP_CIRCLE_STYLE, backgroundColor: "#F3D34A" },
  },
  {
    accessory: "GlassRound",
    body: "Coffee",
    face: "Smile",
    hair: "Bun",
    facialHair: "None",
    strokeColor: PEEP_STROKE_COLOR,
    backgroundColor: PEEP_BACKGROUND_COLOR,
    circleStyle: { ...PEEP_CIRCLE_STYLE, backgroundColor: "#E2E8F0" },
  },
  {
    accessory: "GlassButterfly",
    body: "Hoodie",
    face: "Serious",
    hair: "Long",
    facialHair: "None",
    strokeColor: PEEP_STROKE_COLOR,
    backgroundColor: PEEP_BACKGROUND_COLOR,
    circleStyle: { ...PEEP_CIRCLE_STYLE, backgroundColor: "#D1FAE5" },
  },
  {
    accessory: "SunglassClubmaster",
    body: "Gaming",
    face: "Concerned",
    hair: "ShortCurly",
    facialHair: "None",
    strokeColor: PEEP_STROKE_COLOR,
    backgroundColor: PEEP_BACKGROUND_COLOR,
    circleStyle: { ...PEEP_CIRCLE_STYLE, backgroundColor: "#FFEDD5" },
  },
  {
    accessory: "None",
    body: "BlazerBlackTee",
    face: "SmileTeeth",
    hair: "Pomp",
    facialHair: "Goatee",
    strokeColor: PEEP_STROKE_COLOR,
    backgroundColor: PEEP_BACKGROUND_COLOR,
    circleStyle: { ...PEEP_CIRCLE_STYLE, backgroundColor: "#E0F2FE" },
  },
] as const;

export const createPeepDataUrl = (
  config: PeepConfiguration,
): Promise<string> => {
  return new Promise((resolve) => {
    // Ensure we're in browser environment
    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.visibility = "hidden";
    document.body.appendChild(container);

    // Create root and render Peep component
    const root = createRoot(container);
    const peepElement = createElement(Peep, {
      ...config,
      style: PEEP_STYLE,
      circleStyle: config.circleStyle ?? PEEP_CIRCLE_STYLE,
    } as Parameters<typeof Peep>[0]);

    root.render(peepElement);

    // Use requestAnimationFrame for more reliable timing
    let retryCount = 0;
    const maxRetries = 10;
    const extractSvg = () => {
      const svgElement = container.querySelector("svg");
      if (svgElement) {
        try {
          // Clone and normalize SVG
          const svgClone = svgElement.cloneNode(true) as SVGElement;
          if (!svgClone.getAttribute("xmlns")) {
            svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          }
          const svgString = new XMLSerializer().serializeToString(svgClone);
          const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            svgString,
          )}`;

          // Cleanup
          root.unmount();
          if (container.parentNode) {
            document.body.removeChild(container);
          }
          resolve(dataUrl);
        } catch (error) {
          console.error("Error creating Peep data URL:", error);
          // Cleanup on error
          root.unmount();
          if (container.parentNode) {
            document.body.removeChild(container);
          }
          resolve("");
        }
      } else if (retryCount < maxRetries) {
        // Retry if SVG not ready yet
        retryCount++;
        requestAnimationFrame(extractSvg);
      } else {
        // Max retries reached, cleanup and resolve empty
        console.warn("Peep SVG not found after max retries");
        root.unmount();
        if (container.parentNode) {
          document.body.removeChild(container);
        }
        resolve("");
      }
    };

    // Start extraction after a short delay to ensure render
    requestAnimationFrame(() => {
      requestAnimationFrame(extractSvg);
    });
  });
};

export function useRandomPeepAvatar(enabled = true): string {
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (!enabled) {
      setAvatarUrl("");
      return;
    }

    let isCancelled = false;
    const index = Math.floor(Math.random() * PEEP_VARIANTS.length);
    const config = PEEP_VARIANTS[index] ?? PEEP_VARIANTS[0];
    void createPeepDataUrl(config).then((url) => {
      if (!isCancelled) {
        setAvatarUrl(url);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [enabled]);

  return avatarUrl;
}
