import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="p-6">
        <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center">
          <div className="card p-6 space-y-6 max-w-lg w-full">
            <h1 className="text-3xl font-bold text-center">Welcome to CardForest</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-center">
              Your personal knowledge garden. Create, organize, and share your thoughts with ease.
            </p>
            {!session ? (
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={() => signIn('github')}>
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
                <Link href="/templates" className="block">
                  <div className="card p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <h3 className="font-semibold mb-2">Templates</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Create and manage card templates
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
