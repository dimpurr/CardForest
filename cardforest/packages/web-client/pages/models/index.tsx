import { useRouter } from 'next/router';
import { ModelList } from '@/components/model/ModelList';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { withAuth } from '@/components/auth';

function ModelsPage() {
  const router = useRouter();

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

export default withAuth(ModelsPage);
