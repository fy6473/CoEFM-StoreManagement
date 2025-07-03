import React, { createContext, useContext, useState, useEffect } from 'react';

export const authDataContext = createContext();

export function useAuth() {
  return useContext(authDataContext);
}

function AuthContext({ children }) {
  const serverURL = "http://localhost:5000";
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    serverURL,
    user,
    login,
    logout,
  };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
