# Configuración y preparación para publicación

1. Instala Node.js 18 o posterior.
2. Ejecuta `npm install` y `npm run dev`.
3. Duplica `.env.example` como `.env` y configura datos oficiales:

```dotenv
VITE_WHATSAPP_NUMBER=51907244112
VITE_CONTACT_EMAIL=contacto@tudominio.pe
GEMINI_API_KEY=tu_clave_nueva_de_google_ai_studio
GEMINI_MODEL=gemini-3.6-flash
```

El número WhatsApp configurado es Perú `+51 907 244 112`. El formulario abre ese chat con los campos llenos como mensaje; el usuario debe confirmar y enviar desde WhatsApp. Cambia `VITE_WHATSAPP_NUMBER` si el número comercial cambia.

Obtén una clave de Gemini API en Google AI Studio. Si una clave se compartió en una conversación o en código público, revócala y genera una nueva. Nunca añadas el prefijo `VITE_` a `GEMINI_API_KEY`: las variables con ese prefijo se incluyen en el frontend. El archivo `.env` está excluido de Git.

## Ejecutar y desplegar el chat

- `npm run dev` inicia Vite y el servidor Express de la API local en paralelo.
- El frontend solicita `POST /api/chat`; Vite reenvía esa ruta al servidor local.
- En producción, ejecuta `npm run build` y después `npm start`. Express sirve el build y la API desde el mismo host.
- Configura `GEMINI_API_KEY` y opcionalmente `GEMINI_MODEL` como variables privadas en el entorno del hosting.
- El servidor pasa a Gemini solo la conversación reciente y el contexto publicado de productos, empresa y preguntas frecuentes. Incluye límites de longitud, historial y frecuencia.

El chat avisa explícitamente si falta la clave, se alcanza el límite o Gemini falla. El modelo está limitado a la información proporcionada; confirma los datos comerciales antes de publicarlos.

## Otros datos

1. Reemplaza el catálogo de demostración en `src/data.js` por fichas reales, con precio/material únicamente si se confirmaron.
2. Cambia las imágenes por recursos propios o con licencia adecuada y añade las referencias de licencia si corresponde.
3. Sube videos autorizados a `public/videos/` y completa `videoSlots`.
4. Verifica los datos comerciales, políticas, accesibilidad, enlaces y versión de producción con `npm run build`.

No se incluye sistema de pagos ni persistencia del formulario de contacto. No expongas claves privadas en variables `VITE_*`: esas variables son visibles en el navegador.
