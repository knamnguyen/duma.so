/**
 * Client-side utility to apply stroke/outline to images with transparent backgrounds.
 * Uses Canvas API to detect alpha channel edges and draw stroke.
 */

export type StrokeConfig = {
  enabled: boolean;
  weight: number;
  color: string;
};

/**
 * Applies stroke to an image by detecting edges and drawing outline.
 * Returns a data URL of the stroked image.
 */
export async function applyStrokeToImage(
  imageUrl: string,
  strokeConfig: StrokeConfig,
): Promise<string> {
  if (!strokeConfig.enabled || strokeConfig.weight <= 0) {
    return imageUrl; // Return original if stroke disabled
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Set canvas size to accommodate stroke
        const strokeWidth = strokeConfig.weight;
        const padding = strokeWidth * 2; // Extra padding for stroke
        canvas.width = img.width + padding;
        canvas.height = img.height + padding;

        // Draw image with padding offset
        ctx.drawImage(img, padding / 2, padding / 2);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Create stroke mask by detecting edges
        const strokeMask = new Uint8Array(width * height);

        // Detect edges: pixel is edge if it has alpha > 0 and at least one neighbor has alpha = 0
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const alpha = data[idx + 3]!;

            if (alpha > 0) {
              // Check neighbors for transparent pixels
              let isEdge = false;
              for (let dy = -1; dy <= 1 && !isEdge; dy++) {
                for (let dx = -1; dx <= 1 && !isEdge; dx++) {
                  if (dx === 0 && dy === 0) continue;
                  const nx = x + dx;
                  const ny = y + dy;
                  if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIdx = (ny * width + nx) * 4;
                    if (data[nIdx + 3] === 0) {
                      isEdge = true;
                    }
                  } else {
                    // Out of bounds = edge
                    isEdge = true;
                  }
                }
              }
              if (isEdge) {
                strokeMask[y * width + x] = 1;
              }
            }
          }
        }

        // Draw stroke by expanding edge pixels outward
        const strokeColor = hexToRgba(strokeConfig.color);
        const strokeData = new Uint8ClampedArray(data);

        // For each edge pixel, draw stroke in a circle around it
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (strokeMask[y * width + x] === 1) {
              // Draw stroke circle around this edge pixel
              for (let sy = -strokeWidth; sy <= strokeWidth; sy++) {
                for (let sx = -strokeWidth; sx <= strokeWidth; sx++) {
                  const dist = Math.sqrt(sx * sx + sy * sy);
                  if (dist <= strokeWidth && dist > 0) {
                    const px = x + sx;
                    const py = y + sy;
                    if (px >= 0 && px < width && py >= 0 && py < height) {
                      const pIdx = (py * width + px) * 4;
                      // Only draw stroke where original image is transparent
                      if (data[pIdx + 3] === 0) {
                        strokeData[pIdx] = strokeColor.r;
                        strokeData[pIdx + 1] = strokeColor.g;
                        strokeData[pIdx + 2] = strokeColor.b;
                        strokeData[pIdx + 3] = 255;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Put stroked data back to canvas
        const strokedImageData = new ImageData(strokeData, width, height);
        ctx.putImageData(strokedImageData, 0, 0);

        // Draw original image on top (preserves original appearance)
        ctx.drawImage(img, padding / 2, padding / 2);

        // Return data URL
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

/**
 * Converts hex color to RGBA object.
 */
function hexToRgba(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const sanitized = hex.replace("#", "");
  const r = Number.parseInt(sanitized.slice(0, 2), 16);
  const g = Number.parseInt(sanitized.slice(2, 4), 16);
  const b = Number.parseInt(sanitized.slice(4, 6), 16);
  return { r, g, b, a: 255 };
}
