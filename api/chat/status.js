import { isGeminiConfigured } from '../../server/chat.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ configured: isGeminiConfigured(), provider: 'Gemini' });
}
