/**
 * Compresses an image file to target ~3MB original size
 * This ensures base64 encoding (~4MB) stays under Vercel's 4.5MB API limit
 *
 * @param file - Original image file
 * @param maxSizeBytes - Target max size in bytes (default: 3MB)
 * @returns Compressed File object
 */
export async function compressImage(
  file: File,
  maxSizeBytes: number = 3 * 1024 * 1024, // 3MB
): Promise<File> {
  // If file is already small enough, return as-is
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate dimensions to maintain aspect ratio
        // Start with original dimensions
        let width = img.width;
        let height = img.height;

        // If image is very large, scale down proportionally
        // Max dimension of 3000px should be sufficient for most use cases
        const maxDimension = 3000;
        if (width > maxDimension || height > maxDimension) {
          const scale = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output format and quality
        const isPng = file.type === "image/png";
        const outputType = isPng ? "image/png" : "image/jpeg";

        // For JPEG, use quality compression
        // For PNG, we'll rely on dimension reduction
        let quality = 0.9; // Start with high quality
        const minQuality = 0.6; // Don't go below this

        // Try to compress to target size
        const attemptCompress = (currentQuality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              // If we're under the target size or at minimum quality, we're done
              if (blob.size <= maxSizeBytes || currentQuality <= minQuality) {
                const compressedFile = new File([blob], file.name, {
                  type: outputType,
                });
                resolve(compressedFile);
                return;
              }

              // If still too large and we can reduce quality further, try again
              if (blob.size > maxSizeBytes && currentQuality > minQuality) {
                const newQuality = Math.max(minQuality, currentQuality - 0.1);
                attemptCompress(newQuality);
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: outputType,
                });
                resolve(compressedFile);
              }
            },
            outputType,
            isPng ? undefined : currentQuality, // PNG doesn't support quality parameter
          );
        };

        attemptCompress(quality);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}
