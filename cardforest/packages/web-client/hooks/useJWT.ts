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

  return {
    jwt,
    isAuthenticated: status === 'authenticated' && !!jwt,
    status,
    session
  }
}

export default useJWT
