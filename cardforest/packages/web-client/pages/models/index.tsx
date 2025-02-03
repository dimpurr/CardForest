import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ModelList } from '@/components/model/ModelList';
import { useJWT } from '@/hooks/useJWT';
import { Layout } from '@/components/Layout';

export default function ModelsPage() {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Models</h1>
          <button
            onClick={() => router.push('/models/new')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create Model
          </button>
        </div>
        <ModelList />
      </div>
    </Layout>
  );
}
