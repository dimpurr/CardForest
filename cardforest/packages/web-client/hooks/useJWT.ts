import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useJWT = () => {
  const { data: session, status } = useSession()
  const [jwt, setJwt] = useState<string | null>(null)

  useEffect(() => {
    console.log('useJWT hook session:', {
      hasSession: !!session,
      sessionStatus: status,
      backendJwt: session?.backendJwt ? 'present' : 'absent'
    })

    if (session?.backendJwt) {
      setJwt(session.backendJwt)
    } else {
      setJwt(null)
    }
  }, [session, status])

  // 判断用户是否已经登录
  // 如果用户已经通过 NextAuth 登录，则认为用户已经登录
  // 即使没有 JWT 令牌，也应该尝试发送请求
  const isAuthenticated = status === 'authenticated';

  // 如果用户已经登录但没有 JWT，在控制台输出警告
  if (isAuthenticated && !jwt) {
    console.warn('User is authenticated but has no JWT token. Requests may fail.');
  }

  return {
    jwt,
    isAuthenticated,
    status,
    session
  }
}

export default useJWT
