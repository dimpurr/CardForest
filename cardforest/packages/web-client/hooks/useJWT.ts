import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/**
 * @deprecated Use useAuth() instead
 */
export const useJWT = () => {
  const { data: session, status } = useSession()
  const { jwt, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('useJWT hook session:', {
      hasSession: !!session,
      sessionStatus: status,
      backendJwt: session?.backendJwt ? 'present' : 'absent'
    })

    // 如果用户已经登录但没有 JWT，在控制台输出警告
    if (status === 'authenticated' && !jwt) {
      console.warn('User is authenticated but has no JWT token. Requests may fail.');
    }
  }, [session, status, jwt])

  return {
    jwt,
    isAuthenticated,
    status,
    session
  }
}

export default useJWT
