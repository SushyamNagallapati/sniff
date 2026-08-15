import React, { useRef, useState } from "react";
import type { SampleScene, SniffResult } from "./types/sniff";

import { SAMPLE_SCENES } from "./data/sampleScenes";
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
   * A response is accepted only when its request ID still matches
   * this value. This prevents an older Gemini request from
   * overwriting the result of a newer image.
   */
  const analysisRequestRef = useRef(0);

  /**
   * Allows the browser-side fetch itself to be cancelled when:
   * - another image is selected
   * - the user starts a new scene
   * - the app is reset
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
    /**
     * A user may select a sample while a live analysis is still
     * running. Invalidate that request before showing sample data.
     */
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
    /**
     * Cancel the previous browser request before starting another.
     */
    activeRequestControllerRef.current?.abort();

    const controller = new AbortController();
    activeRequestControllerRef.current = controller;

    const requestId = ++analysisRequestRef.current;

    /**
     * Clear ALL old analysis before displaying a new photograph.
     *
     * This prevents previous markers, scores, titles and quests
     * from ever appearing over the new scene.
     */
    setCurrentImage(base64Image);
    setSniffResult(null);

    setSelectedDiscoveryIndex(0);
    setIsSampleScene(false);
    setHasError(false);
    setIsDogView(true);

    setIsAnalyzing(true);
    setIsCameraOpen(false);

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

      /**
       * Another scene may have been selected while this request
       * was waiting for the server.
       */
      if (requestId !== analysisRequestRef.current) {
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Analysis request failed with status ${response.status}`,
        );
      }

      const rawData: unknown = await response.json();

      /**
       * Never send arbitrary model data directly to the UI.
       *
       * The same validation also runs server-side, giving us a
       * second defensive boundary here in React.
       */
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
      /**
       * Abort is expected when the user changes scenes.
       * It is not an application error.
       */
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      /**
       * Ignore failures belonging to an outdated request.
       */
      if (requestId !== analysisRequestRef.current) {
        return;
      }

      console.error("Scene analysis failed:", error);

      setSniffResult(null);
      setHasError(true);
    } finally {
      /**
       * Only the most recent request is allowed to modify the
       * loading state.
       */
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
   * Brand/logo reset.
   *
   * Returns to the top of the homepage.
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
   * NEW SCENE action.
   *
   * Unlike clicking the SNIFF logo, this returns directly to
   * the scene-intake area.
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
    <div className="flex min-h-screen flex-col bg-[#FBF9F5] text-[#191816] selection:bg-[#4A5839] selection:text-[#FBF9F5]">
      <CanineVisionFilter />

      <Navbar
        hasResult={hasActiveExperience}
        onReset={handleReset}
        onOpenUpload={handleNewScene}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="flex-1">
        {/* -------------------------------------------------------
            HOME
        ------------------------------------------------------- */}

        {!sniffResult && !isAnalyzing && !hasError && (
          <>
            <HeroSection
              onStartSniffing={handleStartSniffing}
              onSelectSample={handleSelectSample}
              onOpenCamera={() => setIsCameraOpen(true)}
            />

            <section
              ref={uploadSectionRef}
              className="mx-auto max-w-4xl px-4 pb-20 sm:px-6"
              aria-labelledby="upload-scene-heading"
            >
              <div className="mb-6 border-t border-[#E6E1D8] pt-8">
                <h2
                  id="upload-scene-heading"
                  className="font-data text-xs font-semibold uppercase tracking-widest text-[#191816]"
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

        {/* -------------------------------------------------------
            LOADING
        ------------------------------------------------------- */}

        {isAnalyzing && (
          <div
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"
            aria-live="polite"
            aria-busy="true"
          >
            <LoadingState imageUrl={currentImage} />
          </div>
        )}

        {/* -------------------------------------------------------
            FIELD REPORT
        ------------------------------------------------------- */}

        {sniffResult && currentImage && !isAnalyzing && !hasError && (
          <section
            ref={analysisContainerRef}
            className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12"
            aria-labelledby="field-report-title"
          >
            {/* Report index */}
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-4">
              <div className="flex items-center gap-3">
                <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#4A5839]">
                  FIELD REPORT / 001
                </span>

                {isSampleScene && (
                  <span className="border border-[#D5CEBF] bg-[#FAF8F3] px-2 py-0.5 font-data text-[10px] uppercase tracking-wider text-[#7A7468]">
                    PRE-ANALYZED SAMPLE
                  </span>
                )}
              </div>
            </div>

            {/* Scene heading */}
            <div className="max-w-3xl space-y-2">
              <h1
                id="field-report-title"
                className="font-editorial text-4xl font-light uppercase tracking-tight text-[#191816] sm:text-5xl"
              >
                {sniffResult.scene.type}
              </h1>

              <p className="font-sans text-base leading-relaxed text-[#524E46] sm:text-lg">
                {sniffResult.scene.summary}
              </p>
            </div>

            {/* Image + selected discovery */}
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
            <SniffQuestCard quest={sniffResult.quest} />

            {/* Bottom action */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E6E1D8] pt-8">
              <button
                type="button"
                onClick={() => {
                  sensoryAudio.playClick();
                  handleNewScene();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#191816] px-8 py-3 font-data text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] transition hover:bg-[#4A5839] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2"
              >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />

                <span>NEW SCENE</span>
              </button>

              <span className="font-data text-xs text-[#7A7468]">
                FIELD REPORT / SNIFF 001
              </span>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------
            ERROR
        ------------------------------------------------------- */}

        {hasError && !isAnalyzing && (
          <section
            className="mx-auto max-w-2xl px-4 py-16 sm:py-24"
            aria-labelledby="analysis-error-title"
            aria-live="polite"
          >
            <div className="border border-[#D5CEBF] bg-white p-8 text-center shadow-xs sm:p-10">
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D5CEBF] bg-[#FAF8F3]">
                  <AlertCircle
                    aria-hidden="true"
                    className="h-5 w-5 text-[#856128]"
                  />
                </div>
              </div>

              <h2
                id="analysis-error-title"
                className="font-editorial text-2xl uppercase tracking-tight text-[#191816] sm:text-3xl"
              >
                OBSERVATION INTERRUPTED
              </h2>

              <p className="mt-4 font-sans text-sm leading-relaxed text-[#524E46] sm:text-base">
                SNIFF couldn&apos;t analyze this scene right now.
                <br />
                The analysis service is temporarily unavailable.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 rounded-full bg-[#191816] px-6 py-2.5 font-data text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] transition hover:bg-[#4A5839] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2"
                >
                  <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />

                  <span>TRY AGAIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sensoryAudio.playClick();
                    handleNewScene();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D5CEBF] bg-[#FAF8F3] px-6 py-2.5 font-data text-xs font-semibold uppercase tracking-wider text-[#191816] transition hover:bg-[#EAE4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5839] focus-visible:ring-offset-2"
                >
                  <span>NEW SCENE</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ---------------------------------------------------------
          CAMERA
      --------------------------------------------------------- */}

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* ---------------------------------------------------------
          FOOTER
      --------------------------------------------------------- */}

      <footer className="mt-auto border-t border-[#E6E1D8] bg-[#FAF8F3] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 font-data text-xs text-[#7A7468] sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base text-[#191816]">
              SNIFF
            </span>

            <span>The world is different down here.</span>
          </div>

          <span>FIELD 001</span>
        </div>
      </footer>
    </div>
  );
}
