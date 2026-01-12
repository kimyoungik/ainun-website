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
    // 초기 사용자 로드
    authService.getCurrentUser()
      .then(async (user) => {
        setCurrentUser(user);
        if (user) {
          try {
            const profile = await authService.getProfile(user.id);
            setUserProfile(profile);
          } catch (error) {
            console.error('프로필 로딩 실패:', error);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // 인증 상태 변화 감지
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        try {
          const profile = await authService.getProfile(session.user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('프로필 로딩 실패:', error);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 회원가입
  const register = async (email, password, confirmPassword, profileData) => {
    if (password !== confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }

    if (!profileData.name || profileData.name.trim().length < 2) {
      throw new Error('이름을 2자 이상 입력해주세요.');
    }

    if (!profileData.grade) {
      throw new Error('학년을 선택해주세요.');
    }

    if (!profileData.avatar) {
      throw new Error('아바타를 선택해주세요.');
    }

    const user = await authService.signUp(email, password, profileData);
    const profile = await authService.getProfile(user.id);
    setUserProfile(profile);
    return user;
  };

  // 로그인
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    const user = await authService.signIn(email, password);
    const profile = await authService.getProfile(user.id);
    setUserProfile(profile);
    return user;
  };

  // 로그아웃
  const logout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setUserProfile(null);
  };

  // 프로필 업데이트
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
