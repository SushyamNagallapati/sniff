import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Camera } from "lucide-react";

import { SAMPLE_SCENES } from "../data/sampleScenes";
import type { SampleScene } from "../types/sniff";
import { sensoryAudio } from "../utils/audioSensory";
import { DURATION, EASE } from "../styles/motion";
import { useNaturalAspect } from "../utils/useNaturalAspect";
import { SHELL } from "../styles/layout";
import { Button } from "./Button";

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
    duration: shouldReduceMotion ? 0 : DURATION.slow,

    ease: EASE,
  };

  /** The scene shown in the hero. Everything about the card derives from it. */
  const featured = SAMPLE_SCENES[0];

  const featuredTitle = cleanTitle(featured.title);

  const featuredDiscoveries = featured.precomputedData.discoveries;

  const { aspectRatio: featuredAspectRatio, onLoad: onFeaturedLoad } =
    useNaturalAspect(featured.imageUrl);

  return (
    // App already owns the <main> landmark.
    <div className={SHELL}>
      {/* HERO */}
      {/*
       * No closing rule here: the featured card already
       * ends on one, and a second hairline a few
       * centimetres below it fences off empty space.
       */}
      <section className="pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
        {/* Editorial metadata */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : DURATION.slow,
            delay: 0.02,
          }}
          className="mb-6 flex items-center justify-between border-b border-[#D8D1C5] pb-3"
        >
          <span className="font-data text-[9px] uppercase tracking-[0.2em] text-[#43513B]">
            CANINE FIELD STUDY
          </span>

          <span className="hidden font-data text-[9px] uppercase tracking-[0.18em] text-faint sm:block">
            VISUAL FIELD ANALYSIS
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-11 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-16 xl:gap-20">
          {/* HERO COPY */}
          <div className="flex flex-col">
            {/*
             * Size: the floor is itself viewport-relative
             * below ~358px, where a flat 3.8rem makes "The
             * world is" wider than the line box. Above that
             * min() resolves to 3.8rem and the headline is
             * unchanged at every size that was already fine.
             *
             * Optical alignment: every box in this column
             * starts at the same x, but the ink does not.
             * Newsreader's lowercase d carries a much larger
             * left side bearing than T or the italic d.
             * Measured against the eyebrow rule and the body
             * copy (both ~0.76px of bearing), "different" sat
             * 1.75px right and "down here." 0.76px left, so
             * each carries a nudge below.
             *
             * The nudges are in em and hold at every size the
             * clamp produces, but they are specific to these
             * glyphs — re-measure if the copy changes.
             */}
            <h1 className="max-w-[680px] font-editorial text-[clamp(min(3.8rem,17vw),5.8vw,6.25rem)] font-light leading-[0.9] tracking-[-0.042em] text-[#1D1C19]">
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
                  className="block -ml-[0.021em]"
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
                  className="ml-[0.009em] block italic text-[#43513B]"
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
              className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-[9px] uppercase tracking-[0.15em] text-faint"
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
              <Button
                onClick={() => {
                  sensoryAudio.playClick();
                  onStartSniffing();
                }}
                className="gap-6"
              >
                Start sniffing
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-slow ease-brand group-hover:translate-x-1.5"
                />
              </Button>

              {/*
               * Quiet, not secondary. Here the camera is
               * the alternative to a dominant CTA; in the
               * upload zone it is an equal partner to
               * "Choose photo" and takes the bordered
               * variant. Different weight, one primitive.
               */}
              <Button
                variant="quiet"
                onClick={() => {
                  sensoryAudio.playClick();
                  onOpenCamera();
                }}
              >
                <Camera
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-slow ease-brand group-hover:-rotate-6"
                />
                Use camera
              </Button>
            </motion.div>
          </div>

          {/* FEATURED SAMPLE */}
          <motion.button
            type="button"
            onClick={() => openSample(featured)}
            aria-label={`Open ${featuredTitle} pre-analyzed sample`}
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
              duration: shouldReduceMotion ? 0 : DURATION.slow,
              delay: 0.18,
              ease: EASE,
            }}
            className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-data text-[9px] uppercase tracking-[0.18em] text-[#43513B]">
                PRE-ANALYZED SAMPLE
              </span>

              <span className="font-data text-[9px] uppercase tracking-[0.15em] text-faint">
                FIELD SPECIMEN
              </span>
            </div>

            {/*
             * The card takes the photograph's own aspect
             * ratio so the markers below sit on the same
             * features they will sit on inside the report.
             */}
            <div
              className="relative overflow-hidden bg-[#E7E1D6]"
              style={{ aspectRatio: featuredAspectRatio }}
            >
              <img
                src={featured.imageUrl}
                alt={`${featuredTitle} sample scene`}
                onLoad={onFeaturedLoad}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover saturate-[0.92] transition-[transform,filter] duration-cinematic ease-ambient group-hover:scale-[1.028] group-hover:saturate-100"
              />

              {/* The featured scene's real discoveries, at their real coordinates. */}
              {featuredDiscoveries.map((discovery, index) => (
                <motion.span
                  key={`${discovery.label}-${index}`}
                  aria-hidden="true"
                  initial={{
                    opacity: 0,
                    scale: shouldReduceMotion ? 1 : 0.65,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : DURATION.base,
                    delay: shouldReduceMotion ? 0 : 0.72 + index * 0.06,
                    ease: EASE,
                  }}
                  style={{
                    left: `${discovery.location.x * 100}%`,
                    top: `${discovery.location.y * 100}%`,
                  }}
                  /*
                   * Same treatment as the report's markers —
                   * a light pin reads on bright grass and on
                   * dark trunks alike, and the card is one
                   * click from the report it previews.
                   */
                  className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/85 bg-[#F2EEE6]/95 font-data text-[9px] font-semibold text-[#1D1C19] shadow-[0_3px_12px_rgba(0,0,0,0.2)] transition-transform duration-slow ease-brand group-hover:scale-110"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
              ))}

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/0 transition-all duration-slow ease-brand group-hover:ring-black/10" />
            </div>

            <div className="flex items-center justify-between border-b border-[#D8D1C5] py-3">
              <div className="flex items-center gap-3">
                <span className="font-data text-[9px] text-[#43513B]">
                  FIG. 01
                </span>

                <span className="font-data text-[9px] uppercase tracking-[0.15em] text-[#716C63]">
                  {featuredTitle}
                </span>
              </div>

              <div className="flex items-center gap-2 font-data text-[9px] uppercase tracking-[0.14em] text-faint">
                <span>
                  {featuredDiscoveries.length}{" "}
                  {featuredDiscoveries.length === 1
                    ? "DISCOVERY"
                    : "DISCOVERIES"}
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-3 w-3 -translate-x-1 opacity-0 transition-[opacity,transform] duration-slow ease-brand group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
            </div>
          </motion.button>
        </div>
      </section>

      {/* SAMPLE SCENES */}
      {/*
       * No top padding: the hero's pb already owns the
       * break between these two sections. Both paying it
       * stacked 160px of dead space under the card.
       */}
      <section
        aria-labelledby="sample-scenes-heading"
        className="border-b border-[#D8D1C5] pb-16 lg:pb-20"
      >
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="font-data text-[9px] uppercase tracking-[0.2em] text-[#43513B]">
              FIELD INDEX / {String(SAMPLE_SCENES.length).padStart(2, "0")}{" "}
              {SAMPLE_SCENES.length === 1 ? "SCENE" : "SCENES"}
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
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#E7E1D6]">
                  <img
                    src={scene.imageUrl}
                    alt={cleanTitle(scene.title)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover saturate-[0.9] transition-[transform,filter] duration-cinematic ease-ambient group-hover:scale-[1.035] group-hover:saturate-100"
                  />

                  <div className="absolute inset-0 bg-[#1D1C19]/0 transition-colors duration-slow ease-brand group-hover:bg-[#1D1C19]/[0.035]" />

                  <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-3 items-center justify-center rounded-full bg-[#F6F3EC] text-[#43513B] opacity-0 shadow-sm transition-[opacity,transform] duration-slow ease-brand group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="mt-3 border-t border-[#C1BAAE] pt-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-data text-[9px] text-[#43513B]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="font-editorial text-[1.65rem] font-light leading-none tracking-[-0.015em] text-[#2A2824] transition-colors duration-slow ease-brand group-hover:text-[#43513B]">
                        {cleanTitle(scene.title)}
                      </h3>
                    </div>

                    <span className="font-data text-[9px] uppercase tracking-[0.15em] text-faint">
                      SAMPLE
                    </span>
                  </div>

                  <p className="mt-3 min-h-[58px] font-sans text-[10px] leading-[1.65] text-[#716C63]">
                    {scene.description}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 font-data text-[9px] uppercase tracking-[0.15em] text-[#43513B]">
                    Open report
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-slow ease-brand group-hover:translate-x-1.5"
                    />
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
