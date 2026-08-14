import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');

    return res.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
    });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'SNIFF Canine Sensory Intelligence API',
  });
}
