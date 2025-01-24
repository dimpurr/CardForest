import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'}/graphql`,
  credentials: 'include',
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from NextAuth.js session if it exists
  let token;
  if (typeof window !== 'undefined') {
    const session = await fetch('/api/auth/session').then(res => res.json());
    token = session?.accessToken;
  }

  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});
