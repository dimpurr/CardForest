import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

async function fetchJWT(accessToken: string) {
  try {
    const response = await fetch('http://localhost:3030/user/auth/github/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch JWT');
    }

    const data = await response.json();
    return data.jwt;
  } catch (error) {
    console.error('Error fetching JWT:', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // 初始登录时
      if (account && user) {
        // 获取 JWT
        const jwt = await fetchJWT(account.access_token as string);
        console.log('NextAuth JWT callback:', { jwt, user });
        
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
          username: profile?.login,
          jwt,
        };
      }

      return token;
    },

    async session({ session, token }) {
      // 将 JWT 添加到 session 中
      return {
        ...session,
        accessToken: token.accessToken,
        userId: token.userId,
        username: token.username,
        jwt: token.jwt,
      };
    },
  },
  pages: {
    error: '/auth/error',
  },
  // 开启 debug 模式帮助排查问题
  debug: true,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

export default NextAuth(authOptions);
