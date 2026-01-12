import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription = null;

    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!mounted) return;

        setCurrentUser(user);
        if (user) {
          try {
            const profile = await authService.getProfile(user.id);
            if (mounted) {
              setUserProfile(profile || null);
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
            if (mounted) {
              setUserProfile(null);
            }
          }
        }
        if (mounted) {
          setLoading(false);
        }

        const { data } = authService.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;

          if (session?.user) {
            setCurrentUser(session.user);
            try {
              const profile = await authService.getProfile(session.user.id);
              if (mounted) {
                setUserProfile(profile || null);
              }
            } catch (error) {
              console.error('Failed to load profile:', error);
              if (mounted) {
                setUserProfile(null);
              }
            }
          } else {
            setCurrentUser(null);
            setUserProfile(null);
          }
        });

        subscription = data.subscription;
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const register = async (email, password, confirmPassword, profileData) => {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    if (!profileData.name || profileData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters.');
    }

    if (!profileData.grade) {
      throw new Error('Grade is required.');
    }

    if (!profileData.avatar) {
      throw new Error('Avatar is required.');
    }

    const user = await authService.signUp(email, password, profileData);
    const profile = await authService.getProfile(user.id);
    setUserProfile(profile || null);
    return user;
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await authService.signIn(email, password);
    const profile = await authService.getProfile(user.id);
    setUserProfile(profile || null);
    return user;
  };

  const logout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (profileData) => {
    if (!currentUser) {
      throw new Error('Login required.');
    }

    const updatedProfile = await authService.updateProfile(currentUser.id, profileData);
    setUserProfile(updatedProfile);
    return updatedProfile;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    updateProfile,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-amber-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
