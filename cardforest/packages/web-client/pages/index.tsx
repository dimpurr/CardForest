import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, login } = useAuth();

  const handleLogin = () => {
    login('github');
  };

  return (
    <Layout
      title="Welcome"
      description="Your personal knowledge garden. Create, organize, and share your thoughts with ease."
    >
      <div className="p-6">
        <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center">
          <div className="card p-6 space-y-6 max-w-lg w-full">
            {!isAuthenticated ? (
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={handleLogin}>
                  Sign in with GitHub
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/cards" className="block">
                  <div className="card p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <h3 className="font-semibold mb-2">My Cards</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      View and manage your knowledge cards
                    </p>
                  </div>
                </Link>
                <Link href="/models" className="block">
                  <div className="card p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <h3 className="font-semibold mb-2">Models</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Create and manage card models
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
