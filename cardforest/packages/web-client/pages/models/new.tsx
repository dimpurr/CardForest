import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { ModelEditor } from '@/components/model/ModelEditor';
import { withAuth } from '@/components/auth';

function NewModelPage() {
  const router = useRouter();

  return (
    <Layout
      title="Create New Model"
      description="Create a new card model"
      breadcrumbs={[
        { label: 'Models', href: '/models' },
        { label: 'Create New Model' }
      ]}
    >
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back
          </button>
        </div>
        <ModelEditor mode="create" />
      </div>
    </Layout>
  );
}

export default withAuth(NewModelPage);
