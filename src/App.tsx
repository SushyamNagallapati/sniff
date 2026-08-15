import React, { useRef, useState } from "react";

import type { SampleScene, SniffResult } from "./types/sniff";

import { sensoryAudio } from "./utils/audioSensory";
import { validateSniffResult } from "./utils/validateSniff";

import { CanineVisionFilter } from "./components/CanineVisionFilter";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { UploadZone } from "./components/UploadZone";
import { CameraModal } from "./components/CameraModal";
import { LoadingState } from "./components/LoadingState";
import { ImageViewport } from "./components/ImageViewport";
import { DiscoveryDossier } from "./components/DiscoveryDossier";
import { SniffQuestCard } from "./components/SniffQuestCard";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [sniffResult, setSniffResult] = useState<SniffResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [hasError, setHasError] = useState(false);

  const [isSampleScene, setIsSampleScene] = useState(false);

  const [selectedDiscoveryIndex, setSelectedDiscoveryIndex] = useState(0);

  const [isDogView, setIsDogView] = useState(true);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const analysisContainerRef = useRef<HTMLDivElement | null>(null);

  const uploadSectionRef = useRef<HTMLDivElement | null>(null);

  /**
   * Incremented for every analysis request.
   *
   * Only the newest request is allowed
   * to update the UI.
   */
  const analysisRequestRef = useRef(0);

  /**
   * Allows an active browser request
   * to be cancelled when the user
   * changes scenes.
   */
  const activeRequestControllerRef = useRef<AbortController | null>(null);

  const scrollToAnalysis = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        analysisContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const scrollToUpload = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        uploadSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const invalidateActiveAnalysis = () => {
    analysisRequestRef.current += 1;

    if (activeRequestControllerRef.current) {
      activeRequestControllerRef.current.abort();

      activeRequestControllerRef.current = null;
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;

    setSoundEnabled(next);

    sensoryAudio.enabled = next;
  };

  const handleStartSniffing = () => {
    scrollToUpload();
  };

  const handleSelectSample = (sample: SampleScene) => {
    invalidateActiveAnalysis();

    setCurrentImage(sample.imageUrl);

    setSniffResult(sample.precomputedData);

    setIsAnalyzing(false);
    setHasError(false);
    setIsSampleScene(true);

    setSelectedDiscoveryIndex(0);

    setIsDogView(true);
    setIsCameraOpen(false);

    scrollToAnalysis();
  };

  const performAnalysis = async (base64Image: string) => {
    activeRequestControllerRef.current?.abort();

    const controller = new AbortController();

    activeRequestControllerRef.current = controller;

    const requestId = ++analysisRequestRef.current;

    setCurrentImage(base64Image);

    setSniffResult(null);

    setSelectedDiscoveryIndex(0);

    setIsSampleScene(false);
    setHasError(false);
    setIsDogView(true);

    setIsAnalyzing(true);
    setIsCameraOpen(false);

    scrollToAnalysis();

    try {
      const response = await fetch("/api/sniff", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          imageBase64: base64Image,
        }),

        signal: controller.signal,
      });

      if (requestId !== analysisRequestRef.current) {
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Analysis request failed with status ${response.status}`,
        );
      }

      const rawData: unknown = await response.json();

      const validatedResult = validateSniffResult(rawData);

      if (!validatedResult) {
        throw new Error("Analysis response structure failed validation");
      }

      if (requestId !== analysisRequestRef.current) {
        return;
      }

      setSniffResult(validatedResult);

      setSelectedDiscoveryIndex(0);

      setIsDogView(true);
      setHasError(false);

      scrollToAnalysis();
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (requestId !== analysisRequestRef.current) {
        return;
      }

      console.error("Scene analysis failed:", error);

      setSniffResult(null);
      setHasError(true);

      scrollToAnalysis();
    } finally {
      if (requestId === analysisRequestRef.current) {
        setIsAnalyzing(false);

        if (activeRequestControllerRef.current === controller) {
          activeRequestControllerRef.current = null;
        }
      }
    }
  };

  const handleImageSelected = (base64Image: string) => {
    void performAnalysis(base64Image);
  };

  const handleCameraCapture = (base64Image: string) => {
    setIsCameraOpen(false);

    void performAnalysis(base64Image);
  };

  const handleRetry = () => {
    if (!currentImage) {
      handleNewScene();
      return;
    }

    sensoryAudio.playClick();

    void performAnalysis(currentImage);
  };

  /**
   * Clicking the SNIFF brand
   * returns to the homepage.
   */
  const handleReset = () => {
    invalidateActiveAnalysis();

    setCurrentImage(null);
    setSniffResult(null);

    setHasError(false);
    setIsAnalyzing(false);
    setIsSampleScene(false);

    setSelectedDiscoveryIndex(0);

    setIsDogView(true);
    setIsCameraOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * New Scene returns directly
   * to the upload area.
   */
  const handleNewScene = () => {
    invalidateActiveAnalysis();

    setCurrentImage(null);
    setSniffResult(null);

    setHasError(false);
    setIsAnalyzing(false);
    setIsSampleScene(false);

    setSelectedDiscoveryIndex(0);

    setIsDogView(true);
    setIsCameraOpen(false);

    scrollToUpload();
  };

  const hasActiveExperience = Boolean(sniffResult) || isAnalyzing || hasError;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F3EC] text-[#1D1C19] selection:bg-[#43513B] selection:text-[#FCFAF5]">
      <CanineVisionFilter />

      <Navbar
        hasResult={hasActiveExperience}
        onReset={handleReset}
        onOpenUpload={handleNewScene}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="flex-1">
        {/* =====================================================
            HOME
        ===================================================== */}

        {!sniffResult && !isAnalyzing && !hasError && (
          <>
            <HeroSection
              onStartSniffing={handleStartSniffing}
              onSelectSample={handleSelectSample}
              onOpenCamera={() => setIsCameraOpen(true)}
            />

            <section
              ref={uploadSectionRef}
              className="scroll-mt-[74px] mx-auto max-w-4xl px-4 pb-20 sm:px-6"
              aria-labelledby="upload-scene-heading"
            >
              <div className="mb-6 border-t border-[#D8D1C5] pt-8">
                <h2
                  id="upload-scene-heading"
                  className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1D1C19]"
                >
                  UPLOAD A SCENE
                </h2>
              </div>

              <UploadZone
                onImageSelected={handleImageSelected}
                onOpenCamera={() => setIsCameraOpen(true)}
                isAnalyzing={isAnalyzing}
              />
            </section>
          </>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {isAnalyzing && (
          <section
            ref={analysisContainerRef}
            className="scroll-mt-[74px] mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"
            aria-live="polite"
            aria-busy="true"
          >
            <LoadingState imageUrl={currentImage} />
          </section>
        )}

        {/* =====================================================
            FIELD REPORT
        ===================================================== */}

        {sniffResult && currentImage && !isAnalyzing && !hasError && (
          <section
            ref={analysisContainerRef}
            className="scroll-mt-[74px] mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12"
            aria-labelledby="field-report-title"
          >
            {/* Report index */}
            <div className="flex items-center justify-between border-b border-[#D8D1C5] pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-[#43513B]">
                  FIELD REPORT / 001
                </span>

                {isSampleScene && (
                  <span className="border border-[#D5CEBF] bg-[#FCFAF5]/70 px-2 py-0.5 font-data text-[8px] uppercase tracking-[0.14em] text-[#716C63]">
                    PRE-ANALYZED SAMPLE
                  </span>
                )}
              </div>
            </div>

            {/* Scene heading */}
            <div className="max-w-3xl space-y-2">
              <h1
                id="field-report-title"
                className="font-editorial text-4xl font-light uppercase tracking-[-0.02em] text-[#1D1C19] sm:text-5xl"
              >
                {sniffResult.scene.type}
              </h1>

              <p className="font-sans text-base leading-relaxed text-[#625D55] sm:text-lg">
                {sniffResult.scene.summary}
              </p>
            </div>

            {/* Image + discovery */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
              <div className="lg:col-span-7">
                <ImageViewport
                  imageUrl={currentImage}
                  discoveries={sniffResult.discoveries}
                  selectedIndex={selectedDiscoveryIndex}
                  onSelectDiscovery={setSelectedDiscoveryIndex}
                  isDogView={isDogView}
                  onToggleView={setIsDogView}
                />
              </div>

              <div className="lg:col-span-5">
                <DiscoveryDossier
                  discoveries={sniffResult.discoveries}
                  selectedIndex={selectedDiscoveryIndex}
                  onSelectDiscovery={setSelectedDiscoveryIndex}
                />
              </div>
            </div>

            {/* Quest */}
            <div className="pt-1">
              <SniffQuestCard quest={sniffResult.quest} />
            </div>

            {/* Report actions */}
            <div className="flex flex-col justify-between gap-4 border-t border-[#D8D1C5] pt-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => {
                  sensoryAudio.playClick();
                  handleNewScene();
                }}
                className="group inline-flex w-fit items-center gap-3 py-1 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-[#4E4A43] transition-colors duration-200 hover:text-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-3"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                />

                <span>New scene</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="group relative w-fit py-1 font-data text-[8px] uppercase tracking-[0.16em] text-[#716C63] transition-colors duration-200 hover:text-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-3"
              >
                Back to top
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#43513B] transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {hasError && !isAnalyzing && (
          <section
            ref={analysisContainerRef}
            className="scroll-mt-[74px] mx-auto max-w-2xl px-4 py-16 sm:py-24"
            aria-labelledby="analysis-error-title"
            aria-live="polite"
          >
            <div className="border border-[#D8D1C5] bg-[#FCFAF5]/70 p-8 text-center sm:p-10">
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D8D1C5] bg-[#F0EBE1]">
                  <AlertCircle
                    aria-hidden="true"
                    className="h-5 w-5 text-[#9B654E]"
                  />
                </div>
              </div>

              <h2
                id="analysis-error-title"
                className="font-editorial text-2xl uppercase tracking-[-0.02em] text-[#1D1C19] sm:text-3xl"
              >
                OBSERVATION INTERRUPTED
              </h2>

              <p className="mt-4 font-sans text-sm leading-relaxed text-[#625D55] sm:text-base">
                SNIFF couldn&apos;t analyze this scene right now.
                <br />
                The analysis service is temporarily unavailable.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="group inline-flex items-center gap-3 bg-[#1D1C19] px-6 py-3 font-data text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FCFAF5] transition-colors hover:bg-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B] focus-visible:ring-offset-3"
                >
                  <RefreshCw
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45"
                  />

                  <span>Try again</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sensoryAudio.playClick();
                    handleNewScene();
                  }}
                  className="group relative py-3 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-[#4E4A43] transition-colors hover:text-[#43513B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43513B]"
                >
                  New scene
                  <span className="absolute bottom-2 left-0 h-px w-full origin-left bg-[#AAA296] transition-transform duration-300 group-hover:scale-x-0" />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =======================================================
          CAMERA
      ======================================================= */}

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* =======================================================
          FOOTER
      ======================================================= */}

      <footer className="mt-auto border-t border-[#D8D1C5] bg-[#F6F3EC]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-5 py-8 sm:px-7 md:grid-cols-[1fr_auto] md:items-end lg:px-10">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-editorial text-xl font-medium tracking-[-0.025em] text-[#1D1C19]">
                SNIFF
              </span>

              <span className="font-data text-[7px] tracking-[0.13em] text-[#918B81]">
                The world is different down here.
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-[7px] uppercase tracking-[0.15em] text-[#8C867C]">
              <span>Visible evidence only</span>

              <span aria-hidden="true" className="text-[#C1BAAE]">
                /
              </span>

              <span>No scent detection</span>

              <span aria-hidden="true" className="text-[#C1BAAE]">
                /
              </span>

              <span>No behavioral claims</span>
            </div>
          </div>

          <span className="font-data text-[7px] uppercase tracking-[0.16em] text-[#918B81]">
            Built with Gemini
          </span>
        </div>
      </footer>
    </div>
  );
}
