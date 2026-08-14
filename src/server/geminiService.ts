import { GoogleGenAI, Type } from "@google/genai";
import type { SniffResult } from "../types/sniff";
import { validateSniffResult } from "../utils/validateSniff";

const MODEL = "gemini-3.6-flash";

const SUPPORTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const MAX_BASE64_LENGTH = 28_000_000;

function prepareImage(
  base64Image: string,
  fallbackMimeType = "image/jpeg",
): {
  data: string;
  mimeType: string;
} {
  let data = base64Image.trim();
  let mimeType = fallbackMimeType.toLowerCase();

  // Handle a complete data URI:
  // data:image/jpeg;base64,...
  if (data.startsWith("data:")) {
    const commaIndex = data.indexOf(",");

    if (commaIndex === -1) {
      throw new Error("INVALID_IMAGE_DATA");
    }

    const metadata = data.slice(0, commaIndex);
    data = data.slice(commaIndex + 1);

    const mimeMatch = metadata.match(/^data:([^;]+);base64$/i);

    if (!mimeMatch) {
      throw new Error("INVALID_IMAGE_DATA");
    }

    mimeType = mimeMatch[1].toLowerCase();
  }

  if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }

  if (!data) {
    throw new Error("INVALID_IMAGE_DATA");
  }

  if (data.length > MAX_BASE64_LENGTH) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  return {
    data,
    mimeType,
  };
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    scene: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          description: "Simple uppercase scene name",
        },
        summary: {
          type: Type.STRING,
          description: "Concise one-sentence observational summary",
        },
      },
      required: ["type", "summary"],
    },

    discoveries: {
      type: Type.ARRAY,
      description: "Four to six visible environmental discoveries",
      minItems: 4,
      maxItems: 6,
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: "Simple name for a clearly visible feature",
          },

          category: {
            type: Type.STRING,
            enum: [
              "smell",
              "sight",
              "sound",
              "movement",
              "social",
              "exploration",
            ],
          },

          interestScore: {
            type: Type.INTEGER,
            minimum: 0,
            maximum: 100,
          },

          explanation: {
            type: Type.STRING,
            description:
              "One concise, grounded explanation based on visible evidence",
          },

          confidence: {
            type: Type.NUMBER,
            minimum: 0,
            maximum: 1,
          },

          location: {
            type: Type.OBJECT,
            properties: {
              x: {
                type: Type.NUMBER,
                minimum: 0,
                maximum: 1,
                description:
                  "Normalized horizontal center coordinate from left to right",
              },
              y: {
                type: Type.NUMBER,
                minimum: 0,
                maximum: 1,
                description:
                  "Normalized vertical center coordinate from top to bottom",
              },
            },
            required: ["x", "y"],
          },
        },

        required: [
          "label",
          "category",
          "interestScore",
          "explanation",
          "confidence",
          "location",
        ],
      },
    },

    quest: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "Short observational Sniff Quest title",
        },

        description: {
          type: Type.STRING,
          description:
            "Safe observational prompt based only on visible scene features",
        },
      },

      required: ["title", "description"],
    },
  },

  required: ["scene", "discoveries", "quest"],
};

const systemInstruction = `
You are SNIFF, an observational scene-analysis system.

SNIFF helps people examine an environment from a dog-oriented exploratory
perspective using only information visible in a photograph.

GROUNDING

Analyze only features visibly supported by the image, including:

- surfaces
- terrain transitions
- vegetation
- people
- animals when clearly visible
- movement
- paths
- boundaries
- objects
- lighting
- shade
- spatial structure

Never claim that the photograph allows you to directly detect:

- smells
- scent molecules
- scent trails
- chemical traces
- ultrasonic sounds
- invisible animal markings
- a dog's thoughts, feelings, intentions, or behavior

A discovery category such as "smell" describes possible sensory relevance.
It does not mean SNIFF detected an actual smell.

DISCOVERY SELECTION

Return exactly 4 to 6 meaningful discoveries.

Be selective rather than listing everything visible.

Spread discoveries across distinct parts of the image when possible.

Every discovery must correspond to a clearly visible feature.

LABELS

Use short, plain labels.

Prefer:
TREE BASE
PATH EDGE
SHADED GRASS
CYCLIST
LOW BENCH

Avoid unsupported specificity such as:
MATURE OAK
VICTORIAN TEAK BENCH

CATEGORIES

Each discovery must use exactly one:

smell
sight
sound
movement
social
exploration

SCORING

interestScore is a relative SNIFF score from 0 to 100.

It is an editorial ranking for this experience, not a scientific measurement.

confidence represents confidence that the identified visible feature and
interpretation are supported by the photograph.

EXPLANATIONS

Use one concise sentence.

Write in plain, grounded language.

Do not use authoritative behavioral claims such as:

"in canine exploration"
"triggers instinct"
"tactile curiosity"
"dogs will"
"dogs always"

COORDINATES

For each discovery, provide the approximate CENTER of its visible feature.

Use normalized coordinates:

x = 0.0 at the left edge
x = 1.0 at the right edge

y = 0.0 at the top edge
y = 1.0 at the bottom edge

Coordinates must refer to the actual visible feature and must never be random.

QUEST

Create one short observational Sniff Quest based only on visible features.

The quest must not instruct the user to:

- walk toward something
- follow a route
- approach a person or animal
- touch or consume anything
- interact with traffic or hazards

Prefer observation and comparison.

Example:
"Compare the open grass with the shaded tree line and notice how the visible
surfaces change."

STYLE

Concise.
Calm.
Editorial.
Grounded.
No pseudo-scientific language.
`;

const userPrompt = `
Analyze this photograph for SNIFF.

Return the required structured field report using only visible evidence.

Choose 4 to 6 meaningful discoveries and place each marker at the approximate
center of the visible feature it describes.
`;

export async function analyzeSceneWithGemini(
  base64Image: string,
  mimeType = "image/jpeg",
): Promise<SniffResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }

  const image = prepareImage(base64Image, mimeType);

  const ai = new GoogleGenAI({
    apiKey,
  });

  const response = await ai.models.generateContent({
    model: MODEL,

    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
    ],

    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const responseText = response.text?.trim();

  if (!responseText) {
    throw new Error("EMPTY_MODEL_RESPONSE");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("INVALID_MODEL_JSON");
  }

  const validated = validateSniffResult(parsed);

  if (!validated) {
    throw new Error("INVALID_MODEL_RESPONSE");
  }

  return validated;
}
