import { createContext, useContext, useState } from 'react';
import { api, session } from './api.js';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(session.user);
  const authenticate = async (mode, payload) => {
    const { token, user } = await api.post(`/auth/${mode}`, payload);
    session.save(token, user); setUser(user); return user;
  };
  const logout = () => { session.clear(); setUser(null); };
  return <Ctx.Provider value={{ user, authenticate, logout }}>{children}</Ctx.Provider>;
}
