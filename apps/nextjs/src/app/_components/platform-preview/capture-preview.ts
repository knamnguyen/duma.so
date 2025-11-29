"use client";

import type GIF from "gif.js";

export interface CapturePreviewOptions {
  element: HTMLElement;
  durationMs?: number;
  fps?: number;
  quality?: number;
  scale?: number;
}

const DEFAULT_DURATION_MS = 5_500;
const DEFAULT_FPS = 12;
const DEFAULT_QUALITY = 10;
const DEFAULT_SCALE = 1.5;

export async function capturePreviewAsGif({
  element,
  durationMs = DEFAULT_DURATION_MS,
  fps = DEFAULT_FPS,
  quality = DEFAULT_QUALITY,
  scale = DEFAULT_SCALE,
}: CapturePreviewOptions): Promise<Blob> {
  if (!element) {
    throw new Error("Missing preview element to capture.");
  }

  const [htmlToImage, { default: GIFConstructor }] = await Promise.all([
    import("html-to-image") as Promise<typeof import("html-to-image")>,
    import("gif.js"),
  ]);

  const frameDelayMs = Math.max(1, Math.round(1_000 / fps));
  const totalFrames = Math.max(1, Math.round(durationMs / frameDelayMs));

  const gif = createGifInstance(GIFConstructor, quality);

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
    // eslint-disable-next-line no-await-in-loop
    const canvas = await htmlToImage.toCanvas(element, {
      pixelRatio: scale,
      backgroundColor: "rgba(0,0,0,0)",
      cacheBust: true,
    });

    gif.addFrame(canvas, {
      copy: true,
      delay: frameDelayMs,
    });

    if (frameIndex < totalFrames - 1) {
      // eslint-disable-next-line no-await-in-loop
      await wait(frameDelayMs);
    }
  }

  const blob = await renderGif(gif);
  return blob;
}

function createGifInstance(GIFConstructor: typeof GIF, quality: number) {
  return new GIFConstructor({
    workers: 2,
    quality,
    repeat: 0,
    workerScript: new URL(
      "gif.js/dist/gif.worker.js",
      import.meta.url,
    ).toString(),
    background: "rgba(0,0,0,0)",
  });
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function renderGif(gif: GIF): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    gif.on("finished", (blob: Blob) => {
      resolve(blob);
    });

    gif.on("abort", () => {
      reject(new Error("GIF render aborted."));
    });

    gif.render();
  });
}
