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
    try {
      // 1. 从 session 中获取
      if (session?.backendJwt) {
        console.log('JWT found in session');
        return session.backendJwt;
      }

      // 2. 从 cookie 中获取
      if (typeof window !== 'undefined') {
        const cookieJwt = Cookies.get('jwt');
        if (cookieJwt) {
          console.log('JWT found in cookie');
          return cookieJwt;
        }

        // 3. 从 URL 参数中获取
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        if (tokenParam) {
          console.log('JWT found in URL parameter');
          const jwt = decodeURIComponent(tokenParam);

          // 将 JWT 存入 cookie 以便于后续使用
          this.saveJWTToCookie(jwt);

          return jwt;
        }
      }

      console.log('No JWT found in any source');
      return null;
    } catch (error) {
      console.error('Error getting JWT:', error);
      return null;
    }
  }

  /**
   * 将 JWT 保存到 cookie
   */
  static saveJWTToCookie(jwt: string, expires: number = 1): void {
    try {
      Cookies.set('jwt', jwt, {
        expires, // days
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      console.log('JWT saved to cookie');
    } catch (error) {
      console.error('Error saving JWT to cookie:', error);
    }
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
   * @param provider 认证提供商（如 'github'）
   * @param callbackUrl 登录成功后的回调 URL，默认为当前 URL
   */
  static async loginWithNextAuth(provider: string, callbackUrl?: string): Promise<void> {
    try {
      console.log('Frontend login with:', { provider, callbackUrl });
      await signIn(provider, {
        callbackUrl: callbackUrl || window.location.href,
        redirect: true
      });
    } catch (error) {
      console.error('Error during NextAuth login:', error);
      throw error;
    }
  }

  /**
   * 使用后端 OAuth 登录
   * @param provider 认证提供商（如 'github'）
   * @param callbackUrl 登录成功后的回调 URL，默认为当前 URL
   */
  static loginWithBackend(provider: string, callbackUrl?: string): void {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
      // 使用指定的回调 URL 或默认为当前页面
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const redirectUrl = `${window.location.origin}/auth/callback`;

      // 将原始回调 URL 作为参数传递，以便登录成功后重定向
      const finalRedirectUrl = callbackUrl
        ? `${redirectUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : redirectUrl;

      console.log('Backend login with:', { provider, redirectUrl: finalRedirectUrl });
      window.location.href = `${backendUrl}/auth/${provider}?redirect_uri=${encodeURIComponent(finalRedirectUrl)}`;
    } catch (error) {
      console.error('Error during backend login:', error);
    }
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
