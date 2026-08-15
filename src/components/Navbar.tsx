import React, { useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Volume2, VolumeX } from "lucide-react";

import { sensoryAudio } from "../utils/audioSensory";
import { DURATION } from "../styles/motion";

const SOUND_HINT_KEY = "sniff-sound-hint-seen";

const SOUND_HINT_DURATION_MS = 2200;

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
  const shouldReduceMotion = useReducedMotion();

  const [showSoundHint, setShowSoundHint] = useState(false);

  /**
   * Shown once per session.
   *
   * The "seen" flag is written when the hint has
   * actually finished, not when it starts — writing
   * it up front means a cancelled effect (React
   * StrictMode remounts every effect in development)
   * marks the hint as seen while leaving it on screen
   * with no timer left to dismiss it.
   */
  useEffect(() => {
    if (sessionStorage.getItem(SOUND_HINT_KEY)) {
      return;
    }

    setShowSoundHint(true);

    const timeout = window.setTimeout(() => {
      sessionStorage.setItem(SOUND_HINT_KEY, "true");

      setShowSoundHint(false);
    }, SOUND_HINT_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleSoundToggle = () => {
    sessionStorage.setItem(SOUND_HINT_KEY, "true");

    setShowSoundHint(false);
    onToggleSound();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8D1C5] bg-[#F6F3EC]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] max-w-[1320px] items-center justify-between px-5 sm:px-7 lg:px-10">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => {
              sensoryAudio.playClick();
              onReset();
            }}
            aria-label="Return to SNIFF home"
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-3 focus-visible:ring-offset-canvas"
          >
            <span className="font-editorial text-[27px] font-medium leading-none tracking-[-0.04em] text-[#1D1C19] transition-[letter-spacing,opacity] duration-base group-hover:tracking-[-0.02em] group-hover:opacity-70">
              SNIFF
            </span>
          </button>

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-[#D8D1C5] sm:block"
          />

          <span className="hidden font-data text-[9px] uppercase tracking-[0.19em] text-[#716C63] sm:block">
            CANINE FIELD STUDY
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {hasResult && (
            <button
              type="button"
              onClick={() => {
                sensoryAudio.playClick();
                onOpenUpload();
              }}
              className="group relative py-1 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-[#555149] transition-colors duration-fast hover:text-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
            >
              New scene
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#43513B] transition-all duration-base group-hover:w-full" />
            </button>
          )}

          {/* Sound */}
          <div className="relative">
            <button
              type="button"
              onClick={handleSoundToggle}
              aria-label={
                soundEnabled
                  ? "Mute interface sounds"
                  : "Enable interface sounds"
              }
              aria-pressed={soundEnabled}
              className="group relative flex h-8 w-8 items-center justify-center rounded-full text-[#716C63] before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] transition-[background-color,color,transform] duration-fast hover:bg-[#EAE5DA] hover:text-[#43513B] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
            >
              {soundEnabled ? (
                <Volume2 aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <VolumeX aria-hidden="true" className="h-3.5 w-3.5" />
              )}
            </button>

            <AnimatePresence>
              {showSoundHint && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : -2,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : DURATION.fast,
                  }}
                  className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap border border-[#D8D1C5] bg-[#FCFAF5] px-2.5 py-1.5 font-data text-[9px] uppercase tracking-[0.16em] text-[#43513B] shadow-sm"
                >
                  {soundEnabled ? "Sound on" : "Sound off"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
