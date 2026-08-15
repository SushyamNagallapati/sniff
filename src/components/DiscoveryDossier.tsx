import React from "react";
import { motion, useReducedMotion } from "motion/react";

import type { Discovery } from "../types/sniff";
import { sensoryAudio } from "../utils/audioSensory";
import { DURATION, EASE } from "../styles/motion";

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
      className="flex h-full flex-col border border-[#DDD6CA] bg-[#FCFAF5]/60 p-6 sm:p-8"
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
                className={`relative flex h-7 w-7 items-center justify-center border font-data before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] text-[9px] font-medium transition-[background-color,color,border-color,transform] duration-fast active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                  isActive
                    ? "border-[#43513B] bg-[#43513B] text-[#FCFAF5]"
                    : "border-[#D8D1C5] bg-[#F2EEE6] text-[#716C63] hover:border-[#C1BAAE] hover:bg-[#EAE5DA] hover:text-[#1D1C19]"
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
          duration: shouldReduceMotion ? 0 : DURATION.fast,
          ease: EASE,
        }}
        className="flex flex-1 flex-col gap-6"
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

          <p className="mt-1 font-data text-[9px] uppercase tracking-[0.17em] text-[#716C63]">
            {current.category}
          </p>
        </div>

        {/* SNIFF score */}
        <div className="flex items-baseline justify-between border-y border-[#E7E1D6] py-4">
          <span className="font-data text-[9px] uppercase tracking-[0.16em] text-[#716C63]">
            SNIFF SCORE
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-[1.8rem] font-light leading-none text-[#1D1C19]">
              {current.interestScore}
            </span>

            <span className="font-data text-[8px] text-faint">/ 100</span>
          </div>
        </div>

        {/* Explanation */}
        <p className="font-sans text-[15px] leading-[1.75] text-[#4E4A43]">
          {current.explanation}
        </p>

        {/* Confidence — reads as the panel's footer, so it sits at the foot. */}
        <div className="mt-auto border-t border-[#E7E1D6] pt-4">
          <div className="flex items-center justify-between gap-4 font-data text-[9px] uppercase tracking-[0.15em] text-[#716C63]">
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
