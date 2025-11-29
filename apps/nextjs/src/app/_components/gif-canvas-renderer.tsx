"use client";

import { useEffect, useRef } from "react";

/**
 * Checks if a URL points to a GIF file
 */
export function isGifUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith(".gif") || url.includes(".gif?");
}

/**
 * Component that renders an animated GIF on a canvas element.
 * This allows html-to-image to capture individual frames correctly.
 */
export function GifCanvasRenderer({
  gifUrl,
  width,
  height,
  className,
  style,
}: {
  gifUrl: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<any>(null);
  const giflerFnRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gifUrl) return;

    // Stop previous animation if it exists
    if (
      animationRef.current &&
      typeof animationRef.current.stop === "function"
    ) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Clear canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Load gifler function if not already loaded
    const loadGifler = async () => {
      if (giflerFnRef.current) {
        return giflerFnRef.current;
      }

      // Dynamically import gifler to avoid loading it unless needed
      // gifler is a browserify bundle - it sets window.gifler and exports via module.exports
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const giflerModule: any = await import("gifler");

      // Wait a tick for browserify to set window.gifler
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          // Try window.gifler first (set by browserify)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          let giflerFn = (window as any).gifler;

          // Fallback: try module exports (CommonJS -> ES module)
          if (!giflerFn || typeof giflerFn !== "function") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            giflerFn = giflerModule.default || giflerModule;
          }

          if (!giflerFn || typeof giflerFn !== "function") {
            console.error("gifler module:", {
              moduleType: typeof giflerModule,
              moduleKeys: Object.keys(giflerModule),
              windowGifler: typeof (window as any).gifler,
            });
            throw new Error("gifler function not accessible");
          }

          giflerFnRef.current = giflerFn;
          resolve(giflerFn);
        }, 0);
      });
    };

    // Load and start animation
    loadGifler()
      .then((giflerFn: any) => {
        // Check if canvas is still mounted and URL hasn't changed
        if (!canvasRef.current || canvasRef.current !== canvas) {
          return;
        }

        // Load and animate the GIF
        // gifler().animate() automatically plays the GIF frame-by-frame on the canvas
        // This allows html-to-image to capture each frame correctly
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        animationRef.current = giflerFn(gifUrl).animate(canvas);
      })
      .catch((error) => {
        console.error("Failed to load GIF:", error);
      });

    // Cleanup: stop animation on unmount or URL change
    return () => {
      if (
        animationRef.current &&
        typeof animationRef.current.stop === "function"
      ) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [gifUrl, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={style}
      width={width}
      height={height}
    />
  );
}
