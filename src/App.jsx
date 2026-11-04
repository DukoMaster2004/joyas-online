import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Heart,
  Instagram, Menu, MessageCircle, Minus, Moon, Plus, Search, ShoppingBag,
  Sun, X,
} from 'lucide-react';
import { company, faqs, formatPrice, galleryImages, imageUrl, products, videoSlots } from './data';

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function Header({ dark, setDark, cartCount, openCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const matches = query.trim()
    ? products.filter((p) => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase()))
    : [];
  const goToProduct = (id) => {
    setSearchOpen(false);
    setQuery('');
    navigate(`/producto/${id}`);
  };
  const nav = [
    ['Colección', '/#coleccion'],
    ['Nuestra historia', '/#nosotros'],
    ['Galería', '/#galeria'],
    ['Contacto', '/#contacto'],
  ];

  return (
    <header className="site-header">
      <button className="icon-button mobile-menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <Link to="/" className="wordmark wordmark-header" aria-label="BELLADONA, inicio">
        <img className="wordmark-logo" src="/logo-diamante.png" alt="" width="34" height="34" />
        <span className="wordmark-text"><span>BELLADONA</span><small>JOYERÍA</small></span>
      </Link>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Buscar productos" onClick={() => setSearchOpen(!searchOpen)}><Search /></button>
        <button className="icon-button theme-toggle" aria-label={dark ? 'Activar tema claro' : 'Activar tema oscuro'} onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button>
        <button className="icon-button bag-button" aria-label={`Abrir carrito, ${cartCount} productos`} onClick={openCart}><ShoppingBag /><span className="bag-count">{cartCount}</span></button>
      </div>
      {searchOpen && <div className="search-panel">
        <div className="search-input-wrap"><Search size={18} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca anillos, collares..." aria-label="Buscar catálogo" /><button className="icon-button" aria-label="Cerrar búsqueda" onClick={() => setSearchOpen(false)}><X size={18} /></button></div>
        {query && <div className="search-results">{matches.length ? matches.map((p) => <button key={p.id} onClick={() => goToProduct(p.id)}><img src={imageUrl(p.image, 120)} alt="" /><span>{p.name}<small>{p.category}</small></span><ArrowUpRight size={16} /></button>) : <p>No encontramos productos para “{query}”.</p>}</div>}
      </div>}
    </header>
  );
}

function ProductCard({ product, addToCart }) {
  const [saved, setSaved] = useState(false);
  return <article className="product-card">
    <Link className="product-image" to={`/producto/${product.id}`}>
      <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
      <span className="product-category">{product.category}</span>
    </Link>
    <button className={`save-product ${saved ? 'saved' : ''}`} aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'} onClick={() => setSaved(!saved)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
    <div className="product-info">
      <div><h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3><p>{product.material}</p></div>
      <span className="price">{formatPrice(product.price)}</span>
    </div>
    <button className="text-button add-button" onClick={() => addToCart(product)}><Plus size={15} /> Añadir a la bolsa</button>
  </article>;
}

function CartDrawer({ open, onClose, cart, updateQuantity, removeProduct }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const unknownPrice = cart.some((item) => item.product.price == null);
  const message = cart.map(({ product, quantity }) => `${product.name} x${quantity} — ${formatPrice(product.price)}`).join('\n');
  const checkoutUrl = company.whatsapp
    ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Hola, quisiera consultar por este pedido:\n${message}\nTotal referencial: ${formatPrice(unknownPrice ? null : subtotal)}`)}`
    : '';
  return <>
    {open && <button className="drawer-backdrop" aria-label="Cerrar carrito" onClick={onClose} />}
    <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-label="Carrito de compras" aria-hidden={!open}>
      <div className="drawer-heading"><div><span className="eyebrow">TU SELECCIÓN</span><h2>Tu bolsa <span>({cart.reduce((n, item) => n + item.quantity, 0)})</span></h2></div><button className="icon-button" aria-label="Cerrar carrito" onClick={onClose}><X /></button></div>
      {cart.length ? <>
        <div className="cart-items">{cart.map(({ product, quantity }) => <article className="cart-item" key={product.id}>
          <img src={imageUrl(product.image, 220)} alt={product.name} />
          <div className="cart-item-copy"><h3>{product.name}</h3><p>{formatPrice(product.price)}</p><div className="quantity-control"><button aria-label={`Reducir cantidad de ${product.name}`} onClick={() => updateQuantity(product.id, quantity - 1)}><Minus size={13} /></button><span>{quantity}</span><button aria-label={`Aumentar cantidad de ${product.name}`} onClick={() => updateQuantity(product.id, quantity + 1)}><Plus size={13} /></button></div></div>
          <button className="remove-button" onClick={() => removeProduct(product.id)}>Eliminar</button>
        </article>)}</div>
        <div className="cart-summary"><div className="summary-line"><span>Subtotal</span><strong>{unknownPrice ? 'Por confirmar' : formatPrice(subtotal)}</strong></div><p>El precio final se confirma directamente con BELLADONA.</p>{checkoutUrl ? <a className="button button-dark full-button" href={checkoutUrl} target="_blank" rel="noreferrer">Consultar por WhatsApp <ArrowUpRight size={16} /></a> : <button className="button button-dark full-button" onClick={() => alert('El número de WhatsApp aún no está configurado. Añade VITE_WHATSAPP_NUMBER en el archivo .env.')}>Configurar WhatsApp <ArrowUpRight size={16} /></button>}</div>
      </> : <div className="empty-cart"><ShoppingBag size={30} /><p>Tu bolsa está esperando una pieza especial.</p><button className="button button-outline" onClick={onClose}>Explorar colección</button></div>}
    </aside>
  </>;
}

function Assistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [localMode, setLocalMode] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hola, soy el asistente de BELLADONA. Puedo ayudarte con información disponible en esta página.' }]);
  useEffect(() => {
    let active = true;
    fetch('/api/chat/status')
      .then((response) => {
        if (!response.ok) throw new Error(`No se pudo consultar la configuración del chat (HTTP ${response.status}).`);
        return response.json();
      })
      .then((status) => {
        if (active) setLocalMode(!status.configured);
      })
      .catch(() => {
        if (active) setLocalMode(true);
      });
    return () => { active = false; };
  }, []);

  function answerLocally(question) {
    const normalized = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const matchedProduct = products.find((product) =>
      `${product.name} ${product.category}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized),
    );
    if (normalized.includes('precio') || normalized.includes('cuesta') || normalized.includes('cuanto')) {
      return 'Los precios todavía no están configurados. Consulta directamente con BELLADONA para conocer el precio actualizado.';
    }
    if (normalized.includes('producto') || normalized.includes('anillo') || normalized.includes('collar') || normalized.includes('arete') || normalized.includes('pulsera')) {
      if (matchedProduct) {
        return `${matchedProduct.name}: ${matchedProduct.description} El material y la disponibilidad deben confirmarse con BELLADONA.`;
      }
      return `En el catálogo de demostración aparecen: ${products.map((product) => `${product.name} (${product.category})`).join(', ')}. Confirma la disponibilidad directamente con BELLADONA.`;
    }
    const faq = faqs.find((item) => {
      const terms = item.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\W+/).filter((term) => term.length > 4);
      return terms.some((term) => normalized.includes(term));
    });
    return faq?.answer || 'El chat está en modo local y no tengo una respuesta confirmada para eso. Configura Gemini para habilitar respuestas generativas o contacta directamente con BELLADONA.';
  }

  async function send(text = draft) {
    const question = text.trim();
    if (!question || loading) return;
    if (localMode === true) {
      setMessages((items) => [...items, {
        role: 'user',
        text: question,
      }, {
        role: 'assistant',
        text: answerLocally(question),
      }]);
      setDraft('');
      setChatError('');
      return;
    }
    const completedTurns = [];
    for (let index = 1; index < messages.length - 1; index += 2) {
      const userMessage = messages[index];
      const assistantMessage = messages[index + 1];
      if (userMessage.role === 'user' && assistantMessage.role === 'assistant') {
        completedTurns.push(
          { role: 'user', text: userMessage.text },
          { role: 'model', text: assistantMessage.text },
        );
      }
    }
    const history = completedTurns.slice(-12);
    setMessages((items) => [...items, { role: 'user', text: question }]);
    setDraft('');
    setChatError('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (result.code === 'GEMINI_NOT_CONFIGURED') {
          setLocalMode(true);
          setMessages((items) => [...items, {
            role: 'assistant',
            text: `Gemini no está configurado; te respondo con la información disponible en la página. ${answerLocally(question)}`,
          }]);
          return;
        }
        throw new Error(result.error || `No se pudo consultar Gemini (HTTP ${response.status}).`);
      }
      if (typeof result.reply !== 'string' || !result.reply.trim()) {
        throw new Error('Gemini devolvió una respuesta vacía. Inténtalo de nuevo.');
      }
      setMessages((items) => [...items, { role: 'assistant', text: result.reply.trim() }]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'No se pudo enviar la consulta a Gemini.');
    } finally {
      setLoading(false);
    }
  };
  return <>
    {open && <section className="chat-panel" aria-label="Chat con asistente BELLADONA">
      <header className="chat-heading"><div className="chat-avatar">B</div><div><strong>Asistente BELLADONA</strong><small>{localMode === true ? 'Modo local · Gemini sin configurar' : localMode === false ? 'Con tecnología Gemini' : 'Conectando…'}</small></div><button className="icon-button" aria-label="Cerrar asistente" onClick={() => setOpen(false)}><X size={18} /></button></header>
      <div className="chat-messages">{messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}>{message.text}</div>)}
        {loading && <div className="chat-message assistant chat-loading" role="status">Gemini está escribiendo…</div>}
        {chatError && <p className="chat-error" role="alert">{chatError}</p>}
        {messages.length === 1 && <div className="suggestions">{['¿Qué productos tienen?', '¿Cuánto cuesta?', '¿Realizan envíos?'].map((q) => <button key={q} onClick={() => send(q)} disabled={loading}>{q}</button>)}</div>}
      </div>
      <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(); }}><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escribe tu consulta..." aria-label="Escribe tu consulta" maxLength={1500} disabled={loading} /><button aria-label="Enviar mensaje" disabled={loading || !draft.trim()}><ArrowRight size={18} /></button></form>
      <small className="chat-privacy">{localMode === true ? 'Respuestas locales; Gemini se activa al configurar la clave.' : 'Tu consulta se procesa con Google Gemini.'}</small>
    </section>}
    <button className="chat-trigger" aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'} onClick={() => setOpen(!open)}>{open ? <X /> : <MessageCircle />}<span>{open ? '' : '¿Te ayudamos?'}</span></button>
  </>;
}

function WhatsappButton() {
  if (!company.whatsapp) return null;
  return <a className="whatsapp-float" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"><MessageCircle /></a>;
}

function Hero() {
  return <section className="hero">
    <img className="hero-image" src={imageUrl('photo-1611652022419-a9419f74343d', 2000)} alt="Detalle editorial de joyería dorada" fetchpriority="high" />
    <div className="hero-wash" />
    <div className="hero-content"><span className="eyebrow hero-eyebrow">JOYAS CON HISTORIA</span><h1>BELLADONA<br /><em>JOYERÍA</em></h1><p>{company.tagline}</p><a className="button button-light" href="#coleccion">Explorar colección <ArrowRight size={16} /></a></div>
    <div className="hero-side-note">HECHO PARA ACOMPAÑARTE <span>—</span> PERÚ</div>
    <a className="hero-scroll" href="#coleccion"><span>DESCUBRE BELLADONA</span><ArrowDown size={15} /></a>
  </section>;
}

function Home({ addToCart }) {
  const [filter, setFilter] = useState('Todos');
  const [activeImage, setActiveImage] = useState(null);
  const categories = ['Todos', 'Anillos', 'Collares', 'Aretes', 'Pulseras', 'Conjuntos', 'Colecciones especiales', 'Regalos'];
  const filtered = filter === 'Todos' ? products : products.filter((p) => p.category === filter);
  const displayedVideos = videoSlots.filter((video) => video.src);
  return <>
    <Hero />
    <main>
      <section className="intro-section section-wrap">
        <span className="eyebrow">UN DETALLE, UNA EMOCIÓN</span>
        <h2>Cada joya cuenta<br /><em>algo de ti.</em></h2>
        <p>Descubre piezas pensadas para acompañar tus momentos y expresar tu esencia.</p>
        <a className="text-button" href="#coleccion">Ver colección <ArrowRight size={16} /></a>
      </section>
      <section className="collection-section section-wrap" id="coleccion">
        <div className="section-heading"><div><span className="eyebrow">SELECCIÓN BELLADONA</span><h2>Piezas <em>especiales</em></h2></div><a href="#galeria" className="text-button desktop-link">Descubrir la galería <ArrowUpRight size={16} /></a></div>
        <div className="filter-row" aria-label="Filtrar por categoría">{categories.map((category) => <button className={filter === category ? 'active' : ''} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div>
        {filtered.length
          ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}</div>
          : <p className="catalog-empty">Todavía no hay piezas confirmadas en esta categoría.</p>}
        <p className="catalog-note">Catálogo de demostración. Confirma disponibilidad, materiales y precios con BELLADONA.</p>
      </section>
      <section className="story-section" id="nosotros">
        <div className="story-image"><img src={imageUrl('photo-1515562141207-7a88fb7ce338', 1200)} alt="Composición editorial para una historia de joyería" loading="lazy" /></div>
        <div className="story-copy"><span className="eyebrow">DE UN SUEÑO A TU COLECCIÓN</span><h2>Nuestra <em>historia</em></h2><p>{company.story}</p><p>Creemos que cada joya representa un momento especial, una emoción y una forma única de expresar la personalidad de quien la lleva.</p><a href="#contacto" className="text-button">Conócenos <ArrowRight size={16} /></a><span className="story-mark">B.</span></div>
      </section>
      <section className="gallery-section section-wrap" id="galeria">
        <div className="section-heading"><div><span className="eyebrow">INSPIRACIÓN BELLADONA</span><h2>Un mundo de <em>detalles</em></h2></div><p>Momentos, texturas y piezas que inspiran.</p></div>
        <div className="gallery-grid">{galleryImages.map((image, index) => <button className={`gallery-tile gallery-tile-${index + 1}`} key={image.id} onClick={() => setActiveImage(image)} aria-label={`Ampliar ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /><span>{image.category} <ArrowUpRight size={14} /></span></button>)}</div>
        <p className="catalog-note">Las imágenes son referencias visuales temporales. Sustitúyelas por fotografías propias o autorizadas antes de publicar.</p>
      </section>
      <section className="video-section">
        <div className="video-copy"><span className="eyebrow">EN MOVIMIENTO</span><h2>La belleza está<br /><em>en los detalles.</em></h2><p>Próximamente, conoce de cerca nuestras piezas y colecciones.</p></div>
        <div className="video-placeholder">{displayedVideos.length ? displayedVideos.slice(0, 3).map((video) => <video key={video.id} controls preload="none" poster={video.poster}><source src={video.src} type="video/mp4" /></video>) : <div className="video-empty"><div className="play-mark">B.</div><span>20 espacios listos para tus videos</span><small>Los videos se mostrarán al agregar archivos autorizados en src/data.js.</small></div>}</div>
      </section>
      <section className="quote-section"><span className="quote-mark">“</span><blockquote>La elegancia no consiste en llamar la atención,<br />sino en permanecer en la memoria.</blockquote><span className="eyebrow">BELLADONA JOYERÍA</span></section>
      <Contact />
    </main>
    <Footer />
    {activeImage && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagen ampliada" onClick={() => setActiveImage(null)}><button className="lightbox-close icon-button" aria-label="Cerrar imagen"><X /></button><img src={activeImage.src.replace('w=900', 'w=1800')} alt={activeImage.alt} onClick={(e) => e.stopPropagation()} /><span>{activeImage.category}</span></div>}
  </>;
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [feedback, setFeedback] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  function submit(e) {
    e.preventDefault();
    if (!Object.values(form).every((value) => value.trim())) {
      setFeedback('Completa todos los campos para preparar tu consulta.');
      setWhatsappLink('');
      return;
    }
    const body = [
      'Hola, quisiera hacer una consulta a BELLADONA JOYERÍA.',
      '',
      `Nombre: ${form.name}`,
      `Celular: ${form.phone}`,
      `Correo: ${form.email}`,
      `Asunto: ${form.subject}`,
      '',
      form.message,
    ].join('\n');
    const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(body)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setFeedback('WhatsApp se abrirá con tu mensaje preparado. Revísalo y pulsa Enviar en WhatsApp.');
    setWhatsappLink(whatsappUrl);
  }
  return <section className="contact-section section-wrap" id="contacto">
    <div className="contact-intro"><span className="eyebrow">ESTAMOS PARA TI</span><h2>Hablemos de<br /><em>algo especial.</em></h2><p>¿Tienes una consulta sobre una pieza? Nos encantará ayudarte.</p>
      <div className="contact-detail"><span>WHATSAPP</span><a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer"><strong>+51 907 244 112</strong></a></div>
      {company.email && <div className="contact-detail"><span>CORREO</span><strong>{company.email}</strong></div>}
      <div className="contact-detail"><span>REDES SOCIALES</span><strong>{company.instagram || 'Instagram por configurar'}</strong></div>
      {company.whatsapp && <a className="text-button" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">Escríbenos por WhatsApp <ArrowUpRight size={15} /></a>}
    </div>
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Nombre completo<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Celular<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
        <label>Correo electrónico<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Asunto<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></label>
      </div>
      <label>Mensaje<textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></label>
      <div className="form-submit-row"><button className="button button-dark" type="submit">Enviar por WhatsApp <ArrowRight size={16} /></button><span>Se abrirá WhatsApp para que confirmes el envío.</span></div>
      {feedback && <p className="form-feedback" role="status">{feedback}{whatsappLink && <> <a href={whatsappLink} target="_blank" rel="noreferrer">Abrir WhatsApp</a></>}</p>}
    </form>
  </section>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main">
    <div className="footer-brand"><Link to="/" className="wordmark"><span>BELLADONA</span><small>JOYERÍA</small></Link><p>Elegancia que refleja tu esencia.</p></div>
    <div className="footer-links"><span className="eyebrow">EXPLORA</span><a href="/#coleccion">Colección</a><a href="/#nosotros">Nuestra historia</a><a href="/#galeria">Galería</a><a href="/#contacto">Contacto</a></div>
    <div className="footer-links"><span className="eyebrow">CONTACTO</span><span>{company.email || 'Correo por configurar'}</span>{company.whatsapp ? <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a> : <span>WhatsApp por configurar</span>}{company.instagram ? <a href={company.instagram} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a> : <span>Instagram por configurar</span>}</div>
    <div className="footer-signoff">B.<span>JOYAS PARA ATESORAR</span></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} BELLADONA JOYERÍA</span><span>Hecho con dedicación en Perú</span><a href="#inicio">Volver arriba ↑</a></div></footer>;
}

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  if (!product) return <main className="not-found"><span className="eyebrow">PIEZA NO ENCONTRADA</span><h1>Esta joya no está aquí.</h1><Link to="/" className="button button-dark"><ArrowLeft size={16} /> Volver al inicio</Link></main>;
  const whatsappUrl = company.whatsapp ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Hola, quisiera consultar por ${product.name}.`)}` : '';
  return <main className="product-detail section-wrap"><Link to="/#coleccion" className="back-link"><ArrowLeft size={15} /> Volver a la colección</Link><div className="detail-grid"><div className="detail-image"><img src={imageUrl(product.image, 1400)} alt={product.name} /></div><div className="detail-copy"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price)}</p><p className="detail-description">{product.description}</p><div className="detail-spec"><span>Material</span><strong>{product.material}</strong></div><div className="detail-spec"><span>Disponibilidad</span><strong>Consultar</strong></div><button className="button button-dark full-button" onClick={() => addToCart(product)}>Añadir a la bolsa <ShoppingBag size={16} /></button>{whatsappUrl ? <a className="button button-outline full-button" href={whatsappUrl} target="_blank" rel="noreferrer">Consultar por WhatsApp <ArrowUpRight size={16} /></a> : <p className="config-note">WhatsApp estará disponible cuando se configure el número comercial.</p>}<p className="catalog-note">Producto de muestra. Confirma la información comercial antes de realizar un pedido.</p></div></div></main>;
}

