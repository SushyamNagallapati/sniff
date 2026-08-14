import React, { useState } from "react";
import type { Discovery } from "../types/sniff";
import { sensoryAudio } from "../utils/audioSensory";
import { Info } from "lucide-react";

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

  const handleToggle = (toDogView: boolean) => {
    if (toDogView === isDogView) {
      return;
    }

    sensoryAudio.playModeSwitch(toDogView);
    onToggleView(toDogView);
  };

  return (
    <div className="relative flex flex-col border border-[#D5CEBF] bg-[#1A1917]">
      {/* Perspective controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302B] bg-[#191816] px-4 py-2 text-white">
        <span className="font-data text-xs uppercase tracking-wider text-[#A59F94]">
          PERSPECTIVE
        </span>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label="Scene perspective"
          >
            <button
              type="button"
              onClick={() => handleToggle(false)}
              aria-pressed={!isDogView}
              className={`px-3 py-1 font-data text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FBF9F5] ${
                !isDogView
                  ? "bg-[#33302B] text-[#FBF9F5]"
                  : "text-[#8C867A] hover:text-[#FBF9F5]"
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
              className={`px-3 py-1 font-data text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FBF9F5] ${
                isDogView
                  ? "bg-[#4A5839] text-[#FBF9F5]"
                  : "text-[#8C867A] hover:text-[#FBF9F5]"
              }`}
            >
              DOG VIEW
            </button>
          </div>

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
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#8C867A] transition hover:text-[#FBF9F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FBF9F5]"
            >
              <Info aria-hidden="true" className="h-3.5 w-3.5" />
            </button>

            {showInfo && (
              <div
                role="tooltip"
                className="absolute right-0 top-full z-30 mt-2 w-64 border border-[#33302B] bg-[#191816] p-3 font-sans text-xs leading-relaxed text-[#D5CEBF] shadow-lg"
              >
                A simplified visual approximation. SNIFF does not reproduce a
                dog&apos;s full sensory experience.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photograph */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A1917] sm:aspect-[16/10]">
        <div
          className={`relative h-full w-full transition-transform duration-500 ease-out ${
            isDogView ? "dog-vision-filter scale-[1.02]" : "scale-100"
          }`}
          style={{
            transformOrigin: isDogView ? "50% 85%" : "50% 50%",
          }}
        >
          <img
            src={imageUrl}
            alt="Scene being analyzed by SNIFF"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Discovery markers */}
        {discoveries.map((discovery, index) => {
          const posX = discovery.location.x * 100;
          const posY = discovery.location.y * 100;
          const isSelected = selectedIndex === index;

          return (
            <button
              key={`${discovery.label}-${index}`}
              type="button"
              onClick={() => {
                sensoryAudio.playDiscoveryPing(discovery.interestScore);
                onSelectDiscovery(index);
              }}
              aria-label={`Discovery ${index + 1}: ${discovery.label}`}
              aria-pressed={isSelected}
              style={{
                top: `${posY}%`,
                left: `${posX}%`,
              }}
              className={`absolute z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-data text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#191816] ${
                isSelected
                  ? "scale-110 border-white bg-[#4A5839] text-white shadow-sm"
                  : "border-[#D5CEBF] bg-[#FBF9F5] text-[#191816] hover:border-[#191816] hover:bg-white"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
};
