import React from "react";

/**
 * A simplified visual approximation inspired by canine dichromatic vision.
 *
 * This filter is an editorial visualization only.
 * It is not a calibrated reconstruction of exactly what an individual
 * dog perceives and does not represent the dog's broader sensory experience.
 */
export const CanineVisionFilter: React.FC = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter id="canine-vision-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.625 0.375 0     0 0
              0.700 0.300 0     0 0
              0.000 0.280 0.720 0 0
              0     0     0     1 0
            "
          />
        </filter>
      </defs>
    </svg>
  );
};
