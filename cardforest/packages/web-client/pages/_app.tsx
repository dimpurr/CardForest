import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Provider as JotaiProvider } from 'jotai';
import { client } from '../lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.scss';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <JotaiProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </JotaiProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
