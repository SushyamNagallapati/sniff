const MAX_IMAGE_DIMENSION = 1920;
const JPEG_QUALITY = 0.86;

/**
 * Normalizes user uploads before they are retained in UI state or sent to the
 * API. This keeps large phone photographs from becoming oversized base64 JSON
 * payloads while preserving enough detail for scene analysis.
 */
export async function prepareImageUpload(file: File): Promise<string> {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();

      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("IMAGE_DECODE_FAILED"));
      element.src = sourceUrl;
    });

    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      throw new Error("IMAGE_DECODE_FAILED");
    }

    const scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
    );

    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("IMAGE_PROCESSING_FAILED");
    }

    // JPEG has no alpha channel. A paper-colored ground avoids transparent PNG
    // regions becoming black after conversion.
    context.fillStyle = "#FCFAF5";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
