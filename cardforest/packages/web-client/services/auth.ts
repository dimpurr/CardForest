import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { User } from '@/atoms/authAtoms';

/**
 * 统一的认证服务
 * 封装所有认证相关逻辑，提供一致的 API
 */
export class AuthService {
  /**
   * 从多个来源获取 JWT
   * 优先级：session > cookie > URL 参数
   */
  static getJWT(session?: Session | null): string | null {
    // 1. 从 session 中获取
    if (session?.backendJwt) {
      return session.backendJwt;
    }

    // 2. 从 cookie 中获取
    if (typeof window !== 'undefined') {
      const cookieJwt = Cookies.get('jwt');
      if (cookieJwt) {
        return cookieJwt;
      }

      // 3. 从 URL 参数中获取
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      if (tokenParam) {
        const jwt = decodeURIComponent(tokenParam);
        
        // 将 JWT 存入 cookie 以便于后续使用
        Cookies.set('jwt', jwt, { expires: 1 }); // 1 day
        
        return jwt;
      }
    }

    return null;
  }

  /**
   * 统一用户对象格式
   */
  static normalizeUser(user: any): User {
    return {
      _id: user._id || `users/${user.sub || user._key || user.id}`,
      _key: user._key || user.sub || user.id,
      username: user.username || user.name || user.email || user.sub,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt,
    };
  }

  /**
   * 使用 NextAuth 登录
   */
  static async loginWithNextAuth(provider: string): Promise<void> {
    await signIn(provider, { callbackUrl: window.location.href });
  }

  /**
   * 使用后端 OAuth 登录
   */
  static loginWithBackend(provider: string): void {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
    const redirectUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${backendUrl}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  /**
   * 登出
   */
  static async logout(): Promise<void> {
    // 清除 cookie
    Cookies.remove('jwt');
    
    // 使用 NextAuth 登出
    await signOut({ callbackUrl: '/' });
  }

  /**
   * 检查用户是否已认证
   */
  static isAuthenticated(session?: Session | null): boolean {
    return !!session || !!this.getJWT(session);
  }

  /**
   * 获取认证来源
   */
  static getAuthSource(session?: Session | null): 'nextauth' | 'backend' | null {
    if (session) {
      return 'nextauth';
    }
    
    if (this.getJWT()) {
      return 'backend';
    }
    
    return null;
  }
}
