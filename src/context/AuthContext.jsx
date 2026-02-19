import { createContext, useContext, useState } from 'react';

// Give the context a default shape to satisfy editor/linter
const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('ems_user') || 'null')
  );
  const [token, setToken] = useState(
    () => localStorage.getItem('ems_token') || null
  );

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('ems_user', JSON.stringify(userData));
    localStorage.setItem('ems_token', tokenValue);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ems_user');
    localStorage.removeItem('ems_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth now guaranteed to never return undefined
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
