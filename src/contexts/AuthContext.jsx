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

    // 세션 만료 체크 (24시간)
    const checkSessionExpiry = async () => {
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (loginTimestamp) {
        const now = Date.now();
        const loginTime = parseInt(loginTimestamp, 10);
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24시간

        if (now - loginTime > oneDayInMs) {
          // 24시간이 지났으면 로그아웃
          console.log('Session expired. Logging out...');
          localStorage.removeItem('loginTimestamp');
          await authService.signOut();
          return true; // 세션 만료됨
        }
      }
      return false; // 세션 유효
    };

    const initAuth = async () => {
      try {
        // 먼저 세션 만료 체크
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

            // 로그인 시간이 없으면 저장 (구글 로그인 리다이렉트 후 처리)
            if (!localStorage.getItem('loginTimestamp')) {
              localStorage.setItem('loginTimestamp', Date.now().toString());
            }

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
            setCurrentUser(null);
            setUserProfile(null);
            // 로그아웃 시 타임스탬프 제거
            localStorage.removeItem('loginTimestamp');
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
    let profile = await authService.getProfile(user.id);
    if (!profile) {
      profile = await authService.ensureProfileFromUser(user);
    }
    setUserProfile(profile || null);

    // 로그인 시간 저장
    localStorage.setItem('loginTimestamp', Date.now().toString());

    return user;
  };

  const loginWithGoogle = async () => {
    const redirectTo = window.location.origin;
    await authService.signInWithGoogle(redirectTo);

    // 로그인 시간 저장 (구글 로그인 후 리다이렉트 되므로 여기서도 저장)
    localStorage.setItem('loginTimestamp', Date.now().toString());
  };

  const logout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setUserProfile(null);

    // 로그아웃 시 타임스탬프 제거
    localStorage.removeItem('loginTimestamp');
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
