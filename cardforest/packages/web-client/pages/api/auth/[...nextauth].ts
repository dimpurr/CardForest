import { AuthOptions } from '@auth/core'
import GitHub from '@auth/core/providers/github'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3030'

console.log('Loading Auth.js configuration...', {
  backendUrl: BACKEND_URL,
  hasGithubId: !!process.env.GITHUB_ID,
  hasGithubSecret: !!process.env.GITHUB_SECRET
})

export const authOptions: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('Auth.js signIn callback:', {
        hasUser: !!user,
        hasAccount: !!account,
        hasProfile: !!profile,
        provider: account?.provider,
        userInfo: user ? {
          id: user.id,
          name: user.name,
          email: user.email
        } : null,
        profileInfo: profile ? {
          id: (profile as any).id,
          sub: (profile as any).sub,
          login: (profile as any).login,
          email: (profile as any).email
        } : null
      })
      return true
    },

    async jwt({ token, account, profile, trigger }) {
      console.log('Auth.js JWT callback:', { 
        trigger,
        hasToken: !!token,
        hasAccount: !!account,
        hasProfile: !!profile,
        existingJwt: token?.backendJwt ? 'present' : 'absent',
        tokenKeys: Object.keys(token || {}),
        profileInfo: profile ? {
          id: (profile as any).id,
          sub: (profile as any).sub,
          login: (profile as any).login,
          email: (profile as any).email
        } : null
      })

      // 初次登录或 token 刷新时获取后端 JWT
      if (account?.access_token || trigger === 'signIn') {
        console.log('Initial login or token refresh detected, fetching JWT...')
        try {
          const response = await fetch(`${BACKEND_URL}/user/auth/github/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              access_token: account?.access_token,
              provider: 'github',
              providerId: (profile as any).id || (profile as any).sub, // 直接传递 providerId
              profile: {
                sub: (profile as any).sub,
                id: (profile as any).id,
                login: (profile as any).login,
                email: (profile as any).email
              }
            }),
          })

          if (!response.ok) {
            const error = await response.text()
            console.error('JWT fetch failed:', { status: response.status, error })
            throw new Error(`Failed to fetch JWT: ${error}`)
          }

          const data = await response.json()
          console.log('JWT fetch success:', { 
            hasJwt: !!data.jwt,
            jwtPreview: data.jwt ? `${data.jwt.slice(0, 10)}...` : null
          })
          
          return {
            ...token,
            backendJwt: data.jwt,
            provider: 'github',
            profile: {
              sub: (profile as any).sub,
              id: (profile as any).id,
              login: (profile as any).login,
              email: (profile as any).email
            }
          }
        } catch (error) {
          console.error('JWT fetch error:', error)
          return token
        }
      }

      return token
    },

    async session({ session, token, trigger }) {
      console.log('Auth.js session callback:', {
        trigger,
        hasSession: !!session,
        hasToken: !!token,
        hasBackendJwt: !!token.backendJwt,
        sessionKeys: Object.keys(session || {}),
        tokenKeys: Object.keys(token || {})
      })

      if (!token?.backendJwt) {
        console.warn('No backend JWT available in session callback')
        return session
      }

      return {
        ...session,
        backendJwt: token.backendJwt,
        provider: token.provider,
        profile: token.profile
      }
    }
  },
  debug: true,
  logger: {
    error(code, ...message) {
      console.error('Auth.js Error:', { code, message })
    },
    warn(code, ...message) {
      console.warn('Auth.js Warning:', { code, message })
    },
    debug(code, ...message) {
      console.log('Auth.js Debug:', { code, message })
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, authOptions)
}

export default handler
