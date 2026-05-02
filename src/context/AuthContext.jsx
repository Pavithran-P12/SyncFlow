import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!auth) {
      // Mock login for demo without Firebase credentials
      if (email && password) {
        setUser({ email, uid: 'mock-uid-123', displayName: email.split('@')[0] });
        return;
      }
      throw new Error("Mock Login Failed. Provide email/password.");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    if (!auth) {
      setUser({ email, uid: 'mock-uid-123', displayName: email.split('@')[0] });
      return;
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
