import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext(null);

export function getAuthErrorMessage(error) {
  const messages = {
    'auth/account-exists-with-different-credential': 'Ese correo ya tiene otro método de acceso. Inicia sesión con ese método.',
    'auth/cancelled-popup-request': 'Se canceló el inicio de sesión. Inténtalo otra vez.',
    'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo otra vez.',
    'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
    'auth/unauthorized-domain': 'Este dominio todavía no está autorizado en Firebase Authentication.',
    'auth/operation-not-allowed': 'El acceso con Google no está habilitado en Firebase Authentication.',
    'auth/network-request-failed': 'No se pudo conectar con Google. Revisa tu conexión.',
  };
  return messages[error?.code] || 'No pudimos completar el inicio de sesión. Inténtalo de nuevo.';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    setLoading(false);
  }, (error) => {
    console.error('Firebase authentication state failed:', error);
    setLoading(false);
  }), []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  }, []);

  const signOutUser = useCallback(() => signOut(auth), []);
  const value = useMemo(() => ({ user, loading, signInWithGoogle, signOutUser }), [
    user, loading, signInWithGoogle, signOutUser,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
