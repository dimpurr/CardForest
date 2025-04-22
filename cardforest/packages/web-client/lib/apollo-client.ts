import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'
import merge from 'deepmerge'
import { getSession } from './getSession' // Assuming getSession is defined in a separate file

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3030/graphql',
  credentials: 'include',
})

const authLink = setContext(async (operation, { headers }) => {
  console.log('Apollo authLink setup:', {
    operation: operation.operationName,
    hasHeaders: !!headers
  });

  // 从多个来源获取 JWT
  // 1. 从 session 中获取
  const session = await getSession()
  let jwt = session?.backendJwt

  // 2. 如果 session 中没有，尝试从 cookie 中获取
  if (!jwt && typeof window !== 'undefined') {
    jwt = Cookies.get('jwt')
    console.log('Got JWT from cookie:', !!jwt)

    // 3. 如果 cookie 中没有，尝试从 URL 参数中获取
    if (!jwt) {
      const urlParams = new URLSearchParams(window.location.search)
      const tokenParam = urlParams.get('token')
      if (tokenParam) {
        jwt = decodeURIComponent(tokenParam)
        console.log('Got JWT from URL parameter:', !!jwt)

        // 将 JWT 存入 cookie 以便于后续使用
        Cookies.set('jwt', jwt, { expires: 1 }) // 1 day
      }
    }
  }

  console.log('Apollo authLink JWT:', {
    hasJwt: !!jwt,
    jwtPreview: jwt ? `${jwt.slice(0, 10)}...` : null,
    headers: headers ? Object.keys(headers) : []
  })

  // 始终包含授权头，即使没有 JWT
  // 如果没有 JWT，使用空字符串，这样服务器会尝试使用 cookie 进行身份验证
  const updatedHeaders = {
    ...headers,
    authorization: jwt ? `Bearer ${jwt}` : '',
    'Content-Type': 'application/json'
  };

  console.log('Apollo authLink final headers:', {
    authorization: updatedHeaders.authorization ? 'present' : 'absent',
    contentType: updatedHeaders['Content-Type'],
    otherHeaders: Object.keys(updatedHeaders).filter(k => !['authorization', 'Content-Type'].includes(k))
  });

  return {
    headers: updatedHeaders
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cards: {
            merge(existing = [], incoming: any[]) {
              return merge(existing, incoming)
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
})
