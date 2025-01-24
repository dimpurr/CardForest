import { useSession, signIn, signOut } from 'next-auth/react';
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

  if (!session) {
    return (
      <Container>
        <VStack spacing={4} mt={8}>
          <Heading>Welcome to CardForest</Heading>
          <Text>Please sign in to continue</Text>
          <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container>
      <VStack spacing={4} mt={8}>
        <Heading>Welcome {session.user?.name}</Heading>
        <Button onClick={() => signOut()}>Sign out</Button>
        
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
