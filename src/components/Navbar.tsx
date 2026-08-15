import React from "react";
import { Volume2, VolumeX } from "lucide-react";

import { sensoryAudio } from "../utils/audioSensory";

interface NavbarProps {
  hasResult: boolean;
  onReset: () => void;
  onOpenUpload: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasResult,
  onReset,
  onOpenUpload,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#D8D1C5] bg-[#F6F3EC]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] max-w-[1320px] items-center justify-between px-5 sm:px-7 lg:px-10">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => {
              sensoryAudio.playClick();
              onReset();
            }}
            aria-label="Return to SNIFF home"
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-3"
          >
            <span className="font-editorial text-[27px] font-medium leading-none tracking-[-0.04em] text-[#1D1C19] transition-[letter-spacing,opacity] duration-300 group-hover:tracking-[-0.02em] group-hover:opacity-70">
              SNIFF
            </span>
          </button>

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-[#D8D1C5] sm:block"
          />

          <span className="hidden font-data text-[8px] uppercase tracking-[0.19em] text-[#716C63] sm:block">
            CANINE FIELD STUDY
          </span>
        </div>

        <div className="flex items-center gap-4">
          {hasResult && (
            <button
              type="button"
              onClick={() => {
                sensoryAudio.playClick();
                onOpenUpload();
              }}
              className="group relative py-1 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-[#555149] transition-colors hover:text-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
            >
              New scene
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#43513B] transition-all duration-300 group-hover:w-full" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={
              soundEnabled ? "Mute interface sounds" : "Enable interface sounds"
            }
            aria-pressed={soundEnabled}
            className="group flex h-8 w-8 items-center justify-center rounded-full text-[#716C63] transition-[background-color,color,transform] duration-200 hover:bg-[#EAE5DA] hover:text-[#43513B] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
          >
            {soundEnabled ? (
              <Volume2 aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <VolumeX aria-hidden="true" className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
