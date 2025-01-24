import { useSession } from 'next-auth/react';
import { useQuery, gql } from '@apollo/client';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import CreateCard from '../components/CreateCard';
import { useCallback, useEffect } from 'react';
import { useJWT } from '../hooks/useJWT';
import { useAtom } from 'jotai';
import { cardsAtom, sortedCardsAtom } from '../store/cards';

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
  const { data: session, status } = useSession();
  const jwt = useJWT();
  const [, setCards] = useAtom(cardsAtom);
  const [sortedCards] = useAtom(sortedCardsAtom);
  
  console.log('Auth State:', { session: !!session, jwt: !!jwt, status });
  
  const { loading, error, data, refetch } = useQuery(GET_MY_CARDS, {
    skip: !jwt,
    onCompleted: (data) => {
      console.log('Query completed:', data);
      if (data?.myCards) {
        setCards(data.myCards);
      }
    },
    onError: (error) => {
      console.error('Query error:', error);
    },
    // 确保每次登录后都重新获取数据
    fetchPolicy: 'cache-and-network',
  });

  console.log('Query State:', { loading, error: error?.message, data });

  const handleSignOut = useCallback(async () => {
    // 清除 cookie
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // 调用 next-auth 的登出
    await signOut();
  }, []);

  const handleSignIn = useCallback(() => {
    signIn('github', {
      callbackUrl: window.location.origin,
      redirect: true,
    });
  }, []);

  // 当 session 或 jwt 变化时，重新获取卡片
  useEffect(() => {
    console.log('Effect triggered:', { hasSession: !!session, hasJwt: !!jwt });
    if (session && jwt) {
      console.log('Refetching cards...');
      refetch();
    } else {
      console.log('Clearing cards...');
      setCards([]);
    }
  }, [session, jwt, refetch, setCards]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen p-6">
        <Alert>
          <Alert.Description>Loading session...</Alert.Description>
        </Alert>
      </div>
    );
  }

  const showError = error && session;
  const isAuthError = error?.message === 'Forbidden resource';

  if (showError && isAuthError) {
    return (
      <div className="min-h-screen p-6">
        <Alert variant="error">
          <Alert.Title>Session Expired</Alert.Title>
          <Alert.Description>
            Your session has expired. Please sign in again.
          </Alert.Description>
          <div className="mt-4">
            <Button
              variant="primary"
              onClick={handleSignIn}
            >
              Sign in again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      {!session ? (
        <div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center">
          <div className="card p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">
              Welcome to CardForest
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-center">
              Your personal knowledge garden
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={handleSignIn}
              >
                Sign in with GitHub
              </Button>
              <Button variant="secondary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Welcome {session.user?.name}
            </h1>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Cards</h2>
              <CreateCard onCardCreated={refetch} />
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
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {card.content}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Created at: {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
