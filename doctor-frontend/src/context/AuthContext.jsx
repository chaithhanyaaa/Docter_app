import React, { createContext, useContext, useState } from 'react';
import { signupDoctor, loginDoctor } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  async function signup(data) {
    const created = await signupDoctor(data);
    setUser({ id: created.id, name: created.name, role: 'DOCTOR', email: created.email });
    setProfile(created);
    return created;
  }

  async function login(credentials) {
    const res = await loginDoctor(credentials);
    setUser(res.user);
    setProfile(res.profile || null);
    return res;
  }

  function logout() {
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, signup, login, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
