# Guía de mantenimiento

## Verificaciones rutinarias

- Ejecuta `npm run build` antes de publicar cambios.
- Revisa los enlaces, navegación en móvil, detalle de productos, modo oscuro, carrito y formulario en navegador.
- Comprueba que las rutas de imágenes y videos siguen vigentes y cuentan con autorización.
- Revisa que la información comercial y las respuestas del asistente estén actualizadas.

## Dependencias

- Mantén `package-lock.json` versionado para instalaciones reproducibles.
- Actualiza paquetes de forma deliberada; vuelve a ejecutar `npm install`, `npm run build` y las pruebas manuales de interacción.

## Datos y servicios

- El carrito y la preferencia visual se guardan en el almacenamiento local del navegador.
- El asistente usa preguntas frecuentes locales, no inteligencia artificial remota.
- El formulario abre una conversación de WhatsApp con el texto preparado; el visitante debe confirmar el envío dentro de WhatsApp. No persiste los datos en un servidor.
- No existe integración de pago ni sistema de inventario. No describir estas funciones como disponibles.

Antes de habilitar una API de IA, pagos o recepción real de formularios, implementa un backend seguro, valida entradas y documenta el tratamiento de datos.
