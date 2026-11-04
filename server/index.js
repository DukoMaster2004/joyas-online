import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GeminiError, createRateLimiter, generateReply, isGeminiConfigured, validateChatBody } from './chat.js';

const app = express();
const port = Number(process.env.PORT) || 3002;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowRequest = createRateLimiter();

app.disable('x-powered-by');
app.use(express.json({ limit: '24kb' }));

app.use('/api/chat', (req, res, next) => {
  if (!allowRequest(req.ip)) {
    return res.status(429).json({ error: 'Se alcanzó el límite temporal de consultas. Inténtalo más tarde.' });
  }
  return next();
});

app.get('/api/chat/status', (_req, res) => {
  res.json({ configured: isGeminiConfigured(), provider: 'Gemini' });
});

app.post('/api/chat', async (req, res, next) => {
  const parsed = validateChatBody(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const reply = await generateReply(parsed.message, parsed.history);
    return res.json({ reply });
  } catch (error) {
    if (!(error instanceof GeminiError)) return next(error);
    const payload = { error: error.message };
    if (error.code) payload.code = error.code;
    return res.status(error.status).json(payload);
  }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta de API no encontrada.' }));

app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La solicitud supera el tamaño permitido.' });
  }
  console.error('API request failed:', error.message);
  return res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
});

const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html'), (error) => {
  if (error) res.status(404).send('Build de frontend no encontrado. Ejecuta npm run build.');
}));

const server = app.listen(port, () => {
  console.log(`BELLADONA API escuchando en http://localhost:${port}`);
  if (!isGeminiConfigured()) console.warn('GEMINI_API_KEY no está configurada; el endpoint de chat responderá con HTTP 503.');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya está en uso. Cierra la otra ventana con "npm run dev" o cambia PORT en el archivo .env.`);
    process.exit(1);
  }
  throw error;
});
