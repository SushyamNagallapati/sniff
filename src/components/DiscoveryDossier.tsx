import React from "react";
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
  const current = discoveries[selectedIndex];

  if (!current) {
    return null;
  }

  return (
    <section
      className="flex flex-col border border-[#D5CEBF] bg-white p-6 sm:p-8"
      aria-labelledby="selected-discovery-title"
    >
      {/* Discovery selector */}
      <div className="mb-6 flex items-center justify-between border-b border-[#E6E1D8] pb-4">
        <span className="font-data text-xs uppercase tracking-widest text-[#7A7468]">
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
                className={`flex h-7 w-7 items-center justify-center font-data text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-[#4A5839] font-bold text-white"
                    : "bg-[#FAF8F3] text-[#7A7468] hover:bg-[#EAE4D8] hover:text-[#191816]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected discovery */}
      <div key={`${current.label}-${selectedIndex}`} className="space-y-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-data text-sm font-bold text-[#4A5839]">
              {String(selectedIndex + 1).padStart(2, "0")} /
            </span>

            <h2
              id="selected-discovery-title"
              className="font-editorial text-2xl uppercase tracking-tight text-[#191816] sm:text-3xl"
            >
              {current.label}
            </h2>
          </div>

          <p className="mt-1 font-data text-xs uppercase tracking-widest text-[#7A7468]">
            {current.category}
          </p>
        </div>

        {/* SNIFF score */}
        <div className="flex items-baseline justify-between border-y border-[#F0ECE2] py-3">
          <span className="font-data text-xs uppercase tracking-wider text-[#7A7468]">
            SNIFF SCORE
          </span>

          <div className="flex items-baseline gap-1">
            <span className="font-editorial text-2xl font-normal text-[#191816]">
              {current.interestScore}
            </span>

            <span className="font-data text-xs text-[#8C867A]">/ 100</span>
          </div>
        </div>

        {/* Explanation */}
        <p className="font-sans text-base leading-relaxed text-[#423E37]">
          {current.explanation}
        </p>

        {/* Confidence */}
        <div className="border-t border-[#F0ECE2] pt-4">
          <div className="flex items-center justify-between gap-4 font-data text-xs uppercase tracking-wider text-[#7A7468]">
            <span>MODEL CONFIDENCE</span>

            <span>{Math.round(current.confidence * 100)}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
