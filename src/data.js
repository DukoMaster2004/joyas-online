const viteEnv = import.meta.env || {};

export const company = {
  name: 'BELLADONA JOYERÍA',
  tagline: 'Elegancia que refleja tu esencia.',
  story:
    'BELLADONA JOYERÍA nació del sueño y emprendimiento de dos personas, impulsadas por la pasión por la belleza, los detalles y la joyería. Lo que comenzó como un proyecto desde casa continúa creciendo gracias a la dedicación y la confianza de sus clientes.',
  whatsapp: viteEnv.VITE_WHATSAPP_NUMBER || '51907244112',
  whatsappChannel: 'https://whatsapp.com/channel/0029VbFzH7A0lwgymnBDUz3B',
  whatsappGroup: 'https://chat.whatsapp.com/Fvdrc9FN3PuDImuQoXvEn9',
  email: viteEnv.VITE_CONTACT_EMAIL || '',
  instagram: '',
};

export const products = [
  { id: 'flor-de-cataleya', name: 'Flor de Cataleya', category: 'Collares', description: 'Collar dorado con dije de cataleya en tonos tornasol y bolitas deslizantes en la cadena.', material: 'Metal dorado con dije tornasol', availability: 'Disponible', price: 45, image: '/productos/flor-cataleya.jpg' },
  { id: 'collar-corazon-rojo', name: 'Collar Corazón Rojo', category: 'Collares', description: 'Collar dorado con dije de corazón rojo, un detalle lleno de significado.', material: 'Metal dorado con dije esmaltado rojo', availability: 'Disponible', price: 40, image: '/productos/collar-corazon-rojo.jpg' },
  { id: 'collar-perlita-plateado', name: 'Collar Perlita Plateado', category: 'Collares', description: 'Collar plateado con perlita cristal brillante, sutil y luminosa.', material: 'Metal plateado con piedra cristal', availability: 'Disponible', price: 35, image: '/productos/collar-perlita-plateado.jpg' },
  { id: 'collar-corazon-pequeno', name: 'Collar Corazón Pequeño', category: 'Collares', description: 'Collar dorado con dije de corazón pequeño y piedra brillante, delicado y especial.', material: 'Metal dorado con piedra cristal', availability: 'Disponible', price: 45, image: '/productos/collar-corazon-pequeno.jpg' },
  { id: 'collar-piedra-negra', name: 'Collar Piedra Negra', category: 'Collares', description: 'Collar dorado con dije ovalado de piedra negra, elegante y con carácter.', material: 'Metal dorado con piedra negra', availability: 'Disponible', price: 38, image: '/productos/collar-piedra-negra.jpg' },
  { id: 'pulseras-2-en-1', name: 'Pulseras 2 en 1', category: 'Pulseras', description: 'Dos pulseras doradas en un solo set: una con cuentas rojas trenzadas y otra de cadena fina con piedra cristal.', material: 'Metal dorado con cuentas rojas y piedra cristal', availability: 'Disponible', price: 40, image: '/productos/pulseras-2-en-1.jpg' },
];

// Galería oculta por ahora (sin fotos). Para mostrarla de nuevo, descomenta el bloque de abajo.
export const galleryImages = [];
// const imageIds = [
//   'photo-1605100804763-247f67b3557e',
//   'photo-1599643478518-a784e5dc4c8f',
//   'photo-1535632066927-ab7c9ab60908',
//   'photo-1611652022419-a9419f74343d',
//   'photo-1617038220319-276d3cfab638',
//   'photo-1611591437281-460bfbe1220a',
//   'photo-1611085583191-a3b181a88401',
//   'photo-1602173574767-37ac01994b2a',
//   'photo-1617038260897-41a1f14a8ca0',
//   'photo-1602751584552-8ba73aad10e1',
//   'photo-1630019852942-f89202989a59',
//   'photo-1619119069152-a2b331eb392a',
//   'photo-1611955167811-4711904bb9f8',
//   'photo-1515562141207-7a88fb7ce338',
// ];
//
// export const galleryImages = imageIds.map((id, index) => ({
//   id: `gallery-${index + 1}`,
//   src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`,
//   alt: `Fotografía de joyería ${index + 1}`,
//   category: ['Anillos', 'Collares', 'Aretes', 'Pulseras', 'Colecciones'][index % 5],
// }));

// Espacios preparados: no se muestran reproducciones hasta cargar videos autorizados.
export const videoSlots = Array.from({ length: 20 }, (_, index) => ({
  id: `video-${index + 1}`,
  title: `Video de colección ${String(index + 1).padStart(2, '0')}`,
  src: '',
  poster: '',
}));

export const faqs = [
  { question: '¿Qué productos ofrecen?', answer: 'Tenemos cinco modelos de collares — Flor de Cataleya, Corazón Rojo, Perlita Plateado, Corazón Pequeño y Piedra Negra — y un set de Pulseras 2 en 1. Puedes verlos todos en la colección.' },
  { question: '¿Cuánto cuestan?', answer: 'Los precios van de S/ 35 a S/ 45 según la pieza. Cada producto muestra su precio en el catálogo.' },
  { question: '¿Cómo hago un pedido?', answer: 'Agrega las piezas al carrito y presiona "Hacer pedido por WhatsApp". Ahí se confirman la disponibilidad y las formas de pago.' },
  { question: '¿Qué materiales utilizan?', answer: 'Cada pieza indica su material en su ficha: tenemos opciones doradas y plateadas con piedras cristal, detalles esmaltados y cuentas.' },
  { question: '¿Realizan envíos?', answer: 'Las condiciones y el costo de envío se coordinan por WhatsApp al confirmar tu pedido.' },
];

export const formatPrice = (price) =>
  price == null
    ? 'Consultar precio'
    : new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price);

export const imageUrl = (image, width = 900) =>
  image.startsWith('/') || image.startsWith('http')
    ? image
    : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=82`;
