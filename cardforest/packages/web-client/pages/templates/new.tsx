import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { TemplateEditor } from '@/components/template/TemplateEditor';
import { useJWT } from '@/hooks/useJWT';

export default function NewTemplatePage() {
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
          <h1 className="text-2xl font-bold">Create New Template</h1>
        </div>
        <TemplateEditor mode="create" />
      </div>
    </Layout>
  );
}
