import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3030/graphql',
  credentials: 'include',  // 这个很重要，确保跨域请求时发送 cookie
});

const authLink = setContext((_, { headers }) => {
  // 从 cookie 中获取 JWT
  const getJwtFromCookie = () => {
    if (typeof window === 'undefined') return null;

    // 直接查找 jwt cookie
    const jwtCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];

    console.log('Apollo Auth - All cookies:', document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>));
    console.log('Apollo Auth - JWT from cookie:', jwtCookie);

    return jwtCookie;
  };

  const jwt = getJwtFromCookie();

  // 如果有 JWT，添加到 headers 中
  const finalHeaders = {
    ...headers,
    'Content-Type': 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };

  console.log('Apollo Auth - Final headers:', finalHeaders);

  return {
    headers: finalHeaders,
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          myCards: {
            // 不缓存 myCards 查询结果
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      // 每次组件挂载时都重新获取数据
      fetchPolicy: 'cache-and-network',
    },
  },
});
