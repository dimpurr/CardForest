import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useJWT() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.jwt) {
      // 设置 JWT cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        path: '/',
      };
      document.cookie = `jwt=${session.jwt}; path=${cookieOptions.path}; expires=${cookieOptions.expires.toUTCString()}`;
    }
  }, [session?.jwt]);

  return session?.jwt;
}
