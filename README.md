# BELLADONA JOYERÍA

Tienda web responsive construida con React, Vite y Express. Incluye catálogo de demostración, filtros, búsqueda, detalle de producto, carrito persistente, tema claro/oscuro, galería ampliable, chat conectado con Gemini, inicio de sesión con Google e historiales de pedidos y conversaciones en Firebase.

## Requisitos

- Node.js 18 o posterior
- npm

## Ejecutar localmente

```bash
npm install
npm run dev
```

Vite muestra la dirección local en la terminal. Mientras `GEMINI_API_KEY` no esté configurada, el chat sigue respondiendo desde la información local del catálogo y las preguntas frecuentes. Para habilitar Gemini, configura `.env` como se describe en `DOCUMENTACION/CONFIGURACION.md` y reinicia el servidor.

El inicio con Google y los historiales usan el proyecto Firebase compartido con la app de tesis. Habilita Google en Firebase Authentication y agrega las reglas de Firestore indicadas en `DOCUMENTACION/CONFIGURACION.md` antes de usar estas funciones.

Para validar una versión de producción:

```bash
npm run build
npm start
```

## Antes de publicar

Los nombres, imágenes, materiales y textos del catálogo son datos de demostración, no representan inventario confirmado. La galería contiene referencias visuales temporales únicas, no una colección oficial ni las 30 fotos finales solicitadas; sustituye o amplía la selección con fotografías propias o autorizadas. No hay precios oficiales ni políticas de envío configuradas.

1. Copia `.env.example` a `.env`, agrega el número oficial de WhatsApp (formato internacional, sin `+` ni espacios), el correo y una clave válida de Gemini.
2. Edita el catálogo y los datos de marca en `src/data.js`.
3. Añade únicamente videos con autorización y sus rutas en `videoSlots` en `src/data.js`.
4. Revisa `DOCUMENTACION/CONFIGURACION.md` antes de desplegar.

El chat usa Gemini desde el servidor Node/Express (`server/index.js`); la clave permanece en el servidor y no se envía al navegador. Si recibiste o compartiste una clave en un chat, revócala y genera otra antes de guardarla en `.env`.

## Publicar en Vercel

El frontend se compila con Vite y el chat se ejecuta como función serverless en `api/`.

1. Importa el repositorio en Vercel.
2. En Settings → Environment Variables agrega `GEMINI_API_KEY` y, si quieres cambiar el modelo, `GEMINI_MODEL`. Opcionalmente `VITE_WHATSAPP_NUMBER` y `VITE_CONTACT_EMAIL`.
3. Despliega: Vercel ejecuta `npm run build` y publica `dist`.

`vercel.json` ya configura la compilación y las rutas de React. Las variables con prefijo `VITE_` se fijan al compilar, así que un cambio en ellas requiere volver a desplegar. La clave de Gemini solo se lee en el servidor y nunca llega al navegador.
