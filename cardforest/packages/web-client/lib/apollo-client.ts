import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import merge from 'deepmerge';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3030/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // Get JWT from cookie
  const jwt = Cookies.get('jwt');
  
  console.log('Apollo authLink:', { 
    hasJwt: !!jwt,
    headers: headers ? 'present' : 'absent'
  });

  return {
    headers: {
      ...headers,
      authorization: jwt ? `Bearer ${jwt}` : '',
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cards: {
            merge(existing = [], incoming: any[]) {
              return merge(existing, incoming);
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
