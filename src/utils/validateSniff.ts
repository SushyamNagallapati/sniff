import type { Discovery, DiscoveryCategory, SniffResult } from "../types/sniff";

const VALID_CATEGORIES = new Set<DiscoveryCategory>([
  "smell",
  "sight",
  "sound",
  "movement",
  "social",
  "exploration",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNumberInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return isFiniteNumber(value) && value >= min && value <= max;
}

/**
 * Validates and sanitizes a Gemini-generated SNIFF result.
 *
 * Returns a safe SniffResult when valid.
 * Returns null when the response is malformed or outside expected ranges.
 */
export function validateSniffResult(data: unknown): SniffResult | null {
  if (!isRecord(data)) {
    return null;
  }

  // Scene
  if (!isRecord(data.scene)) {
    return null;
  }

  if (
    !isNonEmptyString(data.scene.type) ||
    !isNonEmptyString(data.scene.summary)
  ) {
    return null;
  }

  // Discoveries
  if (
    !Array.isArray(data.discoveries) ||
    data.discoveries.length < 4 ||
    data.discoveries.length > 6
  ) {
    return null;
  }

  const discoveries: Discovery[] = [];

  for (const rawDiscovery of data.discoveries) {
    if (!isRecord(rawDiscovery)) {
      return null;
    }

    if (!isNonEmptyString(rawDiscovery.label)) {
      return null;
    }

    if (
      typeof rawDiscovery.category !== "string" ||
      !VALID_CATEGORIES.has(rawDiscovery.category as DiscoveryCategory)
    ) {
      return null;
    }

    if (!isNumberInRange(rawDiscovery.interestScore, 0, 100)) {
      return null;
    }

    if (!isNonEmptyString(rawDiscovery.explanation)) {
      return null;
    }

    if (!isNumberInRange(rawDiscovery.confidence, 0, 1)) {
      return null;
    }

    if (!isRecord(rawDiscovery.location)) {
      return null;
    }

    if (
      !isNumberInRange(rawDiscovery.location.x, 0, 1) ||
      !isNumberInRange(rawDiscovery.location.y, 0, 1)
    ) {
      return null;
    }

    discoveries.push({
      label: rawDiscovery.label.trim(),
      category: rawDiscovery.category as DiscoveryCategory,
      interestScore: Math.round(rawDiscovery.interestScore),
      explanation: rawDiscovery.explanation.trim(),
      confidence: rawDiscovery.confidence,
      location: {
        x: rawDiscovery.location.x,
        y: rawDiscovery.location.y,
      },
    });
  }

  // Quest
  if (!isRecord(data.quest)) {
    return null;
  }

  if (
    !isNonEmptyString(data.quest.title) ||
    !isNonEmptyString(data.quest.description)
  ) {
    return null;
  }

  return {
    scene: {
      type: data.scene.type.trim(),
      summary: data.scene.summary.trim(),
    },

    discoveries,

    quest: {
      title: data.quest.title.trim(),
      description: data.quest.description.trim(),
    },
  };
}
