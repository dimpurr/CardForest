import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import {
  currentUserAtom,
  jwtAtom,
  isAuthenticatedAtom,
  authSourceAtom,
  User
} from '@/atoms/authAtoms';
import { AuthService } from '@/services/auth';
import { useQuery } from '@apollo/client';
import { GET_ME } from '@/graphql/queries/userQueries';

interface AuthContextType {
  user: User | null;
  jwt: string | null;
  isAuthenticated: boolean;
  authSource: string | null;
  login: (provider: string, useBackend?: boolean, callbackUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useAtom(currentUserAtom);
  const [jwt, setJwt] = useAtom(jwtAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authSource, setAuthSource] = useAtom(authSourceAtom);

  // 获取 JWT
  useEffect(() => {
    const token = AuthService.getJWT(session);
    setJwt(token);
  }, [session, setJwt]);

  // 更新认证状态
  useEffect(() => {
    const authenticated = AuthService.isAuthenticated(session);
    setIsAuthenticated(authenticated);

    const source = AuthService.getAuthSource(session);
    setAuthSource(source);
  }, [session, jwt, setIsAuthenticated, setAuthSource]);

  // 获取用户信息
  const { loading } = useQuery(GET_ME, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      if (data?.me) {
        setUser(AuthService.normalizeUser(data.me));
      }
    },
    onError: (error) => {
      console.error('Error fetching user data:', error);
    }
  });

  // 登录方法
  const login = async (provider: string, useBackend = false, callbackUrl?: string) => {
    try {
      if (useBackend) {
        AuthService.loginWithBackend(provider, callbackUrl);
      } else {
        await AuthService.loginWithNextAuth(provider, callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    setUser(null);
    setJwt(null);
    setIsAuthenticated(false);
    setAuthSource(null);
    await AuthService.logout();
  };

  const value = {
    user,
    jwt,
    isAuthenticated,
    authSource,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
