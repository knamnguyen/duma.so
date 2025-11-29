import Jimp from "jimp";

/**
 * Applies stroke/outline to a Jimp image by detecting edges and drawing outline.
 * Returns a new Jimp image with stroke applied.
 */
export async function applyStrokeToJimpImage(
  image: Jimp,
  strokeConfig: { enabled: boolean; weight: number; color: string },
): Promise<Jimp> {
  if (!strokeConfig.enabled || strokeConfig.weight <= 0) {
    return image.clone(); // Return clone if stroke disabled
  }

  const strokeWidth = strokeConfig.weight;
  const strokeColor = Jimp.cssColorToHex(strokeConfig.color);

  // Create a larger canvas to accommodate stroke
  const padding = strokeWidth * 2;
  const originalWidth = image.bitmap.width;
  const originalHeight = image.bitmap.height;
  const canvasWidth = originalWidth + padding;
  const canvasHeight = originalHeight + padding;

  // Create new image with padding
  const strokedImage = new Jimp(
    canvasWidth,
    canvasHeight,
    0x00000000, // Transparent
  );

  // Draw original image with padding offset
  strokedImage.composite(image, padding / 2, padding / 2);

  // Get image data
  const data = strokedImage.bitmap.data;
  const width = canvasWidth;
  const height = canvasHeight;

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
  const strokeRgba = hexToRgba(strokeColor);

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
                  data[pIdx] = strokeRgba.r;
                  data[pIdx + 1] = strokeRgba.g;
                  data[pIdx + 2] = strokeRgba.b;
                  data[pIdx + 3] = 255;
                }
              }
            }
          }
        }
      }
    }
  }

  // Update bitmap data
  strokedImage.bitmap.data = data;

  // Draw original image on top (preserves original appearance)
  strokedImage.composite(image, padding / 2, padding / 2);

  return strokedImage;
}

/**
 * Converts hex color to RGBA object.
 * Jimp hex format: 0xRRGGBBAA
 */
function hexToRgba(hex: number): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const r = (hex >> 24) & 255;
  const g = (hex >> 16) & 255;
  const b = (hex >> 8) & 255;
  const a = hex & 255;
  return { r, g, b, a };
}
