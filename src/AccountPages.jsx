import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, LoaderCircle, LogOut, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { getAuthErrorMessage, useAuth } from './auth';
import { formatPrice, imageUrl, products } from './data';
import { subscribeOrderHistory } from './history';

export function SignInPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const requestedNext = params.get('next');
  const next = requestedNext?.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/historial';

  if (!loading && user) return <Navigate to={next} replace />;

  async function signIn() {
    setBusy(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (caught) {
      setError(getAuthErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return <main className="account-page section-wrap">
    <section className="account-card">
      <span className="eyebrow">BELLADONA JOYERÍA</span>
      <h1>Tu cuenta, tus momentos.</h1>
      <p>Inicia sesión con Google para guardar conversaciones y consultar tus pedidos.</p>
      <button className="button button-dark google-sign-in" type="button" onClick={signIn} disabled={busy || loading}>
        {busy ? <LoaderCircle className="spin" size={18} /> : <span className="google-mark">G</span>}
        {busy ? 'Conectando con Google…' : 'Continuar con Google'}
      </button>
      {error && <p className="account-error" role="alert">{error}</p>}
      <Link to="/" className="account-back"><ArrowLeft size={15} /> Volver a la tienda</Link>
    </section>
  </main>;
}

function formatOrderDate(date) {
  return date
    ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : 'Fecha pendiente';
}

function SavedLists({ favorites, onToggleFavorite, addToCart, cart, updateQuantity, removeProduct, openCart }) {
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return <div className="account-collections">
    <section className="account-list-panel">
      <header className="account-list-heading">
        <div><span className="eyebrow">TUS PIEZAS GUARDADAS</span><h2>Favoritos <span>({favoriteProducts.length})</span></h2></div>
      </header>
      {favoriteProducts.length
        ? <div className="account-favorite-list">{favoriteProducts.map((product) => <article className="account-favorite-item" key={product.id}>
          <Link to={`/producto/${product.id}`} className="account-item-link">
            <img src={imageUrl(product.image, 180)} alt={product.name} />
            <span><strong>{product.name}</strong><small>{formatPrice(product.price)}</small></span>
          </Link>
          <div className="account-item-actions">
            <button type="button" aria-label={`Añadir ${product.name} a la bolsa`} onClick={() => addToCart(product)}><ShoppingBag size={16} /></button>
            <button type="button" aria-label={`Quitar ${product.name} de favoritos`} onClick={() => onToggleFavorite(product.id)}><Heart size={16} fill="currentColor" /></button>
          </div>
        </article>)}</div>
        : <div className="account-list-empty"><Heart size={23} /><p>Aún no guardas favoritos.</p><Link to="/#coleccion">Explorar colección <ArrowRight size={14} /></Link></div>}
      {favoriteProducts.length > 0 && <p className="account-list-note">Tus favoritos se guardan en este dispositivo.</p>}
    </section>

    <section className="account-list-panel">
      <header className="account-list-heading">
        <div><span className="eyebrow">TU SELECCIÓN</span><h2>Tu bolsa <span>({cart.reduce((count, item) => count + item.quantity, 0)})</span></h2></div>
        {cart.length > 0 && <button className="text-button" type="button" onClick={openCart}>Preparar pedido <ArrowRight size={14} /></button>}
      </header>
      {cart.length
        ? <>
          <div className="account-cart-items">{cart.map(({ product, quantity }) => <article className="account-cart-item" key={product.id}>
            <img src={imageUrl(product.image, 180)} alt={product.name} />
            <div className="account-cart-copy">
              <Link to={`/producto/${product.id}`}>{product.name}</Link>
              <small>{formatPrice(product.price * quantity)}</small>
              <div className="quantity-control">
                <button type="button" aria-label={`Reducir cantidad de ${product.name}`} onClick={() => updateQuantity(product.id, quantity - 1)}><Minus size={12} /></button>
                <span>{quantity}</span>
                <button type="button" aria-label={`Aumentar cantidad de ${product.name}`} onClick={() => updateQuantity(product.id, quantity + 1)}><Plus size={12} /></button>
              </div>
            </div>
            <button className="account-remove-item" type="button" aria-label={`Quitar ${product.name} de la bolsa`} onClick={() => removeProduct(product.id)}><Trash2 size={15} /></button>
          </article>)}</div>
          <div className="account-cart-subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        </>
        : <div className="account-list-empty"><ShoppingBag size={23} /><p>Tu bolsa está vacía.</p><Link to="/#coleccion">Explorar colección <ArrowRight size={14} /></Link></div>}
    </section>
  </div>;
}

export function HistoryPage({ favorites, onToggleFavorite, addToCart, cart, updateQuantity, removeProduct, openCart }) {
  const { user, loading: authLoading, signOutUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError('');
    return subscribeOrderHistory(user.uid, (nextOrders) => {
      setOrders(nextOrders);
      setLoading(false);
    }, (caught) => {
      console.error('Could not load Belladona order history:', caught);
      setError(caught.code === 'permission-denied'
        ? 'Firestore no permite leer el historial. Revisa las reglas de seguridad documentadas en la configuración.'
        : 'No pudimos cargar el historial. Revisa tu conexión e inténtalo otra vez.');
      setLoading(false);
    });
  }, [user]);

  if (authLoading) {
    return <main className="account-page section-wrap"><LoaderCircle className="spin" /></main>;
  }

  if (!user) {
    return <main className="order-history section-wrap">
      <header className="history-heading">
        <div><span className="eyebrow">TU CUENTA</span><h1>Historial de pedidos</h1><p>Inicia sesión con Google para consultar tus pedidos guardados.</p></div>
        <Link to="/ingresar?next=/historial" className="button button-dark">Iniciar sesión <ArrowRight size={16} /></Link>
      </header>
      <section className="history-login-notice">
        <ShoppingBag size={22} />
        <p>Tu bolsa y tus favoritos están disponibles abajo. Inicia sesión para ver los pedidos guardados en tu cuenta.</p>
      </section>
      <SavedLists
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        addToCart={addToCart}
        cart={cart}
        updateQuantity={updateQuantity}
        removeProduct={removeProduct}
        openCart={openCart}
      />
    </main>;
  }

  async function signOut() {
    setSigningOut(true);
    setError('');
    try {
      await signOutUser();
    } catch (caught) {
      console.error('Could not sign out:', caught);
      setError('No pudimos cerrar la sesión. Inténtalo otra vez.');
    } finally {
      setSigningOut(false);
    }
  }

  return <main className="order-history section-wrap">
    <header className="history-heading">
      <div>
        <span className="eyebrow">TU CUENTA</span>
        <h1>Historial de pedidos</h1>
        <p>{user.displayName || user.email}</p>
      </div>
      <button className="button button-outline" type="button" onClick={signOut} disabled={signingOut}>
        {signingOut ? <LoaderCircle className="spin" size={16} /> : <LogOut size={16} />} Cerrar sesión
      </button>
    </header>
    {error && <p className="account-error" role="alert">{error}</p>}
    {loading
      ? <div className="history-empty"><LoaderCircle className="spin" /></div>
      : orders.length
        ? <div className="order-history-list">{orders.map((order) => <article className="order-history-card" key={order.id}>
          <div className="order-history-top">
            <div><span className="eyebrow">REFERENCIA</span><strong>{order.code || order.id}</strong></div>
            <span className="order-status">Pendiente de confirmación</span>
          </div>
          <p className="order-date">{formatOrderDate(order.createdAt)}</p>
          <ul>{order.items.map((item, index) => <li key={`${item.productId}-${index}`}>
            <span>{item.quantity} × {item.name}</span>
            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
          </li>)}</ul>
          <div className="order-total"><span>Total referencial</span><strong>{formatPrice(order.total)}</strong></div>
        </article>)}</div>
        : <div className="history-empty">
          <ShoppingBag size={30} />
          <h2>Aún no tienes pedidos guardados</h2>
          <p>Cuando prepares un pedido para WhatsApp, lo encontrarás aquí.</p>
          <Link to="/#coleccion" className="button button-dark">Explorar colección <ArrowRight size={16} /></Link>
        </div>}
    <SavedLists
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      addToCart={addToCart}
      cart={cart}
      updateQuantity={updateQuantity}
      removeProduct={removeProduct}
      openCart={openCart}
    />
  </main>;
}
