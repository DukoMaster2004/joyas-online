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

## Inicio de sesión e historiales

La tienda reutiliza el proyecto Firebase `miapp-4a216` del proyecto de tesis. La configuración web se carga desde `src/firebase.js`; se puede sustituir con las variables `VITE_FIREBASE_*` del archivo `.env`. La clave web de Firebase identifica el proyecto, no sustituye las reglas de seguridad.

En Firebase Console:

1. En **Authentication → Sign-in method**, habilita **Google** y agrega `localhost` y el dominio publicado en **Authorized domains**.
2. En **Firestore → Rules**, conserva las reglas actuales del proyecto y agrega estas dos reglas dentro de `match /databases/{database}/documents`. Las colecciones tienen nombres propios de Belladona para no mezclarse con los pedidos del proyecto de tesis:

```text
match /belladonaOrders/{orderId} {
  allow create: if request.auth != null
    && request.resource.data.ownerUid == request.auth.uid;
  allow read: if request.auth != null
    && resource.data.ownerUid == request.auth.uid;
  allow update, delete: if false;
}

match /belladonaChatConversations/{conversationId} {
  allow create: if request.auth != null
    && request.resource.data.ownerUid == request.auth.uid;
  allow read, delete: if request.auth != null
    && resource.data.ownerUid == request.auth.uid;
  allow update: if request.auth != null
    && resource.data.ownerUid == request.auth.uid
    && request.resource.data.ownerUid == request.auth.uid;
}
```

Al preparar el pedido en el carrito, se guarda una referencia y el detalle en `belladonaOrders` antes de abrir WhatsApp. El estado se muestra como pendiente porque la tienda no puede confirmar si el mensaje se envió desde WhatsApp. Las conversaciones de Gemini se guardan por usuario en `belladonaChatConversations` y se pueden abrir desde el botón de historial dentro del chat. Sin iniciar sesión, el chat sigue disponible pero no persiste y los pedidos pueden enviarse sin guardarse.

Obtén una clave de Gemini API en Google AI Studio. Si una clave se compartió en una conversación o en código público, revócala y genera una nueva. Nunca añadas el prefijo `VITE_` a `GEMINI_API_KEY`: las variables con ese prefijo se incluyen en el frontend. El archivo `.env` está excluido de Git.

## Ejecutar y desplegar el chat

- `npm run dev` inicia Vite y el servidor Express de la API local en paralelo. La API usa el puerto `3002` por defecto.
- El frontend solicita `POST /api/chat`; Vite reenvía esa ruta al servidor local. Si defines `PORT` en `.env`, Vite usa ese mismo puerto.
- En producción, ejecuta `npm run build` y después `npm start`. Express sirve el build y la API desde el mismo host.
- Configura `GEMINI_API_KEY` y opcionalmente `GEMINI_MODEL` como variables privadas en el entorno del hosting.
- El servidor pasa a Gemini solo la conversación reciente y el contexto publicado de productos, empresa y preguntas frecuentes. Incluye límites de longitud, historial y frecuencia.

Si aún no existe `.env` o falta la clave, el chat funciona en **modo local** con el catálogo y las preguntas frecuentes; no responde con el error de configuración. Para respuestas generativas, agrega una clave válida en `.env` y reinicia `npm run dev`. El chat avisa si se alcanza el límite o Gemini falla. El modelo está limitado a la información proporcionada; confirma los datos comerciales antes de publicarlos.

## Otros datos

1. Reemplaza el catálogo de demostración en `src/data.js` por fichas reales, con precio/material únicamente si se confirmaron.
2. Cambia las imágenes por recursos propios o con licencia adecuada y añade las referencias de licencia si corresponde.
3. Sube videos autorizados a `public/videos/` y completa `videoSlots`.
4. Verifica los datos comerciales, políticas, accesibilidad, enlaces y versión de producción con `npm run build`.

No se incluye sistema de pagos ni persistencia del formulario de contacto. No expongas claves privadas en variables `VITE_*`: esas variables son visibles en el navegador.
