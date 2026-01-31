import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/config/firebase';

// User type with role
export type UserRole = 'staff' | 'manager';

export interface UserData {
  uid: string;
  email: string | null;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const USER_STORAGE_KEY = '@subrogo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data with role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userToSave: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role as UserRole,
              name: userData.name,
            };
            setUser(userToSave);
            // Save to AsyncStorage for persistence
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSave));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userToSave: UserData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: userData.role as UserRole,
          name: userData.name,
        };
        setUser(userToSave);
        // Save to AsyncStorage
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSave));
      } else {
        throw new Error('User data not found in database. Please contact administrator.');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
