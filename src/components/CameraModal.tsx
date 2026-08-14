import React, { useCallback, useEffect, useRef, useState } from "react";

import { AlertCircle, RefreshCw, X } from "lucide-react";

import { sensoryAudio } from "../utils/audioSensory";

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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#191816]/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-modal-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col border border-[#D5CEBF] bg-[#FBF9F5] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E6E1D8] bg-[#FAF8F3] px-5 py-3">
          <h2
            id="camera-modal-title"
            className="font-editorial text-lg text-[#1A1917]"
          >
            Camera Viewfinder
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close camera"
            className="rounded-full p-1.5 text-[#635E55] transition hover:bg-[#EFE9DE] hover:text-[#1A1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#1A1917]">
          {error ? (
            <div
              role="alert"
              className="flex max-w-sm flex-col items-center px-6 text-center text-[#FBF9F5]"
            >
              <AlertCircle
                aria-hidden="true"
                className="mb-3 h-8 w-8 text-[#D9A15B]"
              />

              <p className="font-editorial text-lg">Camera Access Needed</p>

              <p className="mt-2 font-sans text-xs leading-relaxed text-[#C6C0B5]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void startCamera(facingMode);
                }}
                className="mt-5 rounded-full bg-[#4A5839] px-5 py-2.5 font-data text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#596849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                TRY CAMERA AGAIN
              </button>
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
              className="absolute inset-0 flex items-center justify-center bg-[#1A1917]/70 text-[#FBF9F5]"
              aria-live="polite"
            >
              <span className="font-data text-xs uppercase tracking-widest">
                INITIALIZING CAMERA...
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 border-t border-[#E6E1D8] bg-[#FAF8F3] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={toggleFacingMode}
            disabled={Boolean(error) || isInitializing}
            className="flex items-center gap-1.5 border border-[#D5CEBF] bg-[#FAF8F3] px-3.5 py-2 font-data text-xs uppercase tracking-wider text-[#383530] transition hover:bg-[#EAE4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              aria-hidden="true"
              className="h-3.5 w-3.5 text-[#4A5839]"
            />

            <span>FLIP CAMERA</span>
          </button>

          <button
            type="button"
            onClick={handleCapture}
            disabled={Boolean(error) || isInitializing}
            className="rounded-full bg-[#191816] px-6 py-3 font-data text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] transition hover:bg-[#4A5839] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            CAPTURE SCENE
          </button>
        </div>
      </div>
    </div>
  );
};
