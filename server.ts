import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeSceneWithGemini } from "./src/server/geminiService.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support larger payloads for uploaded images
app.use(express.json({ limit: "35mb" }));
app.use(express.urlencoded({ extended: true, limit: "35mb" }));

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "SNIFF Canine Sensory Intelligence API",
  });
});

// Scene analysis endpoint
app.post("/api/sniff", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "IMAGE_REQUIRED",
      });
    }

    const result = await analyzeSceneWithGemini(
      imageBase64,
      mimeType || "image/jpeg",
    );

    return res.json(result);
  } catch (err: unknown) {
    console.error("Server error during /api/sniff analysis:", err);

    const message = err instanceof Error ? err.message : String(err);

    if (message === "IMAGE_TOO_LARGE") {
      return res.status(413).json({ error: message });
    }

    if (message === "UNSUPPORTED_IMAGE_TYPE") {
      return res.status(415).json({ error: message });
    }

    if (message === "INVALID_IMAGE_DATA") {
      return res.status(400).json({ error: message });
    }

    return res.status(500).json({
      error: "SERVICE_UNAVAILABLE",
    });
  }
});

// Production static file serving
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SNIFF server listening on port ${PORT}`);
});
