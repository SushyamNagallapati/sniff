import React, { useEffect, useState } from 'react';

const LOADING_STAGES = [
  'Observing the scene...',
  'Finding points of interest...',
  'Building the field report...',
];

interface LoadingStateProps {
  imageUrl?: string | null;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ imageUrl }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < LOADING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => {
      clearInterval(stageInterval);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-4">
        <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#4A5839]">
          FIELD REPORT / PROCESSING
        </span>
      </div>

      {/* Grid: Selected Image + Restrained Loading Dossier */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        {/* Left: The new image alone, pristine, no stale markers or previous results */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden border border-[#D5CEBF] bg-[#1A1917]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Scene under observation"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#FAF8F3] font-data text-xs text-[#7A7468]">
                AWAITING SPECIMEN
              </div>
            )}
          </div>
        </div>

        {/* Right: Restrained 3-Step Sequence Card */}
        <div className="lg:col-span-5 flex flex-col justify-center border border-[#D5CEBF] bg-[#FFFFFF] p-8 sm:p-10 min-h-[320px]">
          <span className="font-data text-xs uppercase tracking-widest text-[#7A7468]">
            STAGE 0{stageIndex + 1} OF 03
          </span>

          <h2 className="mt-6 font-editorial text-3xl font-light text-[#191816] transition-opacity duration-300">
            {LOADING_STAGES[stageIndex]}
          </h2>

          <p className="mt-3 font-sans text-xs text-[#7A7468]">
            Analyzing visible boundaries, surfaces, vegetation, and lighting.
          </p>

          {/* Minimal 3-step Stage Bar (No fake percentages, no generic AI graphics) */}
          <div className="mt-8 flex items-center gap-2">
            {LOADING_STAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 transition-all duration-300 ${
                  i === stageIndex
                    ? 'bg-[#4A5839]'
                    : i < stageIndex
                    ? 'bg-[#191816]'
                    : 'bg-[#E6E1D8]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
