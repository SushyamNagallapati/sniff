import React from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E6E1D8] bg-[#FBF9F5]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:py-3.5">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              sensoryAudio.playClick();
              onReset();
            }}
            className="group flex items-baseline gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2"
            aria-label="Return to SNIFF home"
          >
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#1A1917] transition-opacity group-hover:opacity-80">
              SNIFF
            </span>

            <span className="font-data text-xs font-medium tracking-widest text-[#736E65]">
              / 001
            </span>
          </button>

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-[#E0DACF] md:inline-block"
          />

          <span className="hidden font-editorial text-sm italic text-[#635E55] lg:inline-block">
            The world is different down here.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {hasResult && (
            <button
              type="button"
              onClick={() => {
                sensoryAudio.playClick();
                onOpenUpload();
              }}
              className="rounded-full border border-[#D5CEBF] bg-white px-3.5 py-1.5 font-data text-xs font-semibold uppercase tracking-wider text-[#191816] transition hover:border-[#191816] hover:bg-[#FAF8F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2"
            >
              NEW SCENE
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={
              soundEnabled ? "Mute sensory audio" : "Enable sensory audio"
            }
            aria-pressed={soundEnabled}
            title={soundEnabled ? "Mute sensory audio" : "Enable sensory audio"}
            className="flex items-center justify-center rounded-full border border-[#E0DACF] p-2 text-[#635E55] transition hover:bg-[#F0ECE2] hover:text-[#1A1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2"
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-[#4A5839]" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-[#A59F94]" />
            )}
          </button>

          <div
            className="flex items-center gap-1.5 rounded-full bg-[#ECE7DC] px-2.5 py-1 font-data text-[10px] uppercase tracking-wider text-[#635E55]"
            aria-label="Powered by Gemini"
          >
            <Sparkles
              aria-hidden="true"
              className="h-2.5 w-2.5 text-[#4A5839]"
            />
            <span>GEMINI</span>
          </div>
        </div>
      </div>
    </header>
  );
};
