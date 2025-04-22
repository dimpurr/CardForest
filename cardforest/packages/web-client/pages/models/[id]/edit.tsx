import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { GET_MODEL_WITH_INHERITANCE } from '@/graphql/queries/modelQueries';
import { ModelEditor } from '@/components/model/ModelEditor';
import { withAuth } from '@/components/auth';

function EditModelPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_MODEL_WITH_INHERITANCE, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <Layout
        title="Loading Model"
        breadcrumbs={[
          { label: 'Models', href: '/models' },
          { label: 'Loading...' }
        ]}
      >
        <div className="p-6 flex justify-center">
          <div className="animate-pulse">Loading model...</div>
        </div>
      </Layout>
    );
  }

  if (!data?.model) {
    return (
      <Layout
        title="Model Not Found"
        breadcrumbs={[
          { label: 'Models', href: '/models' },
          { label: 'Not Found' }
        ]}
      >
        <div className="p-6 text-center">
          <p className="text-red-500">The model you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/models')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Models
          </button>
        </div>
      </Layout>
    );
  }

  const modelName = data.model.name || 'Model';

  return (
    <Layout
      title={`Edit ${modelName}`}
      description="Edit model details and fields"
      breadcrumbs={[
        { label: 'Models', href: '/models' },
        { label: modelName, href: `/models/${id}` },
        { label: 'Edit' }
      ]}
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back
          </button>
        </div>
        <ModelEditor model={data.model} mode="edit" />
      </div>
    </Layout>
  );
}

export default withAuth(EditModelPage, { handleErrors: true });
