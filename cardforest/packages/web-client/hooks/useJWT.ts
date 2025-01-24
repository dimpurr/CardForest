import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  expires: 1 // 1 day
}

export const useJWT = () => {
  const { data: session, status } = useSession();
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    // First try to get JWT from session
    const sessionJwt = session?.jwt as string | undefined;
    
    // Then try to get JWT from cookies
    const cookieJwt = Cookies.get('jwt');
    
    console.log('JWT sources:', { 
      sessionJwt: sessionJwt ? 'present' : 'absent',
      cookieJwt: cookieJwt ? 'present' : 'absent',
      status 
    });

    if (sessionJwt) {
      console.log('Using JWT from session');
      setJwt(sessionJwt);
      // Also update cookie
      Cookies.set('jwt', sessionJwt, COOKIE_OPTIONS);
    } else if (cookieJwt) {
      console.log('Using JWT from cookie');
      setJwt(cookieJwt);
    } else {
      console.log('No JWT found');
      setJwt(null);
      // Clean up any existing cookie
      Cookies.remove('jwt', { path: '/' });
    }
  }, [session, status]);

  return {
    jwt,
    hasJwt: !!jwt,
    status
  };
};
