import { SampleScene } from "../types/sniff";

export const SAMPLE_SCENES: SampleScene[] = [
  {
    id: "city-park",
    title: "01 - CITY PARK",
    locationName: "Sunlit Meadow & Walking Path",
    imageUrl:
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=85",
    description:
      "An open lawn framed by mature tree trunks, wooden park benches, and dirt edge pathways.",
    precomputedData: {
      scene: {
        type: "CITY PARK",
        summary:
          "Open grass, mature trees, a shaded path, and several distinct surface transitions.",
      },
      discoveries: [
        {
          label: "TREE BASE",
          category: "exploration",
          interestScore: 92,
          explanation:
            "The rough tree base creates a distinct natural landmark with a different surface and texture from the surrounding grass.",
          confidence: 0.95,
          location: { x: 0.32, y: 0.55 },
        },
        {
          label: "SHADED GRASS",
          category: "sight",
          interestScore: 84,
          explanation:
            "A clear shadow boundary cast across the lawn, creating visual contrast between bright and dark turf.",
          confidence: 0.91,
          location: { x: 0.58, y: 0.72 },
        },
        {
          label: "BENCH BASE",
          category: "exploration",
          interestScore: 78,
          explanation:
            "A low clearance beneath the wooden park bench slats that creates a semi-enclosed pocket near ground level.",
          confidence: 0.88,
          location: { x: 0.78, y: 0.62 },
        },
        {
          label: "PATH EDGE",
          category: "exploration",
          interestScore: 71,
          explanation:
            "A visible shift in surface texture from grass to compacted soil along the route.",
          confidence: 0.89,
          location: { x: 0.44, y: 0.88 },
        },
        {
          label: "DISTANT FIGURE",
          category: "social",
          interestScore: 65,
          explanation: "A person visible near the tree line on open ground.",
          confidence: 0.87,
          location: { x: 0.86, y: 0.48 },
        },
      ],
      quest: {
        title: "GROUND SHIFT",
        description:
          "Look for three visible transitions in the scene: grass to path, sunlight to shade, and open space to tree cover.",
      },
    },
  },
  {
    id: "woodland-trail",
    title: "02 - WOODLAND TRAIL",
    locationName: "Forest Corridor & Loam Path",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85",
    description:
      "A quiet woodland path flanked by tall conifer trunks, fern clusters, and fallen pine needle litter.",
    precomputedData: {
      scene: {
        type: "WOODLAND TRAIL",
        summary:
          "A shaded dirt trail surrounded by conifer trees, exposed surface roots, and low ferns.",
      },
      discoveries: [
        {
          label: "EXPOSED ROOT",
          category: "exploration",
          interestScore: 95,
          explanation:
            "A raised wooden root arching across the dirt surface, creating varied footing and elevation.",
          confidence: 0.96,
          location: { x: 0.46, y: 0.78 },
        },
        {
          label: "FERN CLUSTER",
          category: "sight",
          interestScore: 86,
          explanation:
            "Dense low-lying fronds along the trail edge that create a visual and physical boundary at ground level.",
          confidence: 0.92,
          location: { x: 0.22, y: 0.68 },
        },
        {
          label: "SUNLIGHT PATCH",
          category: "sight",
          interestScore: 74,
          explanation:
            "A beam of sunlight breaking through the canopy onto the damp soil surface.",
          confidence: 0.9,
          location: { x: 0.64, y: 0.6 },
        },
        {
          label: "FALLEN LOG",
          category: "exploration",
          interestScore: 88,
          explanation:
            "A weathered log with coarse bark resting beside the path.",
          confidence: 0.93,
          location: { x: 0.76, y: 0.74 },
        },
        {
          label: "TRAIL CORRIDOR",
          category: "movement",
          interestScore: 68,
          explanation: "A long narrow path extending ahead through the trees.",
          confidence: 0.85,
          location: { x: 0.5, y: 0.46 },
        },
      ],
      quest: {
        title: "CANOPY & ROOT MATRIX",
        description:
          "Observe how the tree roots and fallen needles create distinct ground contours alongside the low-lying fern fronds.",
      },
    },
  },
  {
    id: "home-kitchen",
    title: "03 - HOME KITCHEN",
    locationName: "Indoor Hardwood & Cabinetry",
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85",
    description:
      "An open domestic kitchen with polished hardwood flooring, kitchen island base, and lower wooden cabinets.",
    precomputedData: {
      scene: {
        type: "HOME KITCHEN",
        summary:
          "An indoor room with hardwood flooring, lower wooden cabinetry, and stool legs.",
      },
      discoveries: [
        {
          label: "CABINET BASE",
          category: "exploration",
          interestScore: 94,
          explanation:
            "A continuous recessed channel along the base of the lower cabinets near the floor.",
          confidence: 0.95,
          location: { x: 0.28, y: 0.74 },
        },
        {
          label: "STOOL LEGS",
          category: "exploration",
          interestScore: 82,
          explanation:
            "A grouping of vertical wooden and metal legs that form a narrow ground-level obstacle.",
          confidence: 0.91,
          location: { x: 0.72, y: 0.7 },
        },
        {
          label: "FLOOR REFLECTION",
          category: "sight",
          interestScore: 76,
          explanation:
            "Surface light reflection visible across the smooth polished wood boards.",
          confidence: 0.89,
          location: { x: 0.48, y: 0.84 },
        },
        {
          label: "COUNTER OVERHANG",
          category: "sight",
          interestScore: 85,
          explanation:
            "The protruding edge of the island countertop situated above floor eye level.",
          confidence: 0.93,
          location: { x: 0.52, y: 0.44 },
        },
        {
          label: "FLOOR JOINTS",
          category: "exploration",
          interestScore: 63,
          explanation:
            "Parallel seam lines running between individual floor planks.",
          confidence: 0.86,
          location: { x: 0.38, y: 0.92 },
        },
      ],
      quest: {
        title: "HORIZONTAL SIGHTLINES",
        description:
          "Observe the continuous ground-level channel formed beneath the cabinets and how light reflects across the polished wood planks.",
      },
    },
  },
];
