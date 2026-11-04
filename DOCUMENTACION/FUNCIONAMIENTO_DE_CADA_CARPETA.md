# Funcionamiento de carpetas y archivos

- `public/`: recursos estáticos locales como favicon, logo, fotografías y videos cuando se entreguen archivos aprobados.
- `src/`: código de la aplicación.
- `src/main.jsx`: monta React y BrowserRouter en el documento.
- `src/App.jsx`: componentes de navegación, catálogo, producto, búsqueda, carrito, galería, asistente, contacto y pie de página.
- `src/data.js`: configuración editable del negocio, productos de demostración, referencias de imágenes, 20 espacios de video y respuestas locales.
- `src/styles.css`: paleta, componentes visuales, modo oscuro y breakpoints responsive.
- `index.html`: idioma, título, descripción y fuentes de la web.
- `.env.example`: nombres de variables para el número de WhatsApp y correo. Duplica a `.env` para desarrollo local.

## Personalización

- Productos: sustituir los registros en `products` dentro de `src/data.js`. Define precios solamente cuando sean oficiales; `null` presenta “Consultar precio”.
- Fotografías: cambiar `image` en productos y los identificadores de imagen de `galleryImages` en `src/data.js`. La galería trae referencias visuales temporales, no las 30 fotos oficiales solicitadas. Sustitúyelas o amplíalas con fotografías propias o autorizadas. Para recursos locales, guarda archivos aprobados en `public/images/` y usa rutas como `/images/anillo-01.jpg`.
- Videos: completa `src` y `poster` en los 20 elementos de `videoSlots` en `src/data.js`; los espacios vacíos no muestran reproductores ficticios.
- WhatsApp: define `VITE_WHATSAPP_NUMBER` en `.env`, sin signo más ni separadores.
- Correo: define `VITE_CONTACT_EMAIL`; el formulario usa `mailto:` y no envía datos a un servidor.
- Redes sociales: cambia `instagram` en el objeto `company` por la URL oficial.
- Colores: edita las variables CSS al principio de `src/styles.css`.
- Asistente: mantén respuestas verificadas en `faqs` en `src/data.js`; la lógica de consulta local está en `Assistant` en `src/App.jsx`. Una integración con IA requiere un backend que proteja la clave y aporte contexto comercial confirmado.
- Páginas: agrega rutas en `Routes` en `src/App.jsx`; para componentes nuevos, se pueden extraer del mismo archivo a `src/components/`.

La marca, los productos, materiales, disponibilidad y medios son configurables. Confirma su exactitud antes de hacer pública la web.
