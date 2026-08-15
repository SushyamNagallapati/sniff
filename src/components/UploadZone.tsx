import React, { useRef, useState } from "react";
import { AlertCircle, Camera, Upload } from "lucide-react";

import { sensoryAudio } from "../utils/audioSensory";
import { Button } from "./Button";

interface UploadZoneProps {
  onImageSelected: (base64Image: string, file?: File) => void;

  onOpenCamera: () => void;

  isAnalyzing: boolean;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const UploadZone: React.FC<UploadZoneProps> = ({
  onImageSelected,
  onOpenCamera,
  isAnalyzing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    if (isAnalyzing) {
      return;
    }

    /**
     * Allows selecting the same image again after it
     * was previously chosen.
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      setErrorMessage("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("This image is too large. Choose an image under 15 MB.");
      return;
    }

    if (file.size === 0) {
      setErrorMessage("This image appears to be empty.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setErrorMessage("SNIFF could not read this image.");
        return;
      }

      sensoryAudio.playClick();

      onImageSelected(reader.result, file);
    };

    reader.onerror = () => {
      setErrorMessage("SNIFF could not read this image. Try another file.");
    };

    reader.onabort = () => {
      setErrorMessage("Image selection was interrupted.");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (isAnalyzing) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isAnalyzing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={isAnalyzing}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            processFile(file);
          }
        }}
      />

      {/*
       * A drop target, not a control.
       *
       * This was role="button" wrapping two real buttons,
       * which is invalid ARIA and left the inner controls
       * unreliably exposed. Drag-and-drop is a mouse
       * affordance; the keyboard path is the Choose photo
       * button inside it.
       */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!isAnalyzing) {
            openFilePicker();
          }
        }}
        className={`group relative border border-dashed p-8 text-center transition-colors duration-fast sm:p-12 ${
          isAnalyzing
            ? "cursor-wait border-rule bg-paper opacity-70"
            : isDragging
              ? "cursor-pointer border-forest bg-surface"
              : "cursor-pointer border-rule bg-paper hover:border-forest hover:bg-surface"
        }`}
      >
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#D8D1C5] bg-[#FCFAF5] text-[#43513B]">
            <Upload aria-hidden="true" className="h-5 w-5" />
          </div>

          <h3 className="font-editorial text-2xl font-light text-[#1D1C19] sm:text-3xl">
            Choose a scene or use your camera.
          </h3>

          <p className="mt-2 font-sans text-sm text-[#625D55]">
            Outdoor and indoor environments both work.
          </p>

          <p className="mt-1 font-data text-[10px] uppercase tracking-wider text-faint">
            JPEG · PNG · WEBP · MAX 15 MB
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              disabled={isAnalyzing}
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
            >
              CHOOSE PHOTO
            </Button>

            <Button
              disabled={isAnalyzing}
              onClick={(event) => {
                event.stopPropagation();

                sensoryAudio.playClick();
                onOpenCamera();
              }}
              variant="secondary"
            >
              <Camera
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[#43513B]"
              />

              <span>USE CAMERA</span>
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-3 flex items-center gap-2 border border-[#D8B4A0] bg-[#FFF7F2] px-4 py-2.5 font-sans text-xs text-[#81452F]"
        >
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />

          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
