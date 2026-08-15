import React from "react";
import { motion, useReducedMotion } from "motion/react";

import type { Discovery } from "../types/sniff";
import { sensoryAudio } from "../utils/audioSensory";

interface DiscoveryDossierProps {
  discoveries: Discovery[];
  selectedIndex: number;
  onSelectDiscovery: (index: number) => void;
}

export const DiscoveryDossier: React.FC<DiscoveryDossierProps> = ({
  discoveries,
  selectedIndex,
  onSelectDiscovery,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const current = discoveries[selectedIndex];

  if (!current) {
    return null;
  }

  return (
    <section
      className="flex flex-col border border-[#DDD6CA] bg-[#FCFAF5]/60 p-6 sm:p-8"
      aria-labelledby="selected-discovery-title"
    >
      {/* Discovery selector */}
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#DDD6CA] pb-4">
        <span className="font-data text-[9px] uppercase tracking-[0.18em] text-[#716C63]">
          DISCOVERIES
        </span>

        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Select discovery"
        >
          {discoveries.map((discovery, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={`${discovery.label}-${index}`}
                type="button"
                onClick={() => {
                  sensoryAudio.playDiscoveryPing(discovery.interestScore);

                  onSelectDiscovery(index);
                }}
                aria-label={`Discovery ${index + 1}: ${discovery.label}`}
                aria-pressed={isActive}
                className={`flex h-7 w-7 items-center justify-center border font-data text-[9px] font-medium transition-[background-color,color,border-color,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFAF5] ${
                  isActive
                    ? "border-[#43513B] bg-[#43513B] text-[#FCFAF5]"
                    : "border-[#E2DCD1] bg-[#F2EEE6] text-[#817B71] hover:border-[#BEB6A9] hover:bg-[#EAE5DC] hover:text-[#1D1C19]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected discovery */}
      <motion.div
        key={`${current.label}-${selectedIndex}`}
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 7,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.26,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-data text-[11px] font-semibold text-[#43513B]">
              {String(selectedIndex + 1).padStart(2, "0")} /
            </span>

            <h2
              id="selected-discovery-title"
              className="font-editorial text-2xl font-light uppercase tracking-[-0.025em] text-[#1D1C19] sm:text-3xl"
            >
              {current.label}
            </h2>
          </div>

          <p className="mt-1 font-data text-[9px] uppercase tracking-[0.17em] text-[#817B71]">
            {current.category}
          </p>
        </div>

        {/* SNIFF score */}
        <div className="flex items-baseline justify-between border-y border-[#E5DFD5] py-4">
          <span className="font-data text-[9px] uppercase tracking-[0.16em] text-[#817B71]">
            SNIFF SCORE
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-[1.8rem] font-light leading-none text-[#1D1C19]">
              {current.interestScore}
            </span>

            <span className="font-data text-[8px] text-[#918B81]">/ 100</span>
          </div>
        </div>

        {/* Explanation */}
        <p className="font-sans text-[15px] leading-[1.75] text-[#4E4A43]">
          {current.explanation}
        </p>

        {/* Confidence */}
        <div className="border-t border-[#E5DFD5] pt-4">
          <div className="flex items-center justify-between gap-4 font-data text-[9px] uppercase tracking-[0.15em] text-[#817B71]">
            <span>MODEL CONFIDENCE</span>

            <span className="text-[#625D55]">
              {Math.round(current.confidence * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
