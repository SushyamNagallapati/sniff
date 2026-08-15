import React from "react";

import { motion, useReducedMotion } from "motion/react";

import { useNaturalAspect } from "../utils/useNaturalAspect";
import { DURATION, EASE } from "../styles/motion";

/** Tallest the photograph may render, so a portrait shot can't take over the page. */
const PHOTO_MAX_HEIGHT = "min(72vh, 680px)";

interface PhotoFrameProps {
  imageUrl: string | null;

  alt: string;

  /** Contents of the bar above the photograph. */
  header: React.ReactNode;

  /**
   * Applied to the photograph alone. Overlay children
   * are siblings, so a filter here never reaches them.
   */
  imageClassName?: string;

  /** Scale applied to the photograph and its overlay together. */
  scale?: number;

  transformOrigin?: string;

  /** Absolutely positioned overlay, in the photograph's own coordinate space. */
  children?: React.ReactNode;

  /**
   * Applied to the stage — the bordered box the photograph
   * sits in, above the scaled photo itself. A caller that
   * replaces the system cursor (ImageViewport's custom
   * cursor) sets `cursor-none` here; nothing else needs it.
   */
  stageClassName?: string;

  onStageMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onStageMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onStageMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * The photograph, its chrome, and anything positioned
 * on top of it.
 *
 * Loading and the finished report both render through
 * this, so the photograph cannot shift when one replaces
 * the other — the bar and the stage are defined once.
 *
 * The stage takes the photograph's own aspect ratio, so
 * nothing is cropped and normalized discovery coordinates
 * stay true at every viewport width. maxWidth is derived
 * from the height cap because capping height directly
 * would fight the ratio.
 */
export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  imageUrl,
  alt,
  header,
  imageClassName = "",
  scale = 1,
  transformOrigin = "50% 50%",
  children,
  stageClassName = "",
  onStageMouseMove,
  onStageMouseEnter,
  onStageMouseLeave,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const { aspectRatio, onLoad } = useNaturalAspect(imageUrl ?? "");

  return (
    <div className="relative flex flex-col border border-[#D8D1C5] bg-[#1D1C19]">
      {/*
       * Bar contents are given a uniform 24px row height
       * by their callers, so this bar is the same height
       * whether it holds live controls or a status line
       * — that is what keeps the photograph from shifting
       * when loading becomes the report.
       */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302B] bg-[#1D1C19] px-4 py-2 text-white">
        {header}
      </div>

      <div
        className={`relative flex w-full justify-center overflow-hidden bg-[#1D1C19] ${stageClassName}`}
        onMouseMove={onStageMouseMove}
        onMouseEnter={onStageMouseEnter}
        onMouseLeave={onStageMouseLeave}
      >
        <motion.div
          animate={{ scale }}
          transition={{
            duration: shouldReduceMotion ? 0 : DURATION.base,
            ease: EASE,
          }}
          className="relative w-full"
          style={{
            aspectRatio: aspectRatio,
            maxWidth: `calc(${PHOTO_MAX_HEIGHT} * ${aspectRatio})`,
            transformOrigin,
          }}
        >
          <div className={`h-full w-full ${imageClassName}`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={alt}
                onLoad={onLoad}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#1D1C19] font-data text-[9px] uppercase tracking-[0.17em] text-[#A59F94]">
                AWAITING SPECIMEN
              </div>
            )}
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};
