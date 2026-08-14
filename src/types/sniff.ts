export type DiscoveryCategory =
  | "smell"
  | "sight"
  | "sound"
  | "movement"
  | "social"
  | "exploration";

export interface DiscoveryLocation {
  /**
   * Normalized horizontal coordinate.
   * 0 = left edge, 1 = right edge.
   */
  x: number;

  /**
   * Normalized vertical coordinate.
   * 0 = top edge, 1 = bottom edge.
   */
  y: number;
}

export interface Discovery {
  label: string;
  category: DiscoveryCategory;
  interestScore: number;
  explanation: string;
  confidence: number;
  location: DiscoveryLocation;
}

export interface SniffScene {
  type: string;
  summary: string;
}

export interface SniffQuest {
  title: string;
  description: string;
}

export interface SniffResult {
  scene: SniffScene;
  discoveries: Discovery[];
  quest: SniffQuest;
}

export interface SampleScene {
  id: string;
  title: string;
  locationName: string;
  imageUrl: string;
  description: string;
  precomputedData: SniffResult;
}
