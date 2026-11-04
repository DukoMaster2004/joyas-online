# Instalación

## Requisitos

- Node.js 18 o posterior.
- npm incluido con Node.js.

## Desarrollo local

Desde la carpeta del proyecto:

```bash
npm install
npm run dev
```

Abre la URL local que imprime Vite. El servidor de desarrollo utiliza recarga automática.

## Configurar Gemini

1. Copia `.env.example` a `.env`.
2. Añade una clave nueva de Google AI Studio en `GEMINI_API_KEY` (no uses una que se haya compartido en un chat) y deja `GEMINI_MODEL=gemini-3.6-flash` salvo que quieras seleccionar otro modelo disponible en tu cuenta.
3. Reinicia `npm run dev` si ya estaba iniciado. El chat requiere conexión a internet y una clave válida.

La clave se lee solo en el servidor Express; no se compila dentro de React/Vite. No la publiques ni la configures con el prefijo `VITE_`.

## Producción local

```bash
npm run build
npm start
```

`npm start` sirve la carpeta `dist/` y la API Gemini en el mismo servidor. Configura `GEMINI_API_KEY` como variable privada del entorno del hosting. No uses `npm run preview` para probar el chat integrado: ese comando solo sirve el frontend y no el endpoint Express.
