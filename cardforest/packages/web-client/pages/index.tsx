import { useQuery, gql } from '@apollo/client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '../components/ui/Button';
import CreateCard from '../components/CreateCard';

const GET_MY_CARDS = gql`
  query GetMyCards {
    myCards {
      _id
      title
      content
      createdAt
    }
  }
`;

export default function Home() {
  const { data: session } = useSession();
  const { loading, error, data, refetch } = useQuery(GET_MY_CARDS, {
    skip: !session,
  });

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) {
    console.error('Error fetching cards:', error);
    return <div className="p-4 text-red-500">Error loading cards</div>;
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
                onClick={() => signIn('github', { 
                  callbackUrl: window.location.origin,
                  redirect_uri: 'http://localhost:3030/user/auth/github/callback?client=web'
                })}
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
            <Button variant="secondary" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Cards</h2>
              <CreateCard onCardCreated={refetch} />
            </div>
            <div className="grid gap-4">
              {data?.myCards?.map((card: any) => (
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
          </div>
        </div>
      )}
    </main>
  );
}
