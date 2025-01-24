import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, VStack, Text, Container, Center } from '@chakra-ui/react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/'); // Redirect to home if already logged in
    }
  }, [session, router]);

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  return (
    <Container>
      <Center h="100vh">
        <VStack spacing={4}>
          <Text fontSize="2xl">Welcome to CardForest</Text>
          <Button
            colorScheme="blue"
            onClick={() => signIn('github', { callbackUrl: '/' })}
          >
            Sign in with GitHub
          </Button>
        </VStack>
      </Center>
    </Container>
  );
}
