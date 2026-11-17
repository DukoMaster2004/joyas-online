import {
  addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from './firebase';

const ordersCollection = 'belladonaOrders';
const chatsCollection = 'belladonaChatConversations';

function requireUserId(uid) {
  if (!uid) throw new Error('Inicia sesión para guardar tu historial.');
}

function timestampToDate(value) {
  if (value && typeof value.toDate === 'function') return value.toDate();
  return value instanceof Date ? value : null;
}

export async function saveOrderToHistory(user, cart) {
  requireUserId(user?.uid);
  if (!cart.length) throw new Error('Tu bolsa está vacía.');

  const orderRef = doc(collection(db, ordersCollection));
  const code = `BEL-${orderRef.id.slice(0, 8).toUpperCase()}`;
  await setDoc(orderRef, {
    ownerUid: user.uid,
    userEmail: user.email || '',
    code,
    status: 'pending_confirmation',
    total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    createdAt: serverTimestamp(),
    items: cart.map(({ product, quantity }) => ({
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      quantity,
      unitPrice: product.price,
    })),
  });
  return { id: orderRef.id, code };
}

export function subscribeOrderHistory(uid, onChange, onError) {
  requireUserId(uid);
  const ordersQuery = query(collection(db, ordersCollection), where('ownerUid', '==', uid));
  return onSnapshot(ordersQuery, (snapshot) => {
    const orders = snapshot.docs.map((entry) => {
      const data = entry.data();
      return {
        id: entry.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        items: Array.isArray(data.items) ? data.items : [],
      };
    }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    onChange(orders);
  }, onError);
}

export async function saveChatConversation(uid, id, question, messages) {
  requireUserId(uid);
  const safeMessages = messages
    .filter((message) => ['user', 'assistant'].includes(message.role) && typeof message.text === 'string')
    .slice(-40)
    .map(({ role, text }) => ({ role, text: text.slice(0, 1500) }));
  const values = {
    messages: safeMessages,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    await updateDoc(doc(db, chatsCollection, id), values);
    return id;
  }

  const conversationRef = await addDoc(collection(db, chatsCollection), {
    ownerUid: uid,
    title: question.trim().slice(0, 72) || 'Conversación nueva',
    createdAt: serverTimestamp(),
    ...values,
  });
  return conversationRef.id;
}

export function subscribeChatHistory(uid, onChange, onError) {
  requireUserId(uid);
  const conversationsQuery = query(collection(db, chatsCollection), where('ownerUid', '==', uid));
  return onSnapshot(conversationsQuery, (snapshot) => {
    const conversations = snapshot.docs.map((entry) => {
      const data = entry.data();
      return {
        id: entry.id,
        title: typeof data.title === 'string' ? data.title : 'Conversación',
        messages: Array.isArray(data.messages) ? data.messages : [],
        updatedAt: timestampToDate(data.updatedAt),
      };
    }).sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
    onChange(conversations);
  }, onError);
}
