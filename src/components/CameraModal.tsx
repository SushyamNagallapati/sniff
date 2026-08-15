import React, { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { AlertCircle, RefreshCw, X } from "lucide-react";

import { sensoryAudio } from "../utils/audioSensory";
import { useModalFocus } from "../utils/useModalFocus";
import { DURATION, EASE } from "../styles/motion";
import { Button } from "./Button";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

type FacingMode = "environment" | "user";

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  const shouldReduceMotion = useReducedMotion();

  /**
   * MediaStream is imperative browser state.
   *
   * A ref is preferable to React state here because cleanup
   * must always access the latest stream immediately.
   */
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [facingMode, setFacingMode] = useState<FacingMode>("environment");

  const [isInitializing, setIsInitializing] = useState(false);

  const stopCamera = useCallback(() => {
    const activeStream = streamRef.current;

    if (activeStream) {
      activeStream.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async (mode: FacingMode) => {
      setIsInitializing(true);
      setError(null);

      stopCamera();

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("CAMERA_NOT_SUPPORTED");
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: mode,
            },

            width: {
              ideal: 1920,
            },

            height: {
              ideal: 1080,
            },
          },

          audio: false,
        });

        streamRef.current = mediaStream;

        const video = videoRef.current;

        if (!video) {
          stopCamera();
          return;
        }

        video.srcObject = mediaStream;

        await video.play();
      } catch (caughtError: unknown) {
        console.error("Camera access error:", caughtError);

        stopCamera();

        if (caughtError instanceof DOMException) {
          if (
            caughtError.name === "NotAllowedError" ||
            caughtError.name === "SecurityError"
          ) {
            setError(
              "Camera access was blocked. Allow camera permission in your browser, then try again.",
            );
          } else if (caughtError.name === "NotFoundError") {
            setError("No camera was found on this device.");
          } else if (caughtError.name === "NotReadableError") {
            setError(
              "Your camera is already being used by another application.",
            );
          } else {
            setError(
              "SNIFF could not start the camera. Check your browser permissions and try again.",
            );
          }
        } else {
          setError(
            "SNIFF could not start the camera. Check your browser permissions and try again.",
          );
        }
      } finally {
        setIsInitializing(false);
      }
    },
    [stopCamera],
  );

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    void startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  /**
   * Escape closes the modal.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        stopCamera();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, stopCamera]);

  useModalFocus(isOpen, dialogRef);

  const handleClose = () => {
    sensoryAudio.playClick();
    stopCamera();
    onClose();
  };

  const handleCapture = () => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError("The camera is not ready yet. Try again in a moment.");
      return;
    }

    sensoryAudio.playClick();

    const canvas = document.createElement("canvas");

    /**
     * Limit captured image size.
     *
     * A 1920-wide image is more than enough for the Gemini
     * scene analysis while avoiding unnecessarily large payloads.
     */
    const maxWidth = 1920;

    const scale = Math.min(1, maxWidth / video.videoWidth);

    canvas.width = Math.round(video.videoWidth * scale);

    canvas.height = Math.round(video.videoHeight * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      setError("SNIFF could not capture this frame.");
      return;
    }

    /**
     * Mirror the captured frame when the user-facing camera
     * is active so it matches the familiar preview orientation.
     */
    if (facingMode === "user") {
      context.translate(canvas.width, 0);

      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);

    stopCamera();

    /**
     * App owns the state transition after capture.
     */
    onCapture(dataUrl);
  };

  const toggleFacingMode = () => {
    sensoryAudio.playClick();

    setFacingMode((current) =>
      current === "environment" ? "user" : "environment",
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : DURATION.fast,
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1C19]/80 p-4 backdrop-blur-xs"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="camera-modal-title"
            tabIndex={-1}
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.96,
              y: shouldReduceMotion ? 0 : 8,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.97,
              y: shouldReduceMotion ? 0 : 6,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : DURATION.base,
              ease: EASE,
            }}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-y-auto border border-[#D8D1C5] bg-[#FCFAF5] shadow-xl focus:outline-none"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[#E7E1D6] bg-[#FCFAF5] px-5 py-3">
              <h2
                id="camera-modal-title"
                className="font-editorial text-lg text-[#1D1C19]"
              >
                Camera Viewfinder
              </h2>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close camera"
                className="rounded-full p-1.5 text-[#625D55] transition duration-fast hover:bg-[#EFE9DE] hover:text-[#1D1C19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            {/* Viewfinder */}
            <div className="relative flex aspect-[4/3] max-h-[60vh] w-full shrink-0 items-center justify-center overflow-hidden bg-[#1D1C19]">
              {error ? (
                <div
                  role="alert"
                  className="flex max-w-sm flex-col items-center px-6 text-center text-[#FCFAF5]"
                >
                  <AlertCircle
                    aria-hidden="true"
                    className="mb-3 h-8 w-8 text-[#D9A15B]"
                  />

                  <p className="font-editorial text-lg">Camera Access Needed</p>

                  <p className="mt-2 font-sans text-xs leading-relaxed text-[#C1BAAE]">
                    {error}
                  </p>

                  <Button
                    onClick={() => {
                      void startCamera(facingMode);
                    }}
                    surface="dark"
                    className="mt-5"
                  >
                    TRY CAMERA AGAIN
                  </Button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  aria-label="Live camera preview"
                  className={`h-full w-full object-cover ${
                    facingMode === "user" ? "-scale-x-100" : ""
                  }`}
                />
              )}

              {isInitializing && !error && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[#1D1C19]/70 text-[#FCFAF5]"
                  aria-live="polite"
                >
                  <span className="font-data text-xs uppercase tracking-widest">
                    INITIALIZING CAMERA...
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="sticky bottom-0 z-10 flex shrink-0 items-center justify-between gap-4 border-t border-[#E7E1D6] bg-[#FCFAF5] px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={Boolean(error) || isInitializing}
                className="flex items-center gap-1.5 border border-[#D8D1C5] bg-[#FCFAF5] px-3.5 py-2 font-data text-xs uppercase tracking-wider text-[#38352F] transition duration-fast hover:bg-[#E7E1D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#43513B]"
                />

                <span>FLIP CAMERA</span>
              </button>

              <Button
                onClick={handleCapture}
                disabled={Boolean(error) || isInitializing}
              >
                CAPTURE SCENE
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
