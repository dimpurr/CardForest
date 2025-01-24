import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'}/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // Get the JWT token from cookie
  let token;
  if (typeof window !== 'undefined') {
    token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
  }

  // Always include the token in Authorization header if it exists
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});
