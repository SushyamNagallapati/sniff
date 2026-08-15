import React, { useRef, useState } from "react";

import type { SampleScene, SniffResult } from "./types/sniff";

import { sensoryAudio } from "./utils/audioSensory";
import { validateSniffResult } from "./utils/validateSniff";

import { SCROLL_CLEARANCE, SHELL } from "./styles/layout";

import { CanineVisionFilter } from "./components/CanineVisionFilter";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { UploadZone } from "./components/UploadZone";
import { CameraModal } from "./components/CameraModal";
import { LoadingState } from "./components/LoadingState";
import { ImageViewport } from "./components/ImageViewport";
import { DiscoveryDossier } from "./components/DiscoveryDossier";
import { SniffQuestCard } from "./components/SniffQuestCard";
import { Button } from "./components/Button";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

/**
 * How long a single analysis may run before SNIFF
 * gives up and shows the error state.
 *
 * Without this, a stalled Gemini call leaves the user
 * on the loading screen indefinitely with no way to
 * tell that anything has gone wrong.
 */
const ANALYSIS_TIMEOUT_MS = 45_000;

export default function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [sniffResult, setSniffResult] = useState<SniffResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [hasError, setHasError] = useState(false);

  /** Lets the error state say which of the two things went wrong. */
  const [timedOut, setTimedOut] = useState(false);

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
    setTimedOut(false);
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
    setTimedOut(false);
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

        /*
         * Two ways to end the request: the user changing
         * scenes (controller) or it simply taking too
         * long (timeout). They are distinguished in the
         * catch below — one is silent, the other is an
         * error the user needs to see.
         */
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(ANALYSIS_TIMEOUT_MS),
        ]),
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
      setTimedOut(false);

      scrollToAnalysis();
    } catch (error: unknown) {
      /*
       * The user moved on, so there is nothing to report.
       * A timeout rejects with TimeoutError, not
       * AbortError, and falls through to the error state.
       */
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (requestId !== analysisRequestRef.current) {
        return;
      }

      console.error("Scene analysis failed:", error);

      setSniffResult(null);

      setTimedOut(
        error instanceof DOMException && error.name === "TimeoutError",
      );

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
    setTimedOut(false);
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
    setTimedOut(false);
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
              className={`${SCROLL_CLEARANCE} ${SHELL} pb-20`}
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
            className={`${SCROLL_CLEARANCE} ${SHELL} py-8 sm:py-12`}
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
            className={`${SCROLL_CLEARANCE} ${SHELL} space-y-8 py-8 sm:py-12`}
            aria-labelledby="field-report-title"
          >
            {/* Report index */}
            <div className="flex items-center justify-between border-b border-[#D8D1C5] pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-[#43513B]">
                  FIELD REPORT / 001
                </span>

                {isSampleScene && (
                  <span className="border border-[#D8D1C5] bg-[#FCFAF5]/70 px-2 py-0.5 font-data text-[8px] uppercase tracking-[0.14em] text-[#716C63]">
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
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
            <SniffQuestCard quest={sniffResult.quest} />

            {/* Report actions */}
            <div className="flex flex-col justify-between gap-4 border-t border-[#D8D1C5] pt-5 sm:flex-row sm:items-center">
              <Button
                variant="quiet"
                onClick={() => {
                  sensoryAudio.playClick();
                  handleNewScene();
                }}
                className="w-fit"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-base group-hover:-translate-x-1"
                />

                <span>New scene</span>
              </Button>

              <Button
                variant="quiet"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="w-fit"
              >
                Back to top
              </Button>
            </div>
          </section>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {hasError && !isAnalyzing && (
          <section
            ref={analysisContainerRef}
            className={`${SCROLL_CLEARANCE} ${SHELL} py-16 sm:py-24`}
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

              <h1
                id="analysis-error-title"
                className="font-editorial text-2xl uppercase tracking-[-0.02em] text-[#1D1C19] sm:text-3xl"
              >
                OBSERVATION INTERRUPTED
              </h1>

              <p className="mt-4 font-sans text-sm leading-relaxed text-[#625D55] sm:text-base">
                {timedOut ? (
                  <>
                    The analysis ran longer than 45 seconds and was stopped.
                    <br />A smaller or simpler photograph usually goes through.
                  </>
                ) : (
                  <>
                    SNIFF couldn&apos;t analyze this scene right now.
                    <br />
                    The analysis service is temporarily unavailable.
                  </>
                )}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button onClick={handleRetry}>
                  <RefreshCw
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-base group-hover:rotate-45"
                  />

                  <span>Try again</span>
                </Button>

                <Button
                  variant="quiet"
                  onClick={() => {
                    sensoryAudio.playClick();
                    handleNewScene();
                  }}
                >
                  New scene
                </Button>
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
        <div
          className={`${SHELL} grid grid-cols-1 gap-6 py-8 md:grid-cols-[1fr_auto] md:items-end`}
        >
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-editorial text-xl font-medium tracking-[-0.025em] text-[#1D1C19]">
                SNIFF
              </span>

              {/*
               * The product's thesis, not a disclaimer.
               * At 7px it sat at the same weight as the
               * legal line below and read as decoration.
               */}
              <span className="font-data text-[10px] tracking-[0.1em] text-muted">
                The world is different down here.
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-[7px] uppercase tracking-[0.15em] text-faint">
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

          <span className="font-data text-[7px] uppercase tracking-[0.16em] text-faint">
            Built with Gemini
          </span>
        </div>
      </footer>
    </div>
  );
}
