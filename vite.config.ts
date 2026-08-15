import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, Plugin } from "vite";
import dotenv from "dotenv";
import { analyzeSceneWithGemini } from "./src/server/geminiService";

dotenv.config();

const MAX_DEV_REQUEST_BODY_LENGTH = 35 * 1024 * 1024;

function sniffApiPlugin(): Plugin {
  return {
    name: "sniff-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/health" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "ok",
              service: "SNIFF Canine Sensory API (Dev)",
            }),
          );
          return;
        }

        if (req.url === "/api/sniff" && req.method === "POST") {
          let body = "";
          let bodyTooLarge = false;

          req.on("data", (chunk) => {
            if (bodyTooLarge) {
              return;
            }

            body += chunk;

            if (body.length > MAX_DEV_REQUEST_BODY_LENGTH) {
              body = "";
              bodyTooLarge = true;
            }
          });

          req.on("end", async () => {
            if (bodyTooLarge) {
              res.statusCode = 413;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "IMAGE_TOO_LARGE" }));
              return;
            }

            try {
              const { imageBase64, mimeType } = JSON.parse(body);
              if (!imageBase64) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: "Missing imageBase64 in request" }),
                );
                return;
              }

              const result = await analyzeSceneWithGemini(
                imageBase64,
                mimeType || "image/jpeg",
              );
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (error: unknown) {
              console.error("API Error in dev server:", error);

              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");

              res.end(
                JSON.stringify({
                  error: "SERVICE_UNAVAILABLE",
                }),
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sniffApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
      port: 3000,
      host: "0.0.0.0",
    },
  };
});
