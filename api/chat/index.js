import { GeminiError, createRateLimiter, generateReply, validateChatBody } from '../../server/chat.js';

export const config = { maxDuration: 30 };

const allowRequest = createRateLimiter();

function parseBody(body) {
  if (body == null) return null;
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const forwarded = String(req.headers['x-forwarded-for'] || '');
  const ip = forwarded.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (!allowRequest(ip)) {
    return res.status(429).json({ error: 'Se alcanzó el límite temporal de consultas. Inténtalo más tarde.' });
  }

  const body = parseBody(req.body);
  if (body === undefined) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido.' });
  }

  const parsed = validateChatBody(body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const reply = await generateReply(parsed.message, parsed.history);
    return res.status(200).json({ reply });
  } catch (error) {
    if (!(error instanceof GeminiError)) {
      console.error('Chat handler failed:', error);
      return res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
    }
    const payload = { error: error.message };
    if (error.code) payload.code = error.code;
    return res.status(error.status).json(payload);
  }
}
