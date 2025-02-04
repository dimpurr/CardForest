import { useSession } from 'next-auth/react';
import { useQuery, gql } from '@apollo/client';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CreateCard } from '@/components/CreateCard';
import { useCallback, useEffect } from 'react';
import { useJWT } from '@/hooks/useJWT';
import { useAtom } from 'jotai';
import { cardsAtom, sortedCardsAtom } from '@/store/cards';
import { Layout } from '@/components/Layout';

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

export default function CardsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { jwt, isAuthenticated, status: jwtStatus } = useJWT();
  const [, setCards] = useAtom(cardsAtom);
  const [sortedCards] = useAtom(sortedCardsAtom);
  
  console.log('Auth State:', { 
    session: !!session, 
    jwt: !!jwt,
    sessionStatus,
    jwtStatus 
  });
  
  const { loading, error, data } = useQuery(GET_MY_CARDS, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      console.log('Query completed:', data);
      if (data?.myCards) {
        setCards(data.myCards);
      }
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  console.log('Query State:', { loading, error: error?.message, data });

  const handleSignOut = useCallback(async () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setCards([]);
    await signOut();
  }, [setCards]);

  useEffect(() => {
    console.log('Effect triggered:', { 
      hasSession: !!session, 
      hasJwt: !!jwt,
      sessionStatus,
      jwtStatus
    });
    
    if (!session || !jwt) {
      console.log('Clearing cards...');
      setCards([]);
    }
  }, [session, jwt, sessionStatus, jwtStatus, setCards]);

  if (sessionStatus === 'loading' || jwtStatus === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <Alert>
            <Alert.Description>Loading session...</Alert.Description>
          </Alert>
        </div>
      </Layout>
    );
  }

  const showError = error && session;
  const isAuthError = error?.message === 'Forbidden resource';

  if (showError && isAuthError) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Session Expired</Alert.Title>
            <Alert.Description>
              Your session has expired. Please sign in again.
            </Alert.Description>
            <div className="mt-4">
              <Button variant="primary" onClick={() => signIn('github')}>
                Sign in again
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Authentication Required</Alert.Title>
            <Alert.Description>
              Please sign in to view your cards.
            </Alert.Description>
            <div className="mt-4">
              <Button variant="primary" onClick={() => signIn('github')}>
                Sign in with GitHub
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Cards</h1>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Cards</h2>
              <CreateCard />
            </div>
            {loading ? (
              <Alert>
                <Alert.Description>Loading cards...</Alert.Description>
              </Alert>
            ) : error ? (
              <Alert variant="error">
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{error.message}</Alert.Description>
              </Alert>
            ) : sortedCards.length === 0 ? (
              <Alert variant="default">
                <Alert.Description>
                  No cards yet. Create your first card to get started!
                </Alert.Description>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {sortedCards.map((card) => (
                  <div key={card._id} className="card p-4 space-y-2">
                    <h3 className="text-lg font-medium">{card.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{card.content}</p>
                    <p className="text-sm text-neutral-500">
                      Created at: {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
