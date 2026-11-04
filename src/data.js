const viteEnv = import.meta.env || {};

export const company = {
  name: 'BELLADONA JOYERÍA',
  tagline: 'Elegancia que refleja tu esencia.',
  story:
    'BELLADONA JOYERÍA nació del sueño y emprendimiento de dos personas, impulsadas por la pasión por la belleza, los detalles y la joyería. Lo que comenzó como un proyecto desde casa continúa creciendo gracias a la dedicación y la confianza de sus clientes.',
  whatsapp: viteEnv.VITE_WHATSAPP_NUMBER || '51907244112',
  email: viteEnv.VITE_CONTACT_EMAIL || '',
  instagram: '',
};

// Datos de muestra para enseñar cómo se configura el catálogo; sustituir antes de publicar.
export const products = [
  { id: 'anillo-luz', name: 'Anillo Luz', category: 'Anillos', description: 'Una pieza delicada para acompañar tus momentos especiales.', material: 'Por confirmar', price: null, image: 'photo-1605100804763-247f67b3557e' },
  { id: 'collar-esencia', name: 'Collar Esencia', category: 'Collares', description: 'Un detalle sutil que aporta luz a cada estilo.', material: 'Por confirmar', price: null, image: 'photo-1599643478518-a784e5dc4c8f' },
  { id: 'aretes-aurora', name: 'Aretes Aurora', category: 'Aretes', description: 'Diseño elegante para llevar de día o de noche.', material: 'Por confirmar', price: null, image: 'photo-1535632066927-ab7c9ab60908' },
  { id: 'pulsera-dalia', name: 'Pulsera Dalia', category: 'Pulseras', description: 'Una silueta clásica con un acabado delicado.', material: 'Por confirmar', price: null, image: 'photo-1611652022419-a9419f74343d' },
  { id: 'anillo-iris', name: 'Anillo Iris', category: 'Anillos', description: 'Una pieza de inspiración atemporal.', material: 'Por confirmar', price: null, image: 'photo-1515562141207-7a88fb7ce338' },
  { id: 'collar-alba', name: 'Collar Alba', category: 'Collares', description: 'Un acento luminoso para combinar a tu manera.', material: 'Por confirmar', price: null, image: 'photo-1617038220319-276d3cfab638' },
];

// Recursos de referencia independientes. Reemplazar por fotografías autorizadas de la marca.
const imageIds = [
  'photo-1605100804763-247f67b3557e',
  'photo-1599643478518-a784e5dc4c8f',
  'photo-1535632066927-ab7c9ab60908',
  'photo-1611652022419-a9419f74343d',
  'photo-1617038220319-276d3cfab638',
  'photo-1611591437281-460bfbe1220a',
  'photo-1611085583191-a3b181a88401',
  'photo-1602173574767-37ac01994b2a',
  'photo-1617038260897-41a1f14a8ca0',
  'photo-1602751584552-8ba73aad10e1',
  'photo-1630019852942-f89202989a59',
  'photo-1619119069152-a2b331eb392a',
  'photo-1611955167811-4711904bb9f8',
  'photo-1515562141207-7a88fb7ce338',
];

export const galleryImages = imageIds.map((id, index) => ({
  id: `gallery-${index + 1}`,
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`,
  alt: `Fotografía de joyería ${index + 1}`,
  category: ['Anillos', 'Collares', 'Aretes', 'Pulseras', 'Colecciones'][index % 5],
}));

// Espacios preparados: no se muestran reproducciones hasta cargar videos autorizados.
export const videoSlots = Array.from({ length: 20 }, (_, index) => ({
  id: `video-${index + 1}`,
  title: `Video de colección ${String(index + 1).padStart(2, '0')}`,
  src: '',
  poster: '',
}));

export const faqs = [
  { question: '¿Qué tipos de joyas ofrecen?', answer: 'El catálogo de demostración incluye anillos, collares, aretes y pulseras. Consulta el catálogo para ver las piezas cargadas.' },
  { question: '¿Cuánto cuesta un producto?', answer: 'Los precios todavía no están configurados. Escríbenos por WhatsApp para consultar el precio actualizado de una pieza.' },
  { question: '¿Qué materiales utilizan?', answer: 'La información de materiales aún debe ser confirmada por BELLADONA. Contáctanos para recibir los detalles exactos de cada producto.' },
  { question: '¿Realizan envíos?', answer: 'La cobertura y las condiciones de envío deben confirmarse directamente con BELLADONA. Podemos ayudarte a iniciar una consulta por WhatsApp.' },
];

export const formatPrice = (price) =>
  price == null
    ? 'Consultar precio'
    : new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price);

export const imageUrl = (imageId, width = 900) =>
  `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=${width}&q=82`;
