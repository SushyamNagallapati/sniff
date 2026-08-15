import { useEffect, useState, type SyntheticEvent } from "react";

/** Used until the photograph reports its own dimensions. */
const FALLBACK_ASPECT_RATIO = 4 / 3;

/**
 * Reports a photograph's own aspect ratio.
 *
 * Any frame that carries normalized discovery
 * coordinates has to match the photograph's shape:
 * the moment a fixed ratio crops the image, a marker
 * stored at (0.32, 0.55) stops landing on the feature
 * it describes.
 *
 * Pass `onLoad` to the <img> and give the positioned
 * box `style={{ aspectRatio }}`.
 */
export function useNaturalAspect(imageUrl: string) {
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

  /** A new photograph re-measures rather than inheriting the last one's shape. */
  useEffect(() => {
    setNaturalRatio(null);
  }, [imageUrl]);

  const onLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    if (naturalWidth > 0 && naturalHeight > 0) {
      setNaturalRatio(naturalWidth / naturalHeight);
    }
  };

  return {
    aspectRatio: naturalRatio ?? FALLBACK_ASPECT_RATIO,
    onLoad,
  };
}
