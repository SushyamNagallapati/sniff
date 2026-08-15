import React, { useEffect, useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import { PhotoFrame } from "./PhotoFrame";

const LOADING_STAGES = [
  "Observing the scene...",
  "Finding points of interest...",
  "Building the field report...",
];

const STAGE_DURATION_MS = 1800;

interface LoadingStateProps {
  imageUrl?: string | null;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ imageUrl }) => {
  const [stageIndex, setStageIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();

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

  const isFinalStage = stageIndex === LOADING_STAGES.length - 1;

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

            <h2 className="mt-6 font-editorial text-3xl font-light text-[#1D1C19] transition-opacity duration-base">
              {LOADING_STAGES[stageIndex]}
            </h2>
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
