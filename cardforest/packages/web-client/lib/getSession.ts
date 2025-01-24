import { getSession as nextAuthGetSession } from 'next-auth/react'

export const getSession = async () => {
  try {
    const session = await nextAuthGetSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export default getSession
