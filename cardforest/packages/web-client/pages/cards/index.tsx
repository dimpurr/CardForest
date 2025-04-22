import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CreateCard } from '@/components/CreateCard';
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAtom } from 'jotai';
import { sortedCardsAtom } from '@/atoms/cardAtoms';
import { Layout } from '@/components/Layout';
import { useCards } from '@/hooks/api/useCards';
import { CardList } from '@/components/card';
import { useRouter } from 'next/router';

export default function CardsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { cards, loading: cardsLoading, error } = useCards();
  const [sortedCards] = useAtom(sortedCardsAtom);

  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/cards'));
    }
  }, [isAuthenticated, loading, router]);

  const handleSignOut = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="p-4 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const isAuthError = error?.message === 'Forbidden resource';

  if (error && isAuthError) {
    return (
      <Layout title="Session Expired">
        <div className="p-6">
          <Alert variant="error">
            <Alert.Title>Session Expired</Alert.Title>
            <Alert.Description>
              Your session has expired. Please sign in again.
            </Alert.Description>
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => router.push('/auth/signin')}
              >
                Sign in again
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="My Cards"
      description="View and manage your knowledge cards"
      breadcrumbs={[
        { label: 'Cards' }
      ]}
    >
      <div className="p-4">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex-grow"></div>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>

          {/* Debug section - only shown when URL has ?debug=true */}
          {typeof window !== 'undefined' && window.location.search.includes('debug=true') && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded mb-6">
              <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
              <div className="text-sm">
                <p>JWT: {user ? 'Yes' : 'No'}</p>
                <p>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
                <p>User: {user?.username || 'None'}</p>
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
              loading={cardsLoading}
              error={error}
              emptyMessage="No cards yet. Create your first card to get started!"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
