import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CreateCard } from '@/components/CreateCard';
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAtom } from 'jotai';
import { sortedCardsAtom } from '@/atoms/cardAtoms';
import { Layout } from '@/components/Layout';
import { useCards } from '@/hooks/api/useCards';
import { CardList } from '@/components/card';

export default function CardsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { user, jwt, isAuthenticated, logout } = useAuth();
  const { cards, loading, error } = useCards();
  const [sortedCards] = useAtom(sortedCardsAtom);

  console.log('Auth State:', {
    session: !!session,
    user: !!user,
    jwt: !!jwt,
    sessionStatus,
    isAuthenticated
  });

  const handleSignOut = useCallback(async () => {
    await logout();
  }, [logout]);



  if (sessionStatus === 'loading') {
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

  // 如果没有登录，显示登录选项
  if (!session) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">CardForest Login</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Frontend Login</h2>
              <p className="mb-4 text-gray-600">
                Use NextAuth to authenticate with GitHub. This is the recommended method.
              </p>
              <Button variant="primary" onClick={() => useAuth().login('github')}>
                Sign in with GitHub (Frontend)
              </Button>
            </div>

            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Backend Login</h2>
              <p className="mb-4 text-gray-600">
                Authenticate directly with the backend server. Use this if frontend login doesn't work.
              </p>
              <Button
                variant="secondary"
                onClick={() => useAuth().login('github', true)}
              >
                Sign in with GitHub (Backend)
              </Button>
            </div>
          </div>
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

          {/* Debug section - only shown when URL has ?debug=true */}
          {typeof window !== 'undefined' && window.location.search.includes('debug=true') && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded mb-6">
              <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
              <div className="text-sm">
                <p>Session: {session ? 'Yes' : 'No'}</p>
                <p>JWT: {jwt ? 'Yes' : 'No'}</p>
                <p>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
                <p>Session Status: {sessionStatus}</p>
                <p>User: {user?.username || 'None'}</p>
                <p>Backend JWT: {session?.backendJwt ? session.backendJwt.substring(0, 20) + '...' : 'None'}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Cards</h2>
              <CreateCard />
            </div>
            <CardList
              cards={sortedCards}
              loading={loading}
              error={error}
              emptyMessage="No cards yet. Create your first card to get started!"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
