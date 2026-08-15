import type { IncomingMessage, ServerResponse } from "node:http";

type ApiResponse = ServerResponse & {
  status(statusCode: number): ApiResponse;
  json(body: unknown): ApiResponse;
};

export default function handler(
  req: IncomingMessage,
  res: ApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
    });
  }

  return res.status(200).json({
    status: "ok",
    service: "SNIFF Canine Sensory Intelligence API",
  });
}
