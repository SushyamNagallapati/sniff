import React, { useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Info } from "lucide-react";

import type { Discovery } from "../types/sniff";
import { sensoryAudio } from "../utils/audioSensory";
import { DURATION, EASE } from "../styles/motion";
import { PhotoFrame } from "./PhotoFrame";

interface ImageViewportProps {
  imageUrl: string;
  discoveries: Discovery[];
  selectedIndex: number;
  onSelectDiscovery: (index: number) => void;
  isDogView: boolean;
  onToggleView: (isDog: boolean) => void;
}

export const ImageViewport: React.FC<ImageViewportProps> = ({
  imageUrl,
  discoveries,
  selectedIndex,
  onSelectDiscovery,
  isDogView,
  onToggleView,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (toDogView: boolean) => {
    if (toDogView === isDogView) {
      return;
    }

    sensoryAudio.playModeSwitch(toDogView);

    onToggleView(toDogView);
  };

  return (
    <PhotoFrame
      imageUrl={imageUrl}
      alt="Scene being analyzed by SNIFF"
      imageClassName={isDogView ? "dog-vision-filter" : ""}
      scale={isDogView ? 1.02 : 1}
      transformOrigin={isDogView ? "50% 85%" : "50% 50%"}
      header={
        <>
          <span className="flex h-6 items-center font-data text-[9px] uppercase tracking-[0.17em] text-[#A59F94]">
            PERSPECTIVE
          </span>

          <div className="flex h-6 items-center gap-3">
            <div
              className="flex items-center gap-1"
              role="group"
              aria-label="Scene perspective"
            >
              <button
                type="button"
                onClick={() => handleToggle(false)}
                aria-pressed={!isDogView}
                className={`px-3 py-1 font-data text-[9px] uppercase tracking-[0.14em] transition-colors duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCFAF5] ${
                  !isDogView
                    ? "bg-[#33302B] text-[#FCFAF5]"
                    : "text-dark-faint hover:text-[#FCFAF5]"
                }`}
              >
                ORIGINAL
              </button>

              <span aria-hidden="true" className="text-[#4D4942]">
                /
              </span>

              <button
                type="button"
                onClick={() => handleToggle(true)}
                aria-pressed={isDogView}
                className={`px-3 py-1 font-data text-[9px] uppercase tracking-[0.14em] transition-colors duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCFAF5] ${
                  isDogView
                    ? "bg-[#43513B] text-[#FCFAF5]"
                    : "text-dark-faint hover:text-[#FCFAF5]"
                }`}
              >
                DOG VIEW
              </button>
            </div>

            {/* Dog View info */}
            <div
              className="relative"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
            >
              <button
                type="button"
                onClick={() => setShowInfo((current) => !current)}
                aria-label="About Dog View"
                aria-expanded={showInfo}
                className="relative flex h-6 w-6 items-center justify-center rounded-full text-dark-faint before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] transition-colors duration-fast hover:text-[#FCFAF5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCFAF5]"
              >
                <Info aria-hidden="true" className="h-3.5 w-3.5" />
              </button>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    role="tooltip"
                    initial={{
                      opacity: 0,
                      y: shouldReduceMotion ? 0 : 4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: shouldReduceMotion ? 0 : 2,
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : DURATION.fast,
                    }}
                    className="absolute right-0 top-full z-30 mt-2 w-64 border border-[#38352F] bg-[#1D1C19] p-3 font-sans text-xs leading-relaxed text-[#D8D1C5] shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                  >
                    A simplified visual approximation. SNIFF does not reproduce
                    a dog&apos;s full sensory experience.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      }
    >
      {/* Discovery markers */}
      {discoveries.map((discovery, index) => {
        const posX = discovery.location.x * 100;

        const posY = discovery.location.y * 100;

        const isSelected = selectedIndex === index;

        return (
          <motion.button
            key={`${discovery.label}-${index}`}
            type="button"
            onClick={() => {
              sensoryAudio.playDiscoveryPing(discovery.interestScore);

              onSelectDiscovery(index);
            }}
            aria-label={`Discovery ${index + 1}: ${discovery.label}`}
            aria-pressed={isSelected}
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.55,
            }}
            animate={{
              opacity: 1,
              scale: isSelected ? 1.1 : 1,
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: isSelected ? 1.14 : 1.08,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.96,
                  }
            }
            transition={{
              opacity: {
                duration: shouldReduceMotion ? 0 : DURATION.fast,
                delay: shouldReduceMotion ? 0 : index * 0.06,
              },

              scale: {
                duration: shouldReduceMotion ? 0 : DURATION.base,
                delay: shouldReduceMotion ? 0 : index * 0.06,
                ease: EASE,
              },
            }}
            style={{
              top: `${posY}%`,
              left: `${posX}%`,
            }}
            className={`absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-data before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
              isSelected
                ? "border-white bg-[#43513B] text-white shadow-[0_4px_16px_rgba(0,0,0,0.32)]"
                : "border-white/85 bg-[#F2EEE6]/95 text-[#1D1C19] shadow-[0_3px_12px_rgba(0,0,0,0.2)]"
            }`}
          >
            {String(index + 1).padStart(2, "0")}

            {isSelected && (
              <motion.span
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  scale: 0.75,
                }}
                animate={{
                  opacity: [0, 0.28, 0],
                  scale: [0.8, 1.45, 1.75],
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : DURATION.slow,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute inset-0 rounded-full border border-white/70"
              />
            )}
          </motion.button>
        );
      })}
    </PhotoFrame>
  );
};
