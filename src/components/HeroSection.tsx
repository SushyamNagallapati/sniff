import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Camera } from "lucide-react";

import { SAMPLE_SCENES } from "../data/sampleScenes";
import type { SampleScene } from "../types/sniff";
import { sensoryAudio } from "../utils/audioSensory";

interface HeroSectionProps {
  onStartSniffing: () => void;
  onSelectSample: (scene: SampleScene) => void;
  onOpenCamera: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartSniffing,
  onSelectSample,
  onOpenCamera,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const openSample = (scene: SampleScene) => {
    sensoryAudio.playClick();
    onSelectSample(scene);
  };

  const cleanTitle = (title: string) =>
    title
      .replace(/^\d+\s*[—-]\s*/, "")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());

  const reveal = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const revealTransition = {
    duration: shouldReduceMotion ? 0 : 0.65,

    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <main className="mx-auto w-full max-w-[1320px] px-5 sm:px-7 lg:px-10">
      {/* HERO */}
      <section className="border-b border-[#D8D1C5] pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
        {/* Editorial metadata */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.55,
            delay: 0.02,
          }}
          className="mb-6 flex items-center justify-between border-b border-[#D8D1C5] pb-3"
        >
          <span className="font-data text-[8px] uppercase tracking-[0.2em] text-[#43513B] sm:text-[9px]">
            CANINE FIELD STUDY
          </span>

          <span className="hidden font-data text-[8px] uppercase tracking-[0.18em] text-[#918B81] sm:block">
            VISUAL FIELD ANALYSIS
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-11 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-16 xl:gap-20">
          {/* HERO COPY */}
          <div className="flex flex-col">
            <h1 className="max-w-[680px] font-editorial text-[clamp(3.8rem,5.8vw,6.25rem)] font-light leading-[0.9] tracking-[-0.042em] text-[#1D1C19]">
              <span className="block pb-[0.04em]">
                <motion.span
                  className="block"
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    ...revealTransition,
                    delay: 0.08,
                  }}
                >
                  The world is
                </motion.span>
              </span>

              <span className="block pb-[0.04em]">
                <motion.span
                  className="block"
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    ...revealTransition,
                    delay: 0.16,
                  }}
                >
                  different
                </motion.span>
              </span>

              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block italic text-[#43513B]"
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    ...revealTransition,
                    delay: 0.24,
                  }}
                >
                  down here.
                </motion.span>
              </span>
            </h1>

            {/* Intro */}
            <motion.p
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ...revealTransition,
                delay: 0.34,
              }}
              className="mt-8 max-w-[520px] font-sans text-[15px] leading-[1.75] text-[#625D55] sm:text-[16px]"
            >
              See an everyday environment from a lower, dog-oriented
              perspective. SNIFF surfaces visible details, boundaries, textures,
              movement, and spatial cues that might otherwise pass unnoticed.
            </motion.p>

            {/* Grounding principles */}
            <motion.div
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ...revealTransition,
                delay: 0.42,
              }}
              className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-[8px] uppercase tracking-[0.15em] text-[#8C867C]"
            >
              <span>Visible evidence only</span>

              <span aria-hidden="true" className="text-[#C1BAAE]">
                /
              </span>

              <span>No scent detection</span>

              <span aria-hidden="true" className="text-[#C1BAAE]">
                /
              </span>

              <span>No behavioral claims</span>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ...revealTransition,
                delay: 0.5,
              }}
              className="mt-9 flex flex-wrap items-center gap-6"
            >
              <button
                type="button"
                onClick={() => {
                  sensoryAudio.playClick();
                  onStartSniffing();
                }}
                className="group inline-flex min-h-12 items-center gap-6 bg-[#1D1C19] px-6 py-3 font-data text-[9px] font-semibold uppercase tracking-[0.17em] text-[#FCFAF5] transition-[background-color,transform] duration-200 hover:-translate-y-[1px] hover:bg-[#43513B] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-3"
              >
                Start sniffing
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  sensoryAudio.playClick();
                  onOpenCamera();
                }}
                className="group relative inline-flex min-h-12 items-center gap-3 px-1 py-3 font-data text-[9px] font-medium uppercase tracking-[0.17em] text-[#4E4A43] transition-colors hover:text-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
              >
                <Camera
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-6"
                />
                Use camera
                <span className="absolute bottom-2 left-1 h-px w-[calc(100%-0.5rem)] origin-left scale-x-100 bg-[#AAA296] transition-transform duration-300 group-hover:scale-x-0" />
              </button>
            </motion.div>
          </div>

          {/* FEATURED SAMPLE */}
          <motion.button
            type="button"
            onClick={() => openSample(SAMPLE_SCENES[0])}
            aria-label="Open City Park pre-analyzed sample"
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.985,
              y: shouldReduceMotion ? 0 : 14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.8,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-data text-[8px] uppercase tracking-[0.18em] text-[#43513B]">
                PRE-ANALYZED SAMPLE
              </span>

              <span className="font-data text-[7px] uppercase tracking-[0.15em] text-[#918B81]">
                FIELD SPECIMEN
              </span>
            </div>

            <div className="relative overflow-hidden bg-[#E7E1D6]">
              <div className="aspect-[5/4] overflow-hidden">
                <img
                  src={SAMPLE_SCENES[0].imageUrl}
                  alt="City Park sample scene"
                  className="h-full w-full object-cover saturate-[0.94] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.018] group-hover:saturate-100"
                />
              </div>

              {/* Marker 01 */}
              <motion.span
                initial={{
                  opacity: 0,
                  scale: shouldReduceMotion ? 1 : 0.65,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute left-[34%] top-[57%] flex h-7 w-7 items-center justify-center rounded-full border border-[#FCFAF5] bg-[#35412F] font-data text-[8px] font-medium text-white shadow-[0_3px_12px_rgba(0,0,0,0.24)] transition-transform duration-300 group-hover:scale-110"
              >
                01
              </motion.span>

              {/* Marker 02 */}
              <motion.span
                initial={{
                  opacity: 0,
                  scale: shouldReduceMotion ? 1 : 0.65,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: 0.78,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute left-[60%] top-[73%] flex h-6 w-6 items-center justify-center rounded-full border border-[#FCFAF5] bg-[#1D1C19] font-data text-[7px] font-medium text-white shadow-[0_3px_12px_rgba(0,0,0,0.26)] transition-transform duration-300 group-hover:scale-110"
              >
                02
              </motion.span>

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/0 transition-all duration-300 group-hover:ring-black/10" />
            </div>

            <div className="flex items-center justify-between border-b border-[#D8D1C5] py-3">
              <div className="flex items-center gap-3">
                <span className="font-data text-[8px] text-[#43513B]">
                  FIG. 01
                </span>

                <span className="font-data text-[8px] uppercase tracking-[0.15em] text-[#716C63]">
                  CITY PARK
                </span>
              </div>

              <div className="flex items-center gap-2 font-data text-[7px] uppercase tracking-[0.14em] text-[#8C867C]">
                <span>5 DISCOVERIES</span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
            </div>
          </motion.button>
        </div>
      </section>

      {/* SAMPLE SCENES */}
      <section
        aria-labelledby="sample-scenes-heading"
        className="border-b border-[#D8D1C5] py-16 lg:py-20"
      >
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="font-data text-[8px] uppercase tracking-[0.2em] text-[#43513B]">
              FIELD INDEX / 03 SCENES
            </span>

            <h2
              id="sample-scenes-heading"
              className="mt-2 font-editorial text-[2.55rem] font-light leading-none tracking-[-0.025em] text-[#1D1C19]"
            >
              Pre-analyzed scenes
            </h2>
          </div>

          <p className="max-w-[370px] font-sans text-xs leading-5 text-[#716C63] sm:text-right">
            Explore the interface without uploading a photograph. Sample reports
            are clearly separated from live analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-3">
          {SAMPLE_SCENES.map((scene, index) => (
            <article key={scene.id} className="group">
              <button
                type="button"
                onClick={() => openSample(scene)}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#E7E1D6]">
                  <img
                    src={scene.imageUrl}
                    alt={cleanTitle(scene.title)}
                    className="h-full w-full object-cover saturate-[0.92] transition-[transform,filter] duration-[850ms] ease-out group-hover:scale-[1.025] group-hover:saturate-100"
                  />

                  <div className="absolute inset-0 bg-[#1D1C19]/0 transition-colors duration-300 group-hover:bg-[#1D1C19]/[0.035]" />

                  <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-[#F6F3EC] text-[#43513B] opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="mt-3 border-t border-[#CBC4B8] pt-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-data text-[8px] text-[#43513B]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="font-editorial text-[1.65rem] font-light leading-none tracking-[-0.015em] text-[#2A2824] transition-colors duration-300 group-hover:text-[#43513B]">
                        {cleanTitle(scene.title)}
                      </h3>
                    </div>

                    <span className="font-data text-[7px] uppercase tracking-[0.15em] text-[#918B81]">
                      SAMPLE
                    </span>
                  </div>

                  <p className="mt-3 min-h-[58px] font-sans text-[11px] leading-[1.65] text-[#716C63]">
                    {scene.description}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 font-data text-[8px] uppercase tracking-[0.15em] text-[#43513B]">
                    Open report
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
