import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useJWT() {
  const { data: session } = useSession();
  const [jwt, setJwt] = useState<string | null>(() => {
    // 初始化时从 cookie 获取 JWT
    if (typeof window !== 'undefined') {
      const cookieJwt = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1] || null;
      console.log('useJWT init:', { cookieJwt });
      return cookieJwt;
    }
    return null;
  });

  useEffect(() => {
    // 从 cookie 中获取 JWT
    const getJwtFromCookie = () => {
      if (typeof window === 'undefined') return null;
      
      // 直接查找 jwt cookie
      const jwtCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1];

      console.log('useJWT getJwtFromCookie:', { 
        jwtCookie,
        allCookies: document.cookie.split('; ').reduce((acc, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      });
      
      return jwtCookie;
    };

    // 优先使用 session 中的 JWT，如果没有则从 cookie 中获取
    const currentJwt = session?.jwt || getJwtFromCookie();
    console.log('useJWT effect:', { 
      sessionJwt: session?.jwt, 
      cookieJwt: getJwtFromCookie(), 
      currentJwt,
      sessionData: session
    });

    if (currentJwt) {
      // 设置 JWT cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        path: '/',
      };
      document.cookie = `jwt=${currentJwt}; path=${cookieOptions.path}; expires=${cookieOptions.expires.toUTCString()}`;
      setJwt(currentJwt);
    } else {
      setJwt(null);
    }
  }, [session]);

  return jwt;
}
