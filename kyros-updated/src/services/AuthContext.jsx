import { createContext, useContext, useState } from 'react';
import { api, session, USE_MOCK_API } from './api.js';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!USE_MOCK_API && session.token?.startsWith("demo-token-")) {
      session.clear();
      return null;
    }
    return session.user;
  });
  const authenticate = async (mode, payload) => {
    if (USE_MOCK_API) {
      const { token, user: mockUser } = await api.post(`/auth/${mode}`, payload);
      session.save(token, mockUser);
      setUser(mockUser);
      return mockUser;
    }

    const { loginFirebaseUser, registerFirebaseUser } = await import('./firebaseClient.js');
    const firebaseUser = mode === 'signup'
      ? await registerFirebaseUser(payload)
      : await loginFirebaseUser(payload);
    const idToken = await firebaseUser.getIdToken();
    const provisionalUser = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || payload.name || payload.email.split('@')[0],
      email: firebaseUser.email || payload.email,
      role: payload.role || 'student',
    };
    session.save(idToken, provisionalUser);

    let profile;
    try {
      if (mode === 'signup') {
        profile = await api.post('/users', { name: payload.name, role: payload.role });
      } else {
        try {
          profile = await api.get('/users/me');
        } catch (error) {
          if (!error.message?.toLowerCase().includes('user not found')) throw error;
          profile = await api.post('/users', { name: provisionalUser.name, role: payload.role || 'student' });
        }
      }
    } catch (error) {
      session.clear();
      const { logoutFirebaseUser } = await import('./firebaseClient.js');
      await logoutFirebaseUser();
      throw error;
    }

    const signedInUser = {
      ...profile,
      uid: profile.uid || firebaseUser.uid,
      email: profile.email || firebaseUser.email || payload.email,
    };
    session.save(idToken, signedInUser);
    setUser(signedInUser);
    return signedInUser;
  };
  const logout = async () => {
    if (!USE_MOCK_API) {
      const { logoutFirebaseUser } = await import('./firebaseClient.js');
      await logoutFirebaseUser();
    }
    session.clear();
    setUser(null);
  };
  return <Ctx.Provider value={{ user, authenticate, logout }}>{children}</Ctx.Provider>;
}
