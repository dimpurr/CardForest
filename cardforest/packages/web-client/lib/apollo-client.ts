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

  // 从 session 中获取 JWT
  const session = await getSession()
  const jwt = session?.backendJwt
  
  console.log('Apollo authLink JWT:', {
    hasJwt: !!jwt,
    jwtPreview: jwt ? `${jwt.slice(0, 10)}...` : null,
    headers: headers ? Object.keys(headers) : []
  })

  // Return headers with Bearer token if JWT exists
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
