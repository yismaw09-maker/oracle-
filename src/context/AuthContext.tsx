import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Run quick connection test on boot
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          let docSnap;
          try {
            docSnap = await getDoc(userDocRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
          }

          const profileData: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || 'unknown@user.com',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            photoURL: currentUser.photoURL || undefined,
            lastLoginAt: new Date().toISOString(),
          };

          if (!docSnap?.exists()) {
            profileData.createdAt = new Date().toISOString();
            try {
              await setDoc(userDocRef, profileData);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
            }
          } else {
            const existing = docSnap.data() as UserProfile;
            profileData.createdAt = existing.createdAt || new Date().toISOString();
            try {
              await setDoc(userDocRef, { lastLoginAt: profileData.lastLoginAt }, { merge: true });
            } catch (err) {
              handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
            }
          }

          setUserProfile(profileData);
        } catch (err: unknown) {
          console.error('Failed to sync user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Sign-in error:', err);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      if (message.includes('popup-closed-by-user')) {
        setError('Sign-in window was closed. Please try again.');
      } else if (message.includes('popup-blocked')) {
        setError('Popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setError(`Sign-in failed: ${message}`);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: unknown) {
      console.error('Sign-out error:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
