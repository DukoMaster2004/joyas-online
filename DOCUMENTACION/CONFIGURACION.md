# Configuración y preparación para publicación

1. Instala Node.js 18 o posterior.
2. Ejecuta `npm install` y `npm run dev`.
3. Duplica `.env.example` como `.env` y configura datos oficiales:

```dotenv
VITE_WHATSAPP_NUMBER=519XXXXXXXX
VITE_CONTACT_EMAIL=contacto@tudominio.pe
```

4. Reemplaza el catálogo de demostración en `src/data.js` por fichas reales, con precio/material únicamente si se confirmaron.
5. Cambia las imágenes por recursos propios o con licencia adecuada y añade las referencias de licencia si corresponde.
6. Sube videos autorizados a `public/videos/` y completa `videoSlots`.
7. Verifica los datos comerciales, políticas, accesibilidad, enlaces y versión de producción con `npm run build`.

No se incluye backend, sistema de pagos, autenticación ni envío de formularios. No expongas claves privadas en variables `VITE_*`: esas variables son visibles en el navegador.