export default function App() {
  const [dark, setDark] = useState(() => readStorage('belladona-theme', false));
  const [cart, setCart] = useState(() => readStorage('belladona-cart', []));
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { localStorage.setItem('belladona-theme', JSON.stringify(dark)); }, [dark]);
  useEffect(() => { localStorage.setItem('belladona-cart', JSON.stringify(cart)); }, [cart]);
  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  function addToCart(product) {
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      return existing
        ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }
  function updateQuantity(id, quantity) {
    if (quantity < 1) return;
    setCart((items) => items.map((item) => item.product.id === id ? { ...item, quantity } : item));
  }
  function removeProduct(id) { setCart((items) => items.filter((item) => item.product.id !== id)); }
  return <div className={`app ${dark ? 'dark-theme' : ''}`} id="inicio">
    <Header dark={dark} setDark={setDark} cartCount={cartCount} openCart={() => setCartOpen(true)} />
    <Routes>
      <Route path="/" element={<Home addToCart={addToCart} />} />
      <Route path="/producto/:id" element={<><ProductDetail addToCart={addToCart} /><Footer /></>} />
      <Route path="*" element={<main className="not-found"><span className="eyebrow">404</span><h1>Página no encontrada</h1><Link to="/" className="button button-dark">Volver al inicio</Link></main>} />
    </Routes>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeProduct={removeProduct} />
    <Assistant />
    <WhatsappButton />
  </div>;
}
