import { signIn, signOut, useSession } from 'next-auth/react';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

const GET_MY_CARDS = gql`
  query GetMyCards {
    myCards {
      _id
      title
      content
      createdAt
      createdBy {
        username
      }
    }
  }
`;

export default function Home() {
  const { data: session } = useSession();
  const { loading, error, data } = useQuery(GET_MY_CARDS, {
    skip: !session,
  });
  const toast = useToast();

  if (loading) return <Text>Loading...</Text>;
  if (error) {
    toast({
      title: 'Error loading cards',
      description: error.message,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <Container style={{ padding: '20px' }}>
      <VStack spacing={4} mt={8}>
        {session ? (
          <div>
            <Heading>Welcome {session.user?.name}</Heading>
            <Button
              onClick={() => signOut()}
              style={{
                padding: '8px 16px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div>
            <Heading>Welcome to CardForest</Heading>
            <Text>Please sign in to continue</Text>
            <Button
              onClick={() => signIn('github', { 
                callbackUrl: window.location.origin,
                redirect_uri: 'http://localhost:3030/user/auth/github/callback?client=web'
              })}
              style={{
                padding: '8px 16px',
                background: '#24292e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Sign in with GitHub
            </Button>
          </div>
        )}
        
        <Box w="100%">
          <Heading size="md" mb={4}>My Cards</Heading>
          <VStack spacing={4} align="stretch">
            {data?.myCards?.map((card: any) => (
              <Box key={card._id} p={4} borderWidth={1} borderRadius="md">
                <Heading size="sm">{card.title}</Heading>
                <Text mt={2}>{card.content}</Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Created at: {new Date(card.createdAt).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
