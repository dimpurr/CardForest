import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

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
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
          username: profile?.login,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // 把 token 中的信息加到 session 中
      return {
        ...session,
        accessToken: token.accessToken,
        userId: token.userId,
        username: token.username,
      };
    },
  },
  pages: {
    error: '/auth/error',
  },
  // 开启 debug 模式帮助排查问题
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
