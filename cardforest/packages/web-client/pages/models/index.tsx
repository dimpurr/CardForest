import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ModelList } from '@/components/model/ModelList';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export default function ModelsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/models'));
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="p-4 flex justify-center">
          <div className="animate-pulse">Loading models...</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout
      title="Models"
      description="Create and manage your card models"
      breadcrumbs={[
        { label: 'Models' }
      ]}
    >
      <div className="p-4">
        <div className="flex justify-end mb-6">
          <Button
            variant="primary"
            onClick={() => router.push('/models/new')}
          >
            Create Model
          </Button>
        </div>
        <ModelList />
      </div>
    </Layout>
  );
}
