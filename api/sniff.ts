import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
    });
  }

  const { imageBase64, mimeType } = req.body ?? {};

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return res.status(400).json({
      error: "IMAGE_REQUIRED",
    });
  }

  try {
    /**
     * Load the Gemini integration only after
     * the request has passed basic validation.
     *
     * This prevents a provider/module startup
     * problem from crashing the entire Vercel
     * function before the handler can respond.
     */
    const { analyzeSceneWithGemini } =
      await import("../src/server/geminiService");

    const result = await analyzeSceneWithGemini(
      imageBase64,
      typeof mimeType === "string" ? mimeType : "image/jpeg",
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("SNIFF analysis failed:", error);

    return res.status(500).json({
      error: "SERVICE_UNAVAILABLE",
    });
  }
}
