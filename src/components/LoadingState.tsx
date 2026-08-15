import React, { useEffect, useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import { DURATION, EASE } from "../styles/motion";
import { PhotoFrame } from "./PhotoFrame";

const LOADING_STAGES = [
  "Observing the scene...",
  "Finding points of interest...",
  "Building the field report...",
];

const STAGE_DURATION_MS = 1800;

/**
 * Analysis can take anywhere from a few seconds to the
 * full 45s timeout in App.tsx, but the 3 stages above
 * only script the first ~5.4s. Without this, a slow real
 * request visibly "finishes" its script and then sits on
 * static text for up to 40 more seconds — the pulsing bar
 * still moves, but a reader reads the frozen words as
 * stuck. These rotate the final stage's message instead
 * of holding it still.
 */
const FINAL_STAGE_MESSAGES = [
  "Building the field report...",
  "Cross-checking the discoveries...",
  "Still looking closely...",
];

const FINAL_MESSAGE_ROTATION_MS = 4000;

interface LoadingStateProps {
  imageUrl?: string | null;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ imageUrl }) => {
  const [stageIndex, setStageIndex] = useState(0);

  const [finalMessageIndex, setFinalMessageIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  const isFinalStage = stageIndex === LOADING_STAGES.length - 1;

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((previous) =>
        previous < LOADING_STAGES.length - 1 ? previous + 1 : previous,
      );
    }, STAGE_DURATION_MS);

    return () => {
      clearInterval(stageInterval);
    };
  }, []);

  useEffect(() => {
    if (!isFinalStage) {
      return;
    }

    const rotation = setInterval(() => {
      setFinalMessageIndex((previous) => previous + 1);
    }, FINAL_MESSAGE_ROTATION_MS);

    return () => {
      clearInterval(rotation);
    };
  }, [isFinalStage]);

  const stageText = isFinalStage
    ? FINAL_STAGE_MESSAGES[finalMessageIndex % FINAL_STAGE_MESSAGES.length]
    : LOADING_STAGES[stageIndex];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#D8D1C5] pb-4">
        <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#43513B]">
          FIELD REPORT / PROCESSING
        </span>
      </div>

      {/*
       * Same grid and same frame as the finished report,
       * so the photograph does not move when one replaces
       * the other.
       */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-7">
          <PhotoFrame
            imageUrl={imageUrl ?? null}
            alt="Scene under observation"
            header={
              <>
                <span className="flex h-6 items-center font-data text-[9px] uppercase tracking-[0.17em] text-[#A59F94]">
                  PERSPECTIVE
                </span>

                <span className="flex h-6 items-center font-data text-[9px] uppercase tracking-[0.14em] text-dark-faint">
                  Available when the report arrives
                </span>
              </>
            }
          />
        </div>

        <div className="flex min-h-[320px] flex-col justify-center border border-[#D8D1C5] bg-[#FCFAF5] p-8 sm:p-10 lg:col-span-5">
          {/*
           * Only the stage text is live. Announcing the
           * whole section re-read the photograph on every
           * stage change.
           */}
          <div aria-live="polite">
            <span className="font-data text-xs uppercase tracking-widest text-[#716C63]">
              STAGE 0{stageIndex + 1} OF 03
            </span>

            {/*
             * Keyed on the text itself: whichever value
             * changes it — the stage advancing, or a final
             * -stage phrase rotating — remounts and
             * crossfades, instead of a class that implied
             * a transition nothing ever triggered.
             */}
            <motion.h2
              key={stageText}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 6,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : DURATION.fast,
                ease: EASE,
              }}
              className="mt-6 font-editorial text-3xl font-light text-[#1D1C19]"
            >
              {stageText}
            </motion.h2>
          </div>

          <p className="mt-3 font-sans text-xs text-[#716C63]">
            Analyzing visible boundaries, surfaces, vegetation, and lighting.
          </p>

          {/*
           * The last segment keeps breathing rather than
           * settling. A bar that reads as complete while
           * the request is still open is a lie.
           */}
          <div className="mt-8 flex items-center gap-2">
            {LOADING_STAGES.map((stage, index) => {
              const isCurrent = index === stageIndex;

              const isComplete = index < stageIndex;

              if (isCurrent && isFinalStage && !shouldReduceMotion) {
                return (
                  <motion.div
                    key={stage}
                    animate={{ opacity: [1, 0.35, 1] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-1 flex-1 bg-[#43513B]"
                  />
                );
              }

              return (
                <div
                  key={stage}
                  className={`h-1 flex-1 transition-all duration-base ${
                    isCurrent
                      ? "bg-[#43513B]"
                      : isComplete
                        ? "bg-[#1D1C19]"
                        : "bg-[#E7E1D6]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
