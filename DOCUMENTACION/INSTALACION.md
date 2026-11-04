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

## Producción local

```bash
npm run build
npm run preview
```

La carpeta `dist/` es el resultado optimizado que se publica en un hosting estático compatible con Vite. Configura el hosting para redirigir las rutas de `BrowserRouter` a `index.html`.
