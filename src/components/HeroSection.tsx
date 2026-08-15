import React from "react";
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
  const openSample = (scene: SampleScene) => {
    sensoryAudio.playClick();
    onSelectSample(scene);
  };

  const cleanTitle = (title: string) =>
    title
      .replace(/^\d+\s*[—-]\s*/, "")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <main className="mx-auto w-full max-w-[1320px] px-5 sm:px-7 lg:px-10">
      {/* HERO */}
      <section className="border-b border-[#D8D1C5] pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
        <div className="mb-6 flex items-center justify-between border-b border-[#D8D1C5] pb-3">
          <span className="font-data text-[8px] uppercase tracking-[0.2em] text-[#43513B] sm:text-[9px]">
            CANINE FIELD STUDY
          </span>

          <span className="hidden font-data text-[8px] uppercase tracking-[0.18em] text-[#918B81] sm:block">
            MULTIMODAL OBSERVATION
          </span>
        </div>

        <div className="grid grid-cols-1 gap-11 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-16 xl:gap-20">
          {/* HERO COPY */}
          <div className="flex flex-col">
            <h1 className="max-w-[690px] font-editorial text-[clamp(4rem,6.4vw,6.9rem)] font-light leading-[0.87] tracking-[-0.055em] text-[#1D1C19]">
              <span className="block">The world is</span>

              <span className="block">different</span>

              <span className="block italic text-[#43513B]">down here.</span>
            </h1>

            <p className="mt-8 max-w-[585px] font-sans text-[15px] leading-[1.8] text-[#625D55] sm:text-[16px]">
              See an everyday environment from a lower, dog-oriented
              perspective. SNIFF examines visible details that may otherwise
              pass unnoticed.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-[8px] uppercase tracking-[0.15em] text-[#8C867C]">
              <span>Visible evidence only</span>

              <span aria-hidden="true" className="text-[#C1BAAE]">
                /
              </span>

              <span>No scent detection</span>

              <span aria-hidden="true" className="text-[#C1BAAE]">
                /
              </span>

              <span>No behavioral claims</span>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-6">
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
            </div>
          </div>

          {/* FEATURED SAMPLE */}
          <button
            type="button"
            onClick={() => openSample(SAMPLE_SCENES[0])}
            aria-label="Open City Park pre-analyzed sample"
            className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-4"
          >
            <div className="relative overflow-hidden bg-[#E7E1D6]">
              <div className="aspect-[5/4]">
                <img
                  src={SAMPLE_SCENES[0].imageUrl}
                  alt="City Park sample scene"
                  className="h-full w-full object-cover saturate-[0.94] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.018] group-hover:saturate-100"
                />
              </div>

              <span className="absolute left-0 top-0 bg-[#F6F3EC] px-3 py-2 font-data text-[8px] uppercase tracking-[0.18em] text-[#43513B]">
                PRE-ANALYZED SAMPLE
              </span>

              <span className="absolute left-[34%] top-[57%] flex h-7 w-7 items-center justify-center rounded-full border border-[#FCFAF5]/90 bg-[#43513B] font-data text-[8px] font-medium text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                01
              </span>

              <span className="absolute left-[60%] top-[73%] flex h-6 w-6 items-center justify-center rounded-full border border-[#FCFAF5]/90 bg-[#1D1C19]/80 font-data text-[7px] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                02
              </span>

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
          </button>
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
