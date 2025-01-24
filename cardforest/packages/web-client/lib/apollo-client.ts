import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3030/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // 从 cookie 获取 token
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
    ?.split('=')[1];

  // 如果没有 token，不添加认证头
  if (!token) {
    return { headers };
  }

  return {
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`,
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
