import React, { useRef, useState } from "react";
import { AlertCircle, Camera, Upload } from "lucide-react";

import { sensoryAudio } from "../utils/audioSensory";

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

  const handleDropZoneKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (isAnalyzing) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
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

      <div
        role="button"
        tabIndex={isAnalyzing ? -1 : 0}
        aria-disabled={isAnalyzing}
        aria-label="Choose a scene image"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={handleDropZoneKeyDown}
        onClick={() => {
          if (!isAnalyzing) {
            openFilePicker();
          }
        }}
        className={`group relative border border-dashed p-8 text-center transition-colors sm:p-12 ${
          isAnalyzing
            ? "cursor-wait border-[#D5CEBF] bg-[#FAF8F3] opacity-70"
            : isDragging
              ? "cursor-pointer border-[#4A5839] bg-[#F4F0E8]"
              : "cursor-pointer border-[#D5CEBF] bg-white hover:border-[#4A5839] hover:bg-[#FAF8F3]"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2`}
      >
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#D5CEBF] bg-[#FAF8F3] text-[#4A5839]">
            <Upload aria-hidden="true" className="h-5 w-5" />
          </div>

          <h3 className="font-editorial text-2xl font-light text-[#191816] sm:text-3xl">
            Choose a scene or use your camera.
          </h3>

          <p className="mt-2 font-sans text-sm text-[#635E55]">
            Outdoor and indoor environments both work.
          </p>

          <p className="mt-1 font-data text-[10px] uppercase tracking-wider text-[#8C867A]">
            JPEG · PNG · WEBP · MAX 15 MB
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
              className="rounded-full bg-[#191816] px-6 py-2.5 font-data text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] transition hover:bg-[#4A5839] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CHOOSE PHOTO
            </button>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={(event) => {
                event.stopPropagation();

                sensoryAudio.playClick();
                onOpenCamera();
              }}
              className="flex items-center gap-2 rounded-full border border-[#D5CEBF] bg-[#FAF8F3] px-5 py-2.5 font-data text-xs font-medium uppercase tracking-wider text-[#191816] transition hover:bg-[#EAE4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[#4A5839]"
              />

              <span>USE CAMERA</span>
            </button>
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
