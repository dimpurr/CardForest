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
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
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
          // 先尝试直接使用 GitHub OAuth 登录后端
          // 这里不能使用重定向，因为这是服务器端代码
          // 我们将在前端添加一个登录按钮

          // 如果上面的方法不起作用，则尝试从 cookie 中获取 JWT
          const cookies = await fetch(`${BACKEND_URL}/user/auth/auth-callback-backend`, {
            method: 'GET',
            credentials: 'include',
          })

          // 如果没有 cookie，则使用 POST 请求获取 JWT
          if (!cookies.ok) {
            const response = await fetch(`${BACKEND_URL}/user/auth/github/callback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                access_token: account?.access_token,
                provider: 'github',
                providerId: (profile as any).id || (profile as any).sub,
                profile: {
                  sub: (profile as any).sub,
                  id: (profile as any).id,
                  login: (profile as any).login,
                  email: (profile as any).email
                }
              }),
            })

            if (!response.ok) {
              console.error('Failed to fetch JWT:', response.status, response.statusText)
              throw new Error('Failed to fetch JWT')
            }

            const data = await response.json()
            console.log('Backend JWT response:', {
              hasJwt: !!data.jwt,
              jwtPreview: data.jwt ? `${data.jwt.slice(0, 10)}...` : null
            })

            // 将 JWT 存储在 token 中
            token.backendJwt = data.jwt

            // 同时设置 cookie 以便 Apollo Client 使用
            const cookies = new Headers(response.headers).get('set-cookie')
            if (cookies) {
              console.log('Setting cookies from backend')
              // 这里不需要手动设置，因为 fetch 会自动处理 set-cookie 头
            }
          }
        } catch (error) {
          console.error('Error fetching JWT:', error)
          // 不要抛出错误，让用户继续使用基本功能
        }
      }

      return token
    },

    async session({ session, token }) {
      console.log('Auth.js Session callback:', {
        hasSession: !!session,
        hasToken: !!token,
        hasBackendJwt: !!token.backendJwt,
        sessionKeys: Object.keys(session)
      })

      // 确保 backendJwt 被包含在会话中
      if (token.backendJwt) {
        session.backendJwt = token.backendJwt
      }

      return session
    }
  },
  debug: true,
  logger: {
    error(code: string, ...message: any[]) {
      console.error('Auth.js Error:', { code, message })
    },
    warn(code: string, ...message: any[]) {
      console.warn('Auth.js Warning:', { code, message })
    },
    debug(code: string, ...message: any[]) {
      console.log('Auth.js Debug:', { code, message })
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, authOptions)
}

export default handler
