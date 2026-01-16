import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const sessionTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let subscription = null;
    const sessionTtlMs = 6 * 60 * 60 * 1000;

    const clearSessionTimeout = () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }
    };

    const clearLocalSession = () => {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('loginTimestamp');
    };

    const handleSessionExpiry = async () => {
      clearSessionTimeout();
      if (!mounted) return;
      clearLocalSession();
      try {
        await authService.signOut();
      } catch (error) {
        console.warn('Session signOut failed:', error);
      }
    };

    const scheduleSessionExpiry = (loginTimestamp) => {
      clearSessionTimeout();
      if (!loginTimestamp) return;
      const loginTime = parseInt(loginTimestamp, 10);
      if (Number.isNaN(loginTime)) return;
      const msRemaining = sessionTtlMs - (Date.now() - loginTime);
      if (msRemaining <= 0) {
        handleSessionExpiry();
        return;
      }
      sessionTimeoutRef.current = setTimeout(handleSessionExpiry, msRemaining);
    };

    const checkSessionExpiry = async () => {
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (loginTimestamp) {
        const now = Date.now();
        const loginTime = parseInt(loginTimestamp, 10);
        if (now - loginTime > sessionTtlMs) {
          await handleSessionExpiry();
          return true;
        }
        scheduleSessionExpiry(loginTimestamp);
      }
      return false;
    };

    const refreshSessionState = async () => {
      const isExpired = await checkSessionExpiry();
      if (isExpired || !mounted) return;
      const user = await authService.getCurrentUser();
      if (!mounted) return;
      if (!user) {
        clearLocalSession();
      }
    };

    const initAuth = async () => {
      try {
        const isExpired = await checkSessionExpiry();
        if (isExpired) {
          if (mounted) {
            setCurrentUser(null);
            setUserProfile(null);
            setLoading(false);
          }
          return;
        }

        const user = await authService.getCurrentUser();
        if (!mounted) return;

        setCurrentUser(user);
        if (user) {
          if (!localStorage.getItem('loginTimestamp')) {
            localStorage.setItem('loginTimestamp', Date.now().toString());
          }
          scheduleSessionExpiry(localStorage.getItem('loginTimestamp'));
          try {
            let profile = await authService.getProfile(user.id);
            if (!profile) {
              profile = await authService.ensureProfileFromUser(user);
            }
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

            if (!localStorage.getItem('loginTimestamp')) {
              localStorage.setItem('loginTimestamp', Date.now().toString());
            }
            scheduleSessionExpiry(localStorage.getItem('loginTimestamp'));

            try {
              let profile = await authService.getProfile(session.user.id);
              if (!profile) {
                profile = await authService.ensureProfileFromUser(session.user);
              }
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
            clearLocalSession();
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
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSessionState();
      }
    };
    window.addEventListener('focus', refreshSessionState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      clearSessionTimeout();
      window.removeEventListener('focus', refreshSessionState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const register = async (email, password, confirmPassword, profileData) => {
    if (password !== confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }

    if (!profileData.name || profileData.name.trim().length < 2) {
      throw new Error('이름은 2글자 이상 입력해주세요.');
    }

    if (!profileData.grade) {
      throw new Error('학년을 선택해주세요.');
    }

    if (!profileData.avatar) {
      throw new Error('아바타를 선택해주세요.');
    }

    const redirectTo = `${window.location.origin}/login`;
    const user = await authService.signUp(email, password, profileData, { redirectTo });
    return user;
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    const user = await authService.signIn(email, password);
    let profile = await authService.getProfile(user.id);
    if (!profile) {
      profile = await authService.ensureProfileFromUser(user);
    }
    setUserProfile(profile || null);

    localStorage.setItem('loginTimestamp', Date.now().toString());

    return user;
  };

  const loginWithGoogle = async () => {
    const redirectTo = window.location.origin;
    await authService.signInWithGoogle(redirectTo);

    localStorage.setItem('loginTimestamp', Date.now().toString());
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.warn('Logout failed:', error);
    } finally {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('loginTimestamp');
    }
  };

  const updateProfile = async (profileData) => {
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
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
    loginWithGoogle,
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
