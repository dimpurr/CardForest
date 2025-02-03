import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ModelEditor } from '@/components/model/ModelEditor';
import { useJWT } from '@/hooks/useJWT';

export default function NewModelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { jwt } = useJWT();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !jwt) {
    return null;
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Create New Model</h1>
        </div>
        <ModelEditor mode="create" />
      </div>
    </Layout>
  );
}
