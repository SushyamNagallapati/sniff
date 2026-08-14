import React from 'react';
import { ArrowRight, Camera } from 'lucide-react';
import { SAMPLE_SCENES } from '../data/sampleScenes';
import { SampleScene } from '../types/sniff';
import { sensoryAudio } from '../utils/audioSensory';

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
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
      {/* Top Editorial Rule & Index */}
      <div className="mb-8 border-b border-[#E6E1D8] pb-3 text-[#7A7468]">
        <span className="font-data text-xs uppercase tracking-widest text-[#4A5839]">
          FIELD 001
        </span>
      </div>

      {/* Hero Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* Left Column: Typography & Action */}
        <div className="lg:col-span-7">
          <h1 className="font-editorial text-5xl leading-[1.05] font-light tracking-tight text-[#191816] sm:text-6xl md:text-7xl">
            THE WORLD <br />
            IS DIFFERENT <br />
            <span className="italic text-[#4A5839]">DOWN HERE.</span>
          </h1>

          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-[#524E46] sm:text-lg">
            Explore a scene from a dog-oriented perspective. Gemini identifies
            visible movement, surfaces, vegetation, people, and places that may
            be worth investigating.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                sensoryAudio.playClick();
                onStartSniffing();
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-[#191816] px-8 py-3.5 font-data text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] shadow-xs transition-all hover:bg-[#4A5839]"
            >
              <span>START SNIFFING</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                sensoryAudio.playClick();
                onOpenCamera();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D5CEBF] bg-[#FAF8F3] px-6 py-3.5 font-data text-xs font-medium uppercase tracking-wider text-[#191816] transition-all hover:border-[#B8B09F] hover:bg-[#EAE4D8]"
            >
              <Camera className="h-3.5 w-3.5 text-[#4A5839]" />
              <span>USE CAMERA</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Figure - sits directly in composition */}
        <div className="lg:col-span-5">
          <div className="relative">
            {/* Minimal Figure Image */}
            <div
              onClick={() => {
                sensoryAudio.playClick();
                onSelectSample(SAMPLE_SCENES[0]);
              }}
              className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden border border-[#D5CEBF] bg-[#EBE6DC]"
            >
              <img
                src={SAMPLE_SCENES[0].imageUrl}
                alt="City Park specimen preview"
                className="h-full w-full object-cover grayscale-[15%] transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* Discovery marker pins on preview */}
              <div className="absolute top-[55%] left-[32%] -translate-x-1/2 -translate-y-1/2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#4A5839] font-data text-[11px] font-bold text-white shadow-xs">
                  01
                </span>
              </div>
              <div className="absolute top-[72%] left-[58%] -translate-x-1/2 -translate-y-1/2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#856128] font-data text-[10px] font-bold text-white shadow-xs">
                  02
                </span>
              </div>
            </div>

            {/* Minimal figure caption metadata with subtle PRE-ANALYZED SAMPLE indicator */}
            <div className="mt-3 flex items-baseline justify-between font-data text-xs text-[#7A7468]">
              <div>
                <span className="font-semibold text-[#191816]">FIG. 01</span>
                <span className="mx-2 text-[#D5CEBF]">&middot;</span>
                <span>CITY PARK</span>
                <span className="mx-2 text-[#D5CEBF]">&middot;</span>
                <span className="text-[10px] uppercase tracking-wider text-[#7A7468]">PRE-ANALYZED SAMPLE</span>
              </div>
              <span className="text-[#4A5839]">5 DISCOVERIES</span>
            </div>
          </div>
        </div>
      </div>

      {/* SAMPLE SCENES - Deliberately Asymmetric Editorial Composition */}
      <div className="mt-14 sm:mt-20 border-t border-[#E6E1D8] pt-6 sm:pt-8">
        <div className="mb-6 sm:mb-8 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-data text-xs font-semibold uppercase tracking-widest text-[#191816]">
              SAMPLE SCENES
            </h2>
            <span className="font-data text-[10px] uppercase tracking-wider text-[#7A7468]">
              [PRE-ANALYZED]
            </span>
          </div>
          <span className="font-data text-xs text-[#7A7468]">SELECT TO EXPLORE</span>
        </div>

        {/* Asymmetrical 3-scene layout: Scene 1 Large Left / Scene 2 Smaller Right / Scene 3 Full Width Below */}
        <div className="space-y-8 sm:space-y-10">
          {/* Row 1: Scene 01 (Large Left) & Scene 02 (Aligned Right) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            {/* Scene 01: Large Left */}
            <div className="lg:col-span-7">
              <div
                onClick={() => {
                  sensoryAudio.playClick();
                  onSelectSample(SAMPLE_SCENES[0]);
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/9] w-full overflow-hidden border border-[#D5CEBF] bg-[#EBE6DC]">
                  <img
                    src={SAMPLE_SCENES[0].imageUrl}
                    alt={SAMPLE_SCENES[0].title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="mt-2.5 flex items-baseline justify-between">
                  <div>
                    <span className="font-data text-xs font-semibold text-[#4A5839]">01</span>
                    <h3 className="inline ml-2 font-editorial text-xl text-[#191816] group-hover:text-[#4A5839] sm:text-2xl">
                      CITY PARK
                    </h3>
                  </div>
                  <span className="font-data text-[10px] uppercase tracking-wider text-[#7A7468]">
                    PRE-ANALYZED SAMPLE
                  </span>
                </div>

                <p className="mt-1 font-sans text-xs leading-relaxed text-[#635E55] sm:text-sm">
                  {SAMPLE_SCENES[0].description}
                </p>

                <div className="mt-1.5 flex items-center gap-1 font-data text-xs font-medium text-[#4A5839]">
                  <span>EXPLORE</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Scene 02: Smaller Aligned Right */}
            <div className="lg:col-span-5 lg:pl-2">
              <div
                onClick={() => {
                  sensoryAudio.playClick();
                  onSelectSample(SAMPLE_SCENES[1]);
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] w-full overflow-hidden border border-[#D5CEBF] bg-[#EBE6DC]">
                  <img
                    src={SAMPLE_SCENES[1].imageUrl}
                    alt={SAMPLE_SCENES[1].title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="mt-2.5 flex items-baseline justify-between">
                  <div>
                    <span className="font-data text-xs font-semibold text-[#4A5839]">02</span>
                    <h3 className="inline ml-2 font-editorial text-lg text-[#191816] group-hover:text-[#4A5839] sm:text-xl">
                      WOODLAND TRAIL
                    </h3>
                  </div>
                  <span className="font-data text-[10px] uppercase tracking-wider text-[#7A7468]">
                    PRE-ANALYZED SAMPLE
                  </span>
                </div>

                <p className="mt-1 font-sans text-xs leading-relaxed text-[#635E55] sm:text-sm">
                  {SAMPLE_SCENES[1].description}
                </p>

                <div className="mt-1.5 flex items-center gap-1 font-data text-xs font-medium text-[#4A5839]">
                  <span>EXPLORE</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Scene 03 Wide Horizontal Image */}
          <div className="border-t border-[#F0ECE2] pt-6 sm:pt-8">
            <div
              onClick={() => {
                sensoryAudio.playClick();
                onSelectSample(SAMPLE_SCENES[2]);
              }}
              className="group cursor-pointer grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center lg:gap-8"
            >
              <div className="lg:col-span-8">
                <div className="aspect-[24/9] w-full overflow-hidden border border-[#D5CEBF] bg-[#EBE6DC]">
                  <img
                    src={SAMPLE_SCENES[2].imageUrl}
                    alt={SAMPLE_SCENES[2].title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-data text-xs font-semibold text-[#4A5839]">03</span>
                    <h3 className="inline ml-2 font-editorial text-xl text-[#191816] group-hover:text-[#4A5839] sm:text-2xl">
                      HOME KITCHEN
                    </h3>
                  </div>
                  <span className="font-data text-[10px] uppercase tracking-wider text-[#7A7468]">
                    PRE-ANALYZED SAMPLE
                  </span>
                </div>

                <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#635E55] sm:text-sm">
                  {SAMPLE_SCENES[2].description}
                </p>

                <div className="mt-2 flex items-center gap-1 font-data text-xs font-medium text-[#4A5839]">
                  <span>EXPLORE</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS - Minimal text columns */}
      <div className="mt-14 sm:mt-20 border-t border-[#E6E1D8] pt-6 sm:pt-8">
        <div className="mb-6 sm:mb-8 flex items-baseline justify-between">
          <h2 className="font-data text-xs font-semibold uppercase tracking-widest text-[#191816]">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          {/* Step 01 */}
          <div className="space-y-2 border-t border-[#E6E1D8] pt-3 sm:pt-4">
            <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#4A5839]">
              01 LOOK
            </span>
            <p className="font-sans text-sm leading-relaxed text-[#524E46]">
              Gemini examines visible elements in the scene.
            </p>
          </div>

          {/* Step 02 */}
          <div className="space-y-2 border-t border-[#E6E1D8] pt-3 sm:pt-4">
            <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#4A5839]">
              02 INTERPRET
            </span>
            <p className="font-sans text-sm leading-relaxed text-[#524E46]">
              SNIFF ranks features that may matter from a dog-oriented perspective.
            </p>
          </div>

          {/* Step 03 */}
          <div className="space-y-2 border-t border-[#E6E1D8] pt-3 sm:pt-4">
            <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#4A5839]">
              03 EXPLORE
            </span>
            <p className="font-sans text-sm leading-relaxed text-[#524E46]">
              The scene becomes an interactive field report with discoveries and a Sniff Quest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
